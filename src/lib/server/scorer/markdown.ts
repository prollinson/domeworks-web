/**
 * Renders the Stage 1 report markdown in either the Quick Plan (§7.1, 8 sections)
 * or Assessment Plus Guardrails (§7.2, 15 sections) shape from design-intake-process.md.
 *
 * Section headings match the design doc verbatim so the Gamma import groups them as slides.
 */
import type { QuizStatic } from '$lib/types/quiz';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type { SynthesizerOutput } from '$lib/types/synthesizer';
import type {
	FinancialImpact,
	FourDayPlanItem,
	OpportunityCard,
	ReadinessScorecard,
	RecommendedNextStep,
	ReportShape,
	ScorerOutput
} from './types';

interface RenderInput {
	clientEmail: string;
	submissionDate: string;
	s: QuizStatic;
	screen: ScreenOutput;
	scorecard: ReadinessScorecard;
	nextStep: RecommendedNextStep;
	nextStepRationale: string;
	opportunities: OpportunityCard[];
	fourDayPlan: FourDayPlanItem[];
	financial: FinancialImpact;
	whatComesAfter: string[];
	shape: ReportShape;
	synthesized?: SynthesizerOutput;
}

const VERDICT_LABEL: Record<RecommendedNextStep, string> = {
	pilot: 'Ready for pilot',
	cleanup: 'Cleanup first',
	'policy-first': 'Policy first',
	'strategy-first': 'Strategy first'
};

const PRIMARY_FOCUS: Record<string, string> = {
	admin: 'Efficiency (Time Savings)',
	marketing: 'Capacity for Lead Response',
	delivery: 'Capacity for Client Delivery',
	mixed: 'Mixed Efficiency'
};

export function renderReportMarkdown(input: RenderInput): string {
	if (input.shape === 'quick-plan') return renderQuickPlan(input);
	return renderAssessment(input);
}

function header(): string {
	return '';
}

function section(title: string, body: string): string {
	return `\n## ${title}\n\n${body.trim()}\n`;
}

function execSummary(input: RenderInput): string {
	const quickWins = input.opportunities.filter((o) => o.quadrant === 'quick-win');
	const focus = PRIMARY_FOCUS[input.s.timeLeak] ?? 'Efficiency';
	const pain =
		input.s.dreadedTask.length > 160
			? `${input.s.dreadedTask.slice(0, 157)}...`
			: input.s.dreadedTask;
	const outcomeHours =
		input.financial.weekly_hours_returned > 0
			? `**${input.financial.weekly_hours_returned} hours per week** returned across ${quickWins.length} Quick Wins.`
			: 'No Quick Wins surfaced from the quiz answers; the discovery call should map a sharper opportunity set.';
	return `**Pain.** ${pain}\n\n**Outcome.** ${outcomeHours}\n\n**Opportunity at a Glance.** Hours You Can Reclaim Weekly: **${input.financial.weekly_hours_returned}**. Primary Focus: ${focus}.`;
}

function quadrantMatrix(opps: OpportunityCard[]): string {
	const quick = opps.filter((o) => o.quadrant === 'quick-win');
	const found = opps.filter((o) => o.quadrant === 'foundational');
	const strat = opps.filter((o) => o.quadrant === 'strategic');
	const lines = [
		'|  | Low Effort | High Effort |',
		'| --- | --- | --- |',
		`| **High Impact** | **Quick Wins**${list(quick)} | **Major Projects**${list(strat)} |`,
		`| **Low Impact** | **Fill-ins**${list(found)} | **Ignore these** |`
	];
	return lines.join('\n');
}

function list(opps: OpportunityCard[]): string {
	if (opps.length === 0) return '<br /><em>None.</em>';
	return `<br />${opps.map((o) => `- ${o.tool}: ${o.title}`).join('<br />')}`;
}

