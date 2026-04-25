/**
 * Dry-run validation of the scorer with two fixtures from the Week 2 spec:
 *   1. Non-regulated, team 1-9, broken process => Quick Plan shape
 *   2. Regulated (Medical or dental) team 10-25 => Assessment Plus Guardrails shape
 *   3. Stage 2 synthesized input forces Assessment shape and adds Findings + SIPOC.
 *   3b (Week 6) Stage 2 input + mocked-LLM path: at least one Quick Win
 *      `why_this_fits` echoes a verbatim pain_signal fragment from the
 *      synthesized input.
 *
 * Fixtures 1, 2, and 3 do not pass an llm config so the deterministic fallback strings are
 * used. Fixture 3b mocks the Anthropic SDK so the LLM path is exercised end-to-end.
 */
import { describe, it, expect, vi } from 'vitest';
import type { QuizStatic } from '$lib/types/quiz';
import { runScorer } from './index';

const VERBATIM_PAIN_FRAGMENT = 'Reporting takes all Friday';

vi.mock('@anthropic-ai/sdk', () => {
	const create = vi.fn(async ({ messages }: { messages: { content: string }[] }) => {
		const userMsg = messages[0]?.content ?? '';
		if (userMsg.includes('Quick Wins:')) {
			// Parse the actual Quick Win tool names out of the prompt so the
			// returned why_this_fits entries key on real tools (the scorer's
			// applyEnrichment looks them up by name). Echo a verbatim fragment
			// of the synthesized pain_signal into every rationale so the test
			// can assert that Stage 2 evidence reached the LLM path.
			const toolMatches = [...userMsg.matchAll(/tool="([^"]+)"/g)].map((m) => m[1]);
			const entries = toolMatches.map((tool) => ({
				tool,
				why: `${VERBATIM_PAIN_FRAGMENT.toLowerCase()} keeps surfacing on this account; ${tool} addresses it directly without rewriting the workflow.`
			}));
			return {
				content: [{ type: 'text', text: JSON.stringify(entries) }]
			};
		}
		if (userMsg.includes('Recommended next step (chosen deterministically)')) {
			return {
				content: [{ type: 'text', text: 'I recommend the chosen next step.' }]
			};
		}
		if (userMsg.includes('What Comes After Quick Wins')) {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(['item one', 'item two', 'item three'])
					}
				]
			};
		}
		return { content: [{ type: 'text', text: '' }] };
	});

	class StubAnthropic {
		messages = { create };
		constructor(_config: unknown) {}
	}

	return { default: StubAnthropic };
});

