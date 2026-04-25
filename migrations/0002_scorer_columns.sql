-- Migration 0002: scorer + guardrail output columns
--
-- Week 2 deliverable. Extends quiz_submissions with:
--   - regulated-data-screen output (guardrail_tier, required_mitigations, sector_citations, human_review_policy)
--   - smb-audit-intake-scorer output (opportunities, financial_impact, four_day_plan, what_comes_after,
--     report_shape, stage1_report_markdown)
--
-- Existing scorecard and recommended_next_step columns from 0001 are reused by the scorer.
--
-- Apply locally:   pnpm wrangler d1 execute QUIZ_SUBMISSIONS --local  --file=migrations/0002_scorer_columns.sql
-- Apply remote:    pnpm wrangler d1 execute QUIZ_SUBMISSIONS --remote --file=migrations/0002_scorer_columns.sql

ALTER TABLE quiz_submissions ADD COLUMN guardrail_tier        TEXT;
ALTER TABLE quiz_submissions ADD COLUMN required_mitigations  TEXT;  -- JSON array of strings
ALTER TABLE quiz_submissions ADD COLUMN sector_citations      TEXT;  -- JSON array of {source, text, url}
ALTER TABLE quiz_submissions ADD COLUMN human_review_policy   TEXT;

ALTER TABLE quiz_submissions ADD COLUMN opportunities         TEXT;  -- JSON array of OpportunityCard
ALTER TABLE quiz_submissions ADD COLUMN financial_impact      TEXT;  -- JSON object
ALTER TABLE quiz_submissions ADD COLUMN four_day_plan         TEXT;  -- JSON array of {day, task, tool}
ALTER TABLE quiz_submissions ADD COLUMN what_comes_after      TEXT;  -- JSON array of strings
ALTER TABLE quiz_submissions ADD COLUMN report_shape          TEXT;  -- 'quick-plan' | 'assessment-plus-guardrails'
ALTER TABLE quiz_submissions ADD COLUMN stage1_report_markdown TEXT;

ALTER TABLE quiz_submissions ADD COLUMN scored_at             TEXT;  -- ISO timestamp set when scorer runs
