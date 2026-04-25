/**
 * POST /api/quiz/report
 *
 * Two request shapes (mutually exclusive):
 *
 *   1. Stage 1 cache-or-score:
 *      { submission_id: string }
 *      Reads the D1 row, runs the scorer (or returns the cached result if already scored),
 *      persists the scorer output back to D1, returns the scorer output as JSON.
 *      Idempotent: a second call for the same submission_id returns the cached output without
 *      re-running the LLM. The result view fires this once after submission and treats the
 *      10-second client-side timeout as a fallback to "the report is on its way to your inbox".
 *
 *   2. Stage 2 augmentation (from the voice-agent post-call pipeline):
 *      {
 *        stage2: {
 *          email: string | null,
 *          channel: "voice" | "chat",
 *          session_id: string,
 *          industry: string,
 *          transcript_url: string,
 *          structured_state: { counters, extractions },
 *          turn_count: number,
 *          started_at: string,
 *          ended_at: string
 *        }
 *      }
 *      Looks up the Stage 1 submission by email, persists Stage 2 fields onto the row,
 *      re-runs the scorer (Week 4: the scorer does not yet read Stage 2 fields; Week 5 will),
 *      returns { scored, submission_id, report_shape, stage1_report_markdown, ... }.
 *      If no Stage 1 row exists, returns 200 { scored: false, reason: "no-stage1" } so the
 *      pipeline can still log the transcript and fire the email summary.
 */
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getSubmissionRow,
	findLatestSubmissionByEmail,
	persistScorerOutput,
	persistStage2Fields,
	readPersistedScorerOutput,
	rowToQuizStatic,
	type D1Like,
	type Stage2Payload
} from '$lib/server/quiz-storage';
import { runScorer, type ScorerOutput } from '$lib/server/scorer';
import { screenRegulatedData, type ScreenOutput } from '$lib/regulated-data-screen';
import { runSynthesizer } from '$lib/server/synthesizer';
import { renderStage3Markdown } from '$lib/server/stage3-writer';
import { summarizePrioritizerTiers, updateStage2Record } from '$lib/server/attio';
import type {
	SynthesizerInput,
	SynthesizerOutput,
	TurnExtraction,
	BailCounters
} from '$lib/types/synthesizer';
import type { QuizStatic } from '$lib/types/quiz';

export const prerender = false;

interface Stage1Body {
	submission_id: string;
}

interface Stage2Body {
	stage2: {
		email: string | null;
		channel: 'voice' | 'chat';
		session_id: string;
		industry: string;
		transcript_url: string;
		structured_state: unknown;
		turn_count: number;
		started_at: string;
		ended_at: string;
	};
}

function isStage1Body(v: unknown): v is Stage1Body {
	if (!v || typeof v !== 'object') return false;
	const r = v as Record<string, unknown>;
	return typeof r.submission_id === 'string' && r.submission_id.length > 0;
}

function isStage2Body(v: unknown): v is Stage2Body {
	if (!v || typeof v !== 'object') return false;
	const r = v as Record<string, unknown>;
	const s2 = r.stage2;
	if (!s2 || typeof s2 !== 'object') return false;
	const r2 = s2 as Record<string, unknown>;
	return (
		(r2.channel === 'voice' || r2.channel === 'chat') &&
		typeof r2.session_id === 'string' &&
		typeof r2.industry === 'string' &&
		typeof r2.transcript_url === 'string' &&
		typeof r2.turn_count === 'number' &&
		typeof r2.started_at === 'string' &&
		typeof r2.ended_at === 'string'
	);
}

interface PlatformEnv {
	QUIZ_SUBMISSIONS?: D1Like;
	ANTHROPIC_API_KEY?: string;
	AI_GATEWAY_URL?: string;
	ATTIO_API_KEY?: string;
}

/**
 * Shape the Stage 2 structured_state blob the voice-agent sends into the
 * SynthesizerInput typed form. Loose JSON on the wire, typed JSON inside.
 */
