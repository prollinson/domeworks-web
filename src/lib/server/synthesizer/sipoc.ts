/**
 * Build a SIPOC summary from a transcript plus extractions. Deterministic
 * Week 5 behavior: collect system_mention strings for suppliers/inputs/outputs,
 * collect emails + caller email for customers, synthesize a one-paragraph
 * process line from the ranked pain areas and workarounds.
 *
 * The Week 6 LLM path would replace the process-paragraph builder with a
 * Haiku summarization; the deterministic fallback here is still useful as
 * the fallback path when the Haiku call fails twice.
 */

import type { SipocSummary, TurnExtraction } from '$lib/types/synthesizer';

export interface SipocInput {
	industry: string;
	callerEmail: string | null;
	extractions: TurnExtraction[];
	painThemes: string[];
}

export function buildSipocSummary(input: SipocInput): SipocSummary {
	const systems = new Set<string>();
	for (const e of input.extractions) {
		const s = e.system_mention?.trim();
		if (s) systems.add(s);
	}
	// Classifications are priority-ordered so a mention that matches more than
	// one pattern lands in the most specific bucket: upstream (who/what starts
	// the work) wins over generic input, and output wins over everything
	// because "report" should never be double-counted as an input.
	const suppliers: string[] = [];
	const inputs: string[] = [];
	const outputs: string[] = [];
	for (const s of systems) {
		if (isOutput(s)) outputs.push(s);
		else if (isUpstream(s)) suppliers.push(s);
		else if (isInput(s)) inputs.push(s);
	}

	const customers: string[] = [];
	if (input.callerEmail) customers.push(`${input.callerEmail} (caller)`);

	const process = summarizeProcess(input);

	return {
		suppliers: suppliers.length > 0 ? suppliers : ['(not captured)'],
		inputs: inputs.length > 0 ? inputs : ['(not captured)'],
		process,
		outputs: outputs.length > 0 ? outputs : ['(not captured)'],
		customers: customers.length > 0 ? customers : ['(not captured)'],
	};
}

function isUpstream(mention: string): boolean {
	const m = mention.toLowerCase();
	return /(intake form|referral|lead|phone call|incoming|fax|email inbox|portal)/.test(m);
}

function isInput(mention: string): boolean {
	const m = mention.toLowerCase();
	return /(pdf|spreadsheet|document|form|file|notes|recording)/.test(m);
}

function isOutput(mention: string): boolean {
	const m = mention.toLowerCase();
	// "statement" is intentionally excluded: statements are usually received
	// from a bank or vendor (input), not produced. Include only terms that
	// the SMB itself produces.
	return /(report|invoice|contract|proposal|quote|schedule|estimate)/.test(m);
}

function summarizeProcess(input: SipocInput): string {
	if (input.extractions.length === 0) {
		return 'Stage 2 produced no extractable findings; see transcript for raw detail.';
	}
	const topThemes = input.painThemes.slice(0, 3);
	if (topThemes.length === 0) {
		return `Stage 2 surfaced system mentions but no ranked pain themes; the caller's day-to-day workflow shape is visible in the transcript turns only.`;
	}
	const themes = topThemes.join(', ');
	return `The work in scope runs through ${input.industry}. Across ${input.extractions.length} captured signals, the caller's friction concentrated on: ${themes}. Workarounds and exception paths are captured separately below.`;
}
