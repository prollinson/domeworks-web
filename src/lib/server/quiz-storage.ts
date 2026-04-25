import type { QuizSubmission } from '$lib/types/quiz';

export interface D1Like {
	prepare(query: string): {
		bind(...values: unknown[]): {
			run(): Promise<unknown>;
		};
	};
}

export interface StoredSubmission {
	id: string;
	createdAt: string;
}

/**
 * Insert one quiz submission row into the QUIZ_SUBMISSIONS D1 table.
 * Scorecard and recommended_next_step are left null, Week 2 scoring will fill them.
 */
export async function insertQuizSubmission(
	db: D1Like,
	submission: QuizSubmission
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
				adaptive_answers, email, scorecard, recommended_next_step
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)`
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
			submission.email
		)
		.run();

	return { id, createdAt };
}