function buildSynthesizerInput(
	s2: Stage2Body['stage2'],
	dreadedTask: string | null
): SynthesizerInput {
	const state = (s2.structured_state ?? {}) as {
		counters?: Partial<BailCounters>;
		extractions?: unknown;
	};
	const counters: BailCounters = {
		sensitiveSlips: Number(state.counters?.sensitiveSlips ?? 0),
		offTopicAttempts: Number(state.counters?.offTopicAttempts ?? 0),
		emotionalFlag: Boolean(state.counters?.emotionalFlag ?? false),
		novelWorkflowFlag: Boolean(state.counters?.novelWorkflowFlag ?? false)
	};
	const extractions: TurnExtraction[] = Array.isArray(state.extractions)
		? (state.extractions as TurnExtraction[])
		: [];
	return {
		sessionId: s2.session_id,
		channel: s2.channel,
		industry: s2.industry,
		callerEmail: s2.email,
		startedAt: s2.started_at,
		endedAt: s2.ended_at,
		turnCount: s2.turn_count,
		transcript: [],
		structuredState: { counters, extractions },
		stage1: dreadedTask
			? {
					industry: s2.industry,
					timeLeak: '',
					dreadedTask,
					processHealth: 'Unsure',
					currentAiUse: null,
					regulatedDataFlag: 'no',
					guardrailTier: 'unknown'
				}
			: undefined
	};
}

interface ScoredForRow {
	output: ScorerOutput;
	s: QuizStatic;
	screen: ScreenOutput;
}

