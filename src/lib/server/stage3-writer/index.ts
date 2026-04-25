/**
 * Stage 3 writer orchestrator. Composes the Gamma-ready Assessment markdown
 * by enriching scorer/markdown.ts output with prioritizer LLM rationale prose.
 *
 * When synthesized is absent (or has no candidate_opportunities), the
 * markdown is returned byte-equivalent to scorer/markdown.ts so Fixture 1 +
 * Fixture 2 keep passing.
 *
 * When synthesized is present:
 *   1. runPrioritizer is called fresh with the LLM config so the rationale
 *      prose is Sonnet-generated (Quick Win + Strategic) or Haiku-generated
 *      (Foundational). The prioritizer's own failure boundary handles
 *      LLM failures and falls back to deterministic rationales; either way
 *      the rendered prose passes the voice gate.
 *   2. The "## Foundational and Strategic Items" section body is replaced
 *      with the enriched task register + narrative paragraphs.
 *
 * Pre-send validation runs unconditionally; warnings surface on the
 * response and as a > [!NOTE] callout at the top of the markdown when any
 * warning fires. Validation never blocks the render.
 */
import { runPrioritizer } from '$lib/server/prioritizer';
import {
	buildPrioritizerCandidates,
	buildPrioritizerContext
} from '$lib/server/scorer';
import type { TieredCandidate } from '$lib/types/prioritizer';
import { renderFoundationalRegister } from './foundational';
import { renderStrategicNarrative } from './strategic';
import { runPreSendChecks } from './validation';
import type { Stage3Input, Stage3Output } from './types';

export type { Stage3Input, Stage3Output } from './types';
export { runPreSendChecks } from './validation';

const ENRICHED_SECTION_TITLE = 'Foundational and Strategic Items';

export async function renderStage3Markdown(input: Stage3Input): Promise<Stage3Output> {
	const warnings = runPreSendChecks(input);
	let markdown = input.scorerOutput.stage1_report_markdown;

	const synth = input.synthesized;
	const shouldEnrich = !!synth && synth.candidate_opportunities.length > 0;

	if (shouldEnrich) {
		const candidates = buildPrioritizerCandidates(synth);
		const context = buildPrioritizerContext(input.s, input.screen);
		const prioritizer = await runPrioritizer({ candidates, context, llm: input.llm });
		const foundational = prioritizer.tiered.filter((t) => t.tier === 'foundational');
		const strategic = prioritizer.tiered.filter((t) => t.tier === 'strategic');

		if (foundational.length > 0 || strategic.length > 0) {
			const enrichedBody = buildEnrichedSectionBody(foundational, strategic);
			markdown = spliceSection(markdown, ENRICHED_SECTION_TITLE, enrichedBody);
		}
	}

	if (warnings.length > 0) {
		markdown = prependWarningsCallout(markdown, warnings);
	}

	return { markdown, warnings };
}

function buildEnrichedSectionBody(
	foundational: TieredCandidate[],
	strategic: TieredCandidate[]
): string {
	return [
		'### Foundational Items',
		'',
		renderFoundationalRegister(foundational),
		'',
		'### Strategic Items',
		'',
		renderStrategicNarrative(strategic)
	].join('\n');
}

/**
 * Replace the body of a `## TITLE` section with newBody, preserving the
 * inter-section spacing produced by scorer/markdown.ts (sections joined
 * with `\n` after each section adds its own trailing `\n`, yielding two
 * blank lines between sections).
 *
 * Returns the input unchanged when the section isn't found.
 */
function spliceSection(markdown: string, sectionTitle: string, newBody: string): string {
	const marker = `\n## ${sectionTitle}\n\n`;
	const idx = markdown.indexOf(marker);
	if (idx === -1) return markdown;
	const bodyStart = idx + marker.length;
	const nextSectionIdx = markdown.indexOf('\n\n## ', bodyStart);
	const bodyEnd = nextSectionIdx === -1 ? markdown.length : nextSectionIdx;
	const trimmed = `${newBody.trim()}\n`;
	return markdown.slice(0, bodyStart) + trimmed + markdown.slice(bodyEnd);
}

/**
 * Insert a `> [!NOTE]` warnings callout immediately before the first `## `
 * section. Keeps the H1 + submission-line header intact.
 */
function prependWarningsCallout(markdown: string, warnings: string[]): string {
	const lines = ['', '> [!NOTE]', '> Pre-send validation flagged:'];
	for (const w of warnings) lines.push(`> - ${w}`);
	lines.push('');
	const callout = lines.join('\n');
	const firstSectionIdx = markdown.indexOf('\n## ');
	if (firstSectionIdx === -1) return markdown + callout;
	return markdown.slice(0, firstSectionIdx) + callout + markdown.slice(firstSectionIdx);
}
