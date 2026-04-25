/**
 * discovery-call-synthesizer (TypeScript runtime).
 *
 * Reads one Stage 2 intake record (transcript + structured extraction state)
 * and returns typed findings the scorer can render directly. See the
 * skill spec at /Users/piers/piers-os/.claude/skills/discovery-call-synthesizer/SKILL.md
 * for the contract this runtime implements.
 *
 * Week 5 produced the deterministic baseline. Week 6 promotes the handoff
 * brief to a Sonnet-generated paragraph when an llm config is supplied; on
 * any failure the deterministic renderer keeps producing the brief and the
 * output is identical to Week 5 output.
 */

import type {
	SynthesizerInput,
	SynthesizerOutput
} from '$lib/types/synthesizer';
import type { LlmConfig } from '$lib/server/llm-gateway';
import { rankPainAreas } from './pain-areas';
import { extractWorkarounds, extractExceptionPatterns } from './workarounds';
import { buildSipocSummary } from './sipoc';
import { deriveCandidates } from './candidates';
import { renderHandoffBrief, renderHandoffBriefLLM } from './handoff';

const MIN_TURNS_FOR_ROUTINE = 6;

export interface RunSynthesizerOptions {
	llm?: LlmConfig;
}

export async function runSynthesizer(
	input: SynthesizerInput,
	options: RunSynthesizerOptions = {}
): Promise<SynthesizerOutput> {
	const { extractions, counters } = input.structuredState;

	if (extractions.length === 0) {
		return {
			sipoc_summary: {
				suppliers: [],
				inputs: [],
				process: 'Stage 2 produced no extractable findings.',
				outputs: [],
				customers: [],
			},
			pain_areas_ranked: [],
			workaround_list: [],
			exception_patterns: [],
			candidate_opportunities: [],
			handoff_brief: renderHandoffBrief({
				input,
				painAreas: [],
				workarounds: [],
			}),
			needs_human_review: true,
			llm_status: 'unavailable',
		};
	}

	const painAreas = rankPainAreas({ extractions });
	const workarounds = extractWorkarounds(extractions);
	const exceptions = extractExceptionPatterns(extractions);
	const sipoc = buildSipocSummary({
		industry: input.industry,
		callerEmail: input.callerEmail,
		extractions,
		painThemes: painAreas.map((p) => p.theme),
	});
	const candidates = deriveCandidates({
		painAreas,
		workarounds,
		stage1: input.stage1,
	});

	const handoffInput = { input, painAreas, workarounds };
	let handoffBrief: string;
	let llmStatus: SynthesizerOutput['llm_status'] = 'ok';

	if (options.llm?.apiKey) {
		const result = await renderHandoffBriefLLM(handoffInput, options.llm);
		handoffBrief = result.text;
		llmStatus = result.status === 'ok' ? 'ok' : 'partial';
	} else {
		handoffBrief = renderHandoffBrief(handoffInput);
	}

	const short = input.turnCount < MIN_TURNS_FOR_ROUTINE;
	const needsReview =
		short ||
		counters.sensitiveSlips > 0 ||
		counters.novelWorkflowFlag === true ||
		counters.emotionalFlag === true ||
		(input.stage1 !== undefined && stage1Contradiction(input));

	return {
		sipoc_summary: sipoc,
		pain_areas_ranked: painAreas,
		workaround_list: workarounds,
		exception_patterns: exceptions,
		candidate_opportunities: candidates,
		handoff_brief: handoffBrief,
		needs_human_review: needsReview,
		llm_status: llmStatus,
	};
}

/**
 * Stage 1 said the process was broken; Stage 2 surfaced zero pain signals.
 * Or vice versa. Either direction is a signal that the two stages disagree
 * and a human should eyeball the record before the report goes out.
 */
function stage1Contradiction(input: SynthesizerInput): boolean {
	if (!input.stage1) return false;
	const s1Broken = input.stage1.processHealth === 'Broken';
	const stage2HasPain = input.structuredState.extractions.some(
		(e) => !!e.pain_signal,
	);
	if (s1Broken && !stage2HasPain) return true;
	if (!s1Broken && input.stage1.processHealth !== 'Unsure') {
		const stage2Severe = input.structuredState.extractions.filter(
			(e) => e.dimension === 'implication',
		).length;
		if (stage2Severe >= 3) return true;
	}
	return false;
}

export type { SynthesizerInput, SynthesizerOutput } from '$lib/types/synthesizer';
