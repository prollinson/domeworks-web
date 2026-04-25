/**
 * Three-pass opportunity selection per design doc §9.2 + Week 2 prompt:
 *
 *   Pass 1: filter by industry-fit + pain-area intersection.
 *   Pass 2: filter through regulated-data-screen guardrail.
 *           - tier 'strict' + tool governance_risk 'standard' => moves to 'foundational' with a mitigation note.
 *           - 'cleared-with-baa' and 'on-device' tools always pass.
 *   Pass 2.5 (Week 6): apply Stage 2 prioritizer tier overrides. Each override
 *           maps a PainArea slug to the prioritizer's chosen Tier; tools
 *           whose pain-area set hits an override take that tier verbatim.
 *           Tools whose override is anything other than 'quick-win' are
 *           blocked from the Quick Wins selection regardless of hours-saved
 *           rank. Stage 2 evidence wins ties against Stage 1 defaults.
 *   Pass 3: rank remaining non-blocked tools by hours_saved_per_week descending,
 *           take top 3 to 5 as Quick Wins.
 *
 * Tools that fail Pass 2 land in the foundational quadrant. The remaining filtered tools
 * after the top-N are tagged 'foundational' or 'strategic' depending on complexity:
 *   - complexity 'plug-and-play' or 'some-setup' => foundational
 *   - complexity 'project'                       => strategic
 */
import type { PainArea, ToolEntry } from '$lib/data/tool-library';
import {
	TOOL_LIBRARY,
	industrySlug,
	toolFitsIndustry,
	toolFitsPainAreas
} from '$lib/data/tool-library';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type { Tier } from '$lib/types/prioritizer';
import type { OpportunityCard, Quadrant } from './types';

const QUICK_WIN_COUNT_MAX = 5;

interface RankedTool {
	tool: ToolEntry;
	hours: number;
	flaggedFromQuickWin: boolean;
	overrideTier: Quadrant | null;
}

function midpointHours(t: ToolEntry): number {
	const [lo, hi] = t.hours_saved_per_week_range;
	return Math.round(((lo + hi) / 2) * 10) / 10;
}

function classifyQuadrant(t: ToolEntry, isQuickWin: boolean): Quadrant {
	if (isQuickWin) return 'quick-win';
	if (t.complexity === 'project') return 'strategic';
	return 'foundational';
}

function defaultWhyThisFits(t: ToolEntry, painAreas: PainArea[]): string {
	const intersect = t.fits_pain_areas.filter((p) => painAreas.includes(p));
	const painLabel = intersect[0] ?? t.fits_pain_areas[0];
	return `${t.name} targets the ${painLabel.replaceAll('-', ' ')} pain in this firm and has a ${t.complexity} setup, which keeps the rollout to one decision rather than a project.`;
}

export type SynthesizedTierOverrides = Map<PainArea, Tier>;

export interface OpportunitySelection {
	cards: OpportunityCard[];
	quickWinIds: Set<string>;
	totalCandidatesConsidered: number;
}

function findOverride(
	tool: ToolEntry,
	overrides: SynthesizedTierOverrides | undefined
): Quadrant | null {
	if (!overrides || overrides.size === 0) return null;
	for (const pa of tool.fits_pain_areas) {
		const tier = overrides.get(pa);
		if (tier) return tier as Quadrant;
	}
	return null;
}

