/**
 * Deterministic scoring rules for the six readiness dimensions and the recommended-next-step verdict.
 *
 * Every level + rationale here is a pure function of the quiz answers + regulated-data-screen output.
 * No LLM calls. Rationale strings are templated and voice-gate compliant (no em-dashes).
 */
import type { QuizStatic } from '$lib/types/quiz';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type {
	ReadinessLevel,
	ReadinessScorecard,
	ReadinessDimension,
	RecommendedNextStep,
	ReportShape
} from './types';

const REGULATED_INDUSTRIES = new Set<string>([
	'Accounting or bookkeeping',
	'Legal',
	'Medical or dental',
	'Mortgage broker / lending',
	'Insurance or brokers'
]);

const LARGE_TEAM_SIZES = new Set<string>(['10-25', '26-50', '51-200', '200+']);

// Goal-to-time-leak alignment table. Each leak has a set of high-fit goals.
const STRATEGIC_HIGH_FIT: Record<string, Set<string>> = {
	admin: new Set(['Add capacity without hiring', 'Reduce admin burden', 'Margin or profitability']),
	marketing: new Set([
		'Grow revenue',
		'Faster turnaround',
		'Better client response',
		'Smoother scheduling or intake'
	]),
	delivery: new Set([
		'Add capacity without hiring',
		'Faster turnaround',
		'Improve documentation or compliance',
		'Better client response'
	]),
	mixed: new Set(['Reduce admin burden', 'Margin or profitability'])
};

function strategicFit(s: QuizStatic): ReadinessDimension {
	const highSet = STRATEGIC_HIGH_FIT[s.timeLeak] ?? new Set();
	if (highSet.has(s.businessGoal)) {
		return {
			level: 'High',
			rationale: `The stated goal "${s.businessGoal}" maps directly to the ${s.timeLeak} time leak, so a quick win here moves the needle on what the owner already cares about.`
		};
	}
	if (s.businessGoal === 'Other') {
		return {
			level: 'Medium',
			rationale: `The custom goal needs the discovery call to confirm fit. Mid-tier alignment until we hear "${s.businessGoalOther}" against the actual workflow.`
		};
	}
	if (s.businessGoal && s.timeLeak) {
		return {
			level: 'Medium',
			rationale: `"${s.businessGoal}" is reasonable but does not directly map to the ${s.timeLeak} time leak. Quick wins are still useful, but the strategic case wants tightening on the call.`
		};
	}
	return {
		level: 'Low',
		rationale:
			'Not enough goal-to-leak alignment in the quiz answers. The discovery call should anchor a specific outcome before tool selection.'
	};
}

function workflowReadiness(s: QuizStatic): ReadinessDimension {
	const taskLen = s.dreadedTask.trim().length;
	const hasNumbers = /\d/.test(s.dreadedTask);
	const specific = taskLen >= 50 && hasNumbers;
	const lightlySpecific = taskLen >= 30;

	if (specific && s.processHealth === 'healthy') {
		return {
			level: 'High',
			rationale:
				'The dreaded task is described concretely with frequency or volume, and the surrounding process is reported healthy. Good substrate for a tool-led pilot.'
		};
	}
	if (specific && s.processHealth === 'broken') {
		return {
			level: 'Medium',
			rationale:
				'The task is concrete but the workflow around it is reported broken. Pilot will fail unless the workflow itself gets cleaned up first.'
		};
	}
	if (lightlySpecific && s.processHealth !== 'broken') {
		return {
			level: 'Medium',
			rationale:
				'The task is identified but the description is light on numbers. Useful enough to pilot if the discovery call adds frequency and volume.'
		};
	}
	return {
		level: 'Low',
		rationale:
			'Either the task is described too vaguely or the surrounding process is broken or unclear. Cleanup or discovery should come before tool selection.'
	};
}

function dataReadiness(s: QuizStatic): ReadinessDimension {
	if (!s.digitizationProbe) {
		return {
			level: 'High',
			rationale:
				'The dreaded task does not mention paper, PDFs, phone, or scanned forms, so the data is most likely already in software the firm controls.'
		};
	}
	const probe = s.digitizationProbe.toLowerCase();
	const paperish = /paper|scan|fax|hand[-\s]?written|mail/i.test(probe);
	if (paperish) {
		return {
			level: 'Low',
			rationale:
				'The work currently starts or ends in paper, fax, or mailed forms, which means digitization has to come before any AI tool can act on the data.'
		};
	}
	return {
		level: 'Medium',
		rationale:
			'Some digital touchpoints are described, but the full path is not yet structured. A small connector or template fix may be needed before a tool can run end to end.'
	};
}

