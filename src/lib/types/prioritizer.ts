/**
 * Types for opportunity-prioritizer. Mirrors the SKILL.md spec at
 * /Users/piers/piers-os/.claude/skills/opportunity-prioritizer/SKILL.md.
 *
 * Tiering is a pure deterministic function of the four scores below; the LLM
 * is invoked only for the rationale prose on Quick Win, Foundational, and
 * Strategic items. Research-or-shelve items get a deterministic one-line log
 * entry only.
 */

import type { LlmConfig } from '$lib/server/llm-gateway';

export type Tier = 'quick-win' | 'foundational' | 'strategic' | 'research';

export type Level = 'Low' | 'Medium' | 'High';

export type GuardrailTier = 'none' | 'standard' | 'strict' | 'unknown';

export interface ImpactSignals {
	hours_saved_per_week?: number;
	revenue_unlocked_qualitative?: string;
	cost_avoided_qualitative?: string;
	risk_reduced_qualitative?: string;
	cx_improved_qualitative?: string;
}

export interface FeasibilitySignals {
	user_demand?: 'high' | 'medium' | 'low';
	tech_readiness?: 'ready' | 'partial' | 'blocked';
	data_readiness?: 'ready' | 'partial' | 'blocked';
	vendor_maturity?: 'mature' | 'emerging' | 'unknown';
}

export interface RiskSignals {
	governance_tier?: GuardrailTier;
	human_review?: 'optional' | 'recommended' | 'mandatory';
	pii_phi_touch?: boolean;
}

export interface PrioritizerCandidate {
	title: string;
	rationale: string;
	evidence_turns?: number[];
	governance_risk_note: string | null;
	suggested_quadrant?: Tier;
	impact_signals?: ImpactSignals;
	feasibility_signals?: FeasibilitySignals;
	risk_signals?: RiskSignals;
}

export interface PrioritizerContext {
	industry: string;
	team_size: string;
	strategic_fit_top_goal: string;
	guardrail_tier: GuardrailTier;
	confidence_floor?: Level;
}

export interface PrioritizerInput {
	candidates: PrioritizerCandidate[];
	context: PrioritizerContext;
	llm?: LlmConfig;
}

export interface TieredCandidate {
	title: string;
	tier: Tier;
	impact: Level;
	feasibility: Level;
	confidence: Level;
	risk: Level;
	rationale: string;
	evidence_turns: number[];
	governance_risk_note: string | null;
}

export interface PrioritizerOutput {
	tiered: TieredCandidate[];
	surfaced_to_client: number;
	shelved: number;
	llm_status: 'ok' | 'partial' | 'unavailable';
}

export interface ScoredCandidate {
	candidate: PrioritizerCandidate;
	tier: Tier;
	impact: Level;
	feasibility: Level;
	confidence: Level;
	risk: Level;
}
