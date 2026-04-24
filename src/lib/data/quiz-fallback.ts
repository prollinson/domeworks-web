import type { NextResponse } from '$lib/types/quiz';

export const QUIZ_FALLBACK: NextResponse[] = [
	{
		id: 'q1',
		infoNeed: 'stack',
		question: "What's the main software that task runs through today?",
		helper: 'Pick the closest one, we can refine in the plan.',
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
		options: ['Under 1', '1 to 3', '4 to 8', '8+', 'Other'],
		allowOtherText: true
	}
];

export function getFallbackQuestion(index: number): NextResponse {
	if (index < 0 || index >= QUIZ_FALLBACK.length) {
		throw new RangeError(`Fallback question index out of range: ${index}`);
	}
	return QUIZ_FALLBACK[index];
}
