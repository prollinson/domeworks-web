/**
 * Foundational task-register renderer for Stage 3.
 *
 * One row per `prioritizer.tiered.tier === 'foundational'` candidate. The
 * rationale's first clause becomes the success metric; the rest of the row
 * carries the deterministic placeholders ("TBD", "TBD: assign at handoff",
 * "None") so the register is editable in Gamma without a redesign.
 *
 * Em-dash sweep is mandatory before emit. The prioritizer rationales already
 * pass the voice gate at generation time; we run sanitizeVoice once more
 * here as a belt-and-braces pass on the final composite string.
 */
import { sanitizeVoice } from '$lib/server/llm-gateway';
import type { TieredCandidate } from '$lib/types/prioritizer';

const HEADER = '| Task | Owner | Dependency | Success Metric | Target Date |';
const DIVIDER = '| --- | --- | --- | --- | --- |';
const OWNER_PLACEHOLDER = 'TBD: assign at handoff';
const DEPENDENCY_PLACEHOLDER = 'None';
const TARGET_DATE_PLACEHOLDER = 'TBD';

/**
 * Pull the first clause of a rationale string. The clause is whatever comes
 * before the first sentence terminator (`. ` or `; `); a string with no
 * terminator returns whole-string.
 */
export function firstClause(rationale: string): string {
	const trimmed = rationale.trim();
	if (!trimmed) return '';
	const match = trimmed.match(/^(.+?)([.;](?:\s|$)|,\s)/);
	if (!match) return trimmed;
	return match[1].trim();
}

export function renderFoundationalRegister(items: TieredCandidate[]): string {
	if (items.length === 0) {
		return '_None queued from Stage 2 prioritizer._';
	}
	const rows = items.map((t) => {
		const successMetric = firstClause(t.rationale) || 'Define success metric at handoff';
		return `| ${escapeCell(t.title)} | ${OWNER_PLACEHOLDER} | ${DEPENDENCY_PLACEHOLDER} | ${escapeCell(successMetric)} | ${TARGET_DATE_PLACEHOLDER} |`;
	});
	return sanitizeVoice([HEADER, DIVIDER, ...rows].join('\n'));
}

function escapeCell(s: string): string {
	return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}
