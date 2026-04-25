import { describe, it, expect, expectTypeOf } from 'vitest';
import type { InfoNeed, QuizSubmission, NextResponse } from './quiz';

describe('quiz types', () => {
	it('InfoNeed is the closed union the spec calls out', () => {
		const all: InfoNeed[] = ['stack', 'volume', 'speed-to-lead', 'ownership', 'prior-tools'];
		expect(all).toHaveLength(5);
	});

	it('QuizSubmission has static block + exactly-two adaptive + email', () => {
		const s: QuizSubmission = {
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
				{ id: 'q1', infoNeed: 'stack', question: 'a?', options: ['x', 'Other'], answer: 'x' },
				{ id: 'q2', infoNeed: 'volume', question: 'b?', options: ['y', 'Other'], answer: 'y' }
			],
			email: 'piers@example.com'
		};
		expectTypeOf(s.adaptive).toBeArray();
	});

	it('NextResponse requires "Other" to be the final option', () => {
		const r: NextResponse = {
			id: 'q1',
			question: 'Which platforms do you use?',
			helper: null,
			options: ['AFG', 'Connective', 'Other'],
			allowOtherText: true,
			infoNeed: 'stack'
		};
		expect(r.options[r.options.length - 1]).toBe('Other');
	});
});
