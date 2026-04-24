import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NextRequest } from '$lib/types/quiz';
import { nextQuestion } from '$lib/server/quiz-agent';
import { isValidStatic, isValidAdaptive } from '$lib/server/quiz-validators';

export const prerender = false;

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!payload || typeof payload !== 'object') {
		throw error(400, 'Invalid payload');
	}
	const req = payload as { static?: unknown; adaptiveSoFar?: unknown };

	if (!isValidStatic(req.static)) {
		throw error(400, 'Missing or invalid static fields');
	}
	if (!Array.isArray(req.adaptiveSoFar) || !req.adaptiveSoFar.every(isValidAdaptive)) {
		throw error(400, 'Invalid adaptiveSoFar');
	}
	if (req.adaptiveSoFar.length >= 3) {
		throw error(400, 'Quiz has no further adaptive questions');
	}

	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	const gatewayUrl = platform?.env?.AI_GATEWAY_URL;
	if (!apiKey || !gatewayUrl) {
		throw error(503, 'Agent not configured');
	}

	const nextReq: NextRequest = {
		static: req.static,
		adaptiveSoFar: req.adaptiveSoFar
	};

	try {
		const res = await nextQuestion(nextReq, { apiKey, gatewayUrl });
		return json(res);
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'agent failed';
		throw error(502, `Agent error: ${msg}`);
	}
};