function toolCards(opps: OpportunityCard[]): string {
	const quickWins = opps.filter((o) => o.quadrant === 'quick-win');
	if (quickWins.length === 0) {
		return '_No Quick Wins available; see Foundational Items below._';
	}
	return quickWins
		.map(
			(o) => `### ${o.title}

**Recommended Tool:** ${o.tool}

**Why This Fits.** ${o.why_this_fits}

| Complexity | Monthly Cost | Setup Time | Time Saved |
| --- | --- | --- | --- |
| ${o.complexity} | $${o.monthly_cost}/mo | ${formatMinutes(o.setup_time_minutes)} | ${o.hours_saved_per_week} hrs/week |
`
		)
		.join('\n');
}

function formatMinutes(m: number): string {
	if (m < 60) return `${m} min`;
	const hours = Math.round((m / 60) * 10) / 10;
	return `${hours} hours`;
}

function fourDayPlanBlock(items: FourDayPlanItem[]): string {
	if (items.length === 0) return '_No Quick Wins to schedule; see the Recommended Next Step._';
	return items.map((p) => `- **Day ${p.day}.** ${p.task}`).join('\n');
}

function whatComesAfterBlock(items: string[], opps: OpportunityCard[]): string {
	if (items.length > 0) return items.map((i) => `- ${i}`).join('\n');
	const queued = opps
		.filter((o) => o.quadrant === 'foundational' || o.quadrant === 'strategic')
		.slice(0, 3);
	if (queued.length === 0) return '_No queued follow-ups._';
	return queued.map((o) => `- ${o.tool}: ${o.title}.`).join('\n');
}

function financialBlock(f: FinancialImpact): string {
	return [
		`- **Weekly Time Returned:** ${f.weekly_hours_returned} hours`,
		`- **Monthly Net ROI:** $${f.monthly_net_roi.toLocaleString()} (assumes $${f.hourly_rate_used}/hour)`,
		`- **Total Monthly Tool Cost:** $${f.total_monthly_tool_cost}`
	].join('\n');
}

function nextStepsBlock(): string {
	return [
		'1. Implement the Quick Wins above. Each one is set up to take a single decision, not a project.',
		'2. Schedule a 30-minute Review Call to walk through what worked and what is next.',
		'',
		'Book the call: https://cal.com/prollinson/ai-audit'
	].join('\n');
}

function readinessHeatMap(scorecard: ReadinessScorecard): string {
	const rows = [
		['Strategic Fit', scorecard.strategic_fit],
		['Workflow Readiness', scorecard.workflow],
		['Data Readiness', scorecard.data],
		['AI Fluency', scorecard.ai_fluency],
		['Governance', scorecard.governance],
		['Change Capacity', scorecard.change_capacity]
	] as const;
	const lines = ['| Dimension | Level | Why |', '| --- | --- | --- |'];
	for (const [label, dim] of rows) {
		lines.push(`| ${label} | **${dim.level}** | ${dim.rationale} |`);
	}
	return lines.join('\n');
}

function guardrailsBlock(screen: ScreenOutput): string {
	const tier = screen.guardrail_tier;
	const policy = screen.human_review_policy;
	const mits = screen.required_mitigations.length
		? screen.required_mitigations.map((m) => `- ${m}`).join('\n')
		: '_No additional mitigations required._';
	const cites = screen.sector_citations.length
		? screen.sector_citations
				.map((c) => `- **${c.source}.** ${c.text} ([source](${c.url}))`)
				.join('\n')
		: '_No sector citations apply._';
	return `**Guardrail tier:** ${tier}. **Human review policy:** ${policy}.\n\n**Required mitigations.**\n${mits}\n\n**Sector citations.**\n${cites}`;
}

