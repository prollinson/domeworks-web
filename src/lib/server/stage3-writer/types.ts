/**
 * Types for the Stage 3 writer module. Composes a Gamma-ready Assessment
 * markdown from a ScorerOutput, optionally enriched with prioritizer LLM
 * rationale prose when Stage 2 synthesized findings are present.
 *
 * Renderer is non-replacing: when synthesized is absent, the output markdown
 * is byte-equivalent to scorer/markdown.ts. When synthesized is present, the
 * Foundational task register and Strategic narrative paragraphs are
 * enriched with prioritizer prose.
 */
import type { QuizStatic } from '$lib/types/quiz';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type { ScorerOutput } from '$lib/server/scorer';
import type { SynthesizerOutput } from '$lib/types/synthesizer';
import type { LlmConfig } from '$lib/server/llm-gateway';

export interface Stage3Input {
	scorerOutput: ScorerOutput;
	s: QuizStatic;
	screen: ScreenOutput;
	synthesized?: SynthesizerOutput;
	llm?: LlmConfig;
}

export interface Stage3Output {
	markdown: string;
	warnings: string[];
}
