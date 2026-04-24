import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { QuizSubmission } from '$lib/types/quiz';
import { POST } from './+server';

type Binding = {
	send?: ReturnType<typeof vi.fn>;
	run?: ReturnType<typeof vi.fn>;
};

function makeDb(opts?: { shouldThrow?: boolean }) {
	const run = vi.fn(async () => {
		if (opts?.shouldThrow) throw new Error('db down');
		return { success: true };
	});
	return {
		prepare: vi.fn(() => ({
			bind: vi.fn(() => ({ run }))
		})),
		run
	};
}

function makeEvent(body: unknown, opts?: { seb?: Binding; db?: ReturnType<typeof makeDb> | null }) {
	const req = new Request('http://localhost/api/quiz', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
	const env: Record<string, unknown> = {};
	if (opts?.seb) env.SEB = opts.seb;
	if (opts?.db !== null) env.QUIZ_SUBMISSIONS = opts?.db ?? makeDb();
	return {
		request: req,
		platform: { env }
	} as Parameters<typeof POST>[0];
}

const sample: QuizSubmission = {
	static: {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		regulatedData: 'yes',
		businessGoal: 'Add capacity without hiring',
		businessGoalOther: '',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February',
		digitizationProbe: '',
		processHealth: 'healthy',
		currentAiUse: '',
		governanceRules: 'informal',
		governanceReview: 'always',
		governanceComfort: 'no'
	},
	adaptive: [
		{
			id: 'q1',
			infoNeed: 'stack',
			question: 'Which PM software?',
			options: ['Karbon', 'Canopy', 'Other'],
			answer: 'Karbon'
		},
		{
			id: 'q2',
			infoNeed: 'volume',
			question: 'Hours/week?',
			options: ['1-3', '4-8', '8+', 'Other'],
			answer: '8+'
		}
	],
	email: 'cpa@example.com'
};

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('POST /api/quiz', () => {
	it('writes to D1 and sends an email via SEB on a valid submission', async () => {
		const send = vi.fn().mockResolvedValue(undefined);
		const db = makeDb();
		const res = await POST(makeEvent(sample, { seb: { send }, db }));
		expect(res.status).toBe(200);
		const body = (await res.json()) as { ok: boolean; id: string };
		expect(body.ok).toBe(true);
		expect(body.id).toMatch(/[0-9a-f-]{36}/);
		expect(db.prepare).toHaveBeenCalledOnce();
		expect(send).toHaveBeenCalledOnce();
		const msg = send.mock.calls[0][0];
		expect(msg.to).toBe('piers@domeworks.tech');
		expect(msg.text).toContain('Industry: Accounting or bookkeeping');
		expect(msg.text).toContain('Process health: healthy');
		expect(msg.text).toContain('Which PM software?');
		expect(msg.text).toContain('→ Karbon');
		expect(msg.text).toContain('Reply to: cpa@example.com');
	});

	it('throws 400 on missing static fields', async () => {
		const send = vi.fn();
		const bad = { ...sample, static: { ...sample.static, industry: '' } };
		await expect(POST(makeEvent(bad, { seb: { send } }))).rejects.toMatchObject({ status: 400 });
		expect(send).not.toHaveBeenCalled();
	});

	it('throws 400 when adaptive array is not exactly 2', async () => {
		const send = vi.fn();
		const bad = { ...sample, adaptive: sample.adaptive.slice(0, 1) };
		await expect(POST(makeEvent(bad, { seb: { send } }))).rejects.toMatchObject({ status: 400 });
	});

	it('throws 400 when email is malformed', async () => {
		const send = vi.fn();
		await expect(
			POST(makeEvent({ ...sample, email: 'nope' }, { seb: { send } }))
		).rejects.toMatchObject({
			status: 400
		});
	});

	it('throws 503 when D1 binding is missing', async () => {
		const send = vi.fn();
		await expect(POST(makeEvent(sample, { seb: { send }, db: null }))).rejects.toMatchObject({
			status: 503
		});
	});

	it('throws 503 when SEB binding is missing', async () => {
		await expect(POST(makeEvent(sample))).rejects.toMatchObject({ status: 503 });
	});

	it('throws 502 when D1 insert fails', async () => {
		const send = vi.fn();
		const db = makeDb({ shouldThrow: true });
		await expect(POST(makeEvent(sample, { seb: { send }, db }))).rejects.toMatchObject({
			status: 502
		});
	});

	it('throws 502 when SEB send rejects', async () => {
		const send = vi.fn().mockRejectedValue(new Error('connection refused'));
		await expect(POST(makeEvent(sample, { seb: { send } }))).rejects.toMatchObject({
			status: 502
		});
	});
});
