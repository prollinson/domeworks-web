export type InfoNeed =
	| 'stack'
	| 'volume'
	| 'speed-to-lead'
	| 'sensitive-data'
	| 'ownership'
	| 'prior-tools';

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
}

export interface QuizSubmission {
	static: QuizStatic;
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
	options: string[];
	allowOtherText: true;
	infoNeed: InfoNeed;
}
