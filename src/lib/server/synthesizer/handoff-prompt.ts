/**
 * Prompt construction for the Sonnet-generated handoff brief. The prompt text
 * lives in its own module so lessons.md changes can land here without
 * touching the renderer or the gateway plumbing.
 *
 * Contract: 80 to 120 words, first-person "I" voice, no em-dashes, no tool
 * names, no financial claims, no "we"/"our". Covers who I spoke to, the top
 * three pain areas, the workaround count, the guardrail tier, the channel,
 * and the turn count.
 */

import type {
	PainAreaRanked,
	SynthesizerInput,
	WorkaroundEntry
} from '$lib/types/synthesizer';

export interface HandoffPromptInput {
	input: SynthesizerInput;
	painAreas: PainAreaRanked[];
	workarounds: WorkaroundEntry[];
}

export interface HandoffPrompt {
	system: string;
	user: string;
}

const SYSTEM = `You are DomeWorks writing a Stage 2 handoff brief for an internal teammate. DomeWorks speaks in first person ("I", "my"). Never use "we" or "our". Never use em-dashes (U+2014). Never name a specific tool or vendor. Never make a financial claim or savings estimate. Stay in plain English. No exclamation marks. Output the brief and nothing else (no preamble, no headings, no bullet points, no quotes).`;

export function buildHandoffPrompt(hp: HandoffPromptInput): HandoffPrompt {
	const top = hp.painAreas.slice(0, 3);
	const channel = hp.input.channel;
	const turnCount = hp.input.turnCount;
	const industry = hp.input.industry;
	const guardrailTier = hp.input.stage1?.guardrailTier ?? 'unknown';
	const workaroundCount = hp.workarounds.length;

	const painLines = top.length
		? top
				.map(
					(pa, i) =>
						`${i + 1}. ${pa.theme} (${pa.severity.toLowerCase()} severity, ${pa.frequency})`
				)
				.join('\n')
		: '(no pain areas captured)';

	const user = `I just finished a Stage 2 discovery intake. Write the handoff brief.

Facts to use (do not invent others):
- Channel: ${channel}
- Turn count: ${turnCount}
- Industry bank: ${industry}
- Guardrail tier: ${guardrailTier}
- Manual workarounds in flight: ${workaroundCount}

Top pain areas (verbatim themes; reference at least the top one by name):
${painLines}

Constraints:
- 80 to 120 words.
- First sentence starts with "I" (e.g. "I ran the Stage 2..." or "I spoke with the prospect...").
- Cover: who I spoke to, the top two pain areas in plain language, the workaround count, the shape of the recommended next engagement (a Quick-Win pilot, a cleanup pass, a governance-first framing call, or a follow-up discovery touch).
- If guardrail tier is "strict", the recommended next engagement must be a governance-first framing call before any pilot runs against regulated records.
- No em-dashes. No tool names. No financial claims. No "we" or "our".
- One paragraph. No headings, no bullets, no quotes.`;

	return { system: SYSTEM, user };
}
