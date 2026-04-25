/**
 * Synthesizer unit tests. Covers:
 *   - pain-area ranking (severity rules, tie-break, theme collapse)
 *   - workaround extraction
 *   - exception-pattern grouping
 *   - SIPOC summary (upstream/input/output classification)
 *   - candidate derivation (quadrant rules, governance note attachment)
 *   - handoff brief (voice gate, short-transcript fallback)
 *   - runSynthesizer orchestration (empty path, happy path, contradiction path)
 */

import { describe, it, expect } from 'vitest';
import { rankPainAreas, normalizeTheme } from './pain-areas';
import { extractWorkarounds, extractExceptionPatterns } from './workarounds';
import { buildSipocSummary } from './sipoc';
import { deriveCandidates } from './candidates';
import { renderHandoffBrief } from './handoff';
import { runSynthesizer } from './index';
import type {
	SynthesizerInput,
	TurnExtraction,
} from '$lib/types/synthesizer';

function extraction(overrides: Partial<TurnExtraction> = {}): TurnExtraction {
	return {
		dimension: 'problem',
		pain_signal: null,
		frequency_signal: null,
		system_mention: null,
		sensitive_data_flag: false,
		workaround_mention: null,
		out_of_scope: false,
		emotional_friction: false,
		novel_workflow: false,
		...overrides,
	};
}

function baseInput(overrides: Partial<SynthesizerInput> = {}): SynthesizerInput {
	return {
		sessionId: 'sess-1',
		channel: 'chat',
		industry: 'legal',
		callerEmail: 'jane@example.com',
		startedAt: '2026-04-24T10:00:00.000Z',
		endedAt: '2026-04-24T10:20:00.000Z',
		turnCount: 12,
		transcript: [],
		structuredState: {
			counters: {
				sensitiveSlips: 0,
				offTopicAttempts: 0,
				emotionalFlag: false,
				novelWorkflowFlag: false,
			},
			extractions: [],
		},
		...overrides,
	};
}

describe('normalizeTheme', () => {
	it('trims to at most five words and title-cases the first', () => {
		expect(normalizeTheme('rewriting the intake form from scratch')).toBe(
			'Rewriting the intake form from',
		);
	});
	it('handles empty input', () => {
		expect(normalizeTheme('')).toBe('Unlabeled pain');
	});
});

describe('rankPainAreas', () => {
	it('ranks implication + daily cadence as High', () => {
		const out = rankPainAreas({
			extractions: [
				extraction({
					dimension: 'problem',
					pain_signal: 'intake form rework',
					frequency_signal: 'daily',
				}),
				extraction({
					dimension: 'implication',
					pain_signal: 'intake form rework',
					frequency_signal: 'every day',
				}),
			],
		});
		expect(out).toHaveLength(1);
		expect(out[0].severity).toBe('High');
		expect(out[0].evidence_turns).toEqual([0, 1]);
	});

	it('falls to Low when neither implication nor frequency is present', () => {
		const out = rankPainAreas({
			extractions: [
				extraction({
					dimension: 'problem',
					pain_signal: 'follow-up emails',
				}),
			],
		});
		expect(out[0].severity).toBe('Low');
	});

	it('tie-breaks by evidence count descending', () => {
		const out = rankPainAreas({
			extractions: [
				extraction({ dimension: 'problem', pain_signal: 'Alpha theme' }),
				extraction({ dimension: 'problem', pain_signal: 'Beta theme' }),
				extraction({ dimension: 'problem', pain_signal: 'Beta theme' }),
			],
		});
		expect(out[0].theme).toBe('Beta theme');
	});
});

describe('extractWorkarounds', () => {
	it('captures every workaround_mention with its turn index', () => {
		const list = extractWorkarounds([
			extraction(),
			extraction({ workaround_mention: 'We copy-paste into spreadsheet' }),
			extraction(),
			extraction({ workaround_mention: 'I keep a shadow calendar' }),
		]);
		expect(list).toEqual([
			{ description: 'We copy-paste into spreadsheet', evidence_turn: 1 },
			{ description: 'I keep a shadow calendar', evidence_turn: 3 },
		]);
	});
});

describe('extractExceptionPatterns', () => {
	it('groups dimension=novel turns by pain_signal theme', () => {
		const out = extractExceptionPatterns([
			extraction({
				dimension: 'novel',
				pain_signal: 'project scoping',
				novel_workflow: true,
			}),
			extraction({
				dimension: 'novel',
				pain_signal: 'project scoping',
				novel_workflow: true,
			}),
			extraction({
				dimension: 'novel',
				novel_workflow: true,
			}),
		]);
		expect(out).toHaveLength(2);
		const themed = out.find((e) => e.pattern.startsWith('Project scoping'));
		expect(themed?.evidence_turns).toEqual([0, 1]);
		const untouched = out.find((e) => e.pattern.startsWith('Workflow varies'));
		expect(untouched?.evidence_turns).toEqual([2]);
	});
});