function aiFluency(s: QuizStatic): ReadinessDimension {
	const text = s.currentAiUse.toLowerCase();
	if (!text) {
		return {
			level: 'Low',
			rationale:
				'No prior AI use described. Onboarding has to include a short orientation, not just tool setup.'
		};
	}
	const namedTools =
		/(chatgpt|claude|gemini|copilot|fathom|otter|jasper|notion ai|grammarly|midjourney)/i.test(
			s.currentAiUse
		);
	const negativeOutcome = /(stopped|gave up|abandon|sounded generic|hallucinat|wrong|bad)/i.test(
		text
	);
	if (namedTools && !negativeOutcome) {
		return {
			level: 'High',
			rationale:
				'The team has hands-on experience with named AI tools and the experience is described as positive enough to keep using them. Onboarding can be tool-specific, not foundational.'
		};
	}
	if (namedTools && negativeOutcome) {
		return {
			level: 'Medium',
			rationale:
				'The team has tried specific AI tools and pulled back. Useful baseline of awareness, but expectations need a careful reset before the next tool is introduced.'
		};
	}
	return {
		level: 'Medium',
		rationale:
			'Some AI use is described but not anchored to specific tools or outcomes. Confirm on the discovery call.'
	};
}

function governanceDimension(s: QuizStatic, screen: ScreenOutput): ReadinessDimension {
	if (screen.guardrail_tier === 'unknown') {
		return {
			level: 'Low',
			rationale:
				'Authority sources for this industry are not yet loaded. Defer governance scoring to the full Stage 3 review.'
		};
	}
	if (screen.guardrail_tier === 'none') {
		return {
			level: 'High',
			rationale:
				'No sector-specific guardrails apply. Ordinary vendor due diligence is enough; governance is not the binding constraint here.'
		};
	}
	if (screen.guardrail_tier === 'strict') {
		if (screen.human_review_policy === 'mandatory') {
			return {
				level: 'Low',
				rationale:
					'Sector regulation applies and the governance posture is incomplete. Policy and human-review work has to land before any tool touches client records.'
			};
		}
		return {
			level: 'Medium',
			rationale:
				'Sector regulation applies and the firm already has formal rules and human review in place. Quick wins are possible inside that envelope.'
		};
	}
	if (s.governanceRules === 'formal') {
		return {
			level: 'High',
			rationale:
				'Standard tier with formal AI rules already in place. Governance is not the binding constraint; tool selection is.'
		};
	}
	return {
		level: 'Medium',
		rationale:
			'Standard tier without formal AI rules. A one-page acceptable-use policy is useful as part of the rollout.'
	};
}

function changeCapacity(s: QuizStatic): ReadinessDimension {
	if (s.size === '1-9') {
		return {
			level: 'Medium',
			rationale:
				'Owner-operator firm. The owner is the sponsor by default; change capacity is bounded by personal time, not stakeholder count.'
		};
	}
	if (s.size === '10-25' || s.size === '26-50') {
		if (s.processHealth === 'broken') {
			return {
				level: 'Low',
				rationale:
					'Mid-sized firm with a broken process. Multiple stakeholders need to align before any rollout sticks; sequence cleanup before tools.'
			};
		}
		return {
			level: 'Medium',
			rationale:
				'Mid-sized firm. Sponsorship and rollout discipline matter; the owner needs to nominate one person to own adoption.'
		};
	}
	return {
		level: 'Low',
		rationale:
			'Larger team. Change cycles are longer; tool rollouts need explicit sponsorship, training, and a measurable outcome before they are approved.'
	};
}

export function buildScorecard(s: QuizStatic, screen: ScreenOutput): ReadinessScorecard {
	return {
		strategic_fit: strategicFit(s),
		workflow: workflowReadiness(s),
		data: dataReadiness(s),
		ai_fluency: aiFluency(s),
		governance: governanceDimension(s, screen),
		change_capacity: changeCapacity(s)
	};
}

const LOWEST: Record<ReadinessLevel, number> = { Low: 0, Medium: 1, High: 2 };

export function recommendedNextStep(
	scorecard: ReadinessScorecard,
	s: QuizStatic
): RecommendedNextStep {
	if (
		scorecard.data.level === 'Low' ||
		(scorecard.workflow.level === 'Low' && s.processHealth === 'broken')
	) {
		return 'cleanup';
	}
	if (scorecard.governance.level === 'Low') return 'policy-first';
	const ambitious =
		s.businessGoal === 'Grow revenue' || s.businessGoal === 'Margin or profitability';
	if (ambitious && scorecard.change_capacity.level === 'Low') return 'strategy-first';
	const allMediumOrHigh = (
		[
			scorecard.strategic_fit,
			scorecard.workflow,
			scorecard.data,
			scorecard.governance,
			scorecard.change_capacity
		] as ReadinessDimension[]
	).every((d) => LOWEST[d.level] >= 1);
	if (allMediumOrHigh) return 'pilot';
	return 'cleanup';
}

export function reportShape(s: QuizStatic, screen: ScreenOutput): ReportShape {
	const isRegulated = REGULATED_INDUSTRIES.has(s.industry);
	const sensitive = s.regulatedData !== 'no';
	const largeTeam = LARGE_TEAM_SIZES.has(s.size);
	if (isRegulated || sensitive || largeTeam || screen.guardrail_tier === 'strict') {
		return 'assessment-plus-guardrails';
	}
	return 'quick-plan';
}
