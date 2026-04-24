import { describe, it, expect } from 'vitest';
import { isValidStatic, isValidAdaptive } from './quiz-validators';
import type { QuizStatic } from '$lib/types/quiz';

describe('isValidStatic', () => {
	const valid: QuizStatic = {
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
	};

	it('accepts a valid block', () => {
		expect(isValidStatic(valid)).toBe(true);
	});

	it('rejects non-object', () => {
		expect(isValidStatic(null)).toBe(false);
		expect(isValidStatic('string')).toBe(false);
		expect(isValidStatic(undefined)).toBe(false);
	});

	it('rejects empty industry/size/timeLeak/businessGoal', () => {
		expect(isValidStatic({ ...valid, industry: '' })).toBe(false);
		expect(isValidStatic({ ...valid, size: '' })).toBe(false);
		expect(isValidStatic({ ...valid, timeLeak: '' })).toBe(false);
		expect(isValidStatic({ ...valid, businessGoal: '' })).toBe(false);
	});

	it('rejects dreadedTask under 20 chars', () => {
		expect(isValidStatic({ ...valid, dreadedTask: 'too short' })).toBe(false);
	});

	it('rejects dreadedTask exactly 19 chars and accepts 20+', () => {
		expect(isValidStatic({ ...valid, dreadedTask: 'x'.repeat(19) })).toBe(false);
		expect(isValidStatic({ ...valid, dreadedTask: 'x'.repeat(20) })).toBe(true);
	});

	it('rejects missing processHealth', () => {
		const { processHealth, ...rest } = valid;
		void processHealth;
		expect(isValidStatic(rest)).toBe(false);
	});

	it('rejects unknown processHealth value', () => {
		expect(isValidStatic({ ...valid, processHealth: 'great' })).toBe(false);
	});

	it('accepts each of the three valid processHealth values', () => {
		expect(isValidStatic({ ...valid, processHealth: 'healthy' })).toBe(true);
		expect(isValidStatic({ ...valid, processHealth: 'broken' })).toBe(true);
		expect(isValidStatic({ ...valid, processHealth: 'unsure' })).toBe(true);
	});

	it('rejects unknown regulatedData value', () => {
		expect(isValidStatic({ ...valid, regulatedData: 'maybe' })).toBe(false);
	});

	it('accepts all three regulatedData values', () => {
		expect(isValidStatic({ ...valid, regulatedData: 'yes' })).toBe(true);
		expect(isValidStatic({ ...valid, regulatedData: 'sometimes' })).toBe(true);
		expect(isValidStatic({ ...valid, regulatedData: 'no' })).toBe(true);
	});

	it("requires businessGoalOther text when businessGoal is 'Other'", () => {
		expect(isValidStatic({ ...valid, businessGoal: 'Other', businessGoalOther: '' })).toBe(false);
		expect(isValidStatic({ ...valid, businessGoal: 'Other', businessGoalOther: '   ' })).toBe(
			false
		);
		expect(
			isValidStatic({ ...valid, businessGoal: 'Other', businessGoalOther: 'ship side-project' })
		).toBe(true);
	});

	it('accepts empty governance triple when branch did not fire', () => {
		expect(
			isValidStatic({
				...valid,
				governanceRules: '',
				governanceReview: '',
				governanceComfort: ''
			})
		).toBe(true);
	});

	it('rejects unknown governance values', () => {
		expect(isValidStatic({ ...valid, governanceRules: 'strict' })).toBe(false);
		expect(isValidStatic({ ...valid, governanceReview: 'maybe' })).toBe(false);
		expect(isValidStatic({ ...valid, governanceComfort: 'dunno' })).toBe(false);
	});

	it('requires digitizationProbe and currentAiUse to be strings (may be empty)', () => {
		expect(isValidStatic({ ...valid, digitizationProbe: 123 })).toBe(false);
		expect(isValidStatic({ ...valid, currentAiUse: null })).toBe(false);
		expect(
			isValidStatic({ ...valid, digitizationProbe: 'paper intake then scan', currentAiUse: '' })
		).toBe(true);
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

	it('rejects sensitive-data infoNeed (now a deterministic branch, not adaptive)', () => {
		expect(isValidAdaptive({ ...valid, infoNeed: 'sensitive-data' })).toBe(false);
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
