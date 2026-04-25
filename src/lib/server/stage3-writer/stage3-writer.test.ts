/**
 * Stage 3 writer tests.
 *
 * Three fixtures map to the spec's success criteria:
 *   (a) Stage 1-only: byte-equivalent to scorer/markdown.ts, zero warnings
 *       about prioritizer prose.
 *   (b) Stage 2 + LLM-mocked: at least one Strategic narrative paragraph
 *       drawn from the Sonnet rationale mock, and at least one Foundational
 *       task-register row whose success metric is the first clause of the
 *       (Haiku-mocked) Foundational rationale.
 *   (c) Prioritizer LLM failure: deterministic fallback rationales render,
 *       and the rendered prose passes the em-dash sweep.
 *
 * Validation pass is exercised in fixture-2 (Stage 1-only Assessment with
 * synthesized.needs_human_review === true) and fixture-leak (strict tier
 * Quick Win with governance_risk='standard').
 */
import { describe, it, expect, vi } from 'vitest';
import type { QuizStatic } from '$lib/types/quiz';
import { runScorer, type ScorerOutput } from '$lib/server/scorer';
import { screenRegulatedData } from '$lib/regulated-data-screen';
import type { SynthesizerOutput } from '$lib/types/synthesizer';
import { renderStage3Markdown } from './index';
import { runPreSendChecks } from './validation';
import { firstClause } from './foundational';

const FOUNDATIONAL_SUMMARY = 'Foundational rationale leads with a clear success metric for this firm.';
const STRATEGIC_PARA =
	'Strategic narrative explains the planning session that needs to happen before the rollout. I would suggest naming a sponsor and a 30-day decision gate before any vendor contact.';

vi.mock('@anthropic-ai/sdk', () => {
	const create = vi.fn(
		async ({
			model,
			messages
		}: {
			model: string;
			messages: { content: string }[];
		}) => {
			const userMsg = messages[0]?.content ?? '';
			// Prioritizer rationale prompts include the literal "Tier:" line; route by tier label.
			if (userMsg.includes('Tier: Foundational')) {
				return { content: [{ type: 'text', text: FOUNDATIONAL_SUMMARY }] };
			}
			if (userMsg.includes('Tier: Strategic')) {
				return { content: [{ type: 'text', text: STRATEGIC_PARA }] };
			}
			if (userMsg.includes('Tier: Quick Win')) {
				return {
					content: [{ type: 'text', text: 'Quick Win rationale paragraph for this firm.' }]
				};
			}
			// Scorer enrichment prompts (why_this_fits / next-step / what-comes-after).
			if (userMsg.includes('Quick Wins:')) {
				const tools = [...userMsg.matchAll(/tool="([^"]+)"/g)].map((m) => m[1]);
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(
								tools.map((tool) => ({
									tool,
									why: `${tool} fits because of the discovery-call evidence.`
								}))
							)
						}
					]
				};
			}
			if (userMsg.includes('Recommended next step (chosen deterministically)')) {
				return { content: [{ type: 'text', text: 'I recommend the chosen step.' }] };
			}
			if (userMsg.includes('What Comes After Quick Wins')) {
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(['follow up one', 'follow up two', 'follow up three'])
						}
					]
				};
			}
			// Synthesizer handoff brief.
			if (userMsg.includes('handoff brief') || model.startsWith('claude-sonnet')) {
				return { content: [{ type: 'text', text: 'Handoff brief paragraph.' }] };
			}
			return { content: [{ type: 'text', text: '' }] };
		}
	);

	class StubAnthropic {
		messages = { create };
		constructor(_config: unknown) {}
	}

	return { default: StubAnthropic };
});

const FIXTURE_QUICK_PLAN_STATIC: QuizStatic = {
	industry: 'Marketing or creative agency',
	size: '1-9',
	regulatedData: 'no',
	businessGoal: 'Faster turnaround',
	businessGoalOther: '',
	timeLeak: 'marketing',
	dreadedTask:
		'pulling weekly reports across Google Ads, Meta, and Search Console for 8 active clients, ~5 hrs/week',
	digitizationProbe: '',
	processHealth: 'healthy',
	currentAiUse: 'tried ChatGPT for client emails, kept it for tone editing',
	governanceRules: '',
	governanceReview: '',
	governanceComfort: ''
};

const FIXTURE_ASSESSMENT_STATIC: QuizStatic = {
	industry: 'Medical or dental',
	size: '10-25',
	regulatedData: 'yes',
	businessGoal: 'Add capacity without hiring',
	businessGoalOther: '',
	timeLeak: 'delivery',
	dreadedTask:
		'documenting patient visits in our PMS at the end of each day, takes 90 minutes a day across the team',
	digitizationProbe: '',
	processHealth: 'broken',
	currentAiUse: '',
	governanceRules: 'informal',
	governanceReview: 'sometimes',
	governanceComfort: 'unsure'
};

