import type { QuizStatic, AdaptiveAnswer, InfoNeed } from '$lib/types/quiz';
import { INFO_NEEDS } from './quiz-agent';

export function isValidStatic(v: unknown): v is QuizStatic {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		typeof s.industry === 'string' &&
		s.industry.length > 0 &&
		typeof s.size === 'string' &&
		s.size.length > 0 &&
		typeof s.timeLeak === 'string' &&
		s.timeLeak.length > 0 &&
		typeof s.dreadedTask === 'string' &&
		s.dreadedTask.length >= 20
	);
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
