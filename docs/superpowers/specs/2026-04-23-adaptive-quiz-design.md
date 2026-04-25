# Adaptive Quiz — Design Spec

**Status:** Approved, ready for implementation planning
**Date:** 2026-04-23
**Scope:** `/smb/quiz/` — convert the static 8-question form into a hybrid static-plus-agent-adaptive flow that captures the signal Piers actually needs to hand-write the Action Plan.

---

## 1. Problem

The current quiz collects eight static answers (industry, size, revenue, role, time-leak bucket, dreaded task, AI usage, email). Against the Action Plan's promise — "three personalised quick wins, ranked by time saved vs setup effort, specific to your leak, with setup steps a non-technical person can follow in 30–60 minutes" — this leaves several gaps:

- **No tool stack.** Recommendations can't name specific tools (Karbon vs. Canopy; HubSpot vs. Follow Up Boss) and stay stack-specific.
- **No quantification.** Without hours-per-week or volume numbers, wins can't be ranked by time saved or converted to the dollar math the Assessment page leads with.
- **No speed-to-lead signal.** The "#1 pattern" on the Assessment page is never probed.
- **No sensitive-data signal.** Legal, medical, accounting, mortgage all represented; compliance-unsafe recommendations are possible.
- **No ownership signal.** A 30-minute win the owner stops doing is worth ~10× the same win on a $20/hr admin's plate.

Three static questions (role, revenue, AI-usage bucket) are also doing limited work.

## 2. Goal

Replace those limitations with a **hybrid** flow: four static seed questions followed by three adaptive agent-authored follow-ups, then email. Same ~2-minute budget; dramatically more signal. The agent's job is pure signal-extraction for Piers; it does **not** draft the Action Plan. Piers continues to write every plan by hand.

## 3. Information architecture

**Five static seeds (tap-through, identical styling to today):**

1. Industry — dropdown, extended with `insurance` and `mortgage` (both already have vertical patterns in `AssessmentPage.svelte` but are missing from the current quiz dropdown)
2. Team size — chip row
3. Where time leaks most — chip row, keeping the "mixed" option but treating it as a cue for the agent to probe harder
4. The dreaded task — textarea, validation tightened to `≥ 20 chars`; placeholder rewritten to demand one concrete task + numbers where possible
5. Process health — card-chip row (`healthy` / `broken` / `unsure`), slotted after the dreaded task. Captures whether the dreaded task is inside a broken process. This is the signal that drives Piers's "fix the process first" warning in the Action Plan.

**Dropped from today's quiz:**

- Revenue — ICP verdict can be computed from industry + team size alone
- Role — wasn't feeding plan content
- AI usage (3 buckets) — folded into the agent, which can ask far better stack-specific questions

**Three adaptive follow-ups (agent-authored, always exactly three):**

The agent picks three from a menu of six information needs:

| Need             | When it matters most                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `stack`          | Always high-value; drives every specific recommendation                                                             |
| `volume`         | Always high-value; unlocks the math                                                                                 |
| `speed-to-lead`  | Industry or time-leak implies inbound dependence (trades, real-estate, agency, insurance, or `marketing` time-leak) |
| `sensitive-data` | Industry is legal, medical, accounting, mortgage, insurance                                                         |
| `ownership`      | Team size ≥ 10 (otherwise owner is obviously doing it)                                                              |
| `prior-tools`    | `dreadedTask` mentions AI-adjacent terms or respondent seems sophisticated                                          |

The agent ranks these for the specific respondent and returns the top three, one per turn.

**Final step:** email, then submit (unchanged flow).

**Net interaction count:** 5 static + 3 adaptive + 1 email = **9 moments**, still under 3 minutes.

## 4. Agent contract

### Endpoint

`POST /api/quiz/next` — new SvelteKit endpoint, `prerender = false`, runs on Cloudflare Pages Functions.

### Request

```ts
interface NextRequest {
	static: {
		industry: string;
		size: string;
		timeLeak: string;
		dreadedTask: string;
	};
	adaptiveSoFar: Array<{
		id: string; // "q1" | "q2"
		infoNeed: InfoNeed;
		question: string;
		options: string[];
		answer: string; // chosen chip label or "Other: <typed>"
	}>;
}
```

