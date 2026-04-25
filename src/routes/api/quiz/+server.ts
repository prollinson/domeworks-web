import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { QuizSubmission } from '$lib/types/quiz';
import { isValidStatic, isValidAdaptive } from '$lib/server/quiz-validators';
import { insertQuizSubmission, type D1Like } from '$lib/server/quiz-storage';
import { upsertQuizSubmission } from '$lib/server/attio';
import { screenRegulatedData } from '$lib/regulated-data-screen';

export const prerender = false;

const ADAPTIVE_REQUIRED = 2;

function isValidSubmission(v: unknown): v is QuizSubmission {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		isValidStatic(s.static) &&
		Array.isArray(s.adaptive) &&
		s.adaptive.length === ADAPTIVE_REQUIRED &&
		s.adaptive.every(isValidAdaptive) &&
		typeof s.email === 'string' &&
		/^\S+@\S+\.\S+$/.test(s.email)
	);
}

function buildEmailBody(submissionId: string, s: QuizSubmission): string {
	const adaptiveLines = s.adaptive
		.map((a) => `Q: ${a.question}\n   Options offered: ${a.options.join(' · ')}\n   → ${a.answer}`)
		.join('\n');

	const businessGoal =
		s.static.businessGoal === 'Other' && s.static.businessGoalOther
			? `Other: ${s.static.businessGoalOther}`
			: s.static.businessGoal;

	const governance = s.static.governanceRules
		? `\nGovernance:\n  rules: ${s.static.governanceRules}\n  review: ${s.static.governanceReview}\n  comfort: ${s.static.governanceComfort}`
		: '';

	const digitization = s.static.digitizationProbe
		? `\nDigitization probe: ${s.static.digitizationProbe}`
		: '';

	const currentAi = s.static.currentAiUse ? `\nCurrent AI use: ${s.static.currentAiUse}` : '';

	return [
		'New AI Readiness Quiz submission.',
		`Submission id: ${submissionId}`,
		'',
		`Industry: ${s.static.industry}`,
		`Team size: ${s.static.size}`,
		`Regulated data: ${s.static.regulatedData}`,
		`Business goal: ${businessGoal}`,
		`Time leak area: ${s.static.timeLeak}`,
		`Dreaded task: ${s.static.dreadedTask}${digitization}`,
		`Process health: ${s.static.processHealth}${currentAi}${governance}`,
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

	const env = platform?.env as
		| {
				SEB?: {
					send: (msg: {
						from: string;
						to: string;
						subject: string;
						text: string;
					}) => Promise<unknown>;
				};
				QUIZ_SUBMISSIONS?: D1Like;
				ATTIO_API_KEY?: string;
		  }
		| undefined;

	if (!env?.QUIZ_SUBMISSIONS) {
		throw error(503, 'Database binding unavailable');
	}
	if (!env.SEB) {
		throw error(503, 'Email binding unavailable');
	}

	// 0. Run regulated-data-screen synchronously. Deterministic, in-process, no network.
	// Persisted on the D1 row so the scorer and the Stage 3 report read one source of truth.
	const screen = screenRegulatedData({
		industry: payload.static.industry,
		sensitive_data_flag: payload.static.regulatedData,
		governance_rules: payload.static.governanceRules,
		governance_review: payload.static.governanceReview,
		governance_comfort: payload.static.governanceComfort
	});

	// 1. D1 first (fast, local, source of truth for funnel analytics).
	let stored;
	try {
		stored = await insertQuizSubmission(env.QUIZ_SUBMISSIONS, payload, screen);
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'db insert failed';
		throw error(502, `D1 write failed: ${msg}`);
	}

	// 2. Email to Piers (existing working path).
	try {
		await env.SEB.send({
			from: 'quiz@domeworks.tech',
			to: 'piers@domeworks.tech',
			subject: `Quiz: ${payload.static.industry} · ${payload.static.size} · ${payload.email}`,
			text: buildEmailBody(stored.id, payload)
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'send failed';
		// Email failure is loud, D1 already succeeded.
		throw error(502, `Email send failed: ${msg}`);
	}

	// 3. Attio best-effort. Per failure-boundary rule, two attempts internal, then log and continue.
	if (env.ATTIO_API_KEY) {
		const attio = await upsertQuizSubmission(
			{ apiKey: env.ATTIO_API_KEY },
			stored.id,
			payload,
			screen
		);
		if (!attio.ok) {
			console.warn(
				`[quiz] Attio upsert failed (${attio.errorClass}): ${attio.message}. Submission ${stored.id} is still in D1 + email.`
			);
		}
	} else {
		console.warn('[quiz] ATTIO_API_KEY not set, skipping Attio upsert.');
	}

	return json({ ok: true, id: stored.id });
};
