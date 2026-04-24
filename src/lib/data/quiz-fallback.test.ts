import { describe, it, expect } from 'vitest';
import { QUIZ_FALLBACK, getFallbackQuestion } from './quiz-fallback';

describe('QUIZ_FALLBACK', () => {
	it('has exactly two questions in stack then volume order', () => {
		expect(QUIZ_FALLBACK).toHaveLength(2);
		expect(QUIZ_FALLBACK[0].infoNeed).toBe('stack');
		expect(QUIZ_FALLBACK[1].infoNeed).toBe('volume');
	});

	it('every question ends with "Other" as the last option', () => {
		for (const q of QUIZ_FALLBACK) {
			expect(q.options[q.options.length - 1]).toBe('Other');
			expect(q.allowOtherText).toBe(true);
		}
	});

	it('getFallbackQuestion returns the right slot by index', () => {
		expect(getFallbackQuestion(0).infoNeed).toBe('stack');
		expect(getFallbackQuestion(1).infoNeed).toBe('volume');
	});

	it('getFallbackQuestion throws for out-of-range indices', () => {
		expect(() => getFallbackQuestion(2)).toThrow();
		expect(() => getFallbackQuestion(-1)).toThrow();
	});
});