async function scoreForRow(
	env: PlatformEnv,
	row: Awaited<ReturnType<typeof getSubmissionRow>>,
	synthesized?: SynthesizerOutput
): Promise<ScoredForRow> {
	if (!row) throw error(404, 'Submission not found');
	const s = rowToQuizStatic(row);
	const screen: ScreenOutput =
		row.guardrail_tier && row.required_mitigations && row.sector_citations
			? {
					guardrail_tier: row.guardrail_tier as 'none' | 'standard' | 'strict' | 'unknown',
					required_mitigations: JSON.parse(row.required_mitigations),
					sector_citations: JSON.parse(row.sector_citations),
					human_review_policy: (row.human_review_policy ?? 'recommended') as
						| 'mandatory'
						| 'recommended'
						| 'optional'
				}
			: screenRegulatedData({
					industry: s.industry,
					sensitive_data_flag: s.regulatedData,
					governance_rules: s.governanceRules,
					governance_review: s.governanceReview,
					governance_comfort: s.governanceComfort
				});

	try {
		const output = await runScorer({
			submissionId: row.id,
			clientEmail: row.email,
			submissionDate: row.created_at.slice(0, 10),
			s,
			screen,
			llm: env.ANTHROPIC_API_KEY
				? { apiKey: env.ANTHROPIC_API_KEY, gatewayUrl: env.AI_GATEWAY_URL }
				: undefined,
			synthesized
		});
		return { output, s, screen };
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'scorer failed';
		throw error(502, `Scorer failed: ${msg}`);
	}
}

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const env = platform?.env as PlatformEnv | undefined;
	if (!env?.QUIZ_SUBMISSIONS) throw error(503, 'Database binding unavailable');

	// Stage 2 augmentation path (voice/chat post-call pipeline).
	if (isStage2Body(payload)) {
		const s2 = payload.stage2;
		const email = s2.email;
		if (!email) {
			return json({
				scored: false,
				reason: 'no-email-captured',
				session_id: s2.session_id
			});
		}
		const existing = await findLatestSubmissionByEmail(env.QUIZ_SUBMISSIONS, email);
		if (!existing) {
			return json({
				scored: false,
				reason: 'no-stage1',
				session_id: s2.session_id,
				email
			});
		}

		const stage2: Stage2Payload = {
			channel: s2.channel,
			sessionId: s2.session_id,
			transcriptUrl: s2.transcript_url,
			structuredState: s2.structured_state,
			counters:
				s2.structured_state &&
				typeof s2.structured_state === 'object' &&
				'counters' in (s2.structured_state as Record<string, unknown>)
					? (s2.structured_state as Record<string, unknown>).counters
					: null,
			turnCount: s2.turn_count,
			startedAt: s2.started_at,
			endedAt: s2.ended_at
		};

		try {
			await persistStage2Fields(env.QUIZ_SUBMISSIONS, existing.id, stage2);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'stage2 persist failed';
			throw error(502, `Stage 2 D1 write failed: ${msg}`);
		}

		// Run the discovery-call-synthesizer on the incoming Stage 2 payload.
		// When ANTHROPIC_API_KEY is present, the synthesizer's handoff brief is
		// generated by Sonnet (Week 6); the deterministic renderer is the
		// failure-fallback. Failures here are non-blocking: the scorer can
		// still produce a Stage 1-only report.
		let synthesized: SynthesizerOutput | undefined;
		try {
			synthesized = await runSynthesizer(
				buildSynthesizerInput(s2, existing.dreaded_task ?? null),
				env.ANTHROPIC_API_KEY
					? {
							llm: {
								apiKey: env.ANTHROPIC_API_KEY,
								gatewayUrl: env.AI_GATEWAY_URL
							}
						}
					: {}
			);
		} catch (e) {
			console.warn('[quiz/report] synthesizer failed:', e);
		}

		// Re-run the scorer with the freshest row (includes Stage 2 columns)
		// plus the synthesized findings so the Assessment markdown carries
		// current-state findings, workarounds, exception patterns, SIPOC scope.
		const refreshed = await getSubmissionRow(env.QUIZ_SUBMISSIONS, existing.id);
		const scored = await scoreForRow(env, refreshed, synthesized);
		try {
			await persistScorerOutput(env.QUIZ_SUBMISSIONS, existing.id, scored.output);
		} catch (e) {
			console.warn('[quiz/report] stage2 persistScorerOutput failed:', e);
		}

		// Stage 3 writer: enrich the Assessment markdown with prioritizer LLM
		// rationale prose (Foundational task register + Strategic narrative)
		// and run the §7.5 pre-send validation pass. Failures here are
		// non-blocking; the scorer's stage1_report_markdown is the floor.
		let stage3Markdown = scored.output.stage1_report_markdown;
		let stage3Warnings: string[] = [];
		try {
			const stage3 = await renderStage3Markdown({
				scorerOutput: scored.output,
				s: scored.s,
				screen: scored.screen,
				synthesized,
				llm: env.ANTHROPIC_API_KEY
					? { apiKey: env.ANTHROPIC_API_KEY, gatewayUrl: env.AI_GATEWAY_URL }
					: undefined
			});
			stage3Markdown = stage3.markdown;
			stage3Warnings = stage3.warnings;
		} catch (e) {
			console.warn('[quiz/report] renderStage3Markdown failed, falling back to scorer markdown:', e);
		}

		// Attio Stage 2 fan-out. Best-effort; D1 + the response carry the canonical state.
		if (env.ATTIO_API_KEY && synthesized) {
			const prioritizerSummary = scored.output.prioritizer
				? summarizePrioritizerTiers(scored.output.prioritizer)
				: 'no tiered candidates';
			const painThemes = synthesized.pain_areas_ranked.slice(0, 3).map((p) => p.theme);
			const attio = await updateStage2Record(
				{ apiKey: env.ATTIO_API_KEY },
				{
					email,
					handoffBrief: synthesized.handoff_brief,
					painThemes,
					prioritizerSummary,
					completedAtIso: s2.ended_at
				}
			);
			if (!attio.ok) {
				console.warn(
					`[quiz/report] Attio Stage 2 update failed (${attio.errorClass}): ${attio.message}. D1 + response still carry the canonical state.`
				);
			}
		} else if (!env.ATTIO_API_KEY) {
			console.warn('[quiz/report] ATTIO_API_KEY not set, skipping Stage 2 Attio sync.');
		}

		return json({
			scored: true,
			submission_id: existing.id,
			report_shape: scored.output.report_shape,
			stage1_report_markdown: scored.output.stage1_report_markdown,
			stage3_markdown: stage3Markdown,
			stage3_warnings: stage3Warnings,
			readiness_scorecard: scored.output.readiness_scorecard,
			recommended_next_step: scored.output.recommended_next_step,
			llm_status: scored.output.llm_status,
			synthesizer_status: synthesized?.llm_status ?? 'unavailable',
			needs_human_review: synthesized?.needs_human_review ?? false
		});
	}

	// Stage 1 cache-or-score path (existing behavior).
	if (!isStage1Body(payload)) throw error(400, 'submission_id required');

	const row = await getSubmissionRow(env.QUIZ_SUBMISSIONS, payload.submission_id);
	if (!row) throw error(404, 'Submission not found');

	const cached = readPersistedScorerOutput(row);
	if (cached) return json(cached);

	const scored = await scoreForRow(env, row);

	try {
		await persistScorerOutput(env.QUIZ_SUBMISSIONS, row.id, scored.output);
	} catch (e) {
		console.warn('[quiz/report] persistScorerOutput failed:', e);
	}

	return json(scored.output);
};
