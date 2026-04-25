/**
 * Entry point for the smb-audit-intake-scorer.
 *
 * Pipeline:
 *   1. Run regulated-data-screen (already produced by the submission handler; passed in here).
 *   2. Build the deterministic readiness scorecard.
 *   3. Pick the recommended next step and the report shape.
 *   4. Derive pain areas from Stage 1; merge in Stage 2 themes when synthesized.
 *   5. (Week 6) When synthesized is present, run the opportunity-prioritizer
 *      on its candidate_opportunities. Build a PainArea -> Tier override map
 *      that nudges the scorer's quadrant assignment so a strategic-tiered
 *      candidate cannot land as a Quick Win.
 *   6. Three-pass opportunity selection (industry/pain filter, guardrail
 *      filter, prioritizer overrides applied at quadrant assignment).
 *   7. Build the 4-day plan and the Financial Impact.
 *   8. Call Sonnet (parallel) to fill the three string fields the LLM is allowed to generate.
 *   9. Render the markdown report in the routed shape.
 *
 * Failure boundary: if the LLM enrichment fails twice for any field, the deterministic fallback
 * carries through and the output's `llm_status` is 'unavailable'. Every numeric field is still valid.
 */
import type { QuizStatic } from '$lib/types/quiz';
import { screenRegulatedData, type ScreenOutput } from '$lib/regulated-data-screen';
import type { SynthesizerOutput } from '$lib/types/synthesizer';
import type {
	PrioritizerCandidate,
	PrioritizerContext,
	PrioritizerOutput,
	Tier
} from '$lib/types/prioritizer';
import { deterministicTieredOutput } from '$lib/server/prioritizer';
import { painAreasFromThemes } from './pain-areas';
import { buildScorecard, recommendedNextStep, reportShape } from './scoring';
import { derivePainAreas, mergePainAreas } from './pain-areas';
import { selectOpportunities, type SynthesizedTierOverrides } from './opportunities';
import { buildFourDayPlan } from './plan';
import { computeFinancialImpact } from './financial';
import { enrichWithLlm, type LlmConfig } from './llm';
import { applyEnrichment, renderReportMarkdown } from './markdown';
import type { ScorerOutput } from './types';
import type { PainArea } from '$lib/data/tool-library';

export type { ScorerOutput } from './types';

export interface RunScorerInput {
	submissionId: string;
	clientEmail: string;
	submissionDate: string;
	s: QuizStatic;
	screen?: ScreenOutput;
	hourlyRate?: number;
	llm?: LlmConfig;
	/**
	 * Stage 2 synthesized findings. When present, the scorer:
	 *   - merges synthesized pain-area themes into the tool-matching set
	 *   - forces the Assessment shape (Stage 2 always warrants the longer report)
	 *   - runs the opportunity-prioritizer to tier each synthesized candidate
	 *   - applies prioritizer tier decisions as quadrant overrides during
	 *     opportunity selection
	 *   - injects a Stage 2 Findings section into the Assessment markdown
	 */
	synthesized?: SynthesizerOutput;
}

const TIER_DISTANCE: Record<Tier, number> = {
	'quick-win': 0,
	foundational: 1,
	strategic: 2,
	research: 3
};

export function buildPrioritizerCandidates(
	synth: SynthesizerOutput
): PrioritizerCandidate[] {
	return synth.candidate_opportunities.map((c) => {
		const pa = synth.pain_areas_ranked.find((p) =>
			p.evidence_turns.some((t) => c.evidence_turns.includes(t))
		);
		const severity = pa?.severity;
		const hours = severity === 'High' ? 4 : severity === 'Medium' ? 2 : 0.5;
		return {
			title: c.title,
			rationale: c.rationale,
			evidence_turns: c.evidence_turns,
			governance_risk_note: c.governance_risk_note,
			suggested_quadrant: c.suggested_quadrant,
			impact_signals: { hours_saved_per_week: hours },
			risk_signals: c.governance_risk_note
				? { pii_phi_touch: true }
				: undefined
		};
	});
}

export function buildPrioritizerContext(
	s: QuizStatic,
	screen: ScreenOutput
): PrioritizerContext {
	return {
		industry: s.industry,
		team_size: s.size,
		strategic_fit_top_goal:
			s.businessGoal === 'Other' && s.businessGoalOther
				? s.businessGoalOther
				: s.businessGoal,
		guardrail_tier: screen.guardrail_tier,
		confidence_floor: 'Medium'
	};
}

/**
 * Build the PainArea -> Tier override map. Each tiered candidate's title is
 * mapped to PainArea slugs via the same keyword router Stage 1 uses, so
 * Stage 1 and Stage 2 converge on the same vocabulary. On collision, the
 * most-demoted tier wins (research > strategic > foundational > quick-win)
 * so the scorer never inflates a Stage 2 caution into a Quick Win.
 */