function multiTierSynthesized(): SynthesizerOutput {
	return {
		sipoc_summary: {
			suppliers: ['inbound lead form'],
			inputs: ['client briefs'],
			process: 'Reporting compiled by hand from three platforms each Friday afternoon.',
			outputs: ['weekly client report'],
			customers: ['agency@example.com (caller)']
		},
		pain_areas_ranked: [
			{
				theme: 'Reporting takes all Friday',
				severity: 'High',
				frequency: 'weekly',
				evidence_turns: [3, 7]
			},
			{
				theme: 'Meeting notes get lost',
				severity: 'Medium',
				frequency: 'daily',
				evidence_turns: [2]
			},
			{
				theme: 'Strategic planning sessions deferred',
				severity: 'Low',
				frequency: 'monthly',
				evidence_turns: [9]
			}
		],
		workaround_list: [{ description: 'I keep a shadow spreadsheet', evidence_turn: 3 }],
		exception_patterns: [
			{ pattern: 'Retainer clients bypass intake', evidence_turns: [5] }
		],
		candidate_opportunities: [
			// Forces quick-win tier (high severity, evidence, no risk).
			{
				title: 'Cut reporting work down to a one-step run',
				rationale: 'Surfaced 2 times with high severity.',
				suggested_quadrant: 'quick-win',
				evidence_turns: [3, 7],
				governance_risk_note: null
			},
			// Forces foundational tier: severity=Medium maps to hours=2 → impact=Medium.
			// suggested_quadrant=foundational nudges any computed strategic into foundational.
			{
				title: 'Standardize meeting notes capture',
				rationale: 'Surfaced 1 time at medium severity; needs broader process work first.',
				suggested_quadrant: 'foundational',
				evidence_turns: [2],
				governance_risk_note: null
			},
			// Forces strategic tier: severity=Low maps to hours=0.5 → impact=Low → research.
			// Override to strategic happens via scoreImpact returning Low (qualitative undefined),
			// which would tier as research. To force strategic we set rationale present + Medium.
			// Build a candidate that yields Medium impact deliberately:
			{
				title: 'Plan a quarterly strategic review for the agency',
				rationale: 'Surfaced 1 time; longer-horizon investment.',
				suggested_quadrant: 'strategic',
				evidence_turns: [9],
				governance_risk_note: null
			}
		],
		handoff_brief:
			'I ran Stage 2 on chat; the top friction is reporting. I recommend a Quick-Win pilot.',
		needs_human_review: false,
		llm_status: 'ok'
	};
}

async function scorerOutputFor(
	s: QuizStatic,
	synthesized?: SynthesizerOutput,
	llmKey?: string
): Promise<ScorerOutput> {
	return runScorer({
		submissionId: 'stage3-test',
		clientEmail: 'test@example.com',
		submissionDate: '2026-04-24',
		s,
		llm: llmKey ? { apiKey: llmKey } : undefined,
		synthesized
	});
}

