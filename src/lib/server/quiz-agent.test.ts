import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from '$lib/types/quiz';

// Mock the SDK before importing the module under test.
const mockCreate = vi.fn();
vi.mock('@anthropic-ai/sdk', () => {
	return {
		default: class {
			messages = { create: mockCreate };
		}
	};
});

import { nextQuestion } from './quiz-agent';

const baseReq: NextRequest = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week'
	},
	adaptiveSoFar: []
};

beforeEach(() => {
	mockCreate.mockReset();
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
});
