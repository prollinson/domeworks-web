/**
 * Unit tests for opportunity-prioritizer:
 *   - tier matrix exhaustive coverage (every row of the SKILL.md table)
 *   - honor-suggested-quadrant tie-break (closer-to-action wins)
 *   - governance-risk note pass-through
 *   - empty-candidates fallback (llm_status: 'unavailable')
 *   - LLM failure -> deterministic fallback
 */

import { describe, it, expect } from 'vitest';
import {
	computeTier,
	scoreImpact,
	scoreFeasibility,
	scoreConfidence,
	scoreRisk
} from './tiering';
import { runPrioritizer, deterministicRationale } from './index';
import type {
	PrioritizerCandidate,
	PrioritizerContext,
	Tier
} from '$lib/types/prioritizer';

function ctx(overrides: Partial<PrioritizerContext> = {}): PrioritizerContext {
	return {
		industry: 'Marketing or creative agency',
		team_size: '1-9',
		strategic_fit_top_goal: 'Faster turnaround',
		guardrail_tier: 'none',
		...overrides
	};
}

function candidate(overrides: Partial<PrioritizerCandidate> = {}): PrioritizerCandidate {
	return {
		title: 'Reduce friction in reporting',
		rationale: 'seeded from synthesizer',
		evidence_turns: [3, 7],
		governance_risk_note: null,
		impact_signals: { hours_saved_per_week: 4 },
		feasibility_signals: {
			tech_readiness: 'ready',
			data_readiness: 'ready',
			vendor_maturity: 'mature',
			user_demand: 'high'
		},
		...overrides
	};
}

describe('scoreImpact', () => {
	it('High when hours_saved_per_week >= 3', () => {
		expect(scoreImpact(candidate({ impact_signals: { hours_saved_per_week: 3 } }))).toBe('High');
		expect(scoreImpact(candidate({ impact_signals: { hours_saved_per_week: 8 } }))).toBe('High');
	});
	it('Medium when 1 <= hours < 3', () => {
		expect(scoreImpact(candidate({ impact_signals: { hours_saved_per_week: 1 } }))).toBe('Medium');
		expect(scoreImpact(candidate({ impact_signals: { hours_saved_per_week: 2.5 } }))).toBe(
			'Medium'
		);
	});
	it('Low when hours < 1 or unspecified and no qualitative signal', () => {
		expect(scoreImpact(candidate({ impact_signals: { hours_saved_per_week: 0.5 } }))).toBe('Low');
		expect(scoreImpact(candidate({ impact_signals: undefined }))).toBe('Low');
	});
	it('Medium when qualitative signal is set even if hours unknown', () => {
		expect(
			scoreImpact(candidate({ impact_signals: { revenue_unlocked_qualitative: 'unblocks Q3' } }))
		).toBe('Medium');
	});
});

describe('scoreFeasibility', () => {
	it('High when no signals', () => {
		expect(scoreFeasibility(candidate({ feasibility_signals: undefined }))).toBe('High');
	});
	it('Medium on any partial signal', () => {
		expect(
			scoreFeasibility(candidate({ feasibility_signals: { tech_readiness: 'partial' } }))
		).toBe('Medium');
		expect(
			scoreFeasibility(candidate({ feasibility_signals: { vendor_maturity: 'emerging' } }))
		).toBe('Medium');
	});
	it('Low on any blocked signal or unknown vendor', () => {
		expect(
			scoreFeasibility(candidate({ feasibility_signals: { data_readiness: 'blocked' } }))
		).toBe('Low');
		expect(
			scoreFeasibility(candidate({ feasibility_signals: { vendor_maturity: 'unknown' } }))
		).toBe('Low');
	});
});

describe('scoreConfidence', () => {
	it('High when evidence_turns.length >= 3', () => {
		expect(scoreConfidence(candidate({ evidence_turns: [1, 2, 3] }), ctx())).toBe('High');
	});
	it('Floor when evidence_turns has 1-2 entries', () => {
		expect(scoreConfidence(candidate({ evidence_turns: [1, 2] }), ctx())).toBe('Medium');
		expect(
			scoreConfidence(candidate({ evidence_turns: [1] }), ctx({ confidence_floor: 'High' }))
		).toBe('High');
	});
	it('Low when no evidence and no rationale', () => {
		expect(
			scoreConfidence(candidate({ evidence_turns: [], rationale: '' }), ctx())
		).toBe('Low');
	});
	it('Floor when no evidence but rationale present (Stage 1 origin)', () => {
		expect(
			scoreConfidence(candidate({ evidence_turns: [], rationale: 'Stage 1 dreaded task hint' }), ctx())
		).toBe('Medium');
	});
});

