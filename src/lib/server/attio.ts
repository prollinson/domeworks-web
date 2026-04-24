import type { QuizSubmission } from '$lib/types/quiz';

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

function buildNoteContent(submissionId: string, s: QuizSubmission): string {
	const adaptive = s.adaptive
		.map((a) => `- ${a.infoNeed}: ${a.question}\n  → ${a.answer}`)
		.join('\n');

	const governance = s.static.governanceRules
		? `Governance\n  rules: ${s.static.governanceRules}\n  review: ${s.static.governanceReview}\n  comfort: ${s.static.governanceComfort}\n`
		: '';

	const businessGoal =
		s.static.businessGoal === 'Other' && s.static.businessGoalOther
			? `Other: ${s.static.businessGoalOther}`
			: s.static.businessGoal;

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
		adaptive
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
	submission: QuizSubmission
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
				content: buildNoteContent(submissionId, submission)
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
	submission: QuizSubmission
): Promise<AttioResult> {
	let lastError: AttioResult | null = null;

	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const res = await tryOnce(config, submissionId, submission);
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