### Response

```ts
interface NextResponse {
	id: string; // "q1" | "q2" | "q3"
	question: string; // one sentence, DomeWorks voice
	helper: string | null; // optional ≤140-char clarifier
	options: string[]; // 3–5 chips + "Other" as last entry
	allowOtherText: true;
	infoNeed: InfoNeed;
}

type InfoNeed =
	| 'stack'
	| 'volume'
	| 'speed-to-lead'
	| 'sensitive-data'
	| 'ownership'
	| 'prior-tools';
```

Stop condition is **client-side fixed at 3**: after the user answers the third adaptive question the client doesn't POST again — it just reveals the email field. The server never needs to signal "done." Keeps the contract boring.

### Model & gateway

- Provider: Anthropic, via Cloudflare AI Gateway.
- SDK: `@anthropic-ai/sdk` with `baseURL` pointed at the gateway.
- Model: `claude-haiku-4-5-20251001`.
- `max_tokens: 400`, `temperature: 0.3`.
- JSON output enforced via tool-use (single tool, `emit_question`, schema matches `NextResponse` minus the `done` case; the server handles the `done` case itself based on `adaptiveSoFar.length`).
- Expected cost per completed quiz: ~$0.0015 (3 calls × ~$0.0005). AI Gateway handles caching, analytics, and per-gateway rate limits.

### System prompt (shape, not final text)

Includes:

- Piers's positioning — don't recommend automating human-judgement work, broken processes, low-volume tasks, or cold outbound.
- Voice — direct, no AI fluff, declarative sentences.
- The six information needs, with guidance on when each is highest-value.
- Vertical-specific option hints (mortgage → AFG / Connective / Loan Market / in-house; accounting → Karbon / Canopy / QuickBooks / Drake; trades → ServiceTitan / Jobber / Housecall Pro; etc.).
- "Always include `Other — type it` as the last option."
- "Never reveal that an AI is generating these questions."

## 5. UX flow

