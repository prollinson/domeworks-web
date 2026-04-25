/**
 * opportunity-prioritizer (TypeScript runtime).
 *
 * Reads candidate opportunities + prospect/client context, returns them
 * tiered with impact / feasibility / confidence / risk scores. Tiering is a
 * pure function of the scores; the LLM is invoked only to phrase the
 * rationale prose on Quick Win, Strategic, and Foundational items.
 *
 * Skill spec at
 * /Users/piers/piers-os/.claude/skills/opportunity-prioritizer/SKILL.md.
 *
 * Concurrency: rationale calls run in parallel via Promise.all. The Sonnet
 * (Quick Win + Strategic) and Haiku (Foundational) calls do not depend on
 * each other.
 */

import type {
	PrioritizerCandidate,
	PrioritizerContext,
	PrioritizerInput,
	PrioritizerOutput,
	ScoredCandidate,
	Tier,
	TieredCandidate
} from '$lib/types/prioritizer';
import { scoreAll } from './tiering';
import { deterministicRationale, renderRationale } from './rationale';
import type { LlmConfig } from '$lib/server/llm-gateway';

export type {
	PrioritizerCandidate,
	PrioritizerContext,
	PrioritizerInput,
	PrioritizerOutput,
	TieredCandidate,
	Tier
} from '$lib/types/prioritizer';

export async function runPrioritizer(input: PrioritizerInput): Promise<PrioritizerOutput> {
	if (!input.candidates || input.candidates.length === 0) {
		return {
			tiered: [],
			surfaced_to_client: 0,
			shelved: 0,
			llm_status: 'unavailable'
		};
	}

	const scored = scoreAll(input.candidates, input.context);

	const rationales = await Promise.all(
		scored.map((s) => renderRationale(s, input.context, input.llm))
	);

	let llmStatus: PrioritizerOutput['llm_status'] = 'ok';
	for (const r of rationales) {
		if (r.llm_status === 'partial') llmStatus = 'partial';
		if (r.llm_status === 'unavailable' && llmStatus === 'ok') llmStatus = 'unavailable';
	}

	const tiered: TieredCandidate[] = scored.map((s, i) => ({
		title: s.candidate.title,
		tier: s.tier,
		impact: s.impact,
		feasibility: s.feasibility,
		confidence: s.confidence,
		risk: s.risk,
		rationale: rationales[i].rationale,
		evidence_turns: s.candidate.evidence_turns ?? [],
		governance_risk_note: s.candidate.governance_risk_note
	}));

	const surfaced = tiered.filter((t) => t.tier !== 'research').length;
	const shelved = tiered.length - surfaced;

	return {
		tiered,
		surfaced_to_client: surfaced,
		shelved,
		llm_status: llmStatus
	};
}

/**
 * Convenience: re-export the pure scorer for callers that want tier
 * decisions without rationale prose (e.g. the scorer's quadrant nudging).
 */
export { scoreAll, computeTier } from './tiering';
export { deterministicRationale } from './rationale';

export type ScoredCandidateRow = ScoredCandidate;
export type LlmConfigOption = LlmConfig;

/**
 * Helper for callers that have a pre-scored set and just need the
 * deterministic rationales (no LLM). Used by the scorer when ANTHROPIC_API_KEY
 * is missing and we still want tier decisions.
 */
export function deterministicTieredOutput(
	candidates: PrioritizerCandidate[],
	context: PrioritizerContext
): PrioritizerOutput {
	if (candidates.length === 0) {
		return { tiered: [], surfaced_to_client: 0, shelved: 0, llm_status: 'unavailable' };
	}
	const scored = scoreAll(candidates, context);
	const tiered: TieredCandidate[] = scored.map((s) => ({
		title: s.candidate.title,
		tier: s.tier,
		impact: s.impact,
		feasibility: s.feasibility,
		confidence: s.confidence,
		risk: s.risk,
		rationale: deterministicRationale(s),
		evidence_turns: s.candidate.evidence_turns ?? [],
		governance_risk_note: s.candidate.governance_risk_note
	}));
	const surfaced = tiered.filter((t) => t.tier !== 'research').length;
	return {
		tiered,
		surfaced_to_client: surfaced,
		shelved: tiered.length - surfaced,
		llm_status: 'unavailable'
	};
}

export type SuggestedQuadrant = Tier;