export function selectOpportunities(
	s: { industry: string },
	painAreas: PainArea[],
	screen: ScreenOutput,
	synthesizedTierOverrides?: SynthesizedTierOverrides
): OpportunitySelection {
	const slug = industrySlug(s.industry);

	// Pass 1: industry + pain-area filter.
	const pass1 = TOOL_LIBRARY.filter(
		(t) => toolFitsIndustry(t, slug) && toolFitsPainAreas(t, painAreas)
	);

	// Pass 2 + 2.5: guardrail filter + synthesized tier overrides.
	const ranked: RankedTool[] = pass1.map((tool) => {
		const guardrailFlag = screen.guardrail_tier === 'strict' && tool.governance_risk === 'standard';
		const overrideTier = findOverride(tool, synthesizedTierOverrides);
		const overrideBlocksQuickWin = overrideTier !== null && overrideTier !== 'quick-win';
		return {
			tool,
			hours: midpointHours(tool),
			flaggedFromQuickWin: guardrailFlag || overrideBlocksQuickWin,
			overrideTier
		};
	});

	// Sort by hours desc; flagged ones never become Quick Wins but stay in the rank order.
	ranked.sort((a, b) => b.hours - a.hours);

	// Pass 3: take top Quick Wins from non-flagged candidates.
	const quickWins: RankedTool[] = [];
	const others: RankedTool[] = [];
	for (const r of ranked) {
		if (!r.flaggedFromQuickWin && quickWins.length < QUICK_WIN_COUNT_MAX) {
			quickWins.push(r);
		} else {
			others.push(r);
		}
	}

	const cards: OpportunityCard[] = [];

	for (const r of quickWins) {
		cards.push({
			title: titleFor(r.tool, painAreas),
			quadrant: 'quick-win',
			tool: r.tool.name,
			why_this_fits: defaultWhyThisFits(r.tool, painAreas),
			complexity: r.tool.complexity,
			monthly_cost: r.tool.monthly_cost,
			setup_time_minutes: r.tool.setup_time_minutes,
			hours_saved_per_week: r.hours
		});
	}

	for (const r of others) {
		const naturalQuadrant: Quadrant = !r.flaggedFromQuickWin
			? classifyQuadrant(r.tool, false)
			: 'foundational';
		// Stage 2 wins ties against the natural assignment when an override is
		// present. Otherwise the natural classification stands.
		const quadrant: Quadrant = r.overrideTier ?? naturalQuadrant;
		const guardrailRouted =
			r.flaggedFromQuickWin &&
			screen.guardrail_tier === 'strict' &&
			r.tool.governance_risk === 'standard';
		const why = guardrailRouted
			? `${defaultWhyThisFits(r.tool, painAreas)} Routed out of Quick Wins because the firm's strict guardrail tier requires governance work (BAA review or written policy) before this tool processes client data.`
			: defaultWhyThisFits(r.tool, painAreas);
		cards.push({
			title: titleFor(r.tool, painAreas),
			quadrant,
			tool: r.tool.name,
			why_this_fits: why,
			complexity: r.tool.complexity,
			monthly_cost: r.tool.monthly_cost,
			setup_time_minutes: r.tool.setup_time_minutes,
			hours_saved_per_week: r.hours
		});
	}

	return {
		cards,
		quickWinIds: new Set(quickWins.map((q) => q.tool.id)),
		totalCandidatesConsidered: pass1.length
	};
}

function titleFor(t: ToolEntry, painAreas: PainArea[]): string {
	const intersect = t.fits_pain_areas.filter((p) => painAreas.includes(p));
	const lead = intersect[0] ?? t.fits_pain_areas[0];
	const phraseMap: Record<string, string> = {
		admin: 'Admin time eaten by repetitive tasks',
		'marketing-and-lead-response': 'Lead follow-up takes too long',
		'client-delivery': 'Client delivery has too many manual steps',
		'meeting-notes': 'Meeting notes and action items get lost',
		'action-item-capture': 'Action items get lost between meetings',
		'email-overload': 'Email inbox is the work, not just the channel',
		reporting: 'Manual reporting across multiple platforms',
		'document-drafting': 'Document drafting eats hours every week',
		scheduling: 'Scheduling and calendar coordination',
		intake: 'New-client intake is manual end to end',
		correspondence: 'Routine correspondence takes too long',
		'bookkeeping-review': 'Bookkeeping review and reconciliation',
		compliance: 'Compliance documentation lags client work',
		'design-production': 'Design production for marketing assets',
		'customer-support': 'Customer support response time',
		'crm-hygiene': 'CRM data is stale and inconsistent',
		'sales-outreach': 'Sales outreach cadence is unsustainable',
		research: 'Research and prep before client work',
		mixed: 'Multiple time leaks across the workflow'
	};
	return phraseMap[lead] ?? `Time leak addressed by ${t.name}`;
}