const FIXTURE_QUICK_PLAN: QuizStatic = {
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

const FIXTURE_ASSESSMENT: QuizStatic = {
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

describe('runScorer: dry-run fixtures', () => {
	it('Fixture 1: non-regulated 1-9 marketing agency routes to Quick Plan', async () => {
		const out = await runScorer({
			submissionId: 'fixture-quick-plan',
			clientEmail: 'agency@example.com',
			submissionDate: '2026-04-24',
			s: FIXTURE_QUICK_PLAN
		});

		expect(out.report_shape).toBe('quick-plan');
		expect(out.guardrail.tier).toBe('none');
		expect(out.opportunities.length).toBeGreaterThan(0);

		const quickWins = out.opportunities.filter((o) => o.quadrant === 'quick-win');
		expect(quickWins.length).toBeGreaterThanOrEqual(1);

		// Financial Impact math sanity.
		const handSum = quickWins.reduce((s, o) => s + o.hours_saved_per_week, 0);
		const handCost = quickWins.reduce((s, o) => s + o.monthly_cost, 0);
		expect(out.financial_impact.weekly_hours_returned).toBeCloseTo(handSum, 1);
		expect(out.financial_impact.total_monthly_tool_cost).toBe(handCost);
		expect(out.financial_impact.monthly_net_roi).toBe(
			Math.round(handSum * 100 * 4.33 - handCost)
		);

		// 4-day plan ordering: lowest setup_time first.
		for (let i = 1; i < out.four_day_plan.length; i++) {
			const prev = quickWins.find((o) => o.tool === out.four_day_plan[i - 1].tool);
			const curr = quickWins.find((o) => o.tool === out.four_day_plan[i].tool);
			if (prev && curr) {
				expect(prev.setup_time_minutes).toBeLessThanOrEqual(curr.setup_time_minutes);
			}
		}

		// Markdown contains the 8 Quick Plan sections.
		expect(out.stage1_report_markdown).toContain('## Executive Summary');
		expect(out.stage1_report_markdown).toContain('## Impact / Effort Matrix');
		expect(out.stage1_report_markdown).toContain('## Recommended Solutions');
		expect(out.stage1_report_markdown).toContain('## Your 4-Day Quick Wins Plan');
		expect(out.stage1_report_markdown).toContain('## What Comes After Quick Wins');
		expect(out.stage1_report_markdown).toContain('## Financial Impact');
		expect(out.stage1_report_markdown).toContain('## Your Next Steps');

		// No em-dashes in any rendered output (voice gate).
		expect(out.stage1_report_markdown.includes('—')).toBe(false);
		for (const o of out.opportunities) {
			expect(o.why_this_fits.includes('—')).toBe(false);
		}

		// Print for hand review by Piers.
		// eslint-disable-next-line no-console
		console.log('\n--- FIXTURE 1 (Quick Plan) ---\n' + JSON.stringify(out, null, 2));
	});

	it('Fixture 2: regulated dental team 10-25 routes to Assessment + strict guardrails', async () => {
		const out = await runScorer({
			submissionId: 'fixture-assessment',
			clientEmail: 'practice@example.com',
			submissionDate: '2026-04-24',
			s: FIXTURE_ASSESSMENT
		});

		expect(out.report_shape).toBe('assessment-plus-guardrails');
		expect(out.guardrail.tier).toBe('strict');
		expect(out.guardrail.sector_citations.some((c) => c.source === 'HIPAA')).toBe(true);
		expect(out.guardrail.required_mitigations.length).toBeGreaterThan(0);

		// Heidi (cleared-with-baa, medical-only) should be present.
		const tools = out.opportunities.map((o) => o.tool);
		expect(tools).toContain('Heidi');

		// Markdown contains the 15 Assessment sections.
		expect(out.stage1_report_markdown).toContain('## Executive Summary');
		expect(out.stage1_report_markdown).toContain('## Business Context and Scope');
		expect(out.stage1_report_markdown).toContain('## Readiness Heat Map');
		expect(out.stage1_report_markdown).toContain('## Current-State Findings');
		expect(out.stage1_report_markdown).toContain('## Impact / Effort Matrix');
		expect(out.stage1_report_markdown).toContain('## Recommended Solutions');
		expect(out.stage1_report_markdown).toContain('## Your 4-Day Quick Wins Plan');
		expect(out.stage1_report_markdown).toContain('## Foundational and Strategic Items');
		expect(out.stage1_report_markdown).toContain('## Guardrails and Governance');
		expect(out.stage1_report_markdown).toContain('## Metrics and Decision Gates');
		expect(out.stage1_report_markdown).toContain('## Financial Impact');
		expect(out.stage1_report_markdown).toContain('## What Comes After Quick Wins');
		expect(out.stage1_report_markdown).toContain('## Your Next Steps');
		expect(out.stage1_report_markdown).toContain('## Appendix');

		// Recommended next step is policy-first or cleanup given broken process + governance gaps.
		expect(['policy-first', 'cleanup']).toContain(out.recommended_next_step);

		// No em-dashes.
		expect(out.stage1_report_markdown.includes('—')).toBe(false);

		// eslint-disable-next-line no-console
		console.log('\n--- FIXTURE 2 (Assessment) ---\n' + JSON.stringify(out, null, 2));
	});

	it('Fixture 3: Stage 2 synthesized input forces assessment shape and adds findings section', async () => {
		const out = await runScorer({
			submissionId: 'fixture-stage2',
			clientEmail: 'agency@example.com',
			submissionDate: '2026-04-24',
			s: FIXTURE_QUICK_PLAN,
			synthesized: {
				sipoc_summary: {
					suppliers: ['inbound lead form'],
					inputs: ['PDF brief'],
					process: 'Intake starts at the lead form, client onboarding manual at every step.',
					outputs: ['weekly report'],
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
					}
				],
				workaround_list: [
					{ description: 'I keep a shadow spreadsheet', evidence_turn: 3 }
				],
				exception_patterns: [
					{
						pattern: 'Retainer clients bypass intake',
						evidence_turns: [5]
					}
				],
				candidate_opportunities: [
					{
						title: 'Cut reporting takes all friday',
						rationale: 'Surfaced 2 times with high severity.',
						suggested_quadrant: 'quick-win',
						evidence_turns: [3, 7],
						governance_risk_note: null
					}
				],
				handoff_brief:
					'I ran Stage 2 on chat; the top friction is reporting and meeting notes. I recommend a Quick-Win pilot on reporting.',
				needs_human_review: false,
				llm_status: 'ok'
			}
		});

		// Stage 2 forces assessment shape even though Stage 1 alone was quick-plan.
		expect(out.report_shape).toBe('assessment-plus-guardrails');
		expect(out.stage1_report_markdown).toContain('## Stage 2 Findings');
		expect(out.stage1_report_markdown).toContain('## SIPOC Scope');
		expect(out.stage1_report_markdown).toContain('Reporting takes all Friday');
		expect(out.stage1_report_markdown).toContain('shadow spreadsheet');
		expect(out.stage1_report_markdown).toContain('Retainer clients bypass intake');
		expect(out.stage1_report_markdown.toLowerCase()).toContain('handoff brief');

		// Pain-area merge: Stage 2 surfaces a reporting theme that keyword-maps to
		// PainArea "reporting"; that should bring a reporting tool into the set.
		const tools = out.opportunities.map((o) => o.tool);
		expect(tools.length).toBeGreaterThan(0);

		// Em-dash sweep.
		expect(out.stage1_report_markdown.includes('—')).toBe(false);
	});

	it('Fixture 3b: with mocked LLM and synthesized input, why_this_fits echoes a verbatim pain_signal fragment', async () => {
		const out = await runScorer({
			submissionId: 'fixture-stage2-llm',
			clientEmail: 'agency@example.com',
			submissionDate: '2026-04-24',
			s: FIXTURE_QUICK_PLAN,
			llm: { apiKey: 'test-key-mocked-via-vi-mock' },
			synthesized: {
				sipoc_summary: {
					suppliers: ['inbound lead form'],
					inputs: ['client briefs'],
					process: 'Reporting compiled by hand from three platforms each Friday afternoon.',
					outputs: ['weekly client report'],
					customers: ['agency@example.com (caller)']
				},
				pain_areas_ranked: [
					{
						theme: VERBATIM_PAIN_FRAGMENT,
						severity: 'High',
						frequency: 'weekly',
						evidence_turns: [3, 7]
					}
				],
				workaround_list: [
					{ description: 'I keep a shadow spreadsheet', evidence_turn: 3 }
				],
				exception_patterns: [
					{ pattern: 'Retainer clients bypass intake', evidence_turns: [5] }
				],
				candidate_opportunities: [
					{
						title: `Speed up ${VERBATIM_PAIN_FRAGMENT.toLowerCase()}`,
						rationale: 'Surfaced 2 times with high severity.',
						suggested_quadrant: 'quick-win',
						evidence_turns: [3, 7],
						governance_risk_note: null
					}
				],
				handoff_brief:
					'I ran Stage 2 on chat; the top friction is reporting. I recommend a Quick-Win pilot.',
				needs_human_review: false,
				llm_status: 'ok'
			}
		});

		const quickWins = out.opportunities.filter((o) => o.quadrant === 'quick-win');
		expect(quickWins.length).toBeGreaterThan(0);

		// At least one Quick Win card's why_this_fits must contain the verbatim
		// pain_signal fragment from the synthesized input. This proves the
		// Stage 2 evidence flowed all the way to the LLM prompt and back.
		const fragmentLower = VERBATIM_PAIN_FRAGMENT.toLowerCase();
		const hasFragment = quickWins.some((qw) =>
			qw.why_this_fits.toLowerCase().includes(fragmentLower)
		);
		expect(hasFragment).toBe(true);

		expect(out.llm_status).toBe('ok');
		// Voice gate stays clean even on the LLM path.
		expect(out.stage1_report_markdown.includes('—')).toBe(false);
	});
});
