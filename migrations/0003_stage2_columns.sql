-- Stage 2 augmentation columns on quiz_submissions.
-- Populated by the post-call pipeline in domeworks-voice-agent via
-- POST /api/quiz/report { stage2: { ... } }. Week 4 establishes the seam;
-- Week 5+ lets the scorer read these fields to produce a Stage 1+2 report.

ALTER TABLE quiz_submissions ADD COLUMN stage2_channel TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_session_id TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_transcript_url TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_structured_state TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_counters TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_turn_count INTEGER;
ALTER TABLE quiz_submissions ADD COLUMN stage2_started_at TEXT;
ALTER TABLE quiz_submissions ADD COLUMN stage2_completed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email ON quiz_submissions (email);
