/**
 * POST /api/quiz/report/gamma
 *
 * Body: { submission_id: string }
 *
 * Writes the scorer's `stage1_report_markdown` to R2 at
 *   smb-audit/stage1-reports/{submission_id}.md
 * and returns:
 *   { url: "<public URL to /api/reports/{submission_id}.md>",
 *     bucket_path: "smb-audit/stage1-reports/{submission_id}.md",
 *     markdown: "<the report markdown>" }
 *
 * Decision (documented). Cloudflare R2 does not ship a Workers-API for presigned URLs;
 * the alternatives are S3-API-compatible signing in another worker, or a public bucket
 * with a custom domain. To keep scope bounded for Week 2, the export pipes through a
 * GET endpoint at /api/reports/{id} that streams the file out of R2 with the worker's
 * own auth. The returned URL is a same-origin link that works in any browser.
 *
 * If the row has not yet been scored, this endpoint runs the scorer (same path as
 * /api/quiz/report) and writes through to R2.
 */
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getSubmissionRow,
	persistScorerOutput,
	readPersistedScorerOutput,
	rowToQuizStatic,
	type D1Like
} from '$lib/server/quiz-storage';
import { runScorer } from '$lib/server/scorer';
import { screenRegulatedData } from '$lib/regulated-data-screen';

export const prerender = false;

const R2_PREFIX = 'smb-audit/stage1-reports';

function bucketKey(id: string): string {
	return `${R2_PREFIX}/${id}.md`;
}

export const POST: RequestHandler = async ({ request, platform, url }) => {
	let payload: { submission_id?: string };
	try {
		payload = (await request.json()) as { submission_id?: string };
	} catch {
		throw error(400, 'Invalid JSON');
	}
	const id = payload.submission_id;
	if (typeof id !== 'string' || id.length === 0) throw error(400, 'submission_id required');

	const env = platform?.env as
		| {
				QUIZ_SUBMISSIONS?: D1Like;
				REPORTS_BUCKET?: { put: (key: string, value: string, opts?: unknown) => Promise<unknown> };
				ANTHROPIC_API_KEY?: string;
				AI_GATEWAY_URL?: string;
		  }
		| undefined;

	if (!env?.QUIZ_SUBMISSIONS) throw error(503, 'Database binding unavailable');
	if (!env.REPORTS_BUCKET) throw error(503, 'Reports bucket binding unavailable');

	const row = await getSubmissionRow(env.QUIZ_SUBMISSIONS, id);
	if (!row) throw error(404, 'Submission not found');

	let markdown = row.stage1_report_markdown;
	if (!markdown) {
		const cached = readPersistedScorerOutput(row);
		if (cached?.stage1_report_markdown) {
			markdown = cached.stage1_report_markdown;
		} else {
			const s = rowToQuizStatic(row);
			const screen = screenRegulatedData({
				industry: s.industry,
				sensitive_data_flag: s.regulatedData,
				governance_rules: s.governanceRules,
				governance_review: s.governanceReview,
				governance_comfort: s.governanceComfort
			});
			const out = await runScorer({
				submissionId: row.id,
				clientEmail: row.email,
				submissionDate: row.created_at.slice(0, 10),
				s,
				screen,
				llm: env.ANTHROPIC_API_KEY
					? { apiKey: env.ANTHROPIC_API_KEY, gatewayUrl: env.AI_GATEWAY_URL }
					: undefined
			});
			markdown = out.stage1_report_markdown;
			await persistScorerOutput(env.QUIZ_SUBMISSIONS, row.id, out);
		}
	}

	const key = bucketKey(id);
	await env.REPORTS_BUCKET.put(key, markdown, {
		httpMetadata: { contentType: 'text/markdown; charset=utf-8' }
	});

	return json({
		url: `${url.origin}/api/reports/${id}.md`,
		bucket_path: key,
		markdown
	});
};
