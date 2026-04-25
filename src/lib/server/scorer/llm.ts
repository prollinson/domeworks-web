/**
 * Sonnet calls for the only three string fields the scorer is allowed to generate:
 *   1. Each Quick Win opportunity's `why_this_fits` paragraph.
 *   2. The recommended-next-step rationale.
 *   3. The "What Comes After" phrasing (3 short items).
 *
 * Calls run in parallel via Promise.all so the total latency is bounded by the slowest call.
 *
 * Failure boundary: if any call fails twice, this module returns its deterministic fallback
 * (the templated `defaultWhy*` strings already in the opportunity cards) and sets `llm_status: 'unavailable'`
 * on the parent ScorerOutput. Caller logs and continues.
 *
 * Voice gate: the prompts forbid em-dashes and require first-person DomeWorks voice. The shared
 * gateway helper strips U+2014 from every model output before it leaves this module.
 *
 * Stage 2 evidence: when the Stage 2 synthesizer has run, the why_this_fits prompt receives the
 * top three pain areas (theme + severity + frequency), the matching workaround if any, and one
 * exception pattern. Quick Win rationales then reference the caller's actual language instead
 * of the Stage 1 dreaded_task string alone.
 */
import type { QuizStatic } from '$lib/types/quiz';
import type { SynthesizerOutput } from '$lib/types/synthesizer';
import {
	buildClient,
	callOnce,
	callWithRetry,
	extractJson,
	sanitizeVoice,
	type LlmConfig
} from '$lib/server/llm-gateway';
import type {
	OpportunityCard,
	RecommendedNextStep,
	ReadinessScorecard,
	ReportShape
} from './types';

export type { LlmConfig } from '$lib/server/llm-gateway';

export interface LlmEnrichment {
	why_this_fits: Map<string, string>;
	recommended_next_step_rationale: string;
	what_comes_after: string[];
	status: 'ok' | 'unavailable';
}

const VOICE_RULES = `Voice rules. No em-dashes anywhere. First-person "I" or "my" when DomeWorks speaks. No "we" or "our". Plain English. No marketing language. No exclamation marks. Under 60 words per item unless told otherwise.`;

export async function enrichWithLlm(
	config: LlmConfig,
	s: QuizStatic,
	opportunities: OpportunityCard[],
	scorecard: ReadinessScorecard,
	nextStep: RecommendedNextStep,
	shape: ReportShape,
	synthesized?: SynthesizerOutput
): Promise<LlmEnrichment> {
	const client = buildClient(config);

	const quickWins = opportunities.filter((o) => o.quadrant === 'quick-win');
	const summary = summarizeQuiz(s);
	const stage2Block = synthesized ? buildStage2Block(synthesized) : '';

	const whyTask = callWithRetry<WhyEntry[]>(
		async () => {
			if (quickWins.length === 0) return [];
			const stage2Section = stage2Block
				? `\nStage 2 evidence (verbatim from the discovery call). Reference at least one fragment from this block in your rationales when it lines up with the Quick Win in question:\n${stage2Block}\n`
				: '';
			const user = `${VOICE_RULES}

Prospect summary:
${summary}
${stage2Section}
For each Quick Win below, write one short paragraph (40 to 70 words) explaining why this specific tool fits this specific prospect. Reference the prospect's pain and goal. Do not pitch the tool category, pitch the tool against this firm.

Output strict JSON: an array of objects in the same order, each with {"tool": "<tool name>", "why": "<paragraph>"}.

Quick Wins:
${quickWins
	.map(
		(o, i) =>
			`${i + 1}. tool="${o.tool}", title="${o.title}", complexity=${o.complexity}, hours_per_week=${o.hours_saved_per_week}, monthly_cost=${o.monthly_cost}.`
	)
	.join('\n')}`;
			const out = await callOnce(client, 'Return only the JSON array.', user, {
				maxTokens: 1400
			});
			return parseWhyJson(out, quickWins.length);
		},
		[],
		'scorer.why_this_fits'
	);

	const nextStepTask = callWithRetry<string>(
		async () => {
			const user = `${VOICE_RULES}

Prospect summary:
${summary}

Readiness scorecard:
- Strategic fit: ${scorecard.strategic_fit.level}
- Workflow: ${scorecard.workflow.level}
- Data: ${scorecard.data.level}
- AI fluency: ${scorecard.ai_fluency.level}
- Governance: ${scorecard.governance.level}
- Change capacity: ${scorecard.change_capacity.level}

Recommended next step (chosen deterministically): ${nextStep}

Write one paragraph (50 to 80 words) explaining why "${nextStep}" is the right next step for this prospect. Refer to the readiness scorecard. Speak as DomeWorks (first person). Do not contradict the chosen next step.`;
			return await callOnce(client, 'Return only the paragraph, no preamble.', user, {
				maxTokens: 400
			});
		},
		'',
		'scorer.next_step_rationale'
	);

	const whatComesAfterTask = callWithRetry<string[]>(
		async () => {
			const foundationals = opportunities.filter(
				(o) => o.quadrant === 'foundational' || o.quadrant === 'strategic'
			);
			const seedList =
				foundationals.length > 0
					? foundationals
							.slice(0, 3)
							.map(
								(o, i) =>
									`${i + 1}. ${o.tool}: ${o.why_this_fits.split('. ')[0]} (complexity: ${o.complexity}).`
							)
							.join('\n')
					: '(No queued items; produce three reasonable next-engagement angles based on the summary.)';
			const user = `${VOICE_RULES}

Prospect summary:
${summary}

Report shape: ${shape}

Write three "What Comes After Quick Wins" items, one sentence each (15 to 25 words). Each one frames a foundational or strategic move as a follow-up engagement, not a sale. Tone is steady and specific.

Output strict JSON: an array of three strings.

Seed list (use these as anchors, not literal copy):
${seedList}`;
			const out = await callOnce(client, 'Return only the JSON array.', user, { maxTokens: 500 });
			return parseStringArray(out, 3);
		},
		[],
		'scorer.what_comes_after'
	);

	const [whyResults, nextStepRationale, whatComesAfter] = await Promise.all([
		whyTask,
		nextStepTask,
		whatComesAfterTask
	]);

	const why_this_fits = new Map<string, string>();
	whyResults.forEach((entry, idx) => {
		const tool = entry?.tool ?? quickWins[idx]?.tool;
		if (tool && entry?.why) why_this_fits.set(tool, sanitizeVoice(entry.why));
	});

	const status: 'ok' | 'unavailable' =
		(quickWins.length > 0 && why_this_fits.size === 0) ||
		(nextStepRationale === '' && whatComesAfter.length === 0)
			? 'unavailable'
			: 'ok';

	return {
		why_this_fits,
		recommended_next_step_rationale: nextStepRationale,
		what_comes_after: whatComesAfter,
		status
	};
}

