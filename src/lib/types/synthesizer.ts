/**
 * Types for discovery-call-synthesizer. Input shape mirrors the PipelineInput
 * the voice-agent post-call pipeline assembles and forwards as the Stage 2
 * body on /api/quiz/report. Output matches the SKILL.md §Output section.
 */

export type ExtractionDimension =
	| 'situation'
	| 'problem'
	| 'implication'
	| 'need-payoff'
	| 'governance'
	| 'sensitive-slip'
	| 'off-topic'
	| 'emotional'
	| 'novel';

export interface TurnExtraction {
	dimension: ExtractionDimension;
	pain_signal: string | null;
	frequency_signal: string | null;
	system_mention: string | null;
	sensitive_data_flag: boolean;
	workaround_mention: string | null;
	out_of_scope: boolean;
	emotional_friction: boolean;
	novel_workflow: boolean;
}

export interface BailCounters {
	sensitiveSlips: number;
	offTopicAttempts: number;
	emotionalFlag: boolean;
	novelWorkflowFlag: boolean;
}

export interface TranscriptTurn {
	role: 'user' | 'assistant';
	content: string;
	ts?: number;
}

export interface SynthesizerStage1Context {
	industry: string;
	timeLeak: string;
	dreadedTask: string;
	processHealth: 'Healthy' | 'Broken' | 'Unsure';
	currentAiUse: string | null;
	regulatedDataFlag: 'yes' | 'sometimes' | 'no';
	guardrailTier: 'none' | 'standard' | 'strict' | 'unknown';
}

export interface SynthesizerInput {
	sessionId: string;
	channel: 'voice' | 'chat';
	industry: string;
	callerEmail: string | null;
	startedAt: string;
	endedAt: string;
	turnCount: number;
	transcript: TranscriptTurn[];
	structuredState: {
		counters: BailCounters;
		extractions: TurnExtraction[];
	};
	stage1?: SynthesizerStage1Context;
}

export interface SipocSummary {
	suppliers: string[];
	inputs: string[];
	process: string;
	outputs: string[];
	customers: string[];
}

export interface PainAreaRanked {
	theme: string;
	severity: 'High' | 'Medium' | 'Low';
	frequency: string;
	evidence_turns: number[];
}

export interface WorkaroundEntry {
	description: string;
	evidence_turn: number;
}

export interface ExceptionPattern {
	pattern: string;
	evidence_turns: number[];
}

export interface CandidateOpportunity {
	title: string;
	rationale: string;
	suggested_quadrant: 'quick-win' | 'foundational' | 'strategic' | 'research';
	evidence_turns: number[];
	governance_risk_note: string | null;
}

export interface SynthesizerOutput {
	sipoc_summary: SipocSummary;
	pain_areas_ranked: PainAreaRanked[];
	workaround_list: WorkaroundEntry[];
	exception_patterns: ExceptionPattern[];
	candidate_opportunities: CandidateOpportunity[];
	handoff_brief: string;
	needs_human_review: boolean;
	llm_status: 'ok' | 'partial' | 'unavailable';
}
