/**
 * Pre-send internal validation per design doc §7.5. Deterministic checks
 * over the scorer + synthesizer outputs. Each failed check returns a single
 * warning string. Warnings never block the render; they surface on the
 * response and at the top of the rendered markdown so I see them before the
 * report goes out.
 *
 * The five checks (in order):
 *   1. quick_win_unnamed_workflow:
 *      Quick Win cards each name a workflow (title is non-empty and not the
 *      generic "Time leak addressed by ..." fallback).
 *   2. quick_win_no_fast_setup:
 *      At least one Quick Win carries setup_time_minutes < 240. Without one,
 *      the four-day plan is dead on arrival.
 *   3. assessment_empty_register:
 *      When report_shape === 'assessment-plus-guardrails', either the
 *      Foundational register has at least one row OR a Strategic paragraph
 *      exists. An empty Assessment is a smell.
 *   4. strict_tier_quick_win_leak:
 *      When guardrail.tier === 'strict', every Quick Win's tool must have
 *      governance_risk !== 'standard'. The Pass 2 filter in
 *      selectOpportunities should already prevent this; the check is a
 *      regression catcher.
 *   5. needs_human_review_flag:
 *      When synthesized.needs_human_review === true. The route includes
 *      this on the response and the email summary leads with it.
 */
import { TOOL_LIBRARY } from '$lib/data/tool-library';
import type { Stage3Input } from './types';

const GENERIC_TITLE_PREFIX = 'Time leak addressed by ';
const QUICK_PLAN_FAST_SETUP_THRESHOLD_MIN = 240;

const STANDARD_TOOLS_BY_NAME = new Map(TOOL_LIBRARY.map((t) => [t.name, t]));

export function runPreSendChecks(input: Stage3Input): string[] {
	const warnings: string[] = [];
	const out = input.scorerOutput;
	const quickWins = out.opportunities.filter((o) => o.quadrant === 'quick-win');

	const unnamed = quickWins.filter(
		(o) => !o.title || o.title.startsWith(GENERIC_TITLE_PREFIX)
	);
	if (unnamed.length > 0) {
		warnings.push(
			`quick_win_unnamed_workflow: ${unnamed.length} Quick Win card${unnamed.length === 1 ? '' : 's'} fall back to the generic "Time leak addressed by ..." title; rename before send.`
		);
	}

	if (
		quickWins.length > 0 &&
		!quickWins.some((o) => o.setup_time_minutes < QUICK_PLAN_FAST_SETUP_THRESHOLD_MIN)
	) {
		warnings.push(
			`quick_win_no_fast_setup: no Quick Win has setup_time_minutes under ${QUICK_PLAN_FAST_SETUP_THRESHOLD_MIN}; the four-day plan needs at least one fast win on day one.`
		);
	}

	if (out.report_shape === 'assessment-plus-guardrails') {
		const haveFoundationalOrStrategic = hasFoundationalOrStrategicContent(input);
		if (!haveFoundationalOrStrategic) {
			warnings.push(
				'assessment_empty_register: Assessment shape selected but neither a Foundational task register row nor a Strategic narrative paragraph would render; review the scorer + prioritizer outputs.'
			);
		}
	}

	if (out.guardrail.tier === 'strict') {
		const leaks = quickWins.filter((qw) => {
			const tool = STANDARD_TOOLS_BY_NAME.get(qw.tool);
			return tool ? tool.governance_risk === 'standard' : false;
		});
		if (leaks.length > 0) {
			warnings.push(
				`strict_tier_quick_win_leak: ${leaks.length} Quick Win${leaks.length === 1 ? '' : 's'} (${leaks.map((l) => l.tool).join(', ')}) carry governance_risk='standard' under a strict guardrail tier; the Pass 2 filter should have routed them out.`
			);
		}
	}

	if (input.synthesized?.needs_human_review === true) {
		warnings.push(
			'needs_human_review_flag: synthesizer flagged the Stage 2 record for human review; walk the transcript before sending.'
		);
	}

	return warnings;
}

function hasFoundationalOrStrategicContent(input: Stage3Input): boolean {
	const tieredFoundOrStrat =
		input.scorerOutput.prioritizer?.tiered.filter(
			(t) => t.tier === 'foundational' || t.tier === 'strategic'
		) ?? [];
	if (tieredFoundOrStrat.length > 0) return true;
	const oppFoundOrStrat = input.scorerOutput.opportunities.filter(
		(o) => o.quadrant === 'foundational' || o.quadrant === 'strategic'
	);
	return oppFoundOrStrat.length > 0;
}
