# Council-Driven Messaging Restructure

**Date:** 2026-04-04
**Branch:** hero-redesign
**Trigger:** LLM Council review of DomeWorks services and positioning (council-transcript-20260404-005749.md)

## Context

An LLM Council reviewed DomeWorks' services, positioning, pricing, and go-to-market framing. All 5 advisors converged on the same structural finding: the messaging leads with the framework ("Intelligence Infrastructure Engineering," the Intelligence Stack) when it should lead with the pain. The differentiators ("Embedded not advisory. Designed to end. Working systems not opinions.") were unanimously identified as the strongest copy on the site but are buried below the framework explanation.

This spec addresses 6 site changes identified by the council. It preserves the editorial layout, design system, and brand identity — only the messaging hierarchy and specific copy changes.

## Approach

**Pain-First Reorder (Approach A):** Restructure information hierarchy without redesigning layout. The editorial three-zone hero, D monogram, stat bar, section structure, and all CSS/component architecture stay intact. We're changing what goes where, not how it looks.

## Changes

### 1. Homepage Hero Restructure

**File:** `src/routes/+page.svelte`

**Eyebrow:** Remove entirely. The current "Intelligence Infrastructure Engineering — San Francisco" is framework jargon in the buyer's first 2 seconds. The hero headline and body carry enough weight without an eyebrow.

**Headline:** Replace "Coordination / is overhead. / Build it as / infrastructure." with pain-first language. Direction: "Your team bought AI tools. / Nobody built the systems / between them." (This language is already validated — it's in the current hero body copy. Final wording refined during implementation to fit the staggered line layout.)

**Aside/body copy:** Replace the current body paragraphs with differentiator-forward copy: "I embed with your team and build working systems — not strategy decks. Every engagement is designed to end. You keep what I build." The 10-year background becomes a supporting line, not the lead.

**Stat bar:** Unchanged (10+ Years eng leadership / 48hr Intelligence Scan / 4 layers AI stack).

**CTAs:** Unchanged (Book a call + How it works).

### 2. Homepage Sections Reorder

**File:** `src/routes/+page.svelte`

Reorder the four main content sections:

| Current Order | New Order |
|---|---|
| 01: "The problem isn't the tools" | 01: "Who this is for" (buyer self-selection) |
| 02: "Who this is for" | 02: "The problem isn't the tools" (why it's happening) |
| 03: "The AI Stack" (framework) | 03: "The AI Stack" (the architecture that fixes it) |
| 04: "How it works" (services) | 04: "How it works" (services) |

**Rationale:** Buyer self-selection first. A cold buyer scanning after the hero wants to know "am I in the right place?" before investing in the explanation. Each section earns the right to introduce the next concept: identity → problem → framework → solution.

Section content stays the same — this is a reorder, not a rewrite. The framework section may need a transitional intro line to reflect its new position (e.g., "Here's the architecture that fixes it" rather than leading cold).

### 3. Scan Page — Engineered Conversion to Context Build

**File:** `src/routes/scan/+page.svelte`

Replace the "What this isn't" section with a "What your Scan tells you" closer after the deliverables section. Current defensive framing:

> "This isn't a strategy engagement. I won't interview your stakeholders..."

Replace with prescriptive framing:

> "The Scan shows you where you are. For most teams, the readout surfaces a clear gap: no shared context flowing into AI interactions, no coordination between tools and how the team ships. When that's the case, I'll tell you exactly what a Context Build would address and what it wouldn't — so you can decide whether to build it internally or with me."

This connects diagnosis to prescription. The buyer leaves feeling they got a diagnosis and a clear next step. The existing "Next in the journey: Context Build →" nudge at the bottom stays.

### 4. Block Reference Reframing

**File:** `src/routes/+page.svelte` (Section 02 in new order — "The problem isn't the tools")

Reframe the Block callout from derivative positioning to convergent validation. Current:

> "They have the engineering capacity to build it internally. Most companies don't. That's where DomeWorks comes in."

Replace with language positioning Block as one data point in an emerging pattern:

> "Block recently published how they're replacing coordination overhead with what they call a 'company world model.' It's the same architecture I've been building with engineering teams — the Context and Orchestration layers of the stack. The pattern is showing up independently because the problem is structural, not novel."

This positions Piers as a practitioner who recognized the pattern independently, makes Block evidence of a trend rather than the origin of the idea, and implicitly answers "why not hire someone from Block?"

### 5. "Designed to End" Proof Mechanism

**Files:** `src/routes/about/+page.svelte`, potentially `src/routes/fractional/+page.svelte`

Wherever "designed to end" appears as a differentiator, pair it with the concrete handoff mechanism. On the About page's "How I work" section, expand from:

> "Designed to end — every engagement has a built-in exit"

To:

> "Designed to end — every engagement ships a handoff package: documented systems, runbooks, and a knowledge transfer session. Your team owns what I built and can maintain it without me. If you need ongoing support after that, that's what the Fractional engagement is for — but you're never locked in."

The Orchestration Build page already mentions "documented systems, runbooks, knowledge transfer" in its FAQ. This promotes that language to every place the claim appears so it always comes with proof. Also creates a natural bridge to the Fractional offering.

### 6. Jargon Reduction for Cold Buyers

**Files:** `src/routes/+page.svelte`, meta tags

"Intelligence Infrastructure Engineering" as a label:
- **Remove** from the hero eyebrow (covered in Change 1)
- **Keep** in the page `<title>` and meta description for SEO value
- **Do not use** as a headline or section header anywhere a cold buyer encounters it before the framework explanation

When the Intelligence Stack visual appears (now in homepage Section 03, after buyer self-selection and problem explanation), the terminology stays as-is — "Context System," "Agent Coordination," "Surface," "Edge" are descriptive enough once the buyer has context. The terms land because the buyer has already said "yes, that's my problem."

## Pages Touched

| Page | Changes |
|---|---|
| `/` (homepage) | Hero copy, section reorder, Block reframe, eyebrow removal |
| `/scan/` | "What this isn't" → "What your Scan tells you" |
| `/about/` | "Designed to end" proof mechanism |
| `/fractional/` | "Designed to end" proof mechanism (if it appears) |

## What Does NOT Change

- Editorial three-zone hero layout, D monogram, settle animation
- CSS, component architecture, design tokens, brand palette
- Stat bar content
- Service cards (pricing, descriptions, structure)
- Contact page
- Context Build page
- Orchestration Build page (except if "designed to end" appears there)
- Any Svelte component interfaces or props
- Route structure

## Success Criteria

- A VP Eng skimming the homepage in 10 seconds understands: (1) the pain this solves, (2) whether they're the target buyer, (3) that this is an embedded practitioner, not a strategy consultancy
- The Intelligence Stack framework appears as proof of systematic thinking, not the opening pitch
- The Scan page creates a natural pull toward Context Build without a hard sell
- "Designed to end" feels safe (concrete handoff) rather than precarious (he'll leave)
- Block reference positions Piers as a pattern-recognizer, not an imitator
