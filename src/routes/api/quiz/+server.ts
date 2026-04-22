import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

interface QuizPayload {
	industry?: string;
	size?: string;
	revenue?: string;
	role?: string;
	timeLeak?: string;
	dreadedTask?: string;
	aiUsage?: string;
	email?: string;
}

function isValid(p: QuizPayload): p is Required<QuizPayload> {
	return !!(
		p.industry &&
		p.size &&
		p.revenue &&
		p.role &&
		p.timeLeak &&
		p.dreadedTask &&
		p.aiUsage &&
		p.email &&
		/^\S+@\S+\.\S+$/.test(p.email)
	);
}

function buildBody(p: Required<QuizPayload>): string {
	return [
		'New AI Readiness Quiz submission.',
		'',
		`Industry: ${p.industry}`,
		`Company size: ${p.size}`,
		`Annual revenue: ${p.revenue}`,
		`Role: ${p.role}`,
		`Biggest time leak area: ${p.timeLeak}`,
		`Most-dreaded task: ${p.dreadedTask}`,
		`AI tool usage so far: ${p.aiUsage}`,
		'',
		`Reply to: ${p.email}`
	].join('\n');
}

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: QuizPayload;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!isValid(payload)) {
		throw error(400, 'Missing or invalid fields');
	}

	const seb = platform?.env?.SEB;
	if (!seb) {
		// Binding not wired. Surface the failure so the frontend can fall back to mailto.
		throw error(503, 'Email binding unavailable');
	}

	try {
		await seb.send({
			from: 'quiz@domeworks.tech',
			to: 'piers@domeworks.tech',
			subject: `Quiz: ${payload.industry} · ${payload.size} · ${payload.email}`,
			text: buildBody(payload)
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'send failed';
		throw error(502, `Email send failed: ${msg}`);
	}

	return json({ ok: true });
};