describe('renderStage3Markdown', () => {
	it('Fixture (a) Stage 1-only Quick Plan: byte-equivalent to scorer/markdown.ts, no warnings', async () => {
		const scorer = await scorerOutputFor(FIXTURE_QUICK_PLAN_STATIC);
		const screen = screenRegulatedData({
			industry: FIXTURE_QUICK_PLAN_STATIC.industry,
			sensitive_data_flag: FIXTURE_QUICK_PLAN_STATIC.regulatedData,
			governance_rules: FIXTURE_QUICK_PLAN_STATIC.governanceRules,
			governance_review: FIXTURE_QUICK_PLAN_STATIC.governanceReview,
			governance_comfort: FIXTURE_QUICK_PLAN_STATIC.governanceComfort
		});

		const out = await renderStage3Markdown({
			scorerOutput: scorer,
			s: FIXTURE_QUICK_PLAN_STATIC,
			screen
		});

		expect(out.warnings).toEqual([]);
		expect(out.markdown).toBe(scorer.stage1_report_markdown);
		expect(out.markdown.includes('—')).toBe(false);
	});

	it('Fixture (a) Stage 1-only Assessment: byte-equivalent, no warnings', async () => {
		const scorer = await scorerOutputFor(FIXTURE_ASSESSMENT_STATIC);
		const screen = screenRegulatedData({
			industry: FIXTURE_ASSESSMENT_STATIC.industry,
			sensitive_data_flag: FIXTURE_ASSESSMENT_STATIC.regulatedData,
			governance_rules: FIXTURE_ASSESSMENT_STATIC.governanceRules,
			governance_review: FIXTURE_ASSESSMENT_STATIC.governanceReview,
			governance_comfort: FIXTURE_ASSESSMENT_STATIC.governanceComfort
		});

		const out = await renderStage3Markdown({
			scorerOutput: scorer,
			s: FIXTURE_ASSESSMENT_STATIC,
			screen
		});

		expect(out.warnings).toEqual([]);
		expect(out.markdown).toBe(scorer.stage1_report_markdown);
	});

	it('Fixture (b) Stage 2 + LLM-mocked: Strategic paragraph + Foundational row drawn from mock', async () => {
		const synth = multiTierSynthesized();
		const scorer = await scorerOutputFor(
			FIXTURE_QUICK_PLAN_STATIC,
			synth,
			'mock-key'
		);
		const screen = screenRegulatedData({
			industry: FIXTURE_QUICK_PLAN_STATIC.industry,
			sensitive_data_flag: FIXTURE_QUICK_PLAN_STATIC.regulatedData,
			governance_rules: FIXTURE_QUICK_PLAN_STATIC.governanceRules,
			governance_review: FIXTURE_QUICK_PLAN_STATIC.governanceReview,
			governance_comfort: FIXTURE_QUICK_PLAN_STATIC.governanceComfort
		});

		const out = await renderStage3Markdown({
			scorerOutput: scorer,
			s: FIXTURE_QUICK_PLAN_STATIC,
			screen,
			synthesized: synth,
			llm: { apiKey: 'mock-key' }
		});

		// Strategic paragraph appears verbatim from the Sonnet mock.
		expect(out.markdown).toContain(STRATEGIC_PARA);
		// Foundational row's success-metric column is the first clause of the Haiku rationale.
		const expectedSuccessMetric = firstClause(FOUNDATIONAL_SUMMARY);
		expect(out.markdown).toContain(expectedSuccessMetric);
		// Em-dash sweep.
		expect(out.markdown.includes('—')).toBe(false);
	});

	it('Fixture (c) Prioritizer LLM failure: deterministic fallback, em-dash clean', async () => {
		const synth = multiTierSynthesized();
		// llm omitted from renderStage3Markdown -> runPrioritizer's renderRationale
		// returns the deterministic rationale for non-research tiers.
		const scorer = await scorerOutputFor(FIXTURE_QUICK_PLAN_STATIC, synth);
		const screen = screenRegulatedData({
			industry: FIXTURE_QUICK_PLAN_STATIC.industry,
			sensitive_data_flag: FIXTURE_QUICK_PLAN_STATIC.regulatedData,
			governance_rules: FIXTURE_QUICK_PLAN_STATIC.governanceRules,
			governance_review: FIXTURE_QUICK_PLAN_STATIC.governanceReview,
			governance_comfort: FIXTURE_QUICK_PLAN_STATIC.governanceComfort
		});

		const out = await renderStage3Markdown({
			scorerOutput: scorer,
			s: FIXTURE_QUICK_PLAN_STATIC,
			screen,
			synthesized: synth
			// no llm config -> deterministic path
		});

		// Deterministic foundational rationale: "Foundational move; unblocks higher-impact work in the next tier."
		expect(out.markdown).toContain('Foundational move');
		// Deterministic strategic rationale: "Strategic; worth a dedicated planning session..."
		expect(out.markdown).toContain('Strategic; worth a dedicated planning session');
		// Em-dash sweep on the whole output.
		expect(out.markdown.includes('—')).toBe(false);
	});
});

