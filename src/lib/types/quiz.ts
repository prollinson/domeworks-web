export type InfoNeed = 'stack' | 'volume' | 'speed-to-lead' | 'ownership' | 'prior-tools';

export const INFO_NEEDS: InfoNeed[] = [
	'stack',
	'volume',
	'speed-to-lead',
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

export type RegulatedData = 'yes' | 'sometimes' | 'no';
export type GovernanceRules = 'formal' | 'informal' | 'none';
export type GovernanceReview = 'always' | 'sometimes' | 'no';
export type GovernanceComfort = 'yes' | 'no' | 'unsure';

export const REGULATED_DATA_VALUES: RegulatedData[] = ['yes', 'sometimes', 'no'];
export const GOVERNANCE_RULES_VALUES: GovernanceRules[] = ['formal', 'informal', 'none'];
export const GOVERNANCE_REVIEW_VALUES: GovernanceReview[] = ['always', 'sometimes', 'no'];
export const GOVERNANCE_COMFORT_VALUES: GovernanceComfort[] = ['yes', 'no', 'unsure'];

/**
 * Static answers captured by the quiz UI.
 *
 * Conditional fields are empty strings when the branch did not fire:
 * - `digitizationProbe` fills only if `dreadedTask` mentions email / PDF / phone / paper / spreadsheet.
 * - `governanceRules`, `governanceReview`, `governanceComfort` fill only for regulated industries
 *   when `regulatedData` is 'yes' or 'sometimes'.
 * - `businessGoalOther` fills only when `businessGoal === 'Other'`.
 */
export interface QuizStatic {
	industry: string;
	size: string;
	regulatedData: RegulatedData;
	businessGoal: string;
	businessGoalOther: string;
	timeLeak: string;
	dreadedTask: string;
	digitizationProbe: string;
	processHealth: 'healthy' | 'broken' | 'unsure';
	currentAiUse: string;
	governanceRules: GovernanceRules | '';
	governanceReview: GovernanceReview | '';
	governanceComfort: GovernanceComfort | '';
}

export interface QuizSubmission {
	static: QuizStatic;
	/** Runtime invariant: exactly 2 entries. Enforced by `/api/quiz` validator. */
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
	/** Convention: last element is always `"Other"` so the UI can render an "Other, type it" escape hatch. */
	options: string[];
	allowOtherText: true;
	infoNeed: InfoNeed;
}
