import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest, NextResponse } from '$lib/types/quiz';

const { mockNextQuestion } = vi.hoisted(() => ({ mockNextQuestion: vi.fn() }));
vi.mock('$lib/server/quiz-agent', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/quiz-agent')>();
	return {
		...actual,
		nextQuestion: mockNextQuestion
	};
});

import { POST } from './+server';

function makeEvent(body: unknown, platformOverride?: unknown) {
	const req = new Request('http://localhost/api/quiz/next', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
	return {
		request: req,
		platform: platformOverride ?? {
			env: {
				ANTHROPIC_API_KEY: 'sk-test',
				AI_GATEWAY_URL: 'https://gateway.example/anthropic'
			}
		}
	} as Parameters<typeof POST>[0];
}

const validReq: NextRequest = {
	static: {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February'
	},
	adaptiveSoFar: []
};

const validRes: NextResponse = {
	id: 'q1',
	question: 'Which practice-management software do you use?',
	helper: null,
	options: ['Karbon', 'Canopy', 'QuickBooks', 'Drake', 'Other'],
	allowOtherText: true,
	infoNeed: 'stack'
};

beforeEach(() => mockNextQuestion.mockReset());

describe('POST /api/quiz/next', () => {
	it('returns the agent response as JSON on a valid request', async () => {
		mockNextQuestion.mockResolvedValueOnce(validRes);
		const res = await POST(makeEvent(validReq));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual(validRes);
	});

	it('throws 400 on invalid JSON', async () => {
		await expect(POST(makeEvent('not json'))).rejects.toMatchObject({ status: 400 });
	});

	it('throws 400 on missing static fields', async () => {
		await expect(POST(makeEvent({ static: {}, adaptiveSoFar: [] }))).rejects.toMatchObject({
			status: 400
		});
	});

	it('throws 400 if adaptiveSoFar length already >= 3', async () => {
		const full: NextRequest = {
			...validReq,
			adaptiveSoFar: [
				{ id: 'q1', infoNeed: 'stack', question: 'a?', options: ['x', 'Other'], answer: 'x' },
				{ id: 'q2', infoNeed: 'volume', question: 'b?', options: ['y', 'Other'], answer: 'y' },
				{
					id: 'q3',
					infoNeed: 'sensitive-data',
					question: 'c?',
					options: ['z', 'Other'],
					answer: 'z'
				}
			]
		};
		await expect(POST(makeEvent(full))).rejects.toMatchObject({ status: 400 });
	});

	it('throws 503 if secrets are not configured', async () => {
		await expect(POST(makeEvent(validReq, { env: {} }))).rejects.toMatchObject({ status: 503 });
	});

	it('throws 502 when the agent throws', async () => {
		mockNextQuestion.mockRejectedValueOnce(new Error('gateway down'));
		await expect(POST(makeEvent(validReq))).rejects.toMatchObject({ status: 502 });
	});
});