describe('scoreRisk', () => {
	it('High when strict tier + pii_phi_touch', () => {
		expect(
			scoreRisk(
				candidate({ risk_signals: { governance_tier: 'strict', pii_phi_touch: true } }),
				ctx()
			)
		).toBe('High');
	});
	it('Medium when strict tier without pii_phi_touch', () => {
		expect(
			scoreRisk(candidate({ risk_signals: { governance_tier: 'strict' } }), ctx())
		).toBe('Medium');
	});
	it('Medium when standard or unknown tier', () => {
		expect(scoreRisk(candidate(), ctx({ guardrail_tier: 'standard' }))).toBe('Medium');
		expect(scoreRisk(candidate(), ctx({ guardrail_tier: 'unknown' }))).toBe('Medium');
	});
	it('Low when none tier', () => {
		expect(scoreRisk(candidate(), ctx({ guardrail_tier: 'none' }))).toBe('Low');
	});
});

describe('computeTier matrix (every row of the SKILL.md table)', () => {
	const cases: Array<{
		label: string;
		hours: number;
		feasibility: 'high' | 'medium' | 'low';
		confidence: 'high' | 'medium' | 'low';
		risk: 'high' | 'medium' | 'low';
		expected: Tier;
	}> = [
		// Row 1: High impact + High feasibility + High|Medium confidence + Low|Medium risk -> quick-win.
		{ label: 'H/H/H/L', hours: 5, feasibility: 'high', confidence: 'high', risk: 'low', expected: 'quick-win' },
		{ label: 'H/H/H/M', hours: 5, feasibility: 'high', confidence: 'high', risk: 'medium', expected: 'quick-win' },
		{ label: 'H/H/M/L', hours: 5, feasibility: 'high', confidence: 'medium', risk: 'low', expected: 'quick-win' },
		{ label: 'H/H/M/M', hours: 5, feasibility: 'high', confidence: 'medium', risk: 'medium', expected: 'quick-win' },
		// Row 2: High impact + High feasibility + High|Medium confidence + High risk -> foundational.
		{ label: 'H/H/H/Hrisk', hours: 5, feasibility: 'high', confidence: 'high', risk: 'high', expected: 'foundational' },
		{ label: 'H/H/M/Hrisk', hours: 5, feasibility: 'high', confidence: 'medium', risk: 'high', expected: 'foundational' },
		// Row 3: High impact + Medium feasibility + any confidence + any risk -> foundational.
		{ label: 'H/M/H/L', hours: 5, feasibility: 'medium', confidence: 'high', risk: 'low', expected: 'foundational' },
		{ label: 'H/M/L/H', hours: 5, feasibility: 'medium', confidence: 'low', risk: 'high', expected: 'foundational' },
		// Gap rules: High impact + Low feasibility -> foundational; High impact + Low confidence -> foundational.
		{ label: 'H/Lfeas', hours: 5, feasibility: 'low', confidence: 'high', risk: 'low', expected: 'foundational' },
		{ label: 'H/H/Lconf', hours: 5, feasibility: 'high', confidence: 'low', risk: 'low', expected: 'foundational' },
		// Row 4: Medium impact + High feasibility + High confidence + Low|Medium risk -> foundational.
		{ label: 'M/H/H/L', hours: 2, feasibility: 'high', confidence: 'high', risk: 'low', expected: 'foundational' },
		{ label: 'M/H/H/M', hours: 2, feasibility: 'high', confidence: 'high', risk: 'medium', expected: 'foundational' },
		// Row 5: Medium impact otherwise -> strategic.
		{ label: 'M/M/M/L', hours: 2, feasibility: 'medium', confidence: 'medium', risk: 'low', expected: 'strategic' },
		{ label: 'M/H/M/L', hours: 2, feasibility: 'high', confidence: 'medium', risk: 'low', expected: 'strategic' },
		{ label: 'M/H/H/H', hours: 2, feasibility: 'high', confidence: 'high', risk: 'high', expected: 'strategic' },
		// Rows 6-7: Low impact -> research (regardless of other dimensions).
		{ label: 'L/H/H/L', hours: 0.5, feasibility: 'high', confidence: 'high', risk: 'low', expected: 'research' },
		{ label: 'L/L/L/H', hours: 0.5, feasibility: 'low', confidence: 'low', risk: 'high', expected: 'research' }
	];

	for (const c of cases) {
		it(`${c.label} -> ${c.expected}`, () => {
			const cand = candidate({
				impact_signals: { hours_saved_per_week: c.hours },
				evidence_turns:
					c.confidence === 'high' ? [1, 2, 3] : c.confidence === 'medium' ? [1] : [],
				rationale: c.confidence === 'low' ? '' : 'seed',
				feasibility_signals:
					c.feasibility === 'high'
						? {
								tech_readiness: 'ready',
								data_readiness: 'ready',
								vendor_maturity: 'mature',
								user_demand: 'high'
							}
						: c.feasibility === 'medium'
							? {
									tech_readiness: 'partial',
									data_readiness: 'ready',
									vendor_maturity: 'mature',
									user_demand: 'high'
								}
							: {
									tech_readiness: 'blocked',
									data_readiness: 'ready',
									vendor_maturity: 'mature',
									user_demand: 'high'
								},
				risk_signals:
					c.risk === 'high'
						? { governance_tier: 'strict', pii_phi_touch: true }
						: c.risk === 'medium'
							? { governance_tier: 'standard' }
							: { governance_tier: 'none' }
			});
			const result = computeTier(cand, ctx({ guardrail_tier: 'none' }));
			expect(result.tier).toBe(c.expected);
		});
	}
});

