import type {
	AdaptiveAnswer,
	GovernanceComfort,
	GovernanceReview,
	GovernanceRules,
	InfoNeed,
	QuizStatic,
	RegulatedData
} from '$lib/types/quiz';
import {
	GOVERNANCE_COMFORT_VALUES,
	GOVERNANCE_REVIEW_VALUES,
	GOVERNANCE_RULES_VALUES,
	INFO_NEEDS,
	REGULATED_DATA_VALUES
} from '$lib/types/quiz';

export const PROCESS_HEALTH_VALUES = ['healthy', 'broken', 'unsure'] as const;

function isOptionalEnum<T extends string>(v: unknown, values: readonly T[]): v is T | '' {
	if (typeof v !== 'string') return false;
	if (v === '') return true;
	return values.includes(v as T);
}

export function isValidStatic(v: unknown): v is QuizStatic {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	if (typeof s.industry !== 'string' || s.industry.length === 0) return false;
	if (typeof s.size !== 'string' || s.size.length === 0) return false;
	if (typeof s.timeLeak !== 'string' || s.timeLeak.length === 0) return false;
	if (typeof s.dreadedTask !== 'string' || s.dreadedTask.length < 20) return false;
	if (!PROCESS_HEALTH_VALUES.includes(s.processHealth as (typeof PROCESS_HEALTH_VALUES)[number])) {
		return false;
	}
	if (!REGULATED_DATA_VALUES.includes(s.regulatedData as RegulatedData)) return false;
	if (typeof s.businessGoal !== 'string' || s.businessGoal.length === 0) return false;
	if (typeof s.businessGoalOther !== 'string') return false;
	if (s.businessGoal === 'Other' && s.businessGoalOther.trim().length === 0) return false;
	if (typeof s.digitizationProbe !== 'string') return false;
	if (typeof s.currentAiUse !== 'string') return false;
	if (!isOptionalEnum<GovernanceRules>(s.governanceRules, GOVERNANCE_RULES_VALUES)) return false;
	if (!isOptionalEnum<GovernanceReview>(s.governanceReview, GOVERNANCE_REVIEW_VALUES)) return false;
	if (!isOptionalEnum<GovernanceComfort>(s.governanceComfort, GOVERNANCE_COMFORT_VALUES)) {
		return false;
	}
	return true;
}

export function isValidAdaptive(v: unknown): v is AdaptiveAnswer {
	if (!v || typeof v !== 'object') return false;
	const a = v as Record<string, unknown>;
	return (
		typeof a.id === 'string' &&
		a.id.length > 0 &&
		typeof a.question === 'string' &&
		a.question.length > 0 &&
		typeof a.answer === 'string' &&
		a.answer.length > 0 &&
		typeof a.infoNeed === 'string' &&
		INFO_NEEDS.includes(a.infoNeed as InfoNeed) &&
		Array.isArray(a.options) &&
		a.options.length > 0 &&
		a.options.every((o) => typeof o === 'string')
	);
}
