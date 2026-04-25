/**
 * Rank pain areas from per-turn extractions. Deterministic Week 5 behavior:
 * group by collapsed pain_signal, score severity by cadence + implication
 * presence, tie-break by evidence count.
 *
 * Severity table:
 *   implication present AND frequency in {daily, every day, multiple times}     -> High
 *   implication present AND frequency in {weekly, every week, a few times}      -> Medium
 *   implication present AND no frequency OR frequency unknown                   -> Medium
 *   no implication AND frequency present                                        -> Medium
 *   no implication AND no frequency                                             -> Low
 */

import type { PainAreaRanked, TurnExtraction } from '$lib/types/synthesizer';

const DAILY_RE = /\b(daily|every day|multiple times a day|several times a day|all day)\b/i;
const WEEKLY_RE = /\b(weekly|every week|a few times a week|once a week|several times a week)\b/i;
const MONTHLY_RE = /\b(monthly|every month|once a month)\b/i;

export interface PainAreaRankInput {
	extractions: TurnExtraction[];
}

interface Accum {
	theme: string;
	frequency: string;
	evidence_turns: number[];
	hasImplication: boolean;
	totalMentions: number;
}

/**
 * Collapse multiple pain_signal strings into a theme label of 2-5 words.
 * Light normalization: lowercase, strip punctuation, take first four tokens,
 * capitalize initials.
 */
export function normalizeTheme(signal: string): string {
	const cleaned = signal.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
	const tokens = cleaned
		.split(/\s+/)
		.filter((t) => t.length > 0)
		.slice(0, 5);
	if (tokens.length === 0) return 'Unlabeled pain';
	return tokens
		.map((t, i) => (i === 0 ? t[0].toUpperCase() + t.slice(1).toLowerCase() : t.toLowerCase()))
		.join(' ');
}

export function rankPainAreas(input: PainAreaRankInput): PainAreaRanked[] {
	const byTheme = new Map<string, Accum>();

	input.extractions.forEach((e, index) => {
		const sig = e.pain_signal?.trim();
		if (!sig) return;
		const theme = normalizeTheme(sig);
		const existing = byTheme.get(theme);
		if (existing) {
			existing.evidence_turns.push(index);
			if (e.frequency_signal && !existing.frequency) {
				existing.frequency = e.frequency_signal;
			}
			if (e.dimension === 'implication') existing.hasImplication = true;
			existing.totalMentions++;
		} else {
			byTheme.set(theme, {
				theme,
				frequency: e.frequency_signal ?? '',
				evidence_turns: [index],
				hasImplication: e.dimension === 'implication',
				totalMentions: 1
			});
		}
	});

	// After grouping, also mark themes as implication-backed if any other
	// extraction with matching pain_signal carries dimension=implication.
	input.extractions.forEach((e) => {
		if (e.dimension !== 'implication' || !e.pain_signal) return;
		const theme = normalizeTheme(e.pain_signal);
		const acc = byTheme.get(theme);
		if (acc) acc.hasImplication = true;
	});

	const ranked: PainAreaRanked[] = [];
	for (const acc of byTheme.values()) {
		ranked.push({
			theme: acc.theme,
			severity: severityFrom(acc),
			frequency: acc.frequency || '(unknown)',
			evidence_turns: acc.evidence_turns
		});
	}

	// Sort: severity desc, then evidence-count desc, then theme asc for stable output.
	const severityWeight: Record<PainAreaRanked['severity'], number> = {
		High: 2,
		Medium: 1,
		Low: 0
	};
	ranked.sort((a, b) => {
		const s = severityWeight[b.severity] - severityWeight[a.severity];
		if (s !== 0) return s;
		const e = b.evidence_turns.length - a.evidence_turns.length;
		if (e !== 0) return e;
		return a.theme.localeCompare(b.theme);
	});

	return ranked;
}

function severityFrom(acc: Accum): PainAreaRanked['severity'] {
	const freq = acc.frequency;
	const daily = DAILY_RE.test(freq);
	const weekly = WEEKLY_RE.test(freq);
	const monthly = MONTHLY_RE.test(freq);
	if (acc.hasImplication && daily) return 'High';
	if (acc.hasImplication && weekly) return 'Medium';
	if (acc.hasImplication) return 'Medium';
	if (daily) return 'Medium';
	if (weekly || monthly) return 'Medium';
	return 'Low';
}
