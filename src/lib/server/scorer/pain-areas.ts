import type { QuizStatic } from '$lib/types/quiz';
import type { PainArea } from '$lib/data/tool-library';

const TIME_LEAK_TO_PAIN: Record<string, PainArea[]> = {
	admin: ['admin', 'email-overload'],
	marketing: ['marketing-and-lead-response', 'sales-outreach'],
	delivery: ['client-delivery'],
	mixed: ['admin', 'client-delivery']
};

const KEYWORD_PAIN_MAP: Array<{ pattern: RegExp; areas: PainArea[] }> = [
	{ pattern: /\bmeet(ing|s)?|call(s)?|notes\b/i, areas: ['meeting-notes', 'action-item-capture'] },
	{ pattern: /\b(email|inbox|outlook|gmail)\b/i, areas: ['email-overload', 'correspondence'] },
	{ pattern: /\b(report|dashboard|analytics|metric)\b/i, areas: ['reporting'] },
	{ pattern: /\b(draft|writing|document|proposal|brief)\b/i, areas: ['document-drafting'] },
	{ pattern: /\b(schedul|calendar|book(ing)?|appoint)\b/i, areas: ['scheduling'] },
	{ pattern: /\b(intake|onboard|new client|new patient)\b/i, areas: ['intake'] },
	{ pattern: /\b(bookkeep|reconcil|invoice|ap |ar |billing)\b/i, areas: ['bookkeeping-review'] },
	{ pattern: /\b(complian(ce|t)|audit|regulat)\b/i, areas: ['compliance'] },
	{ pattern: /\b(design|graphic|creative|social post)\b/i, areas: ['design-production'] },
	{ pattern: /\b(support|ticket|help desk|customer service)\b/i, areas: ['customer-support'] },
	{ pattern: /\b(crm|contact|pipeline|hubspot|salesforce)\b/i, areas: ['crm-hygiene'] },
	{ pattern: /\b(outreach|prospect|cold (email|call))\b/i, areas: ['sales-outreach'] },
	{ pattern: /\bresearch\b/i, areas: ['research'] }
];

export function derivePainAreas(s: QuizStatic): PainArea[] {
	const out = new Set<PainArea>();

	for (const a of TIME_LEAK_TO_PAIN[s.timeLeak] ?? []) out.add(a);

	const haystack = `${s.dreadedTask} ${s.currentAiUse} ${s.digitizationProbe}`;
	for (const { pattern, areas } of KEYWORD_PAIN_MAP) {
		if (pattern.test(haystack)) {
			for (const a of areas) out.add(a);
		}
	}

	return Array.from(out);
}

/**
 * Map a free-text synthesized theme (e.g. "Intake form rework") onto the
 * same PainArea slugs the tool library uses. Reuses the KEYWORD_PAIN_MAP
 * the static-quiz path already exercises so Stage 1 and Stage 2 converge
 * on the same vocabulary.
 *
 * Used by the scorer when a SynthesizerOutput is passed in: Stage 2 pain
 * areas are merged into the candidate set so tool matching considers both
 * sources of evidence.
 */
export function painAreasFromThemes(themes: string[]): PainArea[] {
	const out = new Set<PainArea>();
	for (const theme of themes) {
		for (const { pattern, areas } of KEYWORD_PAIN_MAP) {
			if (pattern.test(theme)) {
				for (const a of areas) out.add(a);
			}
		}
	}
	return Array.from(out);
}

/**
 * Merge two PainArea lists, de-duplicated, preserving the first list's
 * order and appending novel entries from the second.
 */
export function mergePainAreas(base: PainArea[], additions: PainArea[]): PainArea[] {
	const out = [...base];
	for (const a of additions) {
		if (!out.includes(a)) out.push(a);
	}
	return out;
}