describe('buildSipocSummary', () => {
	it('classifies system_mentions into suppliers/inputs/outputs', () => {
		const out = buildSipocSummary({
			industry: 'accounting',
			callerEmail: 'piers@test.com',
			extractions: [
				extraction({ system_mention: 'client intake form' }),
				extraction({ system_mention: 'PDF statements' }),
				extraction({ system_mention: 'monthly report' }),
			],
			painThemes: ['Month-end close', 'Client follow-up'],
		});
		expect(out.suppliers).toEqual(['client intake form']);
		expect(out.inputs).toEqual(['PDF statements']);
		expect(out.outputs).toEqual(['monthly report']);
		expect(out.customers[0]).toBe('piers@test.com (caller)');
		expect(out.process).toContain('accounting');
		expect(out.process).toContain('Month-end close');
	});

	it('returns "(not captured)" placeholders when nothing was mentioned', () => {
		const out = buildSipocSummary({
			industry: 'legal',
			callerEmail: null,
			extractions: [extraction()],
			painThemes: [],
		});
		expect(out.suppliers).toEqual(['(not captured)']);
		expect(out.customers).toEqual(['(not captured)']);
	});
});

describe('deriveCandidates', () => {
	it('quick-win for High severity with <=1 workaround', () => {
		const cands = deriveCandidates({
			painAreas: [
				{
					theme: 'Intake rework',
					severity: 'High',
					frequency: 'daily',
					evidence_turns: [0, 1],
				},
			],
			workarounds: [{ description: 'copy-paste', evidence_turn: 0 }],
		});
		expect(cands[0].suggested_quadrant).toBe('quick-win');
		expect(cands[0].title.toLowerCase()).toContain('intake rework');
	});

	it('attaches a governance note when strict-tier and theme touches records', () => {
		const cands = deriveCandidates({
			painAreas: [
				{
					theme: 'Client records handling',
					severity: 'Medium',
					frequency: 'weekly',
					evidence_turns: [2],
				},
			],
			workarounds: [],
			stage1: {
				industry: 'legal',
				timeLeak: 'admin',
				dreadedTask: '',
				processHealth: 'Unsure',
				currentAiUse: null,
				regulatedDataFlag: 'yes',
				guardrailTier: 'strict',
			},
		});
		expect(cands[0].governance_risk_note).not.toBeNull();
		expect(cands[0].governance_risk_note).toContain('Strict guardrail');
	});
});

describe('renderHandoffBrief', () => {
	it('emits the no-extractions fallback', () => {
		const brief = renderHandoffBrief({
			input: baseInput(),
			painAreas: [],
			workarounds: [],
		});
		expect(brief).toContain('Stage 2 captured no structured extractions');
		expect(brief).not.toMatch(/—/);
	});

	it('uses the top two pain themes in happy-path output and stays voice-clean', () => {
		const brief = renderHandoffBrief({
			input: baseInput({ turnCount: 20 }),
			painAreas: [
				{ theme: 'Alpha', severity: 'High', frequency: 'daily', evidence_turns: [0] },
				{ theme: 'Beta', severity: 'Medium', frequency: 'weekly', evidence_turns: [1] },
			],
			workarounds: [{ description: 'test', evidence_turn: 0 }],
		});
		expect(brief).toContain('alpha');
		expect(brief).toContain('beta');
		expect(brief).not.toMatch(/—/);
		expect(brief).toMatch(/^I /);
	});
});

describe('runSynthesizer', () => {
	it('returns the empty-extractions contract when nothing was captured', async () => {
		const out = await runSynthesizer(baseInput());
		expect(out.llm_status).toBe('unavailable');
		expect(out.needs_human_review).toBe(true);
		expect(out.pain_areas_ranked).toEqual([]);
	});

	it('runs the full pipeline on a realistic input', async () => {
		const out = await runSynthesizer(
			baseInput({
				structuredState: {
					counters: {
						sensitiveSlips: 0,
						offTopicAttempts: 0,
						emotionalFlag: false,
						novelWorkflowFlag: false,
					},
					extractions: [
						extraction({
							dimension: 'problem',
							pain_signal: 'intake form rework',
							frequency_signal: 'every day',
							system_mention: 'PDF intake form',
						}),
						extraction({
							dimension: 'implication',
							pain_signal: 'intake form rework',
							frequency_signal: 'daily',
							workaround_mention: 'we copy details into a spreadsheet',
						}),
						extraction({
							dimension: 'novel',
							pain_signal: 'project scoping',
							novel_workflow: true,
						}),
					],
				},
			}),
		);
		expect(out.llm_status).toBe('ok');
		expect(out.pain_areas_ranked.length).toBeGreaterThan(0);
		expect(out.pain_areas_ranked[0].severity).toBe('High');
		expect(out.candidate_opportunities.length).toBeGreaterThan(0);
		expect(out.workaround_list).toHaveLength(1);
		expect(out.exception_patterns.length).toBeGreaterThan(0);
		expect(out.handoff_brief).not.toMatch(/—/);
	});

	it('flags needs_human_review when a counter is tripped', async () => {
		const out = await runSynthesizer(
			baseInput({
				structuredState: {
					counters: {
						sensitiveSlips: 1,
						offTopicAttempts: 0,
						emotionalFlag: false,
						novelWorkflowFlag: false,
					},
					extractions: [
						extraction({
							dimension: 'problem',
							pain_signal: 'test',
						}),
					],
				},
			}),
		);
		expect(out.needs_human_review).toBe(true);
	});

	it('flags needs_human_review on short transcript (< 6 turns)', async () => {
		const out = await runSynthesizer(
			baseInput({
				turnCount: 3,
				structuredState: {
					counters: {
						sensitiveSlips: 0,
						offTopicAttempts: 0,
						emotionalFlag: false,
						novelWorkflowFlag: false,
					},
					extractions: [
						extraction({
							dimension: 'problem',
							pain_signal: 'test',
						}),
					],
				},
			}),
		);
		expect(out.needs_human_review).toBe(true);
	});
});
