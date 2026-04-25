/**
 * Handoff brief renderers. Two paths:
 *
 *   - renderHandoffBrief (deterministic, Week 5). 80 to 120 word first-person
 *     paragraph composed from facts. The failure-fallback path.
 *   - renderHandoffBriefLLM (Sonnet, Week 6). Calls the AI Gateway with the
 *     same facts; runs the voice gate on the result; falls back to the
 *     deterministic renderer when the gate flags violations or the call fails.
 *
 * Voice gate is built into both renderers: no em-dashes, first-person "I",
 * no tool names, no financial claims, no "we"/"our".
 */

import {
	buildClient,
	callOnce,
	callWithRetry,
	checkVoiceGate,
	sanitizeVoice,
	SONNET_MODEL,
	type LlmConfig
} from '$lib/server/llm-gateway';
import type { PainAreaRanked, SynthesizerInput, WorkaroundEntry } from '$lib/types/synthesizer';
import { buildHandoffPrompt } from './handoff-prompt';

export interface HandoffInput {
	input: SynthesizerInput;
	painAreas: PainAreaRanked[];
	workarounds: WorkaroundEntry[];
}

export interface HandoffLlmResult {
	text: string;
	status: 'ok' | 'unavailable';
}

export function renderHandoffBrief(hi: HandoffInput): string {
	const { input, painAreas, workarounds } = hi;
	const channel = input.channel;
	const industry = input.industry;
	const turnCount = input.turnCount;

	if (painAreas.length === 0) {
		return `I spoke with the prospect on ${channel} for ${turnCount} turns. Stage 2 captured no structured extractions, so I will not claim findings here. I will review the transcript by hand before drafting the Stage 3 report.`;
	}

	const top = painAreas.slice(0, 2);
	const topTheme1 = top[0]?.theme ?? 'friction area (not captured)';
	const topTheme2 = top[1]?.theme ?? null;
	const sev1 = top[0]?.severity.toLowerCase() ?? 'medium';

	const painsSentence = topTheme2
		? `The top two friction areas were ${topTheme1.toLowerCase()} (${sev1}) and ${topTheme2.toLowerCase()} (${top[1]!.severity.toLowerCase()}).`
		: `The top friction area was ${topTheme1.toLowerCase()} (${sev1}).`;

	const workaroundSentence =
		workarounds.length > 0
			? `I counted ${workarounds.length} manual workaround${workarounds.length === 1 ? '' : 's'} in flight.`
			: 'I saw no manual workarounds yet, which usually means the pain is still tolerable.';

	const nextShape = recommendEngagementShape(hi);

	const brief = `I ran the Stage 2 intake with the prospect on ${channel}, covering ${turnCount} turns in the ${industry} bank. ${painsSentence} ${workaroundSentence} My recommended next engagement is ${nextShape}.`;

	return sanitizeVoice(brief);
}

/**
 * Sonnet handoff brief. Falls back to renderHandoffBrief on:
 *   - any model-call failure (after one retry)
 *   - any voice-gate violation (em-dash, "we"/"our", banned phrase)
 *
 * Returns status='unavailable' on fallback so the caller can attribute the
 * brief in the Stage 3 markdown.
 */
export async function renderHandoffBriefLLM(
	hi: HandoffInput,
	llm: LlmConfig
): Promise<HandoffLlmResult> {
	const { system, user } = buildHandoffPrompt(hi);
	const client = buildClient(llm);

	const text = await callWithRetry<string>(
		async () => {
			return await callOnce(client, system, user, {
				model: SONNET_MODEL,
				maxTokens: 320
			});
		},
		'',
		'synthesizer.handoff_brief'
	);

	if (!text) {
		return { text: renderHandoffBrief(hi), status: 'unavailable' };
	}

	const gate = checkVoiceGate(text);
	if (!gate.ok) {
		console.warn(
			'[synthesizer.handoff_brief] voice gate violations, falling back:',
			gate.violations,
			'\nFlagged text:',
			text
		);
		return { text: renderHandoffBrief(hi), status: 'unavailable' };
	}

	return { text: sanitizeVoice(text), status: 'ok' };
}

function recommendEngagementShape(hi: HandoffInput): string {
	const strict = hi.input.stage1?.guardrailTier === 'strict';
	const topSeverity = hi.painAreas[0]?.severity;
	if (strict && topSeverity === 'High') {
		return 'a governance-first framing call before any pilot runs against regulated records';
	}
	if (topSeverity === 'High') {
		return 'a focused Quick-Win pilot on the top friction area, with a 30-day decision gate';
	}
	if (topSeverity === 'Medium') {
		return 'a short cleanup pass on the surrounding workflow before picking a pilot tool';
	}
	return 'a follow-up discovery touch to test whether the top theme is worth a pilot at all';
}