describe('runPreSendChecks (deterministic warnings)', () => {
	function makeScorerOutput(overrides: Partial<ScorerOutput>): ScorerOutput {
		const base: ScorerOutput = {
			readiness_scorecard: {
				strategic_fit: { level: 'High', rationale: '' },
				workflow: { level: 'High', rationale: '' },
				data: { level: 'High', rationale: '' },
				ai_fluency: { level: 'High', rationale: '' },
				governance: { level: 'High', rationale: '' },
				change_capacity: { level: 'High', rationale: '' }
			},
			recommended_next_step: 'pilot',
			recommended_next_step_rationale: '',
			report_shape: 'quick-plan',
			opportunities: [],
			four_day_plan: [],
			financial_impact: {
				weekly_hours_returned: 0,
				monthly_net_roi: 0,
				total_monthly_tool_cost: 0,
				hourly_rate_used: 100
			},
			what_comes_after: [],
			stage1_report_markdown: '# AI Tools Assessment\n\ntest · 2026-04-24\n',
			guardrail: {
				tier: 'none',
				human_review_policy: 'optional',
				required_mitigations: [],
				sector_citations: []
			},
			llm_status: 'ok'
		};
		return { ...base, ...overrides };
	}

	const baseInput = (overrides: Partial<ScorerOutput>) => ({
		scorerOutput: makeScorerOutput(overrides),
		s: FIXTURE_QUICK_PLAN_STATIC,
		screen: screenRegulatedData({
			industry: FIXTURE_QUICK_PLAN_STATIC.industry,
			sensitive_data_flag: FIXTURE_QUICK_PLAN_STATIC.regulatedData,
			governance_rules: FIXTURE_QUICK_PLAN_STATIC.governanceRules,
			governance_review: FIXTURE_QUICK_PLAN_STATIC.governanceReview,
			governance_comfort: FIXTURE_QUICK_PLAN_STATIC.governanceComfort
		})
	});

	it('quick_win_unnamed_workflow fires when a Quick Win uses the generic title fallback', () => {
		const input = baseInput({
			opportunities: [
				{
					title: 'Time leak addressed by Tool X',
					quadrant: 'quick-win',
					tool: 'Tool X',
					why_this_fits: 'fits',
					complexity: 'plug-and-play',
					monthly_cost: 20,
					setup_time_minutes: 30,
					hours_saved_per_week: 3
				}
			]
		});
		const warnings = runPreSendChecks(input);
		expect(warnings.some((w) => w.startsWith('quick_win_unnamed_workflow'))).toBe(true);
	});

	it('quick_win_no_fast_setup fires when no Quick Win has setup under 240 min', () => {
		const input = baseInput({
			opportunities: [
				{
					title: 'A real workflow',
					quadrant: 'quick-win',
					tool: 'Tool X',
					why_this_fits: 'fits',
					complexity: 'project',
					monthly_cost: 20,
					setup_time_minutes: 600,
					hours_saved_per_week: 3
				}
			]
		});
		const warnings = runPreSendChecks(input);
		expect(warnings.some((w) => w.startsWith('quick_win_no_fast_setup'))).toBe(true);
	});

	it('assessment_empty_register fires when shape is assessment with no foundational/strategic', () => {
		const input = baseInput({
			report_shape: 'assessment-plus-guardrails',
			opportunities: [
				{
					title: 'Fast win',
					quadrant: 'quick-win',
					tool: 'Tool X',
					why_this_fits: 'fits',
					complexity: 'plug-and-play',
					monthly_cost: 20,
					setup_time_minutes: 30,
					hours_saved_per_week: 3
				}
			]
		});
		const warnings = runPreSendChecks(input);
		expect(warnings.some((w) => w.startsWith('assessment_empty_register'))).toBe(true);
	});

	it('strict_tier_quick_win_leak fires when a strict tier Quick Win carries a standard tool', () => {
		// DashThis is in the tool library with governance_risk: 'standard'.
		const input = baseInput({
			report_shape: 'assessment-plus-guardrails',
			guardrail: {
				tier: 'strict',
				human_review_policy: 'mandatory',
				required_mitigations: [],
				sector_citations: []
			},
			opportunities: [
				{
					title: 'Reporting workflow',
					quadrant: 'quick-win',
					tool: 'DashThis',
					why_this_fits: 'leaked through Pass 2',
					complexity: 'plug-and-play',
					monthly_cost: 39,
					setup_time_minutes: 60,
					hours_saved_per_week: 4
				}
			]
		});
		const warnings = runPreSendChecks(input);
		expect(warnings.some((w) => w.startsWith('strict_tier_quick_win_leak'))).toBe(true);
	});

	it('needs_human_review_flag fires when synthesizer asks for a human eyeball', () => {
		const input = {
			...baseInput({
				report_shape: 'assessment-plus-guardrails',
				opportunities: [
					{
						title: 'Workflow',
						quadrant: 'foundational' as const,
						tool: 'Tool X',
						why_this_fits: 'fits',
						complexity: 'plug-and-play' as const,
						monthly_cost: 20,
						setup_time_minutes: 30,
						hours_saved_per_week: 3
					}
				]
			}),
			synthesized: {
				sipoc_summary: {
					suppliers: [],
					inputs: [],
					process: '',
					outputs: [],
					customers: []
				},
				pain_areas_ranked: [],
				workaround_list: [],
				exception_patterns: [],
				candidate_opportunities: [],
				handoff_brief: 'brief',
				needs_human_review: true,
				llm_status: 'ok' as const
			}
		};
		const warnings = runPreSendChecks(input);
		expect(warnings.some((w) => w.startsWith('needs_human_review_flag'))).toBe(true);
	});
});
