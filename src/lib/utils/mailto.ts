const EMAIL = 'piers@domeworks.tech';
const CALENDLY = 'https://fantastical.app/piers/domeworks';

export function getBookCallUrl(): string {
	return CALENDLY;
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
// Rename the Cal.com event separately (Cal settings → Event Types) and update this constant
// to `https://cal.com/prollinson/ai-tools-assessment` once the rename is applied there.
const ASSESSMENT_CAL = 'https://cal.com/prollinson/ai-audit';

export function getAssessmentCallUrl(): string {
	return ASSESSMENT_CAL;
}

export interface QuizAnswers {
	industry: string;
	size: string;
	revenue: string;
	role: string;
	timeLeak: string;
	dreadedTask: string;
	aiUsage: string;
	email: string;
}

export function generateQuizMailto(a: QuizAnswers): string {
	const subject = encodeURIComponent('AI Readiness Quiz: action plan request');
	const body = encodeURIComponent(`Hi Piers,

Please send me the AI Action Plan based on these answers.

Industry: ${a.industry}
Company size: ${a.size}
Annual revenue: ${a.revenue}
My role: ${a.role}
Biggest time leak area: ${a.timeLeak}
Most-dreaded task: ${a.dreadedTask}
AI tool usage so far: ${a.aiUsage}

My email: ${a.email}

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
