import type { NextResponse } from '$lib/types/quiz';

export const QUIZ_FALLBACK: NextResponse[] = [
	{
		id: 'q1',
		infoNeed: 'stack',
		question: "What's the main software that task runs through today?",
		helper: 'Pick the closest one — we can refine in the plan.',
		options: [
			'Email and spreadsheets',
			'QuickBooks or similar accounting',
			'A CRM (HubSpot, Salesforce, Follow Up Boss, etc.)',
			'Practice-management or job-management software',
			'Other'
		],
		allowOtherText: true
	},
	{
		id: 'q2',
		infoNeed: 'volume',
		question: 'Roughly how many hours per week does that task consume?',
		helper: null,
		options: ['Under 1', '1–3', '4–8', '8+', 'Other'],
		allowOtherText: true
	},
	{
		id: 'q3',
		infoNeed: 'sensitive-data',
		question:
			'Does the task involve sensitive data — health records, privileged client info, or regulated financial data?',
		helper: null,
		options: ['Yes', 'No', 'Not sure', 'Other'],
		allowOtherText: true
	}
];

export function getFallbackQuestion(index: number): NextResponse {
	if (index < 0 || index >= QUIZ_FALLBACK.length) {
		throw new RangeError(`Fallback question index out of range: ${index}`);
	}
	return QUIZ_FALLBACK[index];
}