function stage2FindingsBlock(synth: SynthesizerOutput): string {
	const out: string[] = [];
	out.push(`**Channel.** Stage 2 ran via ${synth.llm_status === 'ok' ? 'the post-call synthesizer' : 'raw transcript (synthesis unavailable)'}.`);
	if (synth.pain_areas_ranked.length > 0) {
		out.push('');
		out.push('**Pain areas ranked.**');
		for (const p of synth.pain_areas_ranked.slice(0, 5)) {
			out.push(`- **${p.theme}** (${p.severity}, ${p.frequency}): ${p.evidence_turns.length} evidence turn${p.evidence_turns.length === 1 ? '' : 's'}`);
		}
	}
	if (synth.workaround_list.length > 0) {
		out.push('');
		out.push('**Workarounds already in flight.**');
		for (const w of synth.workaround_list.slice(0, 6)) {
			out.push(`- ${w.description}`);
		}
	}
	if (synth.exception_patterns.length > 0) {
		out.push('');
		out.push('**Exception patterns.**');
		for (const ex of synth.exception_patterns.slice(0, 4)) {
			out.push(`- ${ex.pattern}`);
		}
	}
	if (synth.needs_human_review) {
		out.push('');
		out.push('**Human review flagged.** Counters tripped or workflow is novel; I will walk the transcript before sending this report.');
	}
	out.push('');
	out.push('**Handoff brief.**');
	out.push(synth.handoff_brief);
	return out.join('\n');
}

function sipocBlock(synth: SynthesizerOutput): string {
	const s = synth.sipoc_summary;
	const bullet = (label: string, values: string[]): string =>
		`- **${label}:** ${values.join(', ')}`;
	return [
		bullet('Suppliers', s.suppliers),
		bullet('Inputs', s.inputs),
		bullet('Outputs', s.outputs),
		bullet('Customers', s.customers),
		'',
		`**Process.** ${s.process}`
	].join('\n');
}

function currentStateBlock(s: QuizStatic): string {
	const goal =
		s.businessGoal === 'Other' && s.businessGoalOther
			? `Other: ${s.businessGoalOther}`
			: s.businessGoal;
	const lines = [
		`**Industry.** ${s.industry}.`,
		`**Team size.** ${s.size}.`,
		`**Top business goal.** ${goal}.`,
		`**Time leak.** ${s.timeLeak}.`,
		`**Dreaded task.** ${s.dreadedTask}`,
		`**Process health.** ${s.processHealth}.`
	];
	if (s.digitizationProbe) lines.push(`**Where the work starts and ends.** ${s.digitizationProbe}`);
	if (s.currentAiUse) lines.push(`**Current AI use.** ${s.currentAiUse}`);
	if (s.governanceRules)
		lines.push(
			`**Governance posture.** Rules: ${s.governanceRules}; review: ${s.governanceReview}; comfort: ${s.governanceComfort}.`
		);
	return lines.join('\n\n');
}

function metricsAndGatesBlock(opps: OpportunityCard[]): string {
	const quickWins = opps.filter((o) => o.quadrant === 'quick-win');
	if (quickWins.length === 0)
		return '_No Quick Wins to gate. Set decision gates after the discovery call._';
	return quickWins
		.map(
			(o) =>
				`- **${o.tool}.** Watch hours-per-week recovered against the ${o.hours_saved_per_week} hrs/week target. Expand if hit, hold if half, stop and replace if zero after 30 days.`
		)
		.join('\n');
}

function foundationalAndStrategic(opps: OpportunityCard[]): string {
	const found = opps.filter((o) => o.quadrant === 'foundational');
	const strat = opps.filter((o) => o.quadrant === 'strategic');
	const lines: string[] = [];
	lines.push('### Foundational Items');
	if (found.length === 0) {
		lines.push('_None queued._');
	} else {
		lines.push('| Task | Tool | Owner | Dependency | Success Metric | Target Date |');
		lines.push('| --- | --- | --- | --- | --- | --- |');
		for (const o of found) {
			lines.push(
				`| ${o.title} | ${o.tool} | TBD | None | Reach ${o.hours_saved_per_week} hrs/week recovered | TBD |`
			);
		}
	}
	lines.push('');
	lines.push('### Strategic Items');
	if (strat.length === 0) {
		lines.push('_None queued._');
	} else {
		for (const o of strat) {
			lines.push(`**${o.tool}.** ${o.why_this_fits}`);
			lines.push('');
		}
	}
	return lines.join('\n');
}

