import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { QuizSubmission, QuizStatic, AdaptiveAnswer, InfoNeed } from '$lib/types/quiz';
import { INFO_NEEDS } from '$lib/server/quiz-agent';

export const prerender = false;

function isValidStatic(v: unknown): v is QuizStatic {
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

function isValidAdaptive(v: unknown): v is AdaptiveAnswer {
	if (!v || typeof v !== 'object') return false;
	const a = v as Record<string, unknown>;
	return (
		typeof a.id === 'string' &&
		typeof a.question === 'string' &&
		typeof a.answer === 'string' &&
		typeof a.infoNeed === 'string' &&
		INFO_NEEDS.includes(a.infoNeed as InfoNeed) &&
		Array.isArray(a.options) &&
		a.options.every((o) => typeof o === 'string')
	);
}

function isValidSubmission(v: unknown): v is QuizSubmission {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		isValidStatic(s.static) &&
		Array.isArray(s.adaptive) &&
		s.adaptive.length === 3 &&
		s.adaptive.every(isValidAdaptive) &&
		typeof s.email === 'string' &&
		/^\S+@\S+\.\S+$/.test(s.email)
	);
}

function buildBody(s: QuizSubmission): string {
	const adaptiveLines = s.adaptive
		.map((a) => `Q: ${a.question}\n   Options offered: ${a.options.join(' · ')}\n   → ${a.answer}`)
		.join('\n');

	return [
		'New AI Readiness Quiz submission.',
		'',
		`Industry: ${s.static.industry}`,
		`Team size: ${s.static.size}`,
		`Time leak area: ${s.static.timeLeak}`,
		`Dreaded task: ${s.static.dreadedTask}`,
		'',
		'Adaptive follow-ups:',
		adaptiveLines,
		'',
		`Reply to: ${s.email}`
	].join('\n');
}

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!isValidSubmission(payload)) {
		throw error(400, 'Missing or invalid fields');
	}

	const seb = platform?.env?.SEB;
	if (!seb) {
		throw error(503, 'Email binding unavailable');
	}

	try {
		await seb.send({
			from: 'quiz@domeworks.tech',
			to: 'piers@domeworks.tech',
			subject: `Quiz: ${payload.static.industry} · ${payload.static.size} · ${payload.email}`,
			text: buildBody(payload)
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'send failed';
		throw error(502, `Email send failed: ${msg}`);
	}

	return json({ ok: true });
};
