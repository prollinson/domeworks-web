/**
 * Shared Anthropic client + call helpers used by the scorer and the
 * synthesizer's Sonnet handoff brief. Both modules use the same Cloudflare AI
 * Gateway path, the same 6-second timeout, and the same single-retry budget.
 *
 * Keeping the gateway plumbing in one place means a Sonnet/Haiku model bump,
 * a gateway-URL change, or a retry-policy adjustment lives in one diff
 * instead of two.
 *
 * Failure boundary: callOnceWithRetry attempts the call twice. Two same-class
 * failures (timeout, 4xx, network) return the typed fallback the caller
 * passes in. Never a third attempt.
 */
import Anthropic from '@anthropic-ai/sdk';

export const SONNET_MODEL = 'claude-sonnet-4-6';
export const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

export const TIMEOUT_MS = 6000;
export const MAX_RETRIES = 1;

export interface LlmConfig {
	apiKey: string;
	gatewayUrl?: string;
}

export function buildClient(config: LlmConfig): Anthropic {
	return new Anthropic({
		apiKey: config.apiKey,
		baseURL: config.gatewayUrl
	});
}

export interface CallOptions {
	model?: string;
	maxTokens: number;
	timeoutMs?: number;
}

/**
 * Single Anthropic call. Returns the first text block run through the
 * mechanical voice-gate pass (em-dash + en-dash replacement, whitespace
 * normalize, trim). Every LLM call in this codebase routes through here, so
 * the voice-gate fixup is enforced at one chokepoint.
 */
export async function callOnce(
	client: Anthropic,
	system: string,
	user: string,
	opts: CallOptions
): Promise<string> {
	const res = await client.messages.create(
		{
			model: opts.model ?? SONNET_MODEL,
			max_tokens: opts.maxTokens,
			system,
			messages: [{ role: 'user', content: user }]
		},
		{ timeout: opts.timeoutMs ?? TIMEOUT_MS }
	);
	const block = res.content.find((c) => c.type === 'text');
	if (!block || block.type !== 'text') return '';
	return sanitizeVoice(block.text);
}

/**
 * Wrap an async LLM call with the project's failure-boundary discipline:
 * one retry, then fallback. The fallback is the caller's responsibility so
 * each callsite can return a typed shape (string, array, map, etc).
 */
export async function callWithRetry<T>(
	fn: () => Promise<T>,
	fallback: T,
	contextLabel: string
): Promise<T> {
	let lastErr: unknown;
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
		}
	}
	console.warn(`[llm-gateway:${contextLabel}] both attempts failed, using fallback:`, lastErr);
	return fallback;
}

/**
 * Mechanical voice-gate fixup. The single source of truth for the
 * deterministic part of the voice gate; checkVoiceGate is the violation
 * report. Both are exported from this module; no other file should define
 * its own.
 *
 * Em-dash (U+2014) becomes "comma plus space" because Sonnet uses em-dashes
 * as clause separators; en-dash (U+2013) becomes a plain hyphen; runs of
 * whitespace collapse to one space; leading and trailing whitespace strip.
 */
export function sanitizeVoice(s: string): string {
	return s
		.replace(/—/g, ', ')
		.replace(/–/g, '-')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

/**
 * Voice-gate scan results. Caller decides what to do (typically: log + fall
 * back to the deterministic renderer rather than ship drifting prose).
 */
export interface VoiceGateResult {
	ok: boolean;
	violations: string[];
}

const BANNED_PHRASES = [
	'synergy',
	'leverage',
	'utilize',
	'best-in-class',
	'cutting-edge',
	'cutting edge',
	'game-changer',
	'game changer'
];

/**
 * Run the post-generation voice gate. Returns the list of violations so the
 * caller can log specific lines before falling back. Soft gate by design: it
 * does not rewrite, it reports.
 */
export function checkVoiceGate(
	text: string,
	options: { allowFirstPersonPlural?: boolean } = {}
): VoiceGateResult {
	const violations: string[] = [];

	if (/—/.test(text)) violations.push('contains em-dash (U+2014)');

	if (!options.allowFirstPersonPlural) {
		const wePattern = /\b(we|our)\b/i;
		if (wePattern.test(text)) {
			violations.push('contains first-person plural ("we" or "our") - DomeWorks voice is "I"');
		}
	}

	const lower = text.toLowerCase();
	for (const phrase of BANNED_PHRASES) {
		if (lower.includes(phrase)) violations.push(`contains banned phrase: "${phrase}"`);
	}

	return { ok: violations.length === 0, violations };
}

/**
 * Extract a JSON value from a model response. Handles the common cases:
 * raw JSON, fenced ```json blocks, and stray text around the JSON.
 */
export function extractJson(raw: string): unknown {
	if (!raw) return null;
	const trimmed = raw.trim();
	const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const candidate = fenceMatch ? fenceMatch[1] : trimmed;
	try {
		return JSON.parse(candidate);
	} catch {
		return null;
	}
}
