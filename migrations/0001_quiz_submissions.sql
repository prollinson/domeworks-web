-- Migration 0001: quiz_submissions
--
-- Source of truth for Stage 1 quiz responses. Scorecard + recommended_next_step
-- are nullable placeholders that Week 2 scoring logic will populate.
--
-- Apply locally:   pnpm wrangler d1 execute QUIZ_SUBMISSIONS --local  --file=migrations/0001_quiz_submissions.sql
-- Apply remote:    pnpm wrangler d1 execute QUIZ_SUBMISSIONS --remote --file=migrations/0001_quiz_submissions.sql

CREATE TABLE IF NOT EXISTS quiz_submissions (
    id                      TEXT PRIMARY KEY,
    created_at              TEXT NOT NULL,

    industry                TEXT NOT NULL,
    team_size               TEXT NOT NULL,
    regulated_data          TEXT NOT NULL,
    business_goal           TEXT NOT NULL,
    business_goal_other     TEXT,
    time_leak               TEXT NOT NULL,
    dreaded_task            TEXT NOT NULL,
    digitization_probe      TEXT,
    process_health          TEXT NOT NULL,
    current_ai_use          TEXT,
    governance_rules        TEXT,
    governance_review       TEXT,
    governance_comfort      TEXT,

    adaptive_answers        TEXT NOT NULL,  -- JSON array of AdaptiveAnswer

    email                   TEXT NOT NULL,

    scorecard               TEXT,           -- JSON, nullable, filled by Week 2 scorer
    recommended_next_step   TEXT            -- nullable, filled by Week 2 scorer
);

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email        ON quiz_submissions(email);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at   ON quiz_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_industry     ON quiz_submissions(industry);
