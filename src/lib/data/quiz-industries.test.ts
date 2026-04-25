import { describe, it, expect } from 'vitest';
import { QUIZ_INDUSTRIES } from './quiz-industries';

describe('QUIZ_INDUSTRIES', () => {
	it('includes the nine existing industries plus mortgage and insurance', () => {
		const values = QUIZ_INDUSTRIES.map((i) => i.value);
		expect(values).toContain('Accounting or bookkeeping');
		expect(values).toContain('Legal');
		expect(values).toContain('Medical or dental');
		expect(values).toContain('Trades or field services');
		expect(values).toContain('Real estate');
		expect(values).toContain('Marketing or creative agency');
		expect(values).toContain('Consulting');
		expect(values).toContain('E-commerce');
		expect(values).toContain('Other professional services');
		expect(values).toContain('Insurance or brokers');
		expect(values).toContain('Mortgage broker / lending');
		expect(QUIZ_INDUSTRIES).toHaveLength(11);
	});

	it('each entry has matching value and label (label may be longer)', () => {
		for (const { value, label } of QUIZ_INDUSTRIES) {
			expect(label.startsWith(value) || label === value).toBe(true);
		}
	});
});
