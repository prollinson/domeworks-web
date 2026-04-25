/**
 * Derive candidate opportunities from ranked pain areas. Pain-to-outcome
 * phrasing, no tool names (tool matching is the scorer's job).
 *
 * Quadrant suggestion rule:
 *   High severity + single workaround                -> quick-win
 *   High severity + multiple workarounds             -> foundational
 *   Medium severity                                  -> foundational
 *   Low severity                                     -> strategic (if governance), else research
 *
 * Governance risk note attaches when strict-tier Stage 1 context is present
 * and the theme mentions records the guardrail covers (records, documents,
 * clients, patients, cases, files, accounts).
 */

import type {
	CandidateOpportunity,
	PainAreaRanked,
	WorkaroundEntry,
	SynthesizerStage1Context,
} from '$lib/types/synthesizer';

export interface CandidatesInput {
	painAreas: PainAreaRanked[];
	workarounds: WorkaroundEntry[];
	stage1?: SynthesizerStage1Context;
}

const GOVERNANCE_TOUCH_RE =
	/(record|document|client|patient|case|file|account|invoice|statement|pii|phi|protected|confidential)/i;

export function deriveCandidates(
	input: CandidatesInput,
): CandidateOpportunity[] {
	const strict = input.stage1?.guardrailTier === 'strict';
	const top = input.painAreas.slice(0, 3);

	return top.map((pa) => {
		const matchingWorkarounds = input.workarounds.filter((w) =>
			pa.evidence_turns.includes(w.evidence_turn),
		);

		const quadrant: CandidateOpportunity['suggested_quadrant'] = pickQuadrant(
			pa.severity,
			matchingWorkarounds.length,
			strict,
		);

		const governance_risk_note = strict && GOVERNANCE_TOUCH_RE.test(pa.theme)
			? buildGovernanceNote(input.stage1!)
			: null;

		return {
			title: painToOutcome(pa.theme),
			rationale: buildRationale(pa, matchingWorkarounds.length),
			suggested_quadrant: quadrant,
			evidence_turns: pa.evidence_turns,
			governance_risk_note,
		};
	});
}

function pickQuadrant(
	severity: PainAreaRanked['severity'],
	workaroundCount: number,
	strict: boolean,
): CandidateOpportunity['suggested_quadrant'] {
	if (severity === 'High' && workaroundCount <= 1) return 'quick-win';
	if (severity === 'High') return 'foundational';
	if (severity === 'Medium') return 'foundational';
	return strict ? 'strategic' : 'research';
}

function painToOutcome(theme: string): string {
	const lower = theme.toLowerCase();
	if (/rework|redo|rewrite|mistake/i.test(lower)) return `Cut ${theme.toLowerCase()}`;
	if (/delay|slow|waiting/i.test(lower)) return `Speed up ${theme.toLowerCase()}`;
	if (/manual|hand|copy/i.test(lower)) return `Automate ${theme.toLowerCase()}`;
	if (/missed|dropped|lost/i.test(lower)) return `Close the gap on ${theme.toLowerCase()}`;
	return `Reduce friction in ${theme.toLowerCase()}`;
}

function buildRationale(pa: PainAreaRanked, workarounds: number): string {
	const bits: string[] = [];
	bits.push(`Surfaced ${pa.evidence_turns.length} time${pa.evidence_turns.length === 1 ? '' : 's'} on the call`);
	if (pa.frequency && pa.frequency !== '(unknown)') bits.push(`at ${pa.frequency}`);
	bits.push(`with ${pa.severity.toLowerCase()} severity`);
	if (workarounds > 0) {
		bits.push(`and ${workarounds} manual workaround${workarounds === 1 ? '' : 's'} already in flight`);
	}
	return `${bits.join(', ')}.`;
}

function buildGovernanceNote(stage1: SynthesizerStage1Context): string {
	const industry = stage1.industry;
	return `Strict guardrail tier applies in ${industry}; human review before any tool touches the records in question.`;
}
