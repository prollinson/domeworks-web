/**
 * Extract workarounds and exception patterns from per-turn extractions.
 *
 * Workarounds are single-turn captures: each extraction carrying a
 * workaround_mention becomes one entry.
 *
 * Exception patterns are collapses across multiple novel-workflow extractions
 * (dimension=novel or novel_workflow=true). We group them on the nearest
 * shared pain_signal theme so the Stage 3 report can cite one pattern per
 * workflow area, not one per turn.
 */

import type { ExceptionPattern, TurnExtraction, WorkaroundEntry } from '$lib/types/synthesizer';
import { normalizeTheme } from './pain-areas';

export function extractWorkarounds(extractions: TurnExtraction[]): WorkaroundEntry[] {
	const out: WorkaroundEntry[] = [];
	extractions.forEach((e, index) => {
		const w = e.workaround_mention?.trim();
		if (!w) return;
		out.push({ description: w, evidence_turn: index });
	});
	return out;
}

export function extractExceptionPatterns(extractions: TurnExtraction[]): ExceptionPattern[] {
	const byTheme = new Map<string, number[]>();
	const unthemed: number[] = [];

	extractions.forEach((e, index) => {
		const isException = e.dimension === 'novel' || e.novel_workflow === true;
		if (!isException) return;
		if (e.pain_signal) {
			const theme = normalizeTheme(e.pain_signal);
			const turns = byTheme.get(theme);
			if (turns) turns.push(index);
			else byTheme.set(theme, [index]);
		} else {
			unthemed.push(index);
		}
	});

	const out: ExceptionPattern[] = [];
	for (const [theme, turns] of byTheme.entries()) {
		out.push({
			pattern: `${theme} path varies per job`,
			evidence_turns: turns
		});
	}
	if (unthemed.length > 0) {
		out.push({
			pattern: 'Workflow varies per job (caller volunteered "every job is different")',
			evidence_turns: unthemed
		});
	}
	return out;
}
