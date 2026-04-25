import type { QuizSubmission } from '$lib/types/quiz';
import type { ScreenOutput } from '$lib/regulated-data-screen';
import type { PrioritizerOutput, Tier } from '$lib/types/prioritizer';

const ATTIO_BASE = 'https://api.attio.com/v2';
const FETCH_TIMEOUT_MS = 5000;

/** Domeworks SMB Audit list (Deals-parented pipeline). */
const LIST_SLUG = 'domeworks_smb_audit';

/** Stage every new quiz submission lands on. Must match a title in the Deals `stage` status set. */
const DEFAULT_STAGE_TITLE = 'Discovered';

/**
 * Workspace-member ID for the Deal owner. Discovered once via GET /v2/self (authorized_by_workspace_member_id).
 * Deals require an owner; pinning Piers means quiz submissions always land in his queue.
 */
const DEFAULT_OWNER_WORKSPACE_MEMBER_ID = '5497d278-fa98-4d48-828b-b996c3053bcc';

export interface AttioResult {
	ok: boolean;
	errorClass?: 'timeout' | 'network' | 'client' | 'server';
	step?: 'people-upsert' | 'deal-create' | 'note' | 'list-entry';
	message?: string;
}

interface AttioConfig {
	apiKey: string;
}

async function attioFetch(config: AttioConfig, path: string, init: RequestInit): Promise<Response> {
	return fetch(`${ATTIO_BASE}${path}`, {
		...init,
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${config.apiKey}`,
			...init.headers
		},
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
	});
}

function classify(status: number): 'client' | 'server' {
	return status >= 500 ? 'server' : 'client';
}

function buildNoteContent(submissionId: string, s: QuizSubmission, screen?: ScreenOutput): string {
	const adaptive = s.adaptive
		.map((a) => `- ${a.infoNeed}: ${a.question}\n  -> ${a.answer}`)
		.join('\n');

	const governance = s.static.governanceRules
		? `Governance\n  rules: ${s.static.governanceRules}\n  review: ${s.static.governanceReview}\n  comfort: ${s.static.governanceComfort}\n`
		: '';

	const businessGoal =
		s.static.businessGoal === 'Other' && s.static.businessGoalOther
			? `Other: ${s.static.businessGoalOther}`
			: s.static.businessGoal;

	const screenBlock = screen
		? [
				'',
				'Regulated-data screen:',
				`  guardrail tier: ${screen.guardrail_tier}`,
				`  human review policy: ${screen.human_review_policy}`,
				screen.required_mitigations.length
					? `  mitigations:\n${screen.required_mitigations.map((m) => `    - ${m}`).join('\n')}`
					: '  mitigations: none',
				screen.sector_citations.length
					? `  citations: ${screen.sector_citations.map((c) => c.source).join(', ')}`
					: '  citations: none'
			].join('\n')
		: '';

	return [
		`Submission id: ${submissionId}`,
		'',
		`Industry: ${s.static.industry}`,
		`Team size: ${s.static.size}`,
		`Regulated data: ${s.static.regulatedData}`,
		`Business goal: ${businessGoal}`,
		`Time leak: ${s.static.timeLeak}`,
		`Dreaded task: ${s.static.dreadedTask}`,
		s.static.digitizationProbe ? `Digitization probe: ${s.static.digitizationProbe}` : '',
		`Process health: ${s.static.processHealth}`,
		s.static.currentAiUse ? `Current AI use: ${s.static.currentAiUse}` : '',
		'',
		governance,
		'Adaptive answers:',
		adaptive,
		screenBlock
	]
		.filter((l) => l !== '')
		.join('\n');
}

function dealName(s: QuizSubmission): string {
	return `SMB Audit: ${s.static.industry} (${s.email})`;
}

async function tryOnce(
	config: AttioConfig,
	submissionId: string,
	submission: QuizSubmission,
	screen?: ScreenOutput
): Promise<AttioResult> {
	// 1. Upsert Person by email. Dedupes contacts when the same person submits twice.
	const personRes = await attioFetch(
		config,
		'/objects/people/records?matching_attribute=email_addresses',
		{
			method: 'PUT',
			body: JSON.stringify({
				data: { values: { email_addresses: [{ email_address: submission.email }] } }
			})
		}
	);
	if (!personRes.ok) {
		return {
			ok: false,
			errorClass: classify(personRes.status),
			step: 'people-upsert',
			message: `${personRes.status}`
		};
	}
	const personBody = (await personRes.json()) as { data?: { id?: { record_id?: string } } };
	const personId = personBody.data?.id?.record_id;
	if (!personId) {
		return {
			ok: false,
			errorClass: 'client',
			step: 'people-upsert',
			message: 'missing record_id'
		};
	}

	// 2. Create a fresh Deal per submission. The Deal is the pipeline entity;
	// duplicate submissions can be merged in the Attio UI if needed.
	const dealRes = await attioFetch(config, '/objects/deals/records', {
		method: 'POST',
		body: JSON.stringify({
			data: {
				values: {
					name: dealName(submission),
					stage: [{ status: DEFAULT_STAGE_TITLE }],
					owner: [
						{
							referenced_actor_type: 'workspace-member',
							referenced_actor_id: DEFAULT_OWNER_WORKSPACE_MEMBER_ID
						}
					],
					associated_people: [{ target_object: 'people', target_record_id: personId }]
				}
			}
		})
	});
	if (!dealRes.ok) {
		return {
			ok: false,
			errorClass: classify(dealRes.status),
			step: 'deal-create',
			message: `${dealRes.status}`
		};
	}
	const dealBody = (await dealRes.json()) as { data?: { id?: { record_id?: string } } };
	const dealId = dealBody.data?.id?.record_id;
	if (!dealId) {
		return { ok: false, errorClass: 'client', step: 'deal-create', message: 'missing record_id' };
	}

	// 3. Attach the quiz-payload note to the Deal so it sits next to the pipeline entry.
	const noteRes = await attioFetch(config, '/notes', {
		method: 'POST',
		body: JSON.stringify({
			data: {
				parent_object: 'deals',
				parent_record_id: dealId,
				title: `SMB Audit Quiz submission ${submissionId}`,
				format: 'plaintext',
				content: buildNoteContent(submissionId, submission, screen)
			}
		})
	});
	if (!noteRes.ok) {
		return {
			ok: false,
			errorClass: classify(noteRes.status),
			step: 'note',
			message: `${noteRes.status}`
		};
	}

	// 4. Add the Deal to the SMB Audit list.
	const listRes = await attioFetch(config, `/lists/${LIST_SLUG}/entries`, {
		method: 'POST',
		body: JSON.stringify({
			data: {
				parent_record_id: dealId,
				parent_object: 'deals',
				entry_values: {}
			}
		})
	});
	if (!listRes.ok) {
		return {
			ok: false,
			errorClass: classify(listRes.status),
			step: 'list-entry',
			message: `${listRes.status}`
		};
	}

	return { ok: true };
}

/**
 * Full Attio fan-out for one quiz submission: Person upsert, Deal create, note, list entry.
 * Retries once on the same error class. If both attempts fail, returns a typed result;
 * caller logs and continues.
 */
export async function upsertQuizSubmission(
	config: AttioConfig,
	submissionId: string,
	submission: QuizSubmission,
	screen?: ScreenOutput
): Promise<AttioResult> {
	let lastError: AttioResult | null = null;

	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const res = await tryOnce(config, submissionId, submission, screen);
			if (res.ok) return res;
			lastError = res;
		} catch (err) {
			if (err instanceof DOMException && err.name === 'TimeoutError') {
				lastError = { ok: false, errorClass: 'timeout', message: 'request timed out' };
			} else {
				lastError = {
					ok: false,
					errorClass: 'network',
					message: err instanceof Error ? err.message : 'unknown network error'
				};
			}
		}
	}

	return lastError ?? { ok: false, errorClass: 'network', message: 'unknown failure' };
}

/**
 * Stage 2 augmentation. Writes four custom attributes onto the prospect's
 * Person record so the SMB Audit Pipeline list shows the post-discovery
 * picture, not just Stage 1.
 *
 * Custom attributes (must exist in the Attio workspace before first call):
 *   - stage2_handoff_brief        text, multiline
 *   - stage2_pain_themes          text, single-line ("theme A, theme B, theme C")
 *   - stage2_prioritizer_summary  text, single-line ("2 quick-win, 1 foundational, 1 strategic, 1 research")
 *   - stage2_completed_at         timestamp (ISO 8601 string)
 *
 * Failure boundary: two same-class failures log and return. The D1 row
 * already carries the canonical state; Attio is the broadcast surface.
 */
export interface AttioStage2Args {
	email: string;
	handoffBrief: string;
	painThemes: string[];
	prioritizerSummary: string;
	completedAtIso: string;
}

export async function updateStage2Record(
	config: AttioConfig,
	args: AttioStage2Args
): Promise<AttioResult> {
	let lastError: AttioResult | null = null;

	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const res = await tryStage2Update(config, args);
			if (res.ok) return res;
			lastError = res;
		} catch (err) {
			if (err instanceof DOMException && err.name === 'TimeoutError') {
				lastError = { ok: false, errorClass: 'timeout', message: 'request timed out' };
			} else {
				lastError = {
					ok: false,
					errorClass: 'network',
					message: err instanceof Error ? err.message : 'unknown network error'
				};
			}
		}
	}

	return lastError ?? { ok: false, errorClass: 'network', message: 'unknown failure' };
}

async function tryStage2Update(config: AttioConfig, args: AttioStage2Args): Promise<AttioResult> {
	const res = await attioFetch(
		config,
		'/objects/people/records?matching_attribute=email_addresses',
		{
			method: 'PUT',
			body: JSON.stringify({
				data: {
					values: {
						email_addresses: [{ email_address: args.email }],
						stage2_handoff_brief: args.handoffBrief,
						stage2_pain_themes: args.painThemes.join(', '),
						stage2_prioritizer_summary: args.prioritizerSummary,
						stage2_completed_at: args.completedAtIso
					}
				}
			})
		}
	);
	if (!res.ok) {
		return {
			ok: false,
			errorClass: classify(res.status),
			step: 'people-upsert',
			message: `${res.status}`
		};
	}
	return { ok: true };
}

/**
 * Build the one-line tier-count string written into stage2_prioritizer_summary.
 * Empty input renders as "no tiered candidates" so the field is never blank.
 */
export function summarizePrioritizerTiers(prioritizer: PrioritizerOutput): string {
	if (prioritizer.tiered.length === 0) return 'no tiered candidates';
	const counts: Record<Tier, number> = {
		'quick-win': 0,
		foundational: 0,
		strategic: 0,
		research: 0
	};
	for (const t of prioritizer.tiered) counts[t.tier]++;
	const order: Tier[] = ['quick-win', 'foundational', 'strategic', 'research'];
	return order
		.filter((t) => counts[t] > 0)
		.map((t) => `${counts[t]} ${t}`)
		.join(', ');
}