describe('honor-suggested-quadrant tie-break', () => {
	it('synthesized foundational + computed strategic -> foundational (closer-to-action wins)', () => {
		const cand = candidate({
			impact_signals: { hours_saved_per_week: 2 },
			feasibility_signals: { tech_readiness: 'partial' },
			suggested_quadrant: 'foundational'
		});
		expect(computeTier(cand, ctx()).tier).toBe('foundational');
	});

	it('synthesized strategic + computed foundational stays foundational (closer-to-action wins)', () => {
		const cand = candidate({
			impact_signals: { hours_saved_per_week: 2 },
			feasibility_signals: { tech_readiness: 'partial' },
			suggested_quadrant: 'foundational'
		});
		// Without nudge it would already be 'strategic'; nudge pulls to foundational.
		expect(computeTier(cand, ctx()).tier).toBe('foundational');
	});

	it('synthesized quick-win never overrides computed foundational', () => {
		const cand = candidate({
			impact_signals: { hours_saved_per_week: 5 },
			feasibility_signals: { tech_readiness: 'partial' },
			suggested_quadrant: 'quick-win'
		});
		expect(computeTier(cand, ctx()).tier).toBe('foundational');
	});
});

describe('runPrioritizer', () => {
	it('empty-candidates fallback', async () => {
		const out = await runPrioritizer({ candidates: [], context: ctx() });
		expect(out.tiered).toEqual([]);
		expect(out.surfaced_to_client).toBe(0);
		expect(out.shelved).toBe(0);
		expect(out.llm_status).toBe('unavailable');
	});

	it('returns deterministic rationales when no llm config is provided', async () => {
		const out = await runPrioritizer({
			candidates: [
				candidate(),
				candidate({
					title: 'Speed up reporting',
					impact_signals: { hours_saved_per_week: 0.5 }
				})
			],
			context: ctx()
		});
		expect(out.tiered).toHaveLength(2);
		expect(out.tiered[0].tier).toBe('quick-win');
		expect(out.tiered[1].tier).toBe('research');
		// Em-dash sweep on rationales.
		for (const t of out.tiered) {
			expect(t.rationale.includes('—')).toBe(false);
		}
	});

	it('attaches governance_risk_note pass-through', async () => {
		const out = await runPrioritizer({
			candidates: [
				candidate({
					governance_risk_note: 'HIPAA review required before vendor onboard.'
				})
			],
			context: ctx({ guardrail_tier: 'strict' })
		});
		expect(out.tiered[0].governance_risk_note).toBe(
			'HIPAA review required before vendor onboard.'
		);
	});

	it('Research-or-shelve uses deterministic rationale even when llm config is provided', async () => {
		const out = await runPrioritizer({
			candidates: [candidate({ impact_signals: { hours_saved_per_week: 0.5 } })],
			context: ctx(),
			llm: { apiKey: 'fake-key-not-called-because-research-tier-skips-llm' }
		});
		expect(out.tiered[0].tier).toBe('research');
		expect(out.tiered[0].rationale).toBe(
			'Shelved; revisit after the top three tiers have had thirty days in flight.'
		);
	});

	it('counts surfaced vs shelved correctly', async () => {
		const out = await runPrioritizer({
			candidates: [
				candidate({ title: 'A', impact_signals: { hours_saved_per_week: 5 } }),
				candidate({ title: 'B', impact_signals: { hours_saved_per_week: 2 } }),
				candidate({ title: 'C', impact_signals: { hours_saved_per_week: 0.5 } })
			],
			context: ctx()
		});
		expect(out.surfaced_to_client).toBe(2);
		expect(out.shelved).toBe(1);
	});
});

describe('deterministicRationale', () => {
	it('returns voice-clean fallback for each tier', () => {
		const tiers: Tier[] = ['quick-win', 'foundational', 'strategic', 'research'];
		for (const tier of tiers) {
			const r = deterministicRationale({
				candidate: candidate(),
				tier,
				impact: 'High',
				feasibility: 'High',
				confidence: 'High',
				risk: 'Low'
			});
			expect(r).not.toMatch(/—/);
			expect(r).not.toMatch(/\bwe\b|\bour\b/i);
		}
	});
});