function appendix(input: RenderInput): string {
	return `**Submission email.** ${input.clientEmail}\n\n**Submission date.** ${input.submissionDate}\n\n**Scoring method.** Deterministic, derived from the eight static and two adaptive answers in the quiz. LLM (Claude Sonnet 4.6) was used only for the why-this-fits paragraphs, the recommended-next-step rationale, and the what-comes-after phrasing.\n\n**Tool inventory.** Drawn from /Users/piers/piers-os/resources/domeworks/smb-audit/tool-library.yaml.\n\n**Assumptions.** Hourly rate ${input.financial.hourly_rate_used} dollars. 4.33 weeks per month.`;
}

function renderQuickPlan(input: RenderInput): string {
	const out: string[] = [];
	out.push(`# AI Tools Assessment\n\n${input.clientEmail} · ${input.submissionDate}\n`);
	out.push(section('Executive Summary', execSummary(input)));
	out.push(section('Impact / Effort Matrix', quadrantMatrix(input.opportunities)));
	out.push(section('Recommended Solutions', toolCards(input.opportunities)));
	out.push(section('Your 4-Day Quick Wins Plan', fourDayPlanBlock(input.fourDayPlan)));
	out.push(
		section(
			'What Comes After Quick Wins',
			whatComesAfterBlock(input.whatComesAfter, input.opportunities)
		)
	);
	out.push(section('Financial Impact', financialBlock(input.financial)));
	out.push(section('Your Next Steps', nextStepsBlock()));
	return header() + out.join('\n');
}

function renderAssessment(input: RenderInput): string {
	const out: string[] = [];
	out.push(`# AI Tools Assessment\n\n${input.clientEmail} · ${input.submissionDate}\n`);
	const verdict = VERDICT_LABEL[input.nextStep];
	out.push(
		section(
			'Executive Summary',
			`${execSummary(input)}\n\n**Readiness Verdict.** ${verdict}.\n\n${input.nextStepRationale}`
		)
	);
	out.push(
		section(
			'Business Context and Scope',
			`Workflow scope is the dreaded task and surrounding intake described in the quiz. Assumptions: hourly rate ${input.financial.hourly_rate_used} dollars, single-owner sponsor unless team size suggests otherwise, no Nevada-specific legal review applied yet.`
		)
	);
	out.push(section('Readiness Heat Map', readinessHeatMap(input.scorecard)));
	out.push(section('Current-State Findings', currentStateBlock(input.s)));
	if (input.synthesized) {
		out.push(section('Stage 2 Findings', stage2FindingsBlock(input.synthesized)));
		out.push(section('SIPOC Scope', sipocBlock(input.synthesized)));
	}
	out.push(section('Impact / Effort Matrix', quadrantMatrix(input.opportunities)));
	out.push(section('Recommended Solutions', toolCards(input.opportunities)));
	out.push(section('Your 4-Day Quick Wins Plan', fourDayPlanBlock(input.fourDayPlan)));
	out.push(
		section('Foundational and Strategic Items', foundationalAndStrategic(input.opportunities))
	);
	out.push(section('Guardrails and Governance', guardrailsBlock(input.screen)));
	out.push(section('Metrics and Decision Gates', metricsAndGatesBlock(input.opportunities)));
	out.push(section('Financial Impact', financialBlock(input.financial)));
	out.push(
		section(
			'What Comes After Quick Wins',
			whatComesAfterBlock(input.whatComesAfter, input.opportunities)
		)
	);
	out.push(section('Your Next Steps', nextStepsBlock()));
	out.push(section('Appendix', appendix(input)));
	return header() + out.join('\n');
}

export function applyEnrichment(
	output: ScorerOutput,
	enrichment: {
		why_this_fits: Map<string, string>;
		recommended_next_step_rationale: string;
		what_comes_after: string[];
	}
): ScorerOutput {
	const enriched: ScorerOutput = {
		...output,
		opportunities: output.opportunities.map((o) => {
			const why = enrichment.why_this_fits.get(o.tool);
			return why ? { ...o, why_this_fits: why } : o;
		}),
		recommended_next_step_rationale:
			enrichment.recommended_next_step_rationale || output.recommended_next_step_rationale,
		what_comes_after:
			enrichment.what_comes_after.length > 0 ? enrichment.what_comes_after : output.what_comes_after
	};
	return enriched;
}
