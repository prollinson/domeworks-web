import { describe, it, expect, vi } from 'vitest';
import type { QuizSubmission } from '$lib/types/quiz';
import { POST } from './+server';

function makeEvent(body: unknown, seb?: { send: ReturnType<typeof vi.fn> }) {
	const req = new Request('http://localhost/api/quiz', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
	return {
		request: req,
		platform: { env: seb ? { SEB: seb } : {} }
	} as Parameters<typeof POST>[0];
}

const sample: QuizSubmission = {
	static: {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February',
		processHealth: 'healthy'
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
		},
		{
			id: 'q3',
			infoNeed: 'sensitive-data',
			question: 'Sensitive?',
			options: ['Yes', 'No', 'Unsure', 'Other'],
			answer: 'Yes'
		}
	],
	email: 'cpa@example.com'
};

describe('POST /api/quiz', () => {
	it('sends an email via SEB on a valid submission', async () => {
		const send = vi.fn().mockResolvedValue(undefined);
		const res = await POST(makeEvent(sample, { send }));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
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
		await expect(POST(makeEvent(bad, { send }))).rejects.toMatchObject({ status: 400 });
		expect(send).not.toHaveBeenCalled();
	});

	it('throws 400 when adaptive array is not exactly 3', async () => {
		const send = vi.fn();
		const bad = { ...sample, adaptive: sample.adaptive.slice(0, 2) };
		await expect(POST(makeEvent(bad, { send }))).rejects.toMatchObject({ status: 400 });
	});

	it('throws 400 when email is malformed', async () => {
		const send = vi.fn();
		await expect(POST(makeEvent({ ...sample, email: 'nope' }, { send }))).rejects.toMatchObject({
			status: 400
		});
	});

	it('throws 503 when SEB binding is missing', async () => {
		await expect(POST(makeEvent(sample))).rejects.toMatchObject({ status: 503 });
	});

	it('throws 502 when SEB send rejects', async () => {
		const send = vi.fn().mockRejectedValue(new Error('connection refused'));
		await expect(POST(makeEvent(sample, { send }))).rejects.toMatchObject({ status: 502 });
	});
});
