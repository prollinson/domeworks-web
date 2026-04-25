/**
 * Attio Stage 2 sync tests. The HTTP layer is mocked; no live API calls.
 *
 * Asserts:
 *   - request body shape (PUT /objects/people/records with matching_attribute=email_addresses
 *     and the four custom attribute keys)
 *   - retry-once-then-fallback behavior on 5xx
 *   - typed result on persistent failure
 *   - tier-count summary helper
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { updateStage2Record, summarizePrioritizerTiers } from './attio';
import type { PrioritizerOutput } from '$lib/types/prioritizer';

interface CapturedCall {
	url: string;
	method?: string;
	body?: unknown;
	headers?: Record<string, string>;
}

let captured: CapturedCall[] = [];
let nextResponses: Array<{ ok: boolean; status: number; json?: unknown }> = [];

beforeEach(() => {
	captured = [];
	nextResponses = [];
	global.fetch = vi.fn(async (url: string, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const initHeaders = init?.headers as Record<string, string> | undefined;
		if (initHeaders) Object.assign(headers, initHeaders);
		captured.push({
			url,
			method: init?.method,
			body: init?.body ? JSON.parse(init.body as string) : undefined,
			headers
		});
		const next = nextResponses.shift() ?? { ok: true, status: 200, json: { data: {} } };
		return {
			ok: next.ok,
			status: next.status,
			async json() {
				return next.json ?? {};
			}
		} as Response;
	}) as unknown as typeof fetch;
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('updateStage2Record', () => {
	it('PUTs to /objects/people/records with the four custom attributes', async () => {
		nextResponses = [{ ok: true, status: 200, json: { data: {} } }];

		const res = await updateStage2Record(
			{ apiKey: 'test-key' },
			{
				email: 'agency@example.com',
				handoffBrief: 'I ran Stage 2 with the prospect on chat. Top friction is reporting.',
				painThemes: ['Reporting takes all Friday', 'Meeting notes get lost'],
				prioritizerSummary: '2 quick-win, 1 foundational, 1 strategic',
				completedAtIso: '2026-04-24T18:30:00.000Z'
			}
		);

		expect(res.ok).toBe(true);
		expect(captured).toHaveLength(1);
		const call = captured[0];
		expect(call.url).toBe(
			'https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses'
		);
		expect(call.method).toBe('PUT');
		expect(call.headers?.authorization).toBe('Bearer test-key');
		expect(call.body).toEqual({
			data: {
				values: {
					email_addresses: [{ email_address: 'agency@example.com' }],
					stage2_handoff_brief:
						'I ran Stage 2 with the prospect on chat. Top friction is reporting.',
					stage2_pain_themes: 'Reporting takes all Friday, Meeting notes get lost',
					stage2_prioritizer_summary: '2 quick-win, 1 foundational, 1 strategic',
					stage2_completed_at: '2026-04-24T18:30:00.000Z'
				}
			}
		});
	});

	it('retries once on 5xx, succeeds on second attempt', async () => {
		nextResponses = [
			{ ok: false, status: 502 },
			{ ok: true, status: 200, json: { data: {} } }
		];

		const res = await updateStage2Record(
			{ apiKey: 'test-key' },
			{
				email: 'agency@example.com',
				handoffBrief: 'brief',
				painThemes: ['theme'],
				prioritizerSummary: '1 quick-win',
				completedAtIso: '2026-04-24T18:30:00.000Z'
			}
		);

		expect(res.ok).toBe(true);
		expect(captured).toHaveLength(2);
	});

	it('returns typed failure after two same-class failures', async () => {
		nextResponses = [
			{ ok: false, status: 502 },
			{ ok: false, status: 502 }
		];

		const res = await updateStage2Record(
			{ apiKey: 'test-key' },
			{
				email: 'agency@example.com',
				handoffBrief: 'brief',
				painThemes: ['theme'],
				prioritizerSummary: '1 quick-win',
				completedAtIso: '2026-04-24T18:30:00.000Z'
			}
		);

		expect(res.ok).toBe(false);
		expect(res.errorClass).toBe('server');
		expect(res.step).toBe('people-upsert');
		expect(captured).toHaveLength(2);
	});

	it('classifies 4xx as client error', async () => {
		nextResponses = [
			{ ok: false, status: 400 },
			{ ok: false, status: 400 }
		];

		const res = await updateStage2Record(
			{ apiKey: 'test-key' },
			{
				email: 'agency@example.com',
				handoffBrief: 'brief',
				painThemes: [],
				prioritizerSummary: 'no tiered candidates',
				completedAtIso: '2026-04-24T18:30:00.000Z'
			}
		);

		expect(res.ok).toBe(false);
		expect(res.errorClass).toBe('client');
	});
});

describe('summarizePrioritizerTiers', () => {
	function tieredOf(
		tiers: Array<'quick-win' | 'foundational' | 'strategic' | 'research'>
	): PrioritizerOutput {
		return {
			tiered: tiers.map((tier) => ({
				title: 'x',
				tier,
				impact: 'High',
				feasibility: 'High',
				confidence: 'High',
				risk: 'Low',
				rationale: 'r',
				evidence_turns: [],
				governance_risk_note: null
			})),
			surfaced_to_client: tiers.filter((t) => t !== 'research').length,
			shelved: tiers.filter((t) => t === 'research').length,
			llm_status: 'ok'
		};
	}

	it('formats counts in tier-distance order', () => {
		const summary = summarizePrioritizerTiers(
			tieredOf(['quick-win', 'quick-win', 'foundational', 'strategic', 'research'])
		);
		expect(summary).toBe('2 quick-win, 1 foundational, 1 strategic, 1 research');
	});

	it('skips zero-count tiers', () => {
		const summary = summarizePrioritizerTiers(tieredOf(['strategic', 'strategic']));
		expect(summary).toBe('2 strategic');
	});

	it('reports no tiered candidates on empty input', () => {
		const summary = summarizePrioritizerTiers(tieredOf([]));
		expect(summary).toBe('no tiered candidates');
	});
});
