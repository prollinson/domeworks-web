/**
 * Strategic narrative renderer for Stage 3.
 *
 * One paragraph per `prioritizer.tiered.tier === 'strategic'` candidate. The
 * paragraph body is the prioritizer rationale verbatim (Sonnet-generated and
 * voice-gated upstream by rationale.ts:checkVoiceGate). A title prefix names
 * the candidate so the section reads as a list of decisions rather than a
 * wall of prose.
 */
import { sanitizeVoice } from '$lib/server/llm-gateway';
import type { TieredCandidate } from '$lib/types/prioritizer';

export function renderStrategicNarrative(items: TieredCandidate[]): string {
	if (items.length === 0) {
		return '_None queued from Stage 2 prioritizer._';
	}
	return items.map((t) => sanitizeVoice(`**${t.title}.** ${t.rationale}`)).join('\n\n');
}
