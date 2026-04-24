export type InfoNeed =
	| 'stack'
	| 'volume'
	| 'speed-to-lead'
	| 'sensitive-data'
	| 'ownership'
	| 'prior-tools';

export const INFO_NEEDS: InfoNeed[] = [
	'stack',
	'volume',
	'speed-to-lead',
	'sensitive-data',
	'ownership',
	'prior-tools'
];

export interface AdaptiveAnswer {
	id: string;
	infoNeed: InfoNeed;
	question: string;
	options: string[];
	answer: string;
}

export interface QuizStatic {
	industry: string;
	size: string;
	timeLeak: string;
	dreadedTask: string;
	processHealth: 'healthy' | 'broken' | 'unsure';
}

export interface QuizSubmission {
	static: QuizStatic;
	/** Runtime invariant: exactly 3 entries. Enforced by `/api/quiz` validator. */
	adaptive: AdaptiveAnswer[];
	email: string;
}

export interface NextRequest {
	static: QuizStatic;
	adaptiveSoFar: AdaptiveAnswer[];
}

export interface NextResponse {
	id: string;
	question: string;
	helper: string | null;
	/** Convention: last element is always `"Other"` so the UI can render an "Other — type it" escape hatch. */
	options: string[];
	allowOtherText: true;
	infoNeed: InfoNeed;
}
