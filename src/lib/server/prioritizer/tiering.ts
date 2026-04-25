/**
 * Deterministic tiering for opportunity-prioritizer. No LLM. Same input
 * always yields the same tier so Stage 3 reports are reproducible.
 *
 * Scoring rules from
 * /Users/piers/piers-os/.claude/skills/opportunity-prioritizer/SKILL.md:
 *   - Impact: hours_saved_per_week >=3 High, 1-3 Medium, <1 or unknown Low.
 *     Low can bump to Medium if any qualitative impact signal is set.
 *   - Feasibility: start High; partial signal -> Medium; blocked or unknown
 *     vendor -> Low.
 *   - Confidence: start at context.confidence_floor (default Medium).
 *     evidence_turns.length >= 3 -> High. evidence_turns.length === 0 AND
 *     no Stage 1 origin -> Low.
 *   - Risk: 'none' -> Low. 'standard'|'unknown' -> Medium. 'strict' AND
 *     pii_phi_touch -> High.
 *
 * Tier matrix (exhaustive):
 *   - quick-win when Impact=High, Feasibility=High, Confidence=High|Med,
 *     Risk=Low|Med.
 *   - foundational when Impact=High AND Risk=High (governance first), or
 *     when Impact=High AND Feasibility<High, or when Impact=High AND
 *     Confidence=Low, or when Impact=Medium AND Feasibility=High AND
 *     Confidence=High AND Risk<High.
 *   - strategic when Impact=Medium and the foundational rule does not fire.
 *   - research when Impact=Low.
 *
 * Suggested-quadrant nudge: when the caller passes a `suggested_quadrant`,
 * use it as a tie-break for items the rules tier as the same level. Only
 * pulls toward "closer to action" (synthesizer suggested foundational +
 * computed strategic -> foundational), never away from it.
 */

import type {
	Level,
	PrioritizerCandidate,
	PrioritizerContext,
	ScoredCandidate,
	Tier
} from '$lib/types/prioritizer';

export interface ComputeTierResult {
	tier: Tier;
	impact: Level;
	feasibility: Level;
	confidence: Level;
	risk: Level;
}

export function computeTier(
	candidate: PrioritizerCandidate,
	context: PrioritizerContext
): ComputeTierResult {
	const impact = scoreImpact(candidate);
	const feasibility = scoreFeasibility(candidate);
	const confidence = scoreConfidence(candidate, context);
	const risk = scoreRisk(candidate, context);

	const baseTier = decideTier(impact, feasibility, confidence, risk);
	const tier = applySuggestedQuadrantNudge(baseTier, candidate.suggested_quadrant);

	return { tier, impact, feasibility, confidence, risk };
}

export function scoreImpact(candidate: PrioritizerCandidate): Level {
	const hours = candidate.impact_signals?.hours_saved_per_week;
	if (typeof hours === 'number') {
		if (hours >= 3) return 'High';
		if (hours >= 1) return 'Medium';
	}
	const qualitative =
		candidate.impact_signals?.revenue_unlocked_qualitative ||
		candidate.impact_signals?.cost_avoided_qualitative ||
		candidate.impact_signals?.risk_reduced_qualitative ||
		candidate.impact_signals?.cx_improved_qualitative;
	if (qualitative) return 'Medium';
	return 'Low';
}

export function scoreFeasibility(candidate: PrioritizerCandidate): Level {
	const f = candidate.feasibility_signals;
	if (!f) return 'High';
	const blocked =
		f.tech_readiness === 'blocked' ||
		f.data_readiness === 'blocked' ||
		f.vendor_maturity === 'unknown' ||
		f.user_demand === 'low';
	if (blocked) return 'Low';
	const partial =
		f.tech_readiness === 'partial' ||
		f.data_readiness === 'partial' ||
		f.vendor_maturity === 'emerging' ||
		f.user_demand === 'medium';
	if (partial) return 'Medium';
	return 'High';
}

export function scoreConfidence(
	candidate: PrioritizerCandidate,
	context: PrioritizerContext
): Level {
	const evidenceCount = candidate.evidence_turns?.length ?? 0;
	const floor: Level = context.confidence_floor ?? 'Medium';
	if (evidenceCount >= 3) return 'High';
	if (evidenceCount === 0) {
		// Stage 1 origin is signaled by a missing or empty evidence_turns array
		// alongside a non-empty rationale. We cannot tell the two apart from
		// type alone, so we honor the floor when the candidate has no evidence
		// to avoid demoting Stage 1 themes the caller already vouched for.
		const hasOriginRationale = candidate.rationale?.length > 0;
		if (!hasOriginRationale) return 'Low';
	}
	return floor;
}

export function scoreRisk(
	candidate: PrioritizerCandidate,
	context: PrioritizerContext
): Level {
	const tier = candidate.risk_signals?.governance_tier ?? context.guardrail_tier;
	const piiPhi = candidate.risk_signals?.pii_phi_touch === true;
	if (tier === 'strict' && piiPhi) return 'High';
	if (tier === 'strict') return 'Medium';
	if (tier === 'standard' || tier === 'unknown') return 'Medium';
	return 'Low';
}

function decideTier(
	impact: Level,
	feasibility: Level,
	confidence: Level,
	risk: Level
): Tier {
	if (impact === 'Low') return 'research';

	if (impact === 'High') {
		if (risk === 'High') return 'foundational';
		if (feasibility === 'High' && (confidence === 'High' || confidence === 'Medium')) {
			return 'quick-win';
		}
		return 'foundational';
	}

	// impact === 'Medium'
	if (
		feasibility === 'High' &&
		confidence === 'High' &&
		(risk === 'Low' || risk === 'Medium')
	) {
		return 'foundational';
	}
	return 'strategic';
}

const TIER_DISTANCE: Record<Tier, number> = {
	'quick-win': 0,
	foundational: 1,
	strategic: 2,
	research: 3
};

/**
 * Honor the synthesizer's suggested_quadrant only when it would pull the
 * tier closer to action. A suggested foundational + computed strategic
 * collapses to foundational (closer to action wins). The reverse is
 * ignored. Quick-win can never be promoted by suggestion alone; the rules
 * own that ceiling.
 */
function applySuggestedQuadrantNudge(computed: Tier, suggested: Tier | undefined): Tier {
	if (!suggested) return computed;
	if (suggested === 'quick-win') return computed; // never promote into Quick Win via suggestion
	return TIER_DISTANCE[suggested] < TIER_DISTANCE[computed] ? suggested : computed;
}

export function scoreAll(
	candidates: PrioritizerCandidate[],
	context: PrioritizerContext
): ScoredCandidate[] {
	return candidates.map((candidate) => {
		const r = computeTier(candidate, context);
		return {
			candidate,
			tier: r.tier,
			impact: r.impact,
			feasibility: r.feasibility,
			confidence: r.confidence,
			risk: r.risk
		};
	});
}
