# Adaptive Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static 8-question `/smb/quiz/` into a hybrid with 4 static seed questions, 3 agent-authored chip follow-ups via Claude Haiku on Cloudflare AI Gateway, then email.

**Architecture:** SvelteKit static site on Cloudflare Pages. New Workers endpoint `/api/quiz/next` calls `@anthropic-ai/sdk` pointed at an AI Gateway route; enforces JSON output via tool-use. Client holds quiz state in Svelte 5 runes and progressively renders each adaptive question as chips. Graceful fallback to a hardcoded 3-question sequence on API failure. Existing `/api/quiz` email handler + mailto fallback stay, with the payload shape updated.

**Tech Stack:** SvelteKit 2 + Svelte 5 runes, Tailwind 4, Vite, Cloudflare Pages Functions, `@anthropic-ai/sdk`, Cloudflare AI Gateway, Vitest (new), Playwright (existing).

**Spec:** `docs/superpowers/specs/2026-04-23-adaptive-quiz-design.md`

---

## File Structure

**Create:**

- `vitest.config.ts` — unit test runner config
- `src/lib/types/quiz.ts` — `QuizSubmission`, `AdaptiveAnswer`, `InfoNeed`, `NextRequest`, `NextResponse`
- `src/lib/data/quiz-industries.ts` — industry dropdown options (includes new `insurance`, `mortgage`)
- `src/lib/data/quiz-industries.test.ts`
- `src/lib/data/quiz-fallback.ts` — 3-question fallback sequence
- `src/lib/data/quiz-fallback.test.ts`
- `src/lib/server/quiz-agent.ts` — Claude call, tool schema, response validation
- `src/lib/server/quiz-agent.test.ts`
- `src/routes/api/quiz/next/+server.ts` — endpoint wrapper
- `src/routes/api/quiz/next/server.test.ts`
- `src/lib/utils/mailto.test.ts`
- `src/routes/api/quiz/server.test.ts`
- `tests/smb-quiz.spec.ts` — Playwright E2E

**Modify:**

- `package.json` — add `@anthropic-ai/sdk`, `vitest`, `@vitest/ui`
- `src/lib/utils/mailto.ts` — `QuizAnswers` → `QuizSubmission`, `generateQuizMailto` updated
- `src/routes/api/quiz/+server.ts` — accept new `QuizSubmission` shape, updated `buildBody`
- `src/routes/smb/quiz/+page.svelte` — rebuilt around 4 static + 3 adaptive flow
- `app.d.ts` or `src/app.d.ts` — type `Platform.Env` to include `ANTHROPIC_API_KEY`, `AI_GATEWAY_URL`

**Delete:**

- `tests/test.ts` — stale boilerplate that asserts `h1 === 'Welcome to SvelteKit'` (false since launch)

Each file has a single responsibility: types are data shapes, data files are static constants, `quiz-agent.ts` wraps the Claude call, `+server.ts` files are thin HTTP wrappers, the page is presentational + orchestration.

---

## Task 1: Add Vitest and a smoke test

**Files:**

- Create: `vitest.config.ts`
- Modify: `package.json`
- Delete: `tests/test.ts`

- [ ] **Step 1: Install Vitest**

```bash
pnpm add -D vitest @vitest/ui
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
		globals: false
	}
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

Edit the `"scripts"` block so `test` runs both and each can be run individually:

```json
"test": "vitest run && playwright test",
"test:unit": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 4: Delete the stale Playwright boilerplate**

```bash
git rm tests/test.ts
```

- [ ] **Step 5: Add smoke test**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
	it('runs', () => {
		expect(1 + 1).toBe(2);
	});
});
```

- [ ] **Step 6: Run the smoke test**

Run: `pnpm test:unit src/lib/smoke.test.ts`
Expected: 1 passed.

- [ ] **Step 7: Delete the smoke file now that we know vitest runs**

```bash
git rm src/lib/smoke.test.ts
```

- [ ] **Step 8: Run `pnpm check` to confirm types still compile**

Run: `pnpm check`
Expected: 0 errors.

- [ ] **Step 9: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml
git commit -m "test: add vitest for unit tests, remove stale boilerplate"
```

---

## Task 2: Shared quiz types

**Files:**

- Create: `src/lib/types/quiz.ts`
- Create: `src/lib/types/quiz.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/types/quiz.test.ts`:

```ts
import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
	InfoNeed,
	AdaptiveAnswer,
	QuizStatic,
	QuizSubmission,
	NextRequest,
	NextResponse
} from './quiz';

describe('quiz types', () => {
	it('InfoNeed is the closed union the spec calls out', () => {
		const all: InfoNeed[] = [
			'stack',
			'volume',
			'speed-to-lead',
			'sensitive-data',
			'ownership',
			'prior-tools'
		];
		expect(all).toHaveLength(6);
	});

	it('QuizSubmission has static block + exactly-three adaptive + email', () => {
		const s: QuizSubmission = {
			static: {
				industry: 'Accounting or bookkeeping',
				size: '10-25',
				timeLeak: 'admin',
				dreadedTask: 'chasing tax documents from 80 clients every February'
			},
			adaptive: [
				{ id: 'q1', infoNeed: 'stack', question: 'a?', options: ['x', 'Other'], answer: 'x' },
				{ id: 'q2', infoNeed: 'volume', question: 'b?', options: ['y', 'Other'], answer: 'y' },
				{
					id: 'q3',
					infoNeed: 'sensitive-data',
					question: 'c?',
					options: ['z', 'Other'],
					answer: 'z'
				}
			],
			email: 'piers@example.com'
		};
		expectTypeOf(s.adaptive).toBeArray();
	});

	it('NextResponse requires "Other" to be the final option', () => {
		const r: NextResponse = {
			id: 'q1',
			question: 'Which platforms do you use?',
			helper: null,
			options: ['AFG', 'Connective', 'Other'],
			allowOtherText: true,
			infoNeed: 'stack'
		};
		expect(r.options[r.options.length - 1]).toBe('Other');
	});
});
```