- **Static Q1–Q4:** unchanged scroll-through form; same chip styles; same `reveal` action.
- **Trigger for first adaptive call:** the dreaded-task textarea fires `/api/quiz/next` on blur once it contains ≥ 20 chars (debounced 400ms so edits don't double-fire). The request carries the full static block and an empty `adaptiveSoFar`. A skeleton chip-row with eyebrow `05 · Based on your answers…` and a pulsing 3-chip placeholder fades in below, and the page auto-scrolls it into view.
- **~1–2s later** the real question + chips fade in (existing `reveal` transition).
- **User taps a chip** (or `Other → type`): answer is locked with the same styling as answered static questions. Browser POSTs again with `adaptiveSoFar` of length 1. Next skeleton appears. Continues for three turns.
- **After the user answers Q07** (the third adaptive answer): no further `/api/quiz/next` call fires; the email field (`Q08`) and submit button fade in.
- **Submission:** existing `/api/quiz` POST flow preserved, including mailto fallback. The payload shape changes (see §6).
- **Post-submit preview:** unchanged — `timeLeak` bucket drives the category preview and ICP verdict (now computed from industry + size).

### Failure paths

- **`/api/quiz/next` returns non-2xx or times out (>8s):** browser falls back to a hardcoded three-question sequence (`stack` → `volume` → `sensitive-data`) rendered from a local const. Quiz completes normally; Piers still gets structured data. A `console.warn` is logged; nothing user-visible.
- **Claude returns malformed JSON (caught server-side):** server returns the same fallback question shape for that slot. Client treats it as normal.
- **User edits an earlier static answer:** bumps a client-side version counter; all adaptive answers are cleared and the first adaptive call re-fires.

## 6. Infra changes

### New

- `src/routes/api/quiz/next/+server.ts` — `prerender = false`, POST handler. Reads `platform.env.ANTHROPIC_API_KEY` and `platform.env.AI_GATEWAY_URL`, calls Claude via SDK, validates the tool-call JSON, returns it.
- `src/lib/data/quiz-fallback.ts` — hardcoded three-question fallback sequence used on API failure.
- Wrangler secrets: `ANTHROPIC_API_KEY`, `AI_GATEWAY_URL` (full base URL including `/anthropic` path, so gateway ID isn't hardcoded in source).

### Modified

- `src/routes/smb/quiz/+page.svelte` — rebuilt around the four-static-plus-adaptive shape; preserves existing visual language (eyebrow / chips / reveal).
- `src/routes/api/quiz/+server.ts` — `QuizPayload` loses `revenue`, `role`, `aiUsage`; gains `adaptive: AdaptiveAnswer[]`. `buildBody` updated to render the new shape.
- `src/lib/utils/mailto.ts` — `QuizAnswers` and `generateQuizMailto` updated to match. Mailto fallback body includes the adaptive Q&A.

### Not changed

- Visual design (DESIGN.md tokens, chip/form styling, `reveal` action).
- Overall page structure (hero, quiz, "What you get", ICP verdict).
- Post-submit preview logic keyed on `timeLeak` and ICP verdict.

## 7. What lands in Piers's inbox

Email subject: `Quiz: {industry} · {size} · {email}` (shape unchanged).

Body:

```
New AI Readiness Quiz submission.

Industry: Mortgage broker / lending
Team size: 10–25
Time leak area: Admin
Dreaded task: [user text]

Adaptive follow-ups:
Q: Which platforms do most of your submissions go to?
   Options offered: AFG · Connective · Loan Market · In-house · Other
   → AFG
Q: Roughly how many submissions per week across all lenders?
   Options offered: <5 · 5–15 · 15–40 · 40+
   → 5–15
Q: Does the task involve payslips, tax returns, or other client-sensitive docs?
   Options offered: Yes · No · Unsure
   → Yes

Reply to: user@example.com
```

Piers sees both the chosen answer **and** the option set the agent offered, so he can distinguish "they picked a pre-baked chip" from "they typed something the agent didn't anticipate." Typed `Other` answers are the most interesting signal for his own pattern library.

## 8. Edge cases

- **User switches tab for 10+ minutes:** no effect. No TTLs, no server-side session state; all state lives in `$state` runes.
- **User refreshes mid-quiz:** answers lost (acceptable — same behaviour as today's quiz).
- **`Other` typed answer > 200 chars:** truncated in the email display with `…`; full string retained in the payload.
- **Adaptive call races a user edit:** latest version counter wins; stale response is dropped.
- **Empty / malformed Claude response:** server returns fallback question for that slot (see §5).
- **Email send failure:** existing mailto fallback preserved; `generateQuizMailto` now includes the adaptive Q&A.

## 9. Abuse and cost

- AI Gateway per-gateway rate limit (e.g. 60 req/min/IP) covers the common abuse case — a user or script hammering `/api/quiz/next`.
- Expected load: single-digit submissions per day; cost ceiling ~$0.05/day even at 30× that.
- No CAPTCHA / Turnstile in v1. Add if and when the gateway metrics show abuse.

## 10. Out of scope for v1

- Streaming responses from the agent (non-streaming JSON response per turn is fine at Haiku latency).
- Agent-decided stop condition (fixed at 3 for UX/cost predictability).
- Agent-drafted Action Plan (explicitly rejected — Piers stays the author).
- Persisting partial submissions server-side.
- A/B testing agent vs. static paths.

## 11. Success criteria

- A mortgage-broker respondent's quiz produces adaptive questions that reference mortgage-specific platforms and volume ranges — not generic "what tools do you use."
- Piers reports that the emailed submission contains enough signal to draft the Action Plan without a follow-up call for ≥ 80% of submissions.
- Median total quiz time stays within 3 minutes (static was ~2 min; adaptive adds ~3s × 3 = 9s of wait plus taps).
- `/api/quiz/next` p95 latency under 3s end-to-end.
- Zero user-visible errors on agent-call failure (fallback path is seamless).
