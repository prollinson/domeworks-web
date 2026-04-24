import { describe, it, expect } from 'vitest';
import { generateQuizMailto } from './mailto';
import type { QuizSubmission } from '$lib/types/quiz';

const sample: QuizSubmission = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week',
		processHealth: 'broken'
	},
	adaptive: [
		{
			id: 'q1',
			infoNeed: 'stack',
			question: 'Which platforms do most of your submissions go to?',
			options: ['AFG', 'Connective', 'Loan Market', 'In-house', 'Other'],
			answer: 'AFG'
		},
		{
			id: 'q2',
			infoNeed: 'volume',
			question: 'Roughly how many submissions per week across all lenders?',
			options: ['<5', '5–15', '15–40', '40+', 'Other'],
			answer: '5–15'
		},
		{
			id: 'q3',
			infoNeed: 'sensitive-data',
			question: 'Does the task involve payslips, tax returns, or other sensitive docs?',
			options: ['Yes', 'No', 'Unsure', 'Other'],
			answer: 'Yes'
		}
	],
	email: 'broker@example.com'
};

describe('generateQuizMailto', () => {
	it('uses piers@domeworks.tech as recipient', () => {
		const url = generateQuizMailto(sample);
		expect(url.startsWith('mailto:piers@domeworks.tech?')).toBe(true);
	});

	it('includes static answers in the body', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Mortgage broker / lending');
		expect(body).toContain('10-25');
		expect(body).toContain('admin');
		expect(body).toContain('chasing client documents');
		expect(body).toContain('Process health: broken');
	});

	it('includes each adaptive question, the options offered, and the answer', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Which platforms do most of your submissions go to?');
		expect(body).toContain('AFG · Connective · Loan Market · In-house · Other');
		expect(body).toContain('→ AFG');
		expect(body).toContain('→ 5–15');
		expect(body).toContain('→ Yes');
	});

	it('includes the respondent email', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('broker@example.com');
	});
});
