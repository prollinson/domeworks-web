/**
 * GET /api/reports/{id}.md
 *
 * Streams the Stage 1 report markdown out of R2 at
 *   smb-audit/stage1-reports/{id}.md
 *
 * Used by the Gamma paste-in workflow: the link is shared with Gamma's "import from URL"
 * (or copy and paste manually) so the deck section order matches the design doc.
 *
 * Returns 404 if the markdown was never generated. The submission handler does NOT auto-write
 * to R2; only POST /api/quiz/report/gamma writes through.
 */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async ({ params, platform }) => {
	const id = params.id;
	if (!id) throw error(400, 'Missing id');

	const env = platform?.env as
		| { REPORTS_BUCKET?: { get: (key: string) => Promise<{ text(): Promise<string> } | null> } }
		| undefined;

	if (!env?.REPORTS_BUCKET) throw error(503, 'Reports bucket binding unavailable');

	const obj = await env.REPORTS_BUCKET.get(`smb-audit/stage1-reports/${id}.md`);
	if (!obj) throw error(404, 'Report not found; trigger /api/quiz/report/gamma first.');

	const body = await obj.text();
	return new Response(body, {
		status: 200,
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'cache-control': 'private, max-age=60'
		}
	});
};
