import { describe, it, expect } from 'vitest';
import { isValidStatic, isValidAdaptive } from './quiz-validators';

describe('isValidStatic', () => {
	const valid = {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February'
	};

	it('accepts a valid block', () => {
		expect(isValidStatic(valid)).toBe(true);
	});

	it('rejects non-object', () => {
		expect(isValidStatic(null)).toBe(false);
		expect(isValidStatic('string')).toBe(false);
		expect(isValidStatic(undefined)).toBe(false);
	});

	it('rejects empty industry/size/timeLeak', () => {
		expect(isValidStatic({ ...valid, industry: '' })).toBe(false);
		expect(isValidStatic({ ...valid, size: '' })).toBe(false);
		expect(isValidStatic({ ...valid, timeLeak: '' })).toBe(false);
	});

	it('rejects dreadedTask under 20 chars', () => {
		expect(isValidStatic({ ...valid, dreadedTask: 'too short' })).toBe(false);
	});

	it('rejects dreadedTask exactly 19 chars and accepts 20+', () => {
		expect(isValidStatic({ ...valid, dreadedTask: 'x'.repeat(19) })).toBe(false);
		expect(isValidStatic({ ...valid, dreadedTask: 'x'.repeat(20) })).toBe(true);
	});
});

describe('isValidAdaptive', () => {
	const valid = {
		id: 'q1',
		infoNeed: 'stack',
		question: 'Which PM software?',
		options: ['Karbon', 'Canopy', 'Other'],
		answer: 'Karbon'
	};

	it('accepts a valid entry', () => {
		expect(isValidAdaptive(valid)).toBe(true);
	});

	it('rejects invalid infoNeed', () => {
		expect(isValidAdaptive({ ...valid, infoNeed: 'not-a-thing' })).toBe(false);
	});

	it('rejects empty id / question / answer', () => {
		expect(isValidAdaptive({ ...valid, id: '' })).toBe(false);
		expect(isValidAdaptive({ ...valid, question: '' })).toBe(false);
		expect(isValidAdaptive({ ...valid, answer: '' })).toBe(false);
	});

	it('rejects empty options array', () => {
		expect(isValidAdaptive({ ...valid, options: [] })).toBe(false);
	});

	it('rejects non-string options entries', () => {
		expect(isValidAdaptive({ ...valid, options: ['Karbon', 42, 'Other'] })).toBe(false);
	});
});
