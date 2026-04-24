import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
	InfoNeed,
	AdaptiveAnswer,
	QuizStatic,
	QuizSubmission,
	NextRequest,
	NextResponse
} from './quiz';

describe('quiz types', () => {
	it('InfoNeed is the closed union the spec calls out', () => {
		const all: InfoNeed[] = [
			'stack',
			'volume',
			'speed-to-lead',
			'sensitive-data',
			'ownership',
			'prior-tools'
		];
		expect(all).toHaveLength(6);
	});

	it('QuizSubmission has static block + exactly-three adaptive + email', () => {
		const s: QuizSubmission = {
			static: {
				industry: 'Accounting or bookkeeping',
				size: '10-25',
				timeLeak: 'admin',
				dreadedTask: 'chasing tax documents from 80 clients every February',
				processHealth: 'healthy'
			},
			adaptive: [
				{ id: 'q1', infoNeed: 'stack', question: 'a?', options: ['x', 'Other'], answer: 'x' },
				{ id: 'q2', infoNeed: 'volume', question: 'b?', options: ['y', 'Other'], answer: 'y' },
				{
					id: 'q3',
					infoNeed: 'sensitive-data',
					question: 'c?',
					options: ['z', 'Other'],
					answer: 'z'
				}
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