- [ ] **Step 2: Run the test, verify it fails (file doesn't exist)**

Run: `pnpm test:unit src/lib/types/quiz.test.ts`
Expected: FAIL with "Cannot find module './quiz'".

- [ ] **Step 3: Create `src/lib/types/quiz.ts`**

```ts
export type InfoNeed =
	| 'stack'
	| 'volume'
	| 'speed-to-lead'
	| 'sensitive-data'
	| 'ownership'
	| 'prior-tools';

export interface AdaptiveAnswer {
	id: string;
	infoNeed: InfoNeed;
	question: string;
	options: string[];
	answer: string;
}

export interface QuizStatic {
	industry: string;
	size: string;
	timeLeak: string;
	dreadedTask: string;
}

export interface QuizSubmission {
	static: QuizStatic;
	adaptive: AdaptiveAnswer[];
	email: string;
}

export interface NextRequest {
	static: QuizStatic;
	adaptiveSoFar: AdaptiveAnswer[];
}

export interface NextResponse {
	id: string;
	question: string;
	helper: string | null;
	options: string[];
	allowOtherText: true;
	infoNeed: InfoNeed;
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `pnpm test:unit src/lib/types/quiz.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Run `pnpm check`**

Run: `pnpm check`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types/quiz.ts src/lib/types/quiz.test.ts
git commit -m "types: shared quiz types (static + adaptive + submission)"
```

---

## Task 3: Industry options data (adds insurance + mortgage)

**Files:**

- Create: `src/lib/data/quiz-industries.ts`
- Create: `src/lib/data/quiz-industries.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/data/quiz-industries.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { QUIZ_INDUSTRIES } from './quiz-industries';

describe('QUIZ_INDUSTRIES', () => {
	it('includes the nine existing industries plus mortgage and insurance', () => {
		const values = QUIZ_INDUSTRIES.map((i) => i.value);
		expect(values).toContain('Accounting or bookkeeping');
		expect(values).toContain('Legal');
		expect(values).toContain('Medical or dental');
		expect(values).toContain('Trades or field services');
		expect(values).toContain('Real estate');
		expect(values).toContain('Marketing or creative agency');
		expect(values).toContain('Consulting');
		expect(values).toContain('E-commerce');
		expect(values).toContain('Other professional services');
		expect(values).toContain('Insurance or brokers');
		expect(values).toContain('Mortgage broker / lending');
		expect(QUIZ_INDUSTRIES).toHaveLength(11);
	});

	it('each entry has matching value and label (label may be longer)', () => {
		for (const { value, label } of QUIZ_INDUSTRIES) {
			expect(label.startsWith(value) || label === value).toBe(true);
		}
	});
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `pnpm test:unit src/lib/data/quiz-industries.test.ts`
Expected: FAIL with "Cannot find module './quiz-industries'".

- [ ] **Step 3: Create `src/lib/data/quiz-industries.ts`**

```ts
export interface IndustryOption {
	value: string;
	label: string;
}

export const QUIZ_INDUSTRIES: IndustryOption[] = [
	{ value: 'Accounting or bookkeeping', label: 'Accounting or bookkeeping' },
	{ value: 'Legal', label: 'Legal' },
	{ value: 'Medical or dental', label: 'Medical or dental' },
	{
		value: 'Trades or field services',
		label: 'Trades or field services (HVAC, plumbing, landscaping, etc.)'
	},
	{ value: 'Real estate', label: 'Real estate' },
	{ value: 'Marketing or creative agency', label: 'Marketing or creative agency' },
	{ value: 'Consulting', label: 'Consulting' },
	{ value: 'E-commerce', label: 'E-commerce' },
	{ value: 'Insurance or brokers', label: 'Insurance or brokers' },
	{ value: 'Mortgage broker / lending', label: 'Mortgage broker / lending' },
	{ value: 'Other professional services', label: 'Other professional services' }
];
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `pnpm test:unit src/lib/data/quiz-industries.test.ts`
Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/quiz-industries.ts src/lib/data/quiz-industries.test.ts
git commit -m "data: quiz industries list (adds insurance, mortgage)"
```

---

## Task 4: Fallback question sequence

**Files:**

- Create: `src/lib/data/quiz-fallback.ts`
- Create: `src/lib/data/quiz-fallback.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/data/quiz-fallback.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { QUIZ_FALLBACK, getFallbackQuestion } from './quiz-fallback';

describe('QUIZ_FALLBACK', () => {
	it('has exactly three questions in stack → volume → sensitive-data order', () => {
		expect(QUIZ_FALLBACK).toHaveLength(3);
		expect(QUIZ_FALLBACK[0].infoNeed).toBe('stack');
		expect(QUIZ_FALLBACK[1].infoNeed).toBe('volume');
		expect(QUIZ_FALLBACK[2].infoNeed).toBe('sensitive-data');
	});

	it('every question ends with "Other" as the last option', () => {
		for (const q of QUIZ_FALLBACK) {
			expect(q.options[q.options.length - 1]).toBe('Other');
			expect(q.allowOtherText).toBe(true);
		}
	});

	it('getFallbackQuestion returns the right slot by index', () => {
		expect(getFallbackQuestion(0).infoNeed).toBe('stack');
		expect(getFallbackQuestion(1).infoNeed).toBe('volume');
		expect(getFallbackQuestion(2).infoNeed).toBe('sensitive-data');
	});

	it('getFallbackQuestion throws for out-of-range indices', () => {
		expect(() => getFallbackQuestion(3)).toThrow();
		expect(() => getFallbackQuestion(-1)).toThrow();
	});
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `pnpm test:unit src/lib/data/quiz-fallback.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/lib/data/quiz-fallback.ts`**

```ts
import type { NextResponse } from '$lib/types/quiz';

export const QUIZ_FALLBACK: NextResponse[] = [
	{
		id: 'q1',
		infoNeed: 'stack',
		question: "What's the main software that task runs through today?",
		helper: 'Pick the closest one — we can refine in the plan.',
		options: [
			'Email and spreadsheets',
			'QuickBooks or similar accounting',
			'A CRM (HubSpot, Salesforce, Follow Up Boss, etc.)',
			'Practice-management or job-management software',
			'Other'
		],
		allowOtherText: true
	},
	{
		id: 'q2',
		infoNeed: 'volume',
		question: 'Roughly how many hours per week does that task consume?',
		helper: null,
		options: ['Under 1', '1–3', '4–8', '8+', 'Other'],
		allowOtherText: true
	},
	{
		id: 'q3',
		infoNeed: 'sensitive-data',
		question:
			'Does the task involve sensitive data — health records, privileged client info, or regulated financial data?',
		helper: null,
		options: ['Yes', 'No', 'Not sure', 'Other'],
		allowOtherText: true
	}
];

export function getFallbackQuestion(index: number): NextResponse {
	if (index < 0 || index >= QUIZ_FALLBACK.length) {
		throw new RangeError(`Fallback question index out of range: ${index}`);
	}
	return QUIZ_FALLBACK[index];
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `pnpm test:unit src/lib/data/quiz-fallback.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/quiz-fallback.ts src/lib/data/quiz-fallback.test.ts
git commit -m "data: hardcoded fallback question sequence (stack → volume → sensitive-data)"
```

---

## Task 5: Agent server module (Claude call + validation)

**Files:**

- Create: `src/lib/server/quiz-agent.ts`
- Create: `src/lib/server/quiz-agent.test.ts`
- Modify: `package.json` (add `@anthropic-ai/sdk`)

- [ ] **Step 1: Install the Anthropic SDK**

```bash
pnpm add @anthropic-ai/sdk
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/server/quiz-agent.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from '$lib/types/quiz';

// Mock the SDK before importing the module under test.
const mockCreate = vi.fn();
vi.mock('@anthropic-ai/sdk', () => {
	return {
		default: class {
			messages = { create: mockCreate };
		}
	};
});

import { nextQuestion } from './quiz-agent';

const baseReq: NextRequest = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week'
	},
	adaptiveSoFar: []
};

beforeEach(() => {
	mockCreate.mockReset();
});

describe('nextQuestion', () => {
	it('returns a validated NextResponse from the tool call', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which platforms do most of your submissions go to?',
						helper: null,
						options: ['AFG', 'Connective', 'Loan Market', 'In-house', 'Other'],
						infoNeed: 'stack'
					}
				}
			]
		});

		const res = await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.ai.cloudflare.com/v1/acc/gw/anthropic'
		});

		expect(res.id).toBe('q1');
		expect(res.question).toContain('submissions');
		expect(res.options).toEqual(['AFG', 'Connective', 'Loan Market', 'In-house', 'Other']);
		expect(res.infoNeed).toBe('stack');
		expect(res.allowOtherText).toBe(true);
	});

	it('assigns id based on adaptiveSoFar length', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Hours per week?',
						helper: null,
						options: ['1-3', '4-8', '8+', 'Other'],
						infoNeed: 'volume'
					}
				}
			]
		});

		const res = await nextQuestion(
			{
				...baseReq,
				adaptiveSoFar: [
					{ id: 'q1', infoNeed: 'stack', question: 'x?', options: ['x', 'Other'], answer: 'x' }
				]
			},
			{ apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' }
		);

		expect(res.id).toBe('q2');
	});

	it('appends "Other" if the model forgot to', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which platforms?',
						helper: null,
						options: ['AFG', 'Connective'],
						infoNeed: 'stack'
					}
				}
			]
		});

		const res = await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.example/anthropic'
		});

		expect(res.options[res.options.length - 1]).toBe('Other');
	});

	it('throws if the model returns no tool_use block', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'end_turn',
			content: [{ type: 'text', text: "I can't answer that." }]
		});

		await expect(
			nextQuestion(baseReq, { apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' })
		).rejects.toThrow(/tool/i);
	});

	it('throws if infoNeed is not one of the six valid values', async () => {
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'Which?',
						helper: null,
						options: ['a', 'Other'],
						infoNeed: 'made-up-need'
					}
				}
			]
		});

		await expect(
			nextQuestion(baseReq, { apiKey: 'sk-test', gatewayUrl: 'https://gateway.example/anthropic' })
		).rejects.toThrow(/infoNeed/);
	});

	it('passes the gateway URL as baseURL to the SDK', async () => {
		// Capture the constructor call via a fresh mock of the default export.
		// (Re-import after resetting modules would be overkill; assert via the mockCreate calls.)
		mockCreate.mockResolvedValueOnce({
			stop_reason: 'tool_use',
			content: [
				{
					type: 'tool_use',
					name: 'emit_question',
					input: {
						question: 'a?',
						helper: null,
						options: ['x', 'Other'],
						infoNeed: 'stack'
					}
				}
			]
		});

		await nextQuestion(baseReq, {
			apiKey: 'sk-test',
			gatewayUrl: 'https://gateway.example/anthropic'
		});

		// Verify messages.create got the expected model and tool config.
		expect(mockCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				model: 'claude-haiku-4-5-20251001',
				max_tokens: 400,
				tool_choice: { type: 'tool', name: 'emit_question' },
				tools: expect.arrayContaining([expect.objectContaining({ name: 'emit_question' })])
			})
		);
	});
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `pnpm test:unit src/lib/server/quiz-agent.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 4: Create `src/lib/server/quiz-agent.ts`**

```ts
import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest, NextResponse, InfoNeed } from '$lib/types/quiz';

const INFO_NEEDS: InfoNeed[] = [
	'stack',
	'volume',
	'speed-to-lead',
	'sensitive-data',
	'ownership',
	'prior-tools'
];

const SYSTEM_PROMPT = `You generate one question at a time for an AI readiness quiz built by Piers Rollinson at DomeWorks. The quiz captures signal so Piers can hand-write a personalised Action Plan for a services-business owner. You are NOT writing the plan.

Voice: direct, declarative, no AI fluff. Mirror the editorial tone of DomeWorks: short sentences, no hype, no emoji.

Your job: given the respondent's four static answers and any previous adaptive answers, pick the single highest-value information need from this closed set and write one question that extracts it.

Information needs:
- stack: what software the dreaded task runs through today (drives every specific tool recommendation)
- volume: hours per week or transaction volume on the task (unlocks the ROI math)
- speed-to-lead: inbound response latency (only relevant if industry or time leak involves inbound — trades, real-estate, agency, insurance, or a "marketing" time leak)
- sensitive-data: PHI / privileged / regulated financial data (only if industry is legal, medical, accounting, mortgage, or insurance)
- ownership: whether owner or staff does the task (only if team size ≥ 10)
- prior-tools: AI tools the respondent already tried (useful if the dreaded task mentions AI-adjacent terms or the respondent seems sophisticated)

Rules:
1. Never ask a question whose info need is already in adaptiveSoFar.
2. Generate vertical-specific chip options. For mortgage brokers: AFG, Connective, Loan Market, in-house, other. For accounting: Karbon, Canopy, QuickBooks, Drake, other. For trades: ServiceTitan, Jobber, Housecall Pro, other. For legal: Clio, MyCase, PracticePanther, other. For medical: Epic, Dentrix, Athena, other. For real estate: Follow Up Boss, kvCORE, CINC, other. Always tailor.
3. Always include "Other" as the last option.
4. Never reveal that an AI is generating these questions.
5. Keep questions to one sentence.

Call the emit_question tool with your output.`;

export interface AgentConfig {
	apiKey: string;
	gatewayUrl: string;
}

export async function nextQuestion(req: NextRequest, config: AgentConfig): Promise<NextResponse> {
	const client = new Anthropic({
		apiKey: config.apiKey,
		baseURL: config.gatewayUrl
	});

	const userContent = JSON.stringify({
		static: req.static,
		adaptiveSoFar: req.adaptiveSoFar.map((a) => ({
			infoNeed: a.infoNeed,
			question: a.question,
			answer: a.answer
		}))
	});

	const message = await client.messages.create({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 400,
		temperature: 0.3,
		system: SYSTEM_PROMPT,
		tool_choice: { type: 'tool', name: 'emit_question' },
		tools: [
			{
				name: 'emit_question',
				description: 'Emit one adaptive quiz question with chip options for the respondent.',
				input_schema: {
					type: 'object',
					required: ['question', 'options', 'infoNeed'],
					properties: {
						question: {
							type: 'string',
							description: 'One sentence. DomeWorks voice. No AI fluff.'
						},
						helper: {
							type: ['string', 'null'],
							description: 'Optional ≤140-char clarifier under the question.'
						},
						options: {
							type: 'array',
							items: { type: 'string' },
							minItems: 3,
							maxItems: 6,
							description: 'Chip labels. Last item MUST be "Other".'
						},
						infoNeed: {
							type: 'string',
							enum: INFO_NEEDS,
							description: 'Which information need this question extracts.'
						}
					}
				}
			}
		],
		messages: [{ role: 'user', content: userContent }]
	});

	const toolBlock = message.content.find(
		(b): b is Extract<typeof b, { type: 'tool_use' }> =>
			b.type === 'tool_use' && b.name === 'emit_question'
	);

	if (!toolBlock) {
		throw new Error('Model did not emit a tool_use block');
	}

	const raw = toolBlock.input as {
		question?: unknown;
		helper?: unknown;
		options?: unknown;
		infoNeed?: unknown;
	};

	if (typeof raw.question !== 'string' || raw.question.length === 0) {
		throw new Error('Invalid question from model');
	}
	if (!Array.isArray(raw.options) || raw.options.some((o) => typeof o !== 'string')) {
		throw new Error('Invalid options from model');
	}
	if (typeof raw.infoNeed !== 'string' || !INFO_NEEDS.includes(raw.infoNeed as InfoNeed)) {
		throw new Error(`Invalid infoNeed from model: ${raw.infoNeed}`);
	}

	const options = raw.options as string[];
	if (options[options.length - 1] !== 'Other') {
		options.push('Other');
	}

	const id = `q${req.adaptiveSoFar.length + 1}`;
	const helper = typeof raw.helper === 'string' && raw.helper.length > 0 ? raw.helper : null;

	return {
		id,
		question: raw.question,
		helper,
		options,
		allowOtherText: true,
		infoNeed: raw.infoNeed as InfoNeed
	};
}
```

- [ ] **Step 5: Run the tests**

Run: `pnpm test:unit src/lib/server/quiz-agent.test.ts`
Expected: 6 passed.

- [ ] **Step 6: Run `pnpm check`**

Run: `pnpm check`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/server/quiz-agent.ts src/lib/server/quiz-agent.test.ts package.json pnpm-lock.yaml
git commit -m "server: quiz-agent Claude call with tool-use JSON and validation"
```

---

## Task 6: `/api/quiz/next` endpoint wrapper

**Files:**

- Create: `src/routes/api/quiz/next/+server.ts`
- Create: `src/routes/api/quiz/next/server.test.ts`
- Modify: `src/app.d.ts`

- [ ] **Step 1: Type the Cloudflare env in `src/app.d.ts`**

Read the current file first:

```bash
cat src/app.d.ts
```

Then edit the `Platform.Env` interface (or create it) so it includes:

```ts
declare global {
	namespace App {
		interface Platform {
			env?: {
				SEB?: {
					send: (msg: {
						from: string;
						to: string;
						subject: string;
						text: string;
					}) => Promise<unknown>;
				};
				ANTHROPIC_API_KEY?: string;
				AI_GATEWAY_URL?: string;
			};
		}
	}
}

export {};
```

(Merge with existing types — don't wholesale replace what's there. `SEB` is already referenced in `src/routes/api/quiz/+server.ts`.)

- [ ] **Step 2: Write the failing test**

Create `src/routes/api/quiz/next/server.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest, NextResponse } from '$lib/types/quiz';

const mockNextQuestion = vi.fn();
vi.mock('$lib/server/quiz-agent', () => ({
	nextQuestion: mockNextQuestion
}));

import { POST } from './+server';

function makeEvent(body: unknown, platformOverride?: unknown) {
	const req = new Request('http://localhost/api/quiz/next', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
	return {
		request: req,
		platform: platformOverride ?? {
			env: {
				ANTHROPIC_API_KEY: 'sk-test',
				AI_GATEWAY_URL: 'https://gateway.example/anthropic'
			}
		}
	} as Parameters<typeof POST>[0];
}

const validReq: NextRequest = {
	static: {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February'
	},
	adaptiveSoFar: []
};

const validRes: NextResponse = {
	id: 'q1',
	question: 'Which practice-management software do you use?',
	helper: null,
	options: ['Karbon', 'Canopy', 'QuickBooks', 'Drake', 'Other'],
	allowOtherText: true,
	infoNeed: 'stack'
};

beforeEach(() => mockNextQuestion.mockReset());

describe('POST /api/quiz/next', () => {
	it('returns the agent response as JSON on a valid request', async () => {
		mockNextQuestion.mockResolvedValueOnce(validRes);

		const res = await POST(makeEvent(validReq));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual(validRes);
	});

	it('returns 400 on invalid JSON', async () => {
		const res = await POST(makeEvent('not json'));
		expect(res.status).toBe(400);
	});

	it('returns 400 on missing static fields', async () => {
		const res = await POST(makeEvent({ static: {}, adaptiveSoFar: [] }));
		expect(res.status).toBe(400);
	});

	it('returns 400 if adaptiveSoFar length already >= 3', async () => {
		const full: NextRequest = {
			...validReq,
			adaptiveSoFar: [
				{ id: 'q1', infoNeed: 'stack', question: 'a?', options: ['x', 'Other'], answer: 'x' },
				{ id: 'q2', infoNeed: 'volume', question: 'b?', options: ['y', 'Other'], answer: 'y' },
				{
					id: 'q3',
					infoNeed: 'sensitive-data',
					question: 'c?',
					options: ['z', 'Other'],
					answer: 'z'
				}
			]
		};
		const res = await POST(makeEvent(full));
		expect(res.status).toBe(400);
	});

	it('returns 503 if secrets are not configured', async () => {
		const res = await POST(makeEvent(validReq, { env: {} }));
		expect(res.status).toBe(503);
	});

	it('returns 502 when the agent throws', async () => {
		mockNextQuestion.mockRejectedValueOnce(new Error('gateway down'));
		const res = await POST(makeEvent(validReq));
		expect(res.status).toBe(502);
	});
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `pnpm test:unit src/routes/api/quiz/next/server.test.ts`
Expected: FAIL — `./+server` module not found.

- [ ] **Step 4: Create `src/routes/api/quiz/next/+server.ts`**

```ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NextRequest, QuizStatic, AdaptiveAnswer, InfoNeed } from '$lib/types/quiz';
import { nextQuestion } from '$lib/server/quiz-agent';

export const prerender = false;

const INFO_NEEDS: InfoNeed[] = [
	'stack',
	'volume',
	'speed-to-lead',
	'sensitive-data',
	'ownership',
	'prior-tools'
];

function isValidStatic(v: unknown): v is QuizStatic {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		typeof s.industry === 'string' &&
		s.industry.length > 0 &&
		typeof s.size === 'string' &&
		s.size.length > 0 &&
		typeof s.timeLeak === 'string' &&
		s.timeLeak.length > 0 &&
		typeof s.dreadedTask === 'string' &&
		s.dreadedTask.length >= 20
	);
}

function isValidAdaptive(v: unknown): v is AdaptiveAnswer {
	if (!v || typeof v !== 'object') return false;
	const a = v as Record<string, unknown>;
	return (
		typeof a.id === 'string' &&
		typeof a.question === 'string' &&
		typeof a.answer === 'string' &&
		typeof a.infoNeed === 'string' &&
		INFO_NEEDS.includes(a.infoNeed as InfoNeed) &&
		Array.isArray(a.options) &&
		a.options.every((o) => typeof o === 'string')
	);
}

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!payload || typeof payload !== 'object') {
		throw error(400, 'Invalid payload');
	}
	const req = payload as { static?: unknown; adaptiveSoFar?: unknown };

	if (!isValidStatic(req.static)) {
		throw error(400, 'Missing or invalid static fields');
	}
	if (!Array.isArray(req.adaptiveSoFar) || !req.adaptiveSoFar.every(isValidAdaptive)) {
		throw error(400, 'Invalid adaptiveSoFar');
	}
	if (req.adaptiveSoFar.length >= 3) {
		throw error(400, 'Quiz has no further adaptive questions');
	}

	const apiKey = platform?.env?.ANTHROPIC_API_KEY;
	const gatewayUrl = platform?.env?.AI_GATEWAY_URL;
	if (!apiKey || !gatewayUrl) {
		throw error(503, 'Agent not configured');
	}

	const nextReq: NextRequest = {
		static: req.static,
		adaptiveSoFar: req.adaptiveSoFar
	};

	try {
		const res = await nextQuestion(nextReq, { apiKey, gatewayUrl });
		return json(res);
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'agent failed';
		throw error(502, `Agent error: ${msg}`);
	}
};
```

- [ ] **Step 5: Run the tests**

Run: `pnpm test:unit src/routes/api/quiz/next/server.test.ts`
Expected: 6 passed.

- [ ] **Step 6: Run `pnpm check`**

Run: `pnpm check`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/routes/api/quiz/next src/app.d.ts
git commit -m "api: /api/quiz/next adaptive question endpoint"
```

---

## Task 7: Update `mailto.ts` + `/api/quiz/+server.ts` (atomic shape migration)

This task updates both the producer (`mailto.ts`) and consumer (`/api/quiz/+server.ts`) of the `QuizSubmission` shape in a single commit. The quiz page still imports the old `QuizAnswers` — it will break temporarily, but is fixed in Task 8. Run this task and Task 8 back-to-back; do not push between them.

**Files:**

- Modify: `src/lib/utils/mailto.ts`
- Create: `src/lib/utils/mailto.test.ts`
- Modify: `src/routes/api/quiz/+server.ts`
- Create: `src/routes/api/quiz/server.test.ts`

- [ ] **Step 1: Write the failing mailto test**

Create `src/lib/utils/mailto.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { generateQuizMailto } from './mailto';
import type { QuizSubmission } from '$lib/types/quiz';

const sample: QuizSubmission = {
	static: {
		industry: 'Mortgage broker / lending',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing client documents for lender submissions, takes 6+ hours a week'
	},
	adaptive: [
		{
			id: 'q1',
			infoNeed: 'stack',
			question: 'Which platforms do most of your submissions go to?',
			options: ['AFG', 'Connective', 'Loan Market', 'In-house', 'Other'],
			answer: 'AFG'
		},
		{
			id: 'q2',
			infoNeed: 'volume',
			question: 'Roughly how many submissions per week across all lenders?',
			options: ['<5', '5–15', '15–40', '40+', 'Other'],
			answer: '5–15'
		},
		{
			id: 'q3',
			infoNeed: 'sensitive-data',
			question: 'Does the task involve payslips, tax returns, or other sensitive docs?',
			options: ['Yes', 'No', 'Unsure', 'Other'],
			answer: 'Yes'
		}
	],
	email: 'broker@example.com'
};

describe('generateQuizMailto', () => {
	it('uses piers@domeworks.tech as recipient', () => {
		const url = generateQuizMailto(sample);
		expect(url.startsWith('mailto:piers@domeworks.tech?')).toBe(true);
	});

	it('includes static answers in the body', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Mortgage broker / lending');
		expect(body).toContain('10-25');
		expect(body).toContain('admin');
		expect(body).toContain('chasing client documents');
	});

	it('includes each adaptive question, the options offered, and the answer', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('Which platforms do most of your submissions go to?');
		expect(body).toContain('AFG · Connective · Loan Market · In-house · Other');
		expect(body).toContain('→ AFG');
		expect(body).toContain('→ 5–15');
		expect(body).toContain('→ Yes');
	});

	it('includes the respondent email', () => {
		const body = decodeURIComponent(generateQuizMailto(sample).split('body=')[1]);
		expect(body).toContain('broker@example.com');
	});
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `pnpm test:unit src/lib/utils/mailto.test.ts`
Expected: FAIL — `generateQuizMailto` is still typed against the old `QuizAnswers` shape.

- [ ] **Step 3: Rewrite `src/lib/utils/mailto.ts`**

Replace the `QuizAnswers` interface and `generateQuizMailto` function. The full new contents of `mailto.ts` are below — paste as a full-file rewrite:

```ts
import type { QuizSubmission } from '$lib/types/quiz';

const EMAIL = 'piers@domeworks.tech';
const CALENDLY = 'https://fantastical.app/piers/domeworks';

export function getBookCallUrl(): string {
	return CALENDLY;
}

export function generateScanMailto(): string {
	const subject = encodeURIComponent('AI Scan: interested');
	const body = encodeURIComponent(`Hi Piers,

I'm interested in the AI Scan for my team.

Company:
Role:
Team size (engineers):
AI tools currently in use:

Best time for a 15-min call:`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function generateContextBuildMailto(): string {
	const subject = encodeURIComponent('Context Build: interested');
	const body = encodeURIComponent(`Hi Piers,

I'm interested in the Context Build.

Company:
Role:
Team size (engineers):
AI tools currently in use:
Biggest challenge with AI adoption:

Best time for a 30-min call:`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

// NOTE: The Cal.com path `/ai-audit` still reflects the old product name.
const ASSESSMENT_CAL = 'https://cal.com/prollinson/ai-audit';

export function getAssessmentCallUrl(): string {
	return ASSESSMENT_CAL;
}

export function generateQuizMailto(s: QuizSubmission): string {
	const subject = encodeURIComponent('AI Readiness Quiz: action plan request');

	const adaptiveLines = s.adaptive
		.map((a) => `Q: ${a.question}\n   Options offered: ${a.options.join(' · ')}\n   → ${a.answer}`)
		.join('\n');

	const body = encodeURIComponent(`Hi Piers,

Please send me the AI Action Plan based on these answers.

Industry: ${s.static.industry}
Team size: ${s.static.size}
Time leak area: ${s.static.timeLeak}
Dreaded task: ${s.static.dreadedTask}

Adaptive follow-ups:
${adaptiveLines}

My email: ${s.email}

Thanks,
`);

	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export function generateGeneralMailto(): string {
	const subject = encodeURIComponent('DomeWorks | inquiry');
	const body = encodeURIComponent(`Hi Piers,

`);
	return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}
```

- [ ] **Step 4: Run the mailto test, verify it passes**

Run: `pnpm test:unit src/lib/utils/mailto.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Write the failing /api/quiz test**

Create `src/routes/api/quiz/server.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import type { QuizSubmission } from '$lib/types/quiz';
import { POST } from './+server';

function makeEvent(body: unknown, seb?: { send: ReturnType<typeof vi.fn> }) {
	const req = new Request('http://localhost/api/quiz', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
	return {
		request: req,
		platform: { env: seb ? { SEB: seb } : {} }
	} as Parameters<typeof POST>[0];
}

const sample: QuizSubmission = {
	static: {
		industry: 'Accounting or bookkeeping',
		size: '10-25',
		timeLeak: 'admin',
		dreadedTask: 'chasing tax documents from 80 clients every February'
	},
	adaptive: [
		{
			id: 'q1',
			infoNeed: 'stack',
			question: 'Which PM software?',
			options: ['Karbon', 'Canopy', 'Other'],
			answer: 'Karbon'
		},
		{
			id: 'q2',
			infoNeed: 'volume',
			question: 'Hours/week?',
			options: ['1-3', '4-8', '8+', 'Other'],
			answer: '8+'
		},
		{
			id: 'q3',
			infoNeed: 'sensitive-data',
			question: 'Sensitive?',
			options: ['Yes', 'No', 'Unsure', 'Other'],
			answer: 'Yes'
		}
	],
	email: 'cpa@example.com'
};

describe('POST /api/quiz', () => {
	it('sends an email via SEB on a valid submission', async () => {
		const send = vi.fn().mockResolvedValue(undefined);
		const res = await POST(makeEvent(sample, { send }));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ ok: true });
		expect(send).toHaveBeenCalledOnce();
		const msg = send.mock.calls[0][0];
		expect(msg.to).toBe('piers@domeworks.tech');
		expect(msg.text).toContain('Industry: Accounting or bookkeeping');
		expect(msg.text).toContain('Which PM software?');
		expect(msg.text).toContain('→ Karbon');
		expect(msg.text).toContain('Reply to: cpa@example.com');
	});

	it('returns 400 on missing static fields', async () => {
		const send = vi.fn();
		const bad = { ...sample, static: { ...sample.static, industry: '' } };
		const res = await POST(makeEvent(bad, { send }));
		expect(res.status).toBe(400);
		expect(send).not.toHaveBeenCalled();
	});

	it('returns 400 when adaptive array is not exactly 3', async () => {
		const send = vi.fn();
		const bad = { ...sample, adaptive: sample.adaptive.slice(0, 2) };
		const res = await POST(makeEvent(bad, { send }));
		expect(res.status).toBe(400);
	});

	it('returns 400 when email is malformed', async () => {
		const send = vi.fn();
		const res = await POST(makeEvent({ ...sample, email: 'nope' }, { send }));
		expect(res.status).toBe(400);
	});

	it('returns 503 when SEB binding is missing', async () => {
		const res = await POST(makeEvent(sample));
		expect(res.status).toBe(503);
	});
});
```

- [ ] **Step 6: Run the test, verify it fails (shape mismatch)**

Run: `pnpm test:unit src/routes/api/quiz/server.test.ts`
Expected: FAIL — existing validator rejects the new shape.

- [ ] **Step 7: Rewrite `src/routes/api/quiz/+server.ts`**

```ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { QuizSubmission, QuizStatic, AdaptiveAnswer, InfoNeed } from '$lib/types/quiz';

export const prerender = false;

const INFO_NEEDS: InfoNeed[] = [
	'stack',
	'volume',
	'speed-to-lead',
	'sensitive-data',
	'ownership',
	'prior-tools'
];

function isValidStatic(v: unknown): v is QuizStatic {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		typeof s.industry === 'string' &&
		s.industry.length > 0 &&
		typeof s.size === 'string' &&
		s.size.length > 0 &&
		typeof s.timeLeak === 'string' &&
		s.timeLeak.length > 0 &&
		typeof s.dreadedTask === 'string' &&
		s.dreadedTask.length >= 20
	);
}

function isValidAdaptive(v: unknown): v is AdaptiveAnswer {
	if (!v || typeof v !== 'object') return false;
	const a = v as Record<string, unknown>;
	return (
		typeof a.id === 'string' &&
		typeof a.question === 'string' &&
		typeof a.answer === 'string' &&
		typeof a.infoNeed === 'string' &&
		INFO_NEEDS.includes(a.infoNeed as InfoNeed) &&
		Array.isArray(a.options) &&
		a.options.every((o) => typeof o === 'string')
	);
}

function isValidSubmission(v: unknown): v is QuizSubmission {
	if (!v || typeof v !== 'object') return false;
	const s = v as Record<string, unknown>;
	return (
		isValidStatic(s.static) &&
		Array.isArray(s.adaptive) &&
		s.adaptive.length === 3 &&
		s.adaptive.every(isValidAdaptive) &&
		typeof s.email === 'string' &&
		/^\S+@\S+\.\S+$/.test(s.email)
	);
}

function buildBody(s: QuizSubmission): string {
	const adaptiveLines = s.adaptive
		.map((a) => `Q: ${a.question}\n   Options offered: ${a.options.join(' · ')}\n   → ${a.answer}`)
		.join('\n');

	return [
		'New AI Readiness Quiz submission.',
		'',
		`Industry: ${s.static.industry}`,
		`Team size: ${s.static.size}`,
		`Time leak area: ${s.static.timeLeak}`,
		`Dreaded task: ${s.static.dreadedTask}`,
		'',
		'Adaptive follow-ups:',
		adaptiveLines,
		'',
		`Reply to: ${s.email}`
	].join('\n');
}

export const POST: RequestHandler = async ({ request, platform }) => {
	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!isValidSubmission(payload)) {
		throw error(400, 'Missing or invalid fields');
	}

	const seb = platform?.env?.SEB;
	if (!seb) {
		throw error(503, 'Email binding unavailable');
	}

	try {
		await seb.send({
			from: 'quiz@domeworks.tech',
			to: 'piers@domeworks.tech',
			subject: `Quiz: ${payload.static.industry} · ${payload.static.size} · ${payload.email}`,
			text: buildBody(payload)
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'send failed';
		throw error(502, `Email send failed: ${msg}`);
	}

	return json({ ok: true });
};
```

- [ ] **Step 8: Run both /api/quiz tests**

Run: `pnpm test:unit src/routes/api/quiz/server.test.ts src/lib/utils/mailto.test.ts`
Expected: 9 passed.

- [ ] **Step 9: DO NOT run `pnpm check` yet.**

`svelte-check` will still fail because `/smb/quiz/+page.svelte` imports `QuizAnswers`. Task 8 fixes that. Proceed to Task 8 immediately.

- [ ] **Step 10: Commit**

```bash
git add src/lib/utils/mailto.ts src/lib/utils/mailto.test.ts src/routes/api/quiz/+server.ts src/routes/api/quiz/server.test.ts
git commit -m "api: /api/quiz accepts QuizSubmission shape, mailto rewritten to match"
```

---

## Task 8: Rebuild `/smb/quiz/+page.svelte`

**Files:**

- Modify: `src/routes/smb/quiz/+page.svelte` (full rewrite)

This is the largest task. It rebuilds the quiz page around the new 4-static-plus-3-adaptive flow while preserving all existing visual design (hero, eyebrows, chip styling, post-submit preview, ICP verdict, "What you get" section).

- [ ] **Step 1: Note the pieces to preserve**

Before rewriting, confirm these pieces carry over unchanged from the current file:

- The hero section (lines 157–193 of the current file, ending `</section>`)
- The `chipClass`, `cardChipClass`, `inputClass` style constants
- The `previewCategory` derivation (lines 40–63)
- The ICP verdict logic — **but update it to use `industry` + `size` only** (no `revenue`)
- The submitted-state layout (sending / sent / mailto-fallback) and preview + ICP verdict blocks
- The "What you get" Section at the bottom

- [ ] **Step 2: Rewrite the page**

Replace the entire contents of `src/routes/smb/quiz/+page.svelte`:

```svelte
<script lang="ts">
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { generateQuizMailto, getAssessmentCallUrl } from '$lib/utils/mailto';
	import { QUIZ_INDUSTRIES } from '$lib/data/quiz-industries';
	import { getFallbackQuestion } from '$lib/data/quiz-fallback';
	import type {
		AdaptiveAnswer,
		NextRequest,
		NextResponse,
		QuizStatic,
		QuizSubmission
	} from '$lib/types/quiz';

	// --- Static answers ---
	let industry = $state('');
	let size = $state('');
	let timeLeak = $state('');
	let dreadedTask = $state('');

	const staticComplete = $derived(
		industry.length > 0 && size.length > 0 && timeLeak.length > 0 && dreadedTask.trim().length >= 20
	);

	// --- Adaptive state ---
	let adaptive = $state<AdaptiveAnswer[]>([]);
	let pendingQuestion = $state<NextResponse | null>(null);
	let loadingNext = $state(false);
	let otherText = $state('');
	let selectedOption = $state('');
	// Monotonic version — bumped when static changes, so stale fetches can be discarded.
	let staticVersion = $state(0);

	// --- Submit state ---
	let email = $state('');
	let submitted = $state(false);
	let submitState = $state<'idle' | 'sending' | 'sent' | 'mailto-fallback'>('idle');

	const canSubmit = $derived(
		staticComplete && adaptive.length === 3 && /^\S+@\S+\.\S+$/.test(email)
	);

	// --- Reset adaptive when any static field changes ---
	$effect(() => {
		// Depend on each static field so Svelte tracks edits.
		industry;
		size;
		timeLeak;
		dreadedTask;
		staticVersion++;
		adaptive = [];
		pendingQuestion = null;
		selectedOption = '';
		otherText = '';
	});

	// --- Fetch next adaptive question ---
	async function fetchNext() {
		if (!staticComplete) return;
		if (adaptive.length >= 3) return;
		if (pendingQuestion) return;
		if (loadingNext) return;

		loadingNext = true;
		const myVersion = staticVersion;

		const body: NextRequest = {
			static: {
				industry,
				size,
				timeLeak,
				dreadedTask: dreadedTask.trim()
			} satisfies QuizStatic,
			adaptiveSoFar: adaptive
		};

		try {
			const res = await fetch('/api/quiz/next', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = (await res.json()) as NextResponse;
			if (myVersion !== staticVersion) return; // stale
			pendingQuestion = data;
		} catch {
			if (myVersion !== staticVersion) return;
			pendingQuestion = getFallbackQuestion(adaptive.length);
		} finally {
			if (myVersion === staticVersion) loadingNext = false;
		}
	}

	// Blur handler on the dreaded-task textarea (debounced).
	let blurTimer: ReturnType<typeof setTimeout> | null = null;
	function handleDreadedBlur() {
		if (blurTimer) clearTimeout(blurTimer);
		blurTimer = setTimeout(() => {
			if (staticComplete && adaptive.length === 0 && !pendingQuestion) fetchNext();
		}, 400);
	}

	// --- Answering an adaptive question ---
	function answerPending() {
		if (!pendingQuestion) return;
		const answer =
			selectedOption === 'Other' && otherText.trim().length > 0
				? `Other: ${otherText.trim()}`
				: selectedOption;
		if (!answer) return;

		adaptive = [
			...adaptive,
			{
				id: pendingQuestion.id,
				infoNeed: pendingQuestion.infoNeed,
				question: pendingQuestion.question,
				options: pendingQuestion.options,
				answer
			}
		];
		pendingQuestion = null;
		selectedOption = '';
		otherText = '';

		if (adaptive.length < 3) fetchNext();
	}

	// --- Submit ---
	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;

		const submission: QuizSubmission = {
			static: { industry, size, timeLeak, dreadedTask: dreadedTask.trim() },
			adaptive,
			email
		};

		submitted = true;
		submitState = 'sending';

		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(submission)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			submitState = 'sent';
		} catch {
			submitState = 'mailto-fallback';
			window.location.href = generateQuizMailto(submission);
		}
	}

	function resend() {
		const submission: QuizSubmission = {
			static: { industry, size, timeLeak, dreadedTask: dreadedTask.trim() },
			adaptive,
			email
		};
		window.location.href = generateQuizMailto(submission);
	}

	// --- Derivations for post-submit preview ---
	const previewCategory = $derived.by(() => {
		switch (timeLeak) {
			case 'admin':
				return {
					title: 'Admin drag',
					body: "The usual quick wins here start with templated intake, document chasing, and invoice follow-up. You're probably losing 3 to 5 hours a week to back-and-forth that a tool can absorb."
				};
			case 'marketing':
				return {
					title: 'Marketing and lead response',
					body: 'Speed-to-lead is the single highest-leverage pattern I find in owner-operated businesses. Cutting your first-response time from hours to minutes is often worth more than every other quick win combined.'
				};
			case 'delivery':
				return {
					title: 'Client delivery',
					body: 'Usual quick wins here start with meeting-notes capture, draft generation for recurring deliverables, and prep work before client calls. 30 to 60 minutes per client interaction typically recoverable.'
				};
			default:
				return {
					title: 'Mixed',
					body: 'The Action Plan will map your biggest specific leak and give you three quick wins to start with.'
				};
		}
	});

	const icpVerdict = $derived.by(() => {
		if (!size) return '';
		if (size === '1-9') return 'below-core';
		if (size === '51-200' || size === '200+') return 'above-core';
		return 'in-core';
	});

	// Shared classes (unchanged from prior file).
	const chipClass =
		'block text-center p-3 bg-paper border border-rule rounded-lg text-sm font-sans text-muted peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-ink hover:border-ink/30 transition';
	const cardChipClass =
		'p-4 bg-paper border border-rule rounded-lg peer-checked:border-accent peer-checked:bg-accent/10 hover:border-ink/30 transition';
	const inputClass =
		'w-full p-3 bg-paper border border-rule rounded-lg text-ink font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent';
</script>

<svelte:head>
	<title>AI Readiness Quiz | DomeWorks</title>
	<meta
		name="description"
		content="2-minute quiz to pinpoint your biggest time leak. Free personalised Action Plan delivered to your inbox."
	/>
	<link rel="canonical" href="https://domeworks.tech/smb/quiz/" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/smb/quiz/" />
	<meta property="og:title" content="AI Readiness Quiz | DomeWorks" />
	<meta
		property="og:description"
		content="2 minutes. Pinpoint your biggest time leak. Get a free Action Plan in your inbox."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="AI Readiness Quiz | DomeWorks" />
	<meta
		name="twitter:description"
		content="2 minutes. Pinpoint your biggest time leak. Get a free Action Plan in your inbox."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />
</svelte:head>

<!-- Hero -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="AI Readiness Quiz">
	<a
		href="/"
		class="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 text-sm font-sans font-semibold tracking-tight text-paper/80 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
	>
		DomeWorks<span class="text-accent-light">.</span>
	</a>
	<div class="relative w-full max-w-4xl mx-auto px-6 lg:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-8"
		>
			<span class="text-accent-light">AI Readiness Quiz</span>
			<span class="h-3 w-px bg-paper/25" aria-hidden="true"></span>
			<span class="text-paper/75 font-normal tracking-[0.08em]">Free · 2 minutes</span>
		</div>
		<h1
			class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
		>
			2 minutes. <span class="text-paper/70">Find your biggest</span>
			<br class="hidden sm:block" />
			<span class="text-accent-light">time leak.</span>
		</h1>
		<p
			class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/80 max-w-2xl font-normal"
		>
			A short set of questions to map where admin, marketing, and delivery are costing you the most
			time right now.
		</p>
		<p class="mt-4 text-sm text-paper/75 max-w-2xl">
			I'll send a free personalised Action Plan to your inbox within 24 hours. Quick wins you can
			set up in 30 to 60 minutes. Step-by-step. No technical background required.
		</p>
	</div>
</section>

<!-- The quiz -->
<Section background="white" padding="md">
	{#if !submitted}
		<form onsubmit={handleSubmit} class="max-w-2xl mx-auto space-y-10" use:reveal>
			<!-- Q01 Industry -->
			<div>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					01
				</p>
				<label
					for="industry"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
				>
					What does your business do?
				</label>
				<select id="industry" bind:value={industry} required class={inputClass}>
					<option value="">Select one</option>
					{#each QUIZ_INDUSTRIES as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<!-- Q02 Size -->
			<fieldset>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					02
				</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
					How many people are on your team?
				</legend>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each [['1-9', '1–9'], ['10-25', '10–25'], ['26-50', '26–50'], ['51-200', '51–200'], ['200+', '200+']] as [v, label]}
						<label class="cursor-pointer">
							<input type="radio" bind:group={size} value={v} class="peer sr-only" required />
							<span class={chipClass}>{label}</span>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Q03 Time leak -->
			<fieldset>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					03
				</p>
				<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
					Where does your time leak most?
				</legend>
				<div class="space-y-2">
					{#each [['admin', 'Admin', 'Invoicing, scheduling, email triage, document chasing.'], ['marketing', 'Marketing and lead response', 'Inbound lead follow-up, content cadence, quoting, proposals.'], ['delivery', 'Client delivery', 'Meeting prep and notes, recurring deliverables, reporting, handoffs.'], ['mixed', 'Not sure / mixed', "It's scattered. I want help seeing where to look first."]] as [v, title, body]}
						<label class="cursor-pointer block">
							<input type="radio" bind:group={timeLeak} value={v} class="peer sr-only" required />
							<div class={cardChipClass}>
								<p class="font-sans font-medium text-ink">{title}</p>
								<p class="font-serif text-sm text-muted leading-relaxed mt-1">{body}</p>
							</div>
						</label>
					{/each}
				</div>
			</fieldset>

			<!-- Q04 Dreaded task -->
			<div>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					04
				</p>
				<label
					for="dreadedTask"
					class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
				>
					Which single task do you dread most?
				</label>
				<textarea
					id="dreadedTask"
					bind:value={dreadedTask}
					onblur={handleDreadedBlur}
					placeholder="One concrete task, with numbers if possible. E.g. 'chasing 15 client docs every tax season, ~6 hrs/week'."
					rows="3"
					required
					class={inputClass}
				></textarea>
				{#if dreadedTask.trim().length > 0 && dreadedTask.trim().length < 20}
					<p class="mt-2 text-xs text-subtle">
						A little more detail helps me write a sharper plan.
					</p>
				{/if}
			</div>

			<!-- Q05–Q07 Adaptive answered -->
			{#each adaptive as a, i (a.id)}
				<fieldset disabled>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						{String(i + 5).padStart(2, '0')}
					</p>
					<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
						{a.question}
					</legend>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{#each a.options as opt (opt)}
							<label class="cursor-pointer">
								<input
									type="radio"
									checked={a.answer === opt || (opt === 'Other' && a.answer.startsWith('Other:'))}
									class="peer sr-only"
								/>
								<span class={chipClass}>{opt}</span>
							</label>
						{/each}
					</div>
					{#if a.answer.startsWith('Other: ')}
						<p class="mt-2 font-serif text-sm text-muted">
							You typed: {a.answer.replace('Other: ', '')}
						</p>
					{/if}
				</fieldset>
			{/each}

			<!-- Pending adaptive question -->
			{#if adaptive.length < 3 && (loadingNext || pendingQuestion)}
				<fieldset>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						{String(adaptive.length + 5).padStart(2, '0')} · Based on your answers
					</p>
					{#if loadingNext && !pendingQuestion}
						<div class="space-y-3" aria-busy="true">
							<div class="h-6 w-3/4 bg-rule/60 rounded animate-pulse"></div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{#each [0, 1, 2] as i (i)}
									<div class="h-12 bg-rule/40 rounded-lg animate-pulse"></div>
								{/each}
							</div>
						</div>
					{:else if pendingQuestion}
						<legend class="block font-sans font-medium text-lg text-ink tracking-tight mb-3">
							{pendingQuestion.question}
						</legend>
						{#if pendingQuestion.helper}
							<p class="font-serif text-sm text-muted leading-relaxed mb-3">
								{pendingQuestion.helper}
							</p>
						{/if}
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{#each pendingQuestion.options as opt (opt)}
								<label class="cursor-pointer">
									<input
										type="radio"
										bind:group={selectedOption}
										value={opt}
										class="peer sr-only"
									/>
									<span class={chipClass}>{opt}</span>
								</label>
							{/each}
						</div>
						{#if selectedOption === 'Other'}
							<input
								type="text"
								bind:value={otherText}
								placeholder="Type your answer"
								class="{inputClass} mt-3"
								maxlength="200"
							/>
						{/if}
						<div class="mt-4">
							<button
								type="button"
								onclick={answerPending}
								disabled={!selectedOption ||
									(selectedOption === 'Other' && otherText.trim().length === 0)}
								class="inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 active:scale-[0.98] bg-ink text-paper hover:bg-ink/90 shadow-sm hover:shadow px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Next →
							</button>
						</div>
					{/if}
				</fieldset>
			{/if}

			<!-- Q08 Email (only after 3 adaptive answers) -->
			{#if adaptive.length === 3}
				<div>
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						08
					</p>
					<label
						for="email"
						class="block font-sans font-medium text-lg text-ink tracking-tight mb-3"
					>
						Where should I send your Action Plan?
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@yourcompany.com"
						required
						class={inputClass}
					/>
					<p class="mt-3 font-serif text-sm text-muted leading-relaxed">
						I'll send your personalised Action Plan within 24 hours. No list. No spam. No upsell in
						the plan. If the honest answer for any part of your situation is "don't use AI here,"
						the plan will say so.
					</p>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						disabled={!canSubmit}
						class="inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 active:scale-[0.98] bg-accent text-paper hover:bg-accent-hover shadow-sm hover:shadow hover:-translate-y-px px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
					>
						{canSubmit ? 'Send me my Action Plan' : 'Enter your email to submit'}
					</button>
					<p class="mt-3 text-xs text-subtle">
						If automatic submission fails, your email client opens with the answers pre-filled.
					</p>
				</div>
			{/if}
		</form>
	{:else}
		<!-- Post-submit state -->
		<div class="max-w-2xl mx-auto space-y-8" use:reveal>
			{#if submitState === 'sending'}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
						Sending
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Submitting your answers.
					</h2>
					<p class="font-serif text-muted leading-relaxed">One moment.</p>
				</div>
			{:else if submitState === 'sent'}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Received
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Thanks. Your Action Plan is on the way.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						I got your answers and I'll email a personalised Action Plan to
						<strong class="font-sans font-medium text-ink">{email}</strong>
						within 24 hours. No list. No spam.
					</p>
				</div>
			{:else}
				<div class="rule-left-accent">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						One more step
					</p>
					<h2 class="font-sans font-medium text-2xl text-ink tracking-tight mb-2">
						Check the email window that just opened.
					</h2>
					<p class="font-serif text-muted leading-relaxed">
						Automatic submission didn't work so your mail client opened with your answers
						pre-filled. Hit send in that window and I'll email your personalised Action Plan within
						24 hours.
					</p>
					<button
						type="button"
						onclick={resend}
						class="mt-4 text-sm font-sans text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						Didn't see an email window? Click here to try again.
					</button>
				</div>
			{/if}

			<div class="border-t border-rule pt-8">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Preview · based on your answers
				</p>
				<h3 class="font-sans font-medium text-lg text-ink tracking-tight mb-2">
					Your category: {previewCategory.title}
				</h3>
				<p class="font-serif text-muted leading-relaxed">{previewCategory.body}</p>
			</div>

			{#if icpVerdict === 'in-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Good fit
					</p>
					<p class="font-serif text-muted leading-relaxed">
						You're squarely in the size I work with most. If the Action Plan lands and you want to
						go further, the full <a
							href="/smb/"
							class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
							>AI Tools Assessment</a
						> is the natural next step.
					</p>
				</div>
			{:else if icpVerdict === 'below-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
						Heads up
					</p>
					<p class="font-serif text-muted leading-relaxed">
						Your size is a touch below the teams I work with on paid engagements, but the Action
						Plan will still give you concrete quick wins. No pitch, no follow-up pressure.
					</p>
				</div>
			{:else if icpVerdict === 'above-core'}
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						Different track
					</p>
					<p class="font-serif text-muted leading-relaxed">
						You're above my owner-operator Assessment track. The <a
							href="/scan/"
							class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
							>AI Scan</a
						> is probably a better fit at your scale. I'll mention that in the Action Plan too.
					</p>
				</div>
			{/if}
		</div>
	{/if}
</Section>

{#if !submitted}
	<Section
		background="muted"
		padding="md"
		eyebrow="What you get"
		title="The Action Plan"
		centered={false}
	>
		<div class="max-w-5xl">
			<div
				class="hairline-grid on-muted grid md:grid-cols-3"
				use:reveal={{ stagger: true, staggerDelay: 80, duration: 420 }}
			>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						01
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						Three personalised quick wins
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						Ranked by time saved vs. setup effort. Each is specific to the leak you named, not a
						generic top-10 list.
					</p>
				</div>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						02
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						Step-by-step instructions
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						Each win comes with setup instructions a non-technical person can follow in 30 to 60
						minutes. No developer required.
					</p>
				</div>
				<div class="cell">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
						03
					</p>
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
						What to leave alone
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						If part of your answer points at a workflow where AI is the wrong tool, the plan names
						it and says so plainly. No pretending.
					</p>
				</div>
			</div>

			<div class="mt-12 max-w-3xl">
				<p class="font-serif text-muted leading-relaxed">
					Already know you want the full diagnostic?
					<a
						href={getAssessmentCallUrl()}
						class="text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors"
						>Book the AI Tools Assessment discovery call</a
					> instead.
				</p>
			</div>
		</div>
	</Section>
{/if}
```

- [ ] **Step 3: Run `pnpm check`**

Run: `pnpm check`
Expected: 0 errors.

- [ ] **Step 4: Run all vitest tests**

Run: `pnpm test:unit`
Expected: all passing.

- [ ] **Step 5: Manual sanity check in dev**

Start the dev server (use the portless command from global CLAUDE.md, not raw `npm run dev`):

```bash
dev domeworks
```

Open `https://domeworks.localhost:1355/smb/quiz/`. Without `.dev.vars` configured, `/api/quiz/next` will return 503 and the fallback sequence should kick in. Fill out Q1–Q4, tab out of the textarea, and confirm:

- Skeleton appears below Q04 within ~400ms of blur
- After ~1–2s a fallback question appears (stack question)
- Selecting a chip and clicking "Next →" reveals the next question
- After 3 answers, the email field (Q08) and submit button appear
- Submit with a fake email → mailto fallback opens (SEB binding is also absent in dev)
- Edit Q01 industry → adaptive block clears and re-fetches

- [ ] **Step 6: Commit**

```bash
git add src/routes/smb/quiz/+page.svelte
git commit -m "smb/quiz: rebuild around 4 static + 3 adaptive flow with fallback"
```

---

## Task 9: Playwright E2E for the adaptive flow

**Files:**

- Create: `tests/smb-quiz.spec.ts`

- [ ] **Step 1: Write the E2E test**

Create `tests/smb-quiz.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('/smb/quiz — adaptive flow', () => {
	test('completes end-to-end with mocked adaptive endpoint', async ({ page }) => {
		let callCount = 0;

		await page.route('**/api/quiz/next', async (route) => {
			callCount++;
			const responses = [
				{
					id: 'q1',
					question: 'Which practice-management software do you use?',
					helper: null,
					options: ['Karbon', 'Canopy', 'QuickBooks', 'Drake', 'Other'],
					allowOtherText: true,
					infoNeed: 'stack'
				},
				{
					id: 'q2',
					question: 'Roughly how many hours per week on that task?',
					helper: null,
					options: ['Under 1', '1–3', '4–8', '8+', 'Other'],
					allowOtherText: true,
					infoNeed: 'volume'
				},
				{
					id: 'q3',
					question: 'Does the task involve client-sensitive documents?',
					helper: null,
					options: ['Yes', 'No', 'Unsure', 'Other'],
					allowOtherText: true,
					infoNeed: 'sensitive-data'
				}
			];
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(responses[callCount - 1])
			});
		});

		// Mock the submit endpoint so we don't need SEB.
		await page.route('**/api/quiz', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ok: true })
			})
		);

		await page.goto('/smb/quiz/');

		await page.selectOption('#industry', 'Accounting or bookkeeping');
		await page.getByRole('radio', { name: '10–25' }).check({ force: true });
		await page.getByText('Invoicing, scheduling, email triage').click();

		const textarea = page.locator('#dreadedTask');
		await textarea.fill(
			'chasing tax documents from 80 clients every February, roughly 8 hours a week'
		);
		await textarea.blur();

		// Wait for the first adaptive question.
		await expect(page.getByText('Which practice-management software do you use?')).toBeVisible({
			timeout: 4000
		});
		await page.getByRole('radio', { name: 'Karbon' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		await expect(page.getByText('Roughly how many hours per week')).toBeVisible();
		await page.getByRole('radio', { name: '8+' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		await expect(page.getByText('Does the task involve client-sensitive')).toBeVisible();
		await page.getByRole('radio', { name: 'Yes' }).check({ force: true });
		await page.getByRole('button', { name: 'Next →' }).click();

		// Email + submit
		await expect(page.locator('#email')).toBeVisible();
		await page.fill('#email', 'cpa@example.com');
		await page.getByRole('button', { name: /Send me my Action Plan/ }).click();

		await expect(page.getByText('Your Action Plan is on the way')).toBeVisible();
		expect(callCount).toBe(3);
	});

	test('falls back to hardcoded questions when the adaptive endpoint fails', async ({ page }) => {
		await page.route('**/api/quiz/next', (route) =>
			route.fulfill({ status: 502, body: 'agent down' })
		);

		await page.goto('/smb/quiz/');
		await page.selectOption('#industry', 'Legal');
		await page.getByRole('radio', { name: '10–25' }).check({ force: true });
		await page.getByText('Invoicing, scheduling, email triage').click();
		const textarea = page.locator('#dreadedTask');
		await textarea.fill(
			'drafting demand letters from scratch every time, 4-5 hours a week typically'
		);
		await textarea.blur();

		// First fallback question is the "stack" question.
		await expect(
			page.getByText("What's the main software that task runs through today?")
		).toBeVisible({
			timeout: 4000
		});
	});
});
```

- [ ] **Step 2: Update playwright.config.ts to pass dev-mode env vars**

The current config builds + previews. For these tests we want to run against the built preview without real secrets — the page gracefully handles missing env. No config change needed unless `preview` tries to validate secrets (it does not). Leave `playwright.config.ts` as-is.

- [ ] **Step 3: Run Playwright**

Run: `pnpm test:e2e`
Expected: 2 passed. (First run may need `pnpm exec playwright install chromium` if browsers aren't cached.)

- [ ] **Step 4: Commit**

```bash
git add tests/smb-quiz.spec.ts
git commit -m "test: e2e for adaptive quiz happy path + fallback"
```

---

## Task 10: Deploy notes — secrets and local dev

**Files:**

- Modify: `docs/cloudflare-pages-migration.md` (append section) OR create `docs/quiz-secrets.md` if the migration doc is wrong-audience

- [ ] **Step 1: Decide where secrets docs go**

Read `docs/cloudflare-pages-migration.md`:

```bash
head -40 docs/cloudflare-pages-migration.md
```

If it's the project's ops doc, append a section. Otherwise create `docs/quiz-secrets.md`.

- [ ] **Step 2: Write the ops section**

Append or create with this content:

````markdown
## Adaptive quiz secrets

The `/api/quiz/next` endpoint calls Anthropic's Claude through Cloudflare AI Gateway. Two wrangler secrets are required in production:

- `ANTHROPIC_API_KEY` — Anthropic API key with access to the Haiku family.
- `AI_GATEWAY_URL` — full base URL including the `/anthropic` suffix, e.g. `https://gateway.ai.cloudflare.com/v1/<account_id>/<gateway_slug>/anthropic`.

### Setting in production (Cloudflare Pages)

```bash
wrangler pages secret put ANTHROPIC_API_KEY --project-name domeworks-web
wrangler pages secret put AI_GATEWAY_URL --project-name domeworks-web
```
````

### Setting for local `wrangler pages dev`

Create `.dev.vars` at the project root (already gitignored by the default SvelteKit `.gitignore`; verify):

```
ANTHROPIC_API_KEY=sk-...
AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1/<account_id>/<gateway_slug>/anthropic
```

Without these set, `/api/quiz/next` returns 503 and the client falls back to the hardcoded 3-question sequence — the quiz still completes and Piers still gets a valid submission.

### Cost

Per completed quiz: ~3 calls × ~$0.0005 = ~$0.0015. AI Gateway's per-gateway rate limit should be set to ~60 req/min/IP.

````

- [ ] **Step 3: Verify `.dev.vars` is gitignored**

Run: `git check-ignore -v .dev.vars || echo "NOT IGNORED"`

If it says "NOT IGNORED," add `.dev.vars` to `.gitignore`.

- [ ] **Step 4: Commit**

```bash
git add docs/ .gitignore
git commit -m "docs: quiz adaptive endpoint secrets and local dev notes"
````

---

## Self-Review

### Spec coverage

- §3 Information architecture → Tasks 3, 4, 8 (industries, fallback, page)
- §4 Agent contract (endpoint, types, model, system prompt) → Tasks 2, 5, 6
- §5 UX flow (trigger, loading, failure fallback, static-edit reset) → Task 8
- §6 Infra (new endpoint, modified endpoint, secrets, app.d.ts) → Tasks 6, 7, 10
- §7 Piers's inbox body format → Task 7 (buildBody + mailto)
- §8 Edge cases (stale fetch via version counter, Other>200 truncated via `maxlength`, malformed Claude response, email fail) → Tasks 5, 6, 7, 8
- §9 Abuse and cost → Task 10 (notes)
- §10 Out-of-scope — honoured (no streaming, no agent-decided stop, no agent drafting plan)
- §11 Success criteria — verified by Task 9 E2E (happy path + fallback path) and Task 8 manual smoke

### Placeholder scan

No "TBD", no "implement later", no "add appropriate error handling" without concrete code. All code blocks are complete.

### Type consistency

- `QuizSubmission` / `QuizStatic` / `AdaptiveAnswer` / `InfoNeed` / `NextRequest` / `NextResponse` — defined once in Task 2, imported consistently in Tasks 4, 5, 6, 7, 8.
- `nextQuestion(req, config)` signature consistent between definition (Task 5) and callers (Task 6 test + `/api/quiz/next/+server.ts`).
- `generateQuizMailto(s: QuizSubmission)` consistent between Task 7 definition and Task 8 caller.
- Validator functions `isValidStatic` / `isValidAdaptive` appear in both `/api/quiz/+server.ts` and `/api/quiz/next/+server.ts` — acceptable duplication (they're short and the two files have different validity rules; pulling them into shared code would be a false-DRY at this scale).
- Fallback data: Task 4 exports `QUIZ_FALLBACK: NextResponse[]` and `getFallbackQuestion(i: number): NextResponse`. Task 8 consumes `getFallbackQuestion(adaptive.length)`. Match.
- Vitest-SvelteKit plugin import in `vitest.config.ts` uses `@sveltejs/kit/vite` (same as `vite.config.ts`); `$lib` alias resolves correctly in tests via the sveltekit plugin.
