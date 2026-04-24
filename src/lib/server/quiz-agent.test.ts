import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from '$lib/types/quiz';

// Mock the SDK before importing the module under test.
const mockCreate = vi.fn();
const constructorCalls: Array<{ apiKey: string; baseURL: string }> = [];
vi.mock('@anthropic-ai/sdk', () => {
	return {
		default: class {
			messages = { create: mockCreate };
			constructor(opts: { apiKey: string; baseURL: string }) {
				constructorCalls.push(opts);
			}
		}
	};
});

import { nextQuestion } from './quiz-agent';

const baseReq: NextRequest = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week',
		processHealth: 'healthy'
	},
	adaptiveSoFar: []
};

beforeEach(() => {
	mockCreate.mockReset();
	constructorCalls.length = 0;
});

describe('nextQuestion', () => {
	it('returns a validated NextResponse from the tool call', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which platforms do most of your submissions go to?',
						helper: null,
						options: ['AFG', 'Connective', 'Loan Market', 'In-house', 'Other'],
						infoNeed: 'stack'
					}
				}
			]
		});

		const res = await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.ai.cloudflare.com/v1/acc/gw/anthropic'
		});

		expect(res.id).toBe('q1');
		expect(res.question).toContain('submissions');
		expect(res.options).toEqual(['AFG', 'Connective', 'Loan Market', 'In-house', 'Other']);
		expect(res.infoNeed).toBe('stack');
		expect(res.allowOtherText).toBe(true);
	});

	it('assigns id based on adaptiveSoFar length', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Hours per week?',
						helper: null,
						options: ['1-3', '4-8', '8+', 'Other'],
						infoNeed: 'volume'
					}
				}
			]
		});

		const res = await nextQuestion(
			{
				...baseReq,
				adaptiveSoFar: [
					{ id: 'q1', infoNeed: 'stack', question: 'x?', options: ['x', 'Other'], answer: 'x' }
				]
			},
			{ apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' }
		);

		expect(res.id).toBe('q2');
	});

	it('appends "Other" if the model forgot to', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which platforms?',
						helper: null,
						options: ['AFG', 'Connective'],
						infoNeed: 'stack'
					}
				}
			]
		});

		const res = await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.example/anthropic'
		});

		expect(res.options[res.options.length - 1]).toBe('Other');
	});

	it('throws if the model returns no tool_use block', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'end_turn',
			content: [{ type: 'text', text: "I can't answer that." }]
		});

		await expect(
			nextQuestion(baseReq, { apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' })
		).rejects.toThrow(/tool/i);
	});

	it('throws if infoNeed is not one of the six valid values', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which?',
						helper: null,
						options: ['a', 'Other'],
						infoNeed: 'made-up-need'
					}
				}
			]
		});

		await expect(
			nextQuestion(baseReq, { apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' })
		).rejects.toThrow(/infoNeed/);
	});

	it('passes the expected model and tool config to the SDK', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'a?',
						helper: null,
						options: ['x', 'Other'],
						infoNeed: 'stack'
					}
				}
			]
		});

		await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.example/anthropic'
		});

		expect(mockCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				model: 'claude-haiku-4-5-20251001',
				max_tokens: 400,
				tool_choice: { type: 'tool', name: 'emit_question' },
				tools: expect.arrayContaining([expect.objectContaining({ name: 'emit_question' })])
			})
		);
	});

	it('passes the gateway URL to the SDK as baseURL', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'a?',
						helper: null,
						options: ['x', 'Other'],
						infoNeed: 'stack'
					}
				}
			]
		});

		await nextQuestion(baseReq, {
			apiKey: 'sk-test-abc',
			gatewayUrl: 'https://gateway.ai.cloudflare.com/v1/acc/gw/anthropic'
		});

		expect(constructorCalls).toHaveLength(1);
		expect(constructorCalls[0].apiKey).toBe('sk-test-abc');
		expect(constructorCalls[0].baseURL).toBe(
			'https://gateway.ai.cloudflare.com/v1/acc/gw/anthropic'
		);
	});

	it("moves 'Other' to the end if the model puts it first", async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which platforms?',
						helper: null,
						options: ['Other', 'AFG', 'Connective'],
						infoNeed: 'stack'
					}
				}
			]
		});

		const res = await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.example/anthropic'
		});

		expect(res.options).toEqual(['AFG', 'Connective', 'Other']);
	});

	it('throws if the model returns an empty options array', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which?',
						helper: null,
						options: [],
						infoNeed: 'stack'
					}
				}
			]
		});

		await expect(
			nextQuestion(baseReq, { apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' })
		).rejects.toThrow(/options/i);
	});
});
