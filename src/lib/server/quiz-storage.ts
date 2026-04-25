import type { QuizStatic, QuizSubmission, AdaptiveAnswer } from '$lib/types/quiz';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type { ScorerOutput } from './scorer';

export interface D1Like {
	prepare(query: string): {
		bind(...values: unknown[]): {
			run(): Promise<unknown>;
			first<T = unknown>(): Promise<T | null>;
			all<T = unknown>(): Promise<{ results: T[] }>;
		};
	};
}

export interface StoredSubmission {
	id: string;
	createdAt: string;
}

/**
 * Insert one quiz submission row into the QUIZ_SUBMISSIONS D1 table.
 * Persists the regulated-data-screen output on the same row so downstream calls
 * (the scorer, the result view, the Stage 3 report) read a single source of truth.
 * Scorecard, opportunities, and report markdown are left null; the scorer fills them.
 */
export async function insertQuizSubmission(
	db: D1Like,
	submission: QuizSubmission,
	screen: ScreenOutput
): Promise<StoredSubmission> {
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();
	const s = submission.static;

	await db
		.prepare(
			`INSERT INTO quiz_submissions (
				id, created_at, industry, team_size, regulated_data,
				business_goal, business_goal_other, time_leak, dreaded_task, digitization_probe,
				process_health, current_ai_use, governance_rules, governance_review, governance_comfort,
				adaptive_answers, email,
				guardrail_tier, required_mitigations, sector_citations, human_review_policy
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			id,
			createdAt,
			s.industry,
			s.size,
			s.regulatedData,
			s.businessGoal,
			s.businessGoal === 'Other' ? s.businessGoalOther : null,
			s.timeLeak,
			s.dreadedTask,
			s.digitizationProbe || null,
			s.processHealth,
			s.currentAiUse || null,
			s.governanceRules || null,
			s.governanceReview || null,
			s.governanceComfort || null,
			JSON.stringify(submission.adaptive),
			submission.email,
			screen.guardrail_tier,
			JSON.stringify(screen.required_mitigations),
			JSON.stringify(screen.sector_citations),
			screen.human_review_policy
		)
		.run();

	return { id, createdAt };
}

export interface StoredSubmissionRow {
	id: string;
	created_at: string;
	industry: string;
	team_size: string;
	regulated_data: string;
	business_goal: string;
	business_goal_other: string | null;
	time_leak: string;
	dreaded_task: string;
	digitization_probe: string | null;
	process_health: string;
	current_ai_use: string | null;
	governance_rules: string | null;
	governance_review: string | null;
	governance_comfort: string | null;
	adaptive_answers: string;
	email: string;
	guardrail_tier: string | null;
	required_mitigations: string | null;
	sector_citations: string | null;
	human_review_policy: string | null;
	scorecard: string | null;
	recommended_next_step: string | null;
	opportunities: string | null;
	financial_impact: string | null;
	four_day_plan: string | null;
	what_comes_after: string | null;
	report_shape: string | null;
	stage1_report_markdown: string | null;
	scored_at: string | null;
	stage2_channel: string | null;
	stage2_session_id: string | null;
	stage2_transcript_url: string | null;
	stage2_structured_state: string | null;
	stage2_counters: string | null;
	stage2_turn_count: number | null;
	stage2_started_at: string | null;
	stage2_completed_at: string | null;
}

export async function getSubmissionRow(
	db: D1Like,
	id: string
): Promise<StoredSubmissionRow | null> {
	const row = await db
		.prepare(`SELECT * FROM quiz_submissions WHERE id = ?`)
		.bind(id)
		.first<StoredSubmissionRow>();
	return row ?? null;
}

/**
 * Find the most recent Stage 1 submission for an email. Used by the
 * post-call-pipeline seam: voice + chat know the caller's email but not
 * the submission_id, so we look up the freshest quiz row by email.
 */
export async function findLatestSubmissionByEmail(
	db: D1Like,
	email: string
): Promise<StoredSubmissionRow | null> {
	const row = await db
		.prepare(
			`SELECT * FROM quiz_submissions WHERE lower(email) = lower(?) ORDER BY created_at DESC LIMIT 1`
		)
		.bind(email)
		.first<StoredSubmissionRow>();
	return row ?? null;
}

export interface Stage2Payload {
	channel: 'voice' | 'chat';
	sessionId: string;
	transcriptUrl: string;
	structuredState: unknown;
	counters: unknown;
	turnCount: number;
	startedAt: string;
	endedAt: string;
}

export async function persistStage2Fields(
	db: D1Like,
	id: string,
	stage2: Stage2Payload
): Promise<void> {
	await db
		.prepare(
			`UPDATE quiz_submissions
			 SET stage2_channel = ?,
			     stage2_session_id = ?,
			     stage2_transcript_url = ?,
			     stage2_structured_state = ?,
			     stage2_counters = ?,
			     stage2_turn_count = ?,
			     stage2_started_at = ?,
			     stage2_completed_at = ?
			 WHERE id = ?`
		)
		.bind(
			stage2.channel,
			stage2.sessionId,
			stage2.transcriptUrl,
			JSON.stringify(stage2.structuredState ?? null),
			JSON.stringify(stage2.counters ?? null),
			stage2.turnCount,
			stage2.startedAt,
			stage2.endedAt,
			id
		)
		.run();
}

export function rowToQuizStatic(row: StoredSubmissionRow): QuizStatic {
	return {
		industry: row.industry,
		size: row.team_size,
		regulatedData: row.regulated_data as QuizStatic['regulatedData'],
		businessGoal: row.business_goal,
		businessGoalOther: row.business_goal_other ?? '',
		timeLeak: row.time_leak,
		dreadedTask: row.dreaded_task,
		digitizationProbe: row.digitization_probe ?? '',
		processHealth: row.process_health as QuizStatic['processHealth'],
		currentAiUse: row.current_ai_use ?? '',
		governanceRules: (row.governance_rules ?? '') as QuizStatic['governanceRules'],
		governanceReview: (row.governance_review ?? '') as QuizStatic['governanceReview'],
		governanceComfort: (row.governance_comfort ?? '') as QuizStatic['governanceComfort']
	};
}

export function rowToAdaptive(row: StoredSubmissionRow): AdaptiveAnswer[] {
	try {
		return JSON.parse(row.adaptive_answers) as AdaptiveAnswer[];
	} catch {
		return [];
	}
}

export async function persistScorerOutput(
	db: D1Like,
	id: string,
	out: ScorerOutput
): Promise<void> {
	const scoredAt = new Date().toISOString();
	await db
		.prepare(
			`UPDATE quiz_submissions
			 SET scorecard = ?,
			     recommended_next_step = ?,
			     opportunities = ?,
			     financial_impact = ?,
			     four_day_plan = ?,
			     what_comes_after = ?,
			     report_shape = ?,
			     stage1_report_markdown = ?,
			     scored_at = ?
			 WHERE id = ?`
		)
		.bind(
			JSON.stringify(out.readiness_scorecard),
			out.recommended_next_step,
			JSON.stringify(out.opportunities),
			JSON.stringify(out.financial_impact),
			JSON.stringify(out.four_day_plan),
			JSON.stringify(out.what_comes_after),
			out.report_shape,
			out.stage1_report_markdown,
			scoredAt,
			id
		)
		.run();
}

export function readPersistedScorerOutput(row: StoredSubmissionRow): ScorerOutput | null {
	if (!row.scored_at) return null;
	if (!row.scorecard || !row.opportunities || !row.financial_impact) return null;
	try {
		return {
			readiness_scorecard: JSON.parse(row.scorecard),
			recommended_next_step: (row.recommended_next_step ??
				'pilot') as ScorerOutput['recommended_next_step'],
			recommended_next_step_rationale: '',
			report_shape: (row.report_shape ?? 'quick-plan') as ScorerOutput['report_shape'],
			opportunities: JSON.parse(row.opportunities),
			four_day_plan: JSON.parse(row.four_day_plan ?? '[]'),
			financial_impact: JSON.parse(row.financial_impact),
			what_comes_after: JSON.parse(row.what_comes_after ?? '[]'),
			stage1_report_markdown: row.stage1_report_markdown ?? '',
			guardrail: {
				tier: (row.guardrail_tier ?? 'unknown') as ScorerOutput['guardrail']['tier'],
				human_review_policy: (row.human_review_policy ??
					'recommended') as ScorerOutput['guardrail']['human_review_policy'],
				required_mitigations: row.required_mitigations ? JSON.parse(row.required_mitigations) : [],
				sector_citations: row.sector_citations ? JSON.parse(row.sector_citations) : []
			},
			llm_status: 'ok'
		};
	} catch {
		return null;
	}
}
