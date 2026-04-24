import { describe, it, expect } from 'vitest';
import { generateQuizMailto } from './mailto';
import type { QuizSubmission } from '$lib/types/quiz';

const sample: QuizSubmission = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		regulatedData: 'yes',
		businessGoal: 'Add capacity without hiring',
		businessGoalOther: '',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week',
		digitizationProbe: 'starts in email, ends as a PDF package to the lender',
		processHealth: 'broken',
		currentAiUse: 'tried ChatGPT for initial document review',
		governanceRules: 'informal',
		governanceReview: 'always',
		governanceComfort: 'no'
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
			options: ['<5', '5-15', '15-40', '40+', 'Other'],
			answer: '5-15'
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
		expect(body).toContain('Regulated data: yes');
		expect(body).toContain('Business goal: Add capacity without hiring');
	});

	it('includes governance + digitization + current AI blocks when filled', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Governance:');
		expect(body).toContain('Tool-use rules: informal');
		expect(body).toContain('Digitization probe: starts in email');
		expect(body).toContain('Current AI use: tried ChatGPT');
	});

	it('renders businessGoal Other with typed text', () => {
		const other: QuizSubmission = {
			...sample,
			static: {
				...sample.static,
				businessGoal: 'Other',
				businessGoalOther: 'Spin up a side-product'
			}
		};
		const body = decodeURIComponent(generateQuizMailto(other).split('body=')[1]);
		expect(body).toContain('Business goal: Other: Spin up a side-product');
	});

	it('includes each adaptive question, the options offered, and the answer', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Which platforms do most of your submissions go to?');
		expect(body).toContain('AFG · Connective · Loan Market · In-house · Other');
		expect(body).toContain('→ AFG');
		expect(body).toContain('→ 5-15');
	});

	it('includes the respondent email', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('broker@example.com');
	});
});
