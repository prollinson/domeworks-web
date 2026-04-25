/**
 * 4-Day Quick Wins Plan ordering: lowest setup_time_minutes first so day 1 is an easy win.
 * Tie-break by lowest complexity ('plug-and-play' < 'some-setup' < 'project').
 * Cap at 4 tasks. If fewer than 4 Quick Wins exist, fill what we have and leave the rest empty
 * (Quick Plan template will skip the empty slots; Assessment shape may omit the section entirely).
 */
import type { OpportunityCard, FourDayPlanItem } from './types';

const COMPLEXITY_RANK = { 'plug-and-play': 0, 'some-setup': 1, project: 2 } as const;

export function buildFourDayPlan(opportunities: OpportunityCard[]): FourDayPlanItem[] {
	const quickWins = opportunities
		.filter((o) => o.quadrant === 'quick-win')
		.slice()
		.sort((a, b) => {
			if (a.setup_time_minutes !== b.setup_time_minutes) {
				return a.setup_time_minutes - b.setup_time_minutes;
			}
			return COMPLEXITY_RANK[a.complexity] - COMPLEXITY_RANK[b.complexity];
		})
		.slice(0, 4);

	return quickWins.map((card, idx) => ({
		day: (idx + 1) as 1 | 2 | 3 | 4,
		task: dayTaskFor(card),
		tool: card.tool
	}));
}

function dayTaskFor(card: OpportunityCard): string {
	if (card.complexity === 'plug-and-play') {
		return `Set up ${card.tool} and run it through one real workflow today.`;
	}
	if (card.complexity === 'some-setup') {
		return `Configure ${card.tool} against the firm's primary workflow. Plan around ${card.setup_time_minutes} minutes for the initial setup.`;
	}
	return `Begin the ${card.tool} project: scope the rollout, name the owner, and book the kickoff this week.`;
}
