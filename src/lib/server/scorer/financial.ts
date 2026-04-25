/**
 * Financial Impact math from design doc §7.4. Pure function of Quick Wins.
 *
 *   weekly_hours_returned   = sum(hours_saved_per_week for opportunity in quick_wins)
 *   total_monthly_tool_cost = sum(monthly_cost for opportunity in quick_wins)
 *   monthly_net_roi         = (weekly_hours_returned * hourly_rate * 4.33) - total_monthly_tool_cost
 *   hourly_rate             = 100 default; overridable via Attio hourly_rate_override field.
 */
import type { OpportunityCard, FinancialImpact } from './types';

const WEEKS_PER_MONTH = 4.33;
const DEFAULT_HOURLY_RATE = 100;

export function computeFinancialImpact(
	opportunities: OpportunityCard[],
	hourlyRate: number = DEFAULT_HOURLY_RATE
): FinancialImpact {
	const quickWins = opportunities.filter((o) => o.quadrant === 'quick-win');
	const weekly_hours_returned = round1(quickWins.reduce((s, o) => s + o.hours_saved_per_week, 0));
	const total_monthly_tool_cost = quickWins.reduce((s, o) => s + o.monthly_cost, 0);
	const monthly_net_roi = Math.round(
		weekly_hours_returned * hourlyRate * WEEKS_PER_MONTH - total_monthly_tool_cost
	);
	return {
		weekly_hours_returned,
		monthly_net_roi,
		total_monthly_tool_cost,
		hourly_rate_used: hourlyRate
	};
}

function round1(n: number): number {
	return Math.round(n * 10) / 10;
}