function summarizeQuiz(s: QuizStatic): string {
	const goal =
		s.businessGoal === 'Other' && s.businessGoalOther
			? `Other: ${s.businessGoalOther}`
			: s.businessGoal;
	const lines = [
		`Industry: ${s.industry}`,
		`Team size: ${s.size}`,
		`Regulated data: ${s.regulatedData}`,
		`Business goal: ${goal}`,
		`Time leak: ${s.timeLeak}`,
		`Dreaded task: ${s.dreadedTask}`,
		`Process health: ${s.processHealth}`
	];
	if (s.digitizationProbe) lines.push(`Digitization: ${s.digitizationProbe}`);
	if (s.currentAiUse) lines.push(`Current AI use: ${s.currentAiUse}`);
	return lines.join('\n');
}

/**
 * Compact, prompt-ready Stage 2 evidence block. Top three pain areas with
 * theme/severity/frequency, the matching workaround if any (nearest by
 * evidence_turn), and one exception pattern. The verbatim fragments here are
 * what the rationale must echo when it lines up.
 */
function buildStage2Block(synth: SynthesizerOutput): string {
	const top = synth.pain_areas_ranked.slice(0, 3);
	if (top.length === 0) return '';
	const lines: string[] = [];
	top.forEach((pa, i) => {
		lines.push(
			`${i + 1}. pain_signal="${pa.theme}", severity=${pa.severity}, frequency=${pa.frequency}`
		);
		const matching = synth.workaround_list.find((w) => pa.evidence_turns.includes(w.evidence_turn));
		if (matching) {
			lines.push(`   workaround_in_flight: "${matching.description}"`);
		}
	});
	const ex = synth.exception_patterns[0];
	if (ex) {
		lines.push(`exception_pattern: "${ex.pattern}"`);
	}
	return lines.join('\n');
}

interface WhyEntry {
	tool: string;
	why: string;
}

function parseWhyJson(raw: string, expected: number): WhyEntry[] {
	const json = extractJson(raw);
	if (!Array.isArray(json)) return [];
	return json
		.filter((e): e is WhyEntry => e && typeof e.tool === 'string' && typeof e.why === 'string')
		.slice(0, expected);
}

function parseStringArray(raw: string, expected: number): string[] {
	const json = extractJson(raw);
	if (!Array.isArray(json)) return [];
	return json
		.filter((e): e is string => typeof e === 'string')
		.map(sanitizeVoice)
		.slice(0, expected);
}
