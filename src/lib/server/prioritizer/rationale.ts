/**
 * Tiered rationale prose for opportunity-prioritizer.
 *
 * - Quick Win + Strategic rationales: Sonnet (voice-sensitive client-facing
 *   prose).
 * - Foundational rationale: Haiku (single-sentence summary, voice-sensitive
 *   but lower stakes).
 * - Research rationale: deterministic only (internal log entry, never
 *   surfaced to clients).
 *
 * Failure boundary: any LLM call falls through callWithRetry once. If both
 * attempts fail, the deterministic fallback strings from the SKILL.md spec
 * are returned and the caller marks llm_status='partial'.
 */

import {
	buildClient,
	callOnce,
	callWithRetry,
	checkVoiceGate,
	HAIKU_MODEL,
	SONNET_MODEL,
	type LlmConfig
} from '$lib/server/llm-gateway';
import type {
	PrioritizerContext,
	ScoredCandidate,
	Tier
} from '$lib/types/prioritizer';

const VOICE_RULES = `Voice rules. No em-dashes anywhere. First-person "I" or "my" when DomeWorks speaks. No "we" or "our". Plain English. No marketing language. No exclamation marks.`;

export interface RationaleResult {
	rationale: string;
	llm_status: 'ok' | 'partial' | 'unavailable';
}

export function deterministicRationale(scored: ScoredCandidate): string {
	const { tier, impact, feasibility, confidence } = scored;
	switch (tier) {
		case 'quick-win':
			return `Surfaced as a quick win: ${impact} impact, ${feasibility} feasibility, ${confidence} confidence. Guardrail tier permits standard tooling.`;
		case 'foundational':
			return 'Foundational move; unblocks higher-impact work in the next tier.';
		case 'strategic':
			return 'Strategic; worth a dedicated planning session before scoping a pilot.';
		case 'research':
			return 'Shelved; revisit after the top three tiers have had thirty days in flight.';
	}
}

/**
 * Render the rationale for a single scored candidate. Routes to the right
 * model by tier, runs the voice gate post-generation, and falls back to
 * deterministic prose on any failure.
 *
 * Research-or-shelve never calls the LLM; it returns the deterministic
 * one-liner directly.
 */
export async function renderRationale(
	scored: ScoredCandidate,
	context: PrioritizerContext,
	llm?: LlmConfig
): Promise<RationaleResult> {
	if (scored.tier === 'research') {
		return { rationale: deterministicRationale(scored), llm_status: 'ok' };
	}
	if (!llm?.apiKey) {
		return { rationale: deterministicRationale(scored), llm_status: 'unavailable' };
	}

	const client = buildClient(llm);
	const fallback = deterministicRationale(scored);
	const model = scored.tier === 'foundational' ? HAIKU_MODEL : SONNET_MODEL;
	const maxTokens = scored.tier === 'foundational' ? 100 : 240;
	const prompt = buildPrompt(scored, context);

	const text = await callWithRetry<string>(
		async () => callOnce(client, prompt.system, prompt.user, { model, maxTokens }),
		'',
		`prioritizer.rationale.${scored.tier}`
	);

	if (!text) return { rationale: fallback, llm_status: 'partial' };

	const gate = checkVoiceGate(text);
	if (!gate.ok) {
		console.warn(
			`[prioritizer.rationale.${scored.tier}] voice gate violations, falling back:`,
			gate.violations,
			'\nFlagged text:',
			text
		);
		return { rationale: fallback, llm_status: 'partial' };
	}

	return { rationale: text, llm_status: 'ok' };
}

interface PromptBundle {
	system: string;
	user: string;
}

function buildPrompt(scored: ScoredCandidate, context: PrioritizerContext): PromptBundle {
	const { candidate, tier, impact, feasibility, confidence, risk } = scored;
	const lengthRule = tier === 'foundational'
		? 'one sentence, 15 to 25 words'
		: 'one short paragraph, 50 to 80 words';

	const tierLabel = tierLabelOf(tier);
	const govNote = candidate.governance_risk_note
		? `Governance note that must be respected: ${candidate.governance_risk_note}\n`
		: '';

	const system = `You are DomeWorks writing a ${tierLabel} rationale on an opportunity card. ${VOICE_RULES} Output the rationale and nothing else (no preamble, no headings, no bullet points).`;

	const user = `Opportunity: ${candidate.title}.
Tier: ${tierLabel}.
Scores: impact=${impact}, feasibility=${feasibility}, confidence=${confidence}, risk=${risk}.
Industry: ${context.industry}. Team size: ${context.team_size}. Top goal: ${context.strategic_fit_top_goal || '(not stated)'}.
${govNote}
Write the rationale: ${lengthRule}. Ground it in the scores above; do not invent facts. Frame as DomeWorks speaking ("I", "my"). Do not name a specific tool or vendor.`;

	return { system, user };
}

function tierLabelOf(tier: Tier): string {
	switch (tier) {
		case 'quick-win':
			return 'Quick Win';
		case 'foundational':
			return 'Foundational';
		case 'strategic':
			return 'Strategic';
		case 'research':
			return 'Research-or-shelve';
	}
}
