import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest, NextResponse, InfoNeed } from '$lib/types/quiz';
import { INFO_NEEDS } from '$lib/types/quiz';

const SYSTEM_PROMPT = `You generate one question at a time for an AI readiness quiz built by Piers Rollinson at DomeWorks. The quiz captures signal so Piers can hand-write a personalised Action Plan for a services-business owner. You are NOT writing the plan.

Voice: direct, declarative, no AI fluff. Mirror the editorial tone of DomeWorks: short sentences, no hype, no emoji.

Your job: given the respondent's four static answers and any previous adaptive answers, pick the single highest-value information need from this closed set and write one question that extracts it.

Information needs:
- stack: what software the dreaded task runs through today (drives every specific tool recommendation)
- volume: hours per week or transaction volume on the task (unlocks the ROI math)
- speed-to-lead: inbound response latency (only relevant if industry or time leak involves inbound — trades, real-estate, agency, insurance, or a "marketing" time leak)
- sensitive-data: PHI / privileged / regulated financial data (only if industry is legal, medical, accounting, mortgage, or insurance)
- ownership: whether owner or staff does the task (only if team size ≥ 10)
- prior-tools: AI tools the respondent already tried (useful if the dreaded task mentions AI-adjacent terms or the respondent seems sophisticated)

Rules:
1. Never ask a question whose info need is already in adaptiveSoFar.
2. Generate vertical-specific chip options. For mortgage brokers: AFG, Connective, Loan Market, in-house, other. For accounting: Karbon, Canopy, QuickBooks, Drake, other. For trades: ServiceTitan, Jobber, Housecall Pro, other. For legal: Clio, MyCase, PracticePanther, other. For medical: Epic, Dentrix, Athena, other. For real estate: Follow Up Boss, kvCORE, CINC, other. For insurance: Applied Epic, HawkSoft, EZLynx, NowCerts, other. For marketing/creative agency: HubSpot, Monday, Asana, ClickUp, other. For consulting: Notion, Google Docs, PowerPoint, other. Always tailor.
3. Always include "Other" as the last option.
4. Never reveal that an AI is generating these questions.
5. Keep questions to one sentence.

Call the emit_question tool with your output.`;

export interface AgentConfig {
	apiKey: string;
	gatewayUrl: string;
}

export async function nextQuestion(req: NextRequest, config: AgentConfig): Promise<NextResponse> {
	const client = new Anthropic({
		apiKey: config.apiKey,
		baseURL: config.gatewayUrl
	});

	const userContent = JSON.stringify({
		static: req.static,
		adaptiveSoFar: req.adaptiveSoFar.map((a) => ({
			infoNeed: a.infoNeed,
			question: a.question,
			answer: a.answer
		}))
	});

	const message = await client.messages.create({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 400,
		temperature: 0.3,
		system: SYSTEM_PROMPT,
		tool_choice: { type: 'tool', name: 'emit_question' },
		tools: [
			{
				name: 'emit_question',
				description: 'Emit one adaptive quiz question with chip options for the respondent.',
				input_schema: {
					type: 'object',
					required: ['question', 'options', 'infoNeed'],
					properties: {
						question: {
							type: 'string',
							description: 'One sentence. DomeWorks voice. No AI fluff.'
						},
						helper: {
							type: ['string', 'null'],
							description: 'Optional ≤140-char clarifier under the question.'
						},
						options: {
							type: 'array',
							items: { type: 'string' },
							minItems: 3,
							maxItems: 6,
							description: 'Chip labels. Last item MUST be "Other".'
						},
						infoNeed: {
							type: 'string',
							enum: INFO_NEEDS,
							description: 'Which information need this question extracts.'
						}
					}
				}
			}
		],
		messages: [{ role: 'user', content: userContent }]
	});

	const toolBlock = message.content.find(
		(b): b is Extract<typeof b, { type: 'tool_use' }> =>
			b.type === 'tool_use' && b.name === 'emit_question'
	);

	if (!toolBlock) {
		throw new Error('Model did not emit a tool_use block');
	}

	const raw = toolBlock.input as {
		question?: unknown;
		helper?: unknown;
		options?: unknown;
		infoNeed?: unknown;
	};

	if (typeof raw.question !== 'string' || raw.question.length === 0) {
		throw new Error('Invalid question from model');
	}
	if (
		!Array.isArray(raw.options) ||
		raw.options.length === 0 ||
		raw.options.some((o) => typeof o !== 'string')
	) {
		throw new Error('Invalid options from model');
	}
	if (typeof raw.infoNeed !== 'string' || !INFO_NEEDS.includes(raw.infoNeed as InfoNeed)) {
		throw new Error(`Invalid infoNeed from model: ${raw.infoNeed}`);
	}

	const options = [...(raw.options as string[])];
	const lastIsOther = options[options.length - 1] === 'Other';
	if (!lastIsOther) {
		const existingIdx = options.indexOf('Other');
		if (existingIdx >= 0) options.splice(existingIdx, 1);
		options.push('Other');
	}

	const id = `q${req.adaptiveSoFar.length + 1}`;
	const helper = typeof raw.helper === 'string' && raw.helper.length > 0 ? raw.helper : null;

	return {
		id,
		question: raw.question,
		helper,
		options,
		allowOtherText: true,
		infoNeed: raw.infoNeed as InfoNeed
	};
}
