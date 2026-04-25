import type { QuizSubmission } from '$lib/types/quiz';

const EMAIL = 'piers@domeworks.tech';
const BOOK_CALL_URL = 'https://cal.com/prollinson/ai-audit';

export function getBookCallUrl(): string {
	return BOOK_CALL_URL;
}

export function generateScanMailto(): string {
	const subject = encodeURIComponent('AI Scan: interested');
	const body = encodeURIComponent(`Hi Piers,

I'm interested in the AI Scan for my team.

Company:
Role:
Team size (engineers):
AI tools currently in use:

Best time for a 15-min call:`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function generateContextBuildMailto(): string {
	const subject = encodeURIComponent('Context Build: interested');
	const body = encodeURIComponent(`Hi Piers,

I'm interested in the Context Build.

Company:
Role:
Team size (engineers):
AI tools currently in use:
Biggest challenge with AI adoption:

Best time for a 30-min call:`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

// NOTE: The Cal.com path `/ai-audit` still reflects the old product name.
const ASSESSMENT_CAL = 'https://cal.com/prollinson/ai-audit';

export function getAssessmentCallUrl(): string {
	return ASSESSMENT_CAL;
}

export function generateQuizMailto(s: QuizSubmission): string {
	const subject = encodeURIComponent('AI Readiness Quiz: action plan request');

	const adaptiveLines = s.adaptive
		.map((a) => `Q: ${a.question}\n   Options offered: ${a.options.join(' · ')}\n   → ${a.answer}`)
		.join('\n');

	const businessGoal =
		s.static.businessGoal === 'Other' && s.static.businessGoalOther
			? `Other: ${s.static.businessGoalOther}`
			: s.static.businessGoal;

	const governanceBlock = s.static.governanceRules
		? `
Governance:
- Tool-use rules: ${s.static.governanceRules}
- Human review: ${s.static.governanceReview}
- Comfort with third-party AI: ${s.static.governanceComfort}`
		: '';

	const digitizationBlock = s.static.digitizationProbe
		? `\nDigitization probe: ${s.static.digitizationProbe}`
		: '';

	const currentAiBlock = s.static.currentAiUse ? `\nCurrent AI use: ${s.static.currentAiUse}` : '';

	const body = encodeURIComponent(`Hi Piers,

Please send me the AI Action Plan based on these answers.

Industry: ${s.static.industry}
Team size: ${s.static.size}
Regulated data: ${s.static.regulatedData}
Business goal: ${businessGoal}
Time leak area: ${s.static.timeLeak}
Dreaded task: ${s.static.dreadedTask}${digitizationBlock}
Process health: ${s.static.processHealth}${currentAiBlock}${governanceBlock}

Adaptive follow-ups:
${adaptiveLines}

My email: ${s.email}

Thanks,
`);

	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function generateGeneralMailto(): string {
	const subject = encodeURIComponent('DomeWorks | inquiry');
	const body = encodeURIComponent(`Hi Piers,

`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}