function buildOverrides(
	prioritizer: PrioritizerOutput
): SynthesizedTierOverrides {
	const map = new Map<PainArea, Tier>();
	for (const t of prioritizer.tiered) {
		const areas = painAreasFromThemes([t.title]);
		for (const a of areas) {
			const existing = map.get(a);
			if (!existing || TIER_DISTANCE[t.tier] > TIER_DISTANCE[existing]) {
				map.set(a, t.tier);
			}
		}
	}
	return map;
}

export async function runScorer(input: RunScorerInput): Promise<ScorerOutput> {
	const screen =
		input.screen ??
		screenRegulatedData({
			industry: input.s.industry,
			sensitive_data_flag: input.s.regulatedData,
			governance_rules: input.s.governanceRules,
			governance_review: input.s.governanceReview,
			governance_comfort: input.s.governanceComfort
		});

	const scorecard = buildScorecard(input.s, screen);
	const nextStep = recommendedNextStep(scorecard, input.s);
	const shape = input.synthesized
		? 'assessment-plus-guardrails'
		: reportShape(input.s, screen);

	const stage1PainAreas = derivePainAreas(input.s);
	const stage2PainAreas = input.synthesized
		? painAreasFromThemes(input.synthesized.pain_areas_ranked.map((p) => p.theme))
		: [];
	const painAreas = mergePainAreas(stage1PainAreas, stage2PainAreas);

	let prioritizer: PrioritizerOutput | undefined;
	let overrides: SynthesizedTierOverrides | undefined;
	if (input.synthesized && input.synthesized.candidate_opportunities.length > 0) {
		const cands = buildPrioritizerCandidates(input.synthesized);
		const context = buildPrioritizerContext(input.s, screen);
		prioritizer = deterministicTieredOutput(cands, context);
		overrides = buildOverrides(prioritizer);
	}

	const selection = selectOpportunities(input.s, painAreas, screen, overrides);

	const fourDayPlan = buildFourDayPlan(selection.cards);
	const financial = computeFinancialImpact(selection.cards, input.hourlyRate);

	let enrichment = {
		why_this_fits: new Map<string, string>(),
		recommended_next_step_rationale: '',
		what_comes_after: [] as string[],
		status: 'unavailable' as 'ok' | 'unavailable'
	};
	if (input.llm?.apiKey) {
		enrichment = await enrichWithLlm(
			input.llm,
			input.s,
			selection.cards,
			scorecard,
			nextStep,
			shape,
			input.synthesized
		);
	}

	const fallbackNextStepRationale = buildFallbackNextStepRationale(nextStep);
	const fallbackWhatComesAfter = buildFallbackWhatComesAfter(selection.cards);

	const baseOutput: ScorerOutput = {
		readiness_scorecard: scorecard,
		recommended_next_step: nextStep,
		recommended_next_step_rationale: fallbackNextStepRationale,
		report_shape: shape,
		opportunities: selection.cards,
		four_day_plan: fourDayPlan,
		financial_impact: financial,
		what_comes_after: fallbackWhatComesAfter,
		stage1_report_markdown: '',
		guardrail: {
			tier: screen.guardrail_tier,
			human_review_policy: screen.human_review_policy,
			required_mitigations: screen.required_mitigations,
			sector_citations: screen.sector_citations
		},
		prioritizer,
		llm_status: enrichment.status
	};

	const enriched = applyEnrichment(baseOutput, enrichment);

	enriched.stage1_report_markdown = renderReportMarkdown({
		clientEmail: input.clientEmail,
		submissionDate: input.submissionDate,
		s: input.s,
		screen,
		scorecard,
		nextStep,
		nextStepRationale: enriched.recommended_next_step_rationale,
		opportunities: enriched.opportunities,
		fourDayPlan,
		financial,
		whatComesAfter: enriched.what_comes_after,
		shape,
		synthesized: input.synthesized
	});

	return enriched;
}

function buildFallbackNextStepRationale(step: string): string {
	const phrasings: Record<string, string> = {
		pilot:
			'The readiness scorecard is mid-tier or better across every dimension, the goal lines up with the time leak, and the workflow is described concretely. A small pilot is the highest-value next move.',
		cleanup:
			'Either the data is not yet structured enough for AI to act on, or the surrounding workflow is reported broken. Cleanup or digitization has to come before tool selection.',
		'policy-first':
			'Sector regulation applies and the governance posture has gaps. Drafting an acceptable-use policy and naming a human-review owner has to land before any tool processes client records.',
		'strategy-first':
			'The owner has an ambitious goal but the change-capacity readiness is low. The right next step is one strategy session before any tool is chosen, so the rollout plan matches the firm.'
	};
	return phrasings[step] ?? '';
}

function buildFallbackWhatComesAfter(opps: import('./types').OpportunityCard[]): string[] {
	const queued = opps
		.filter((o) => o.quadrant === 'foundational' || o.quadrant === 'strategic')
		.slice(0, 3);
	return queued.map(
		(o) => `Layer in ${o.tool} once the Quick Wins have run for at least four weeks.`
	);
}
