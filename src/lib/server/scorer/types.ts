/**
 * Output schema for `smb-audit-intake-scorer`. Matches design doc §9.2 verbatim.
 */
import type { Citation } from '$lib/data/regulated-data-citations';
import type { Complexity } from '$lib/data/tool-library';
import type { GuardrailTier, HumanReviewPolicy } from '$lib/regulated-data-screen';
import type { PrioritizerOutput } from '$lib/types/prioritizer';

export type ReadinessLevel = 'Low' | 'Medium' | 'High';

export interface ReadinessDimension {
	level: ReadinessLevel;
	rationale: string;
}

export interface ReadinessScorecard {
	strategic_fit: ReadinessDimension;
	workflow: ReadinessDimension;
	data: ReadinessDimension;
	ai_fluency: ReadinessDimension;
	governance: ReadinessDimension;
	change_capacity: ReadinessDimension;
}

export type RecommendedNextStep = 'pilot' | 'cleanup' | 'policy-first' | 'strategy-first';

export type ReportShape = 'quick-plan' | 'assessment-plus-guardrails';

export type Quadrant = 'quick-win' | 'foundational' | 'strategic' | 'research';

export interface OpportunityCard {
	title: string;
	quadrant: Quadrant;
	tool: string;
	why_this_fits: string;
	complexity: Complexity;
	monthly_cost: number;
	setup_time_minutes: number;
	hours_saved_per_week: number;
}

export interface FourDayPlanItem {
	day: 1 | 2 | 3 | 4;
	task: string;
	tool: string;
}

export interface FinancialImpact {
	weekly_hours_returned: number;
	monthly_net_roi: number;
	total_monthly_tool_cost: number;
	hourly_rate_used: number;
}

export interface ScorerOutput {
	readiness_scorecard: ReadinessScorecard;
	recommended_next_step: RecommendedNextStep;
	recommended_next_step_rationale: string;
	report_shape: ReportShape;
	opportunities: OpportunityCard[];
	four_day_plan: FourDayPlanItem[];
	financial_impact: FinancialImpact;
	what_comes_after: string[];
	stage1_report_markdown: string;
	guardrail: {
		tier: GuardrailTier;
		human_review_policy: HumanReviewPolicy;
		required_mitigations: string[];
		sector_citations: Citation[];
	};
	/**
	 * Stage 2 prioritizer output, present only when synthesized findings were
	 * passed in. Tier decisions feed selectOpportunities via overrides; the
	 * full tiered list is exposed here so downstream consumers (Stage 3
	 * report writer, Attio sync) can read the same source of truth.
	 */
	prioritizer?: PrioritizerOutput;
	llm_status: 'ok' | 'unavailable';
}
