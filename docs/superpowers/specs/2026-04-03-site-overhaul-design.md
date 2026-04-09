# DomeWorks Site Overhaul — Design Spec
_2026-04-03_

## Overview

Six improvements identified in a content + design audit. Executed via two parallel tracks: one content/copy agent, one code/structure agent.

---

## Track 1: Content & Copy

### 1A. New page: `/orchestration-build/`

**Positioning:** Outcome-focused, milestone-based. Not a fixed-process page like Context Build. Emphasises what the org achieves, not what steps happen.

**Prerequisite framing:** Requires a completed Context Build (or equivalent). The context system is what agent coordination runs on. This is stated clearly, not buried.

**Structure:**

```
Hero
  Headline: "Your team goes from AI helping individuals to AI coordinating your work."
  Subtext: milestone-based engagement, 4–12 weeks, day rate scoped from Context Build

01 What this is
  Not a fixed process. Milestones are defined during the Context Build assessment.
  The Orchestration Build takes the context system that's in place and builds
  agent coordination on top of it.

02 Outcomes (before → after)
  Status meetings → routed tasks
  Manual QA → quality gates
  Individual prompting → coordinated agent workflows
  Managers aggregating context → systems that route context automatically

03 Prerequisites
  A completed Context Build (or equivalent readiness assessment) is required.
  The context system is what agent coordination runs on. Without it, you're
  automating noise.

04 Investment
  Day rate. Typical engagement: 4–12 weeks.
  Exact scope and rate are defined after reviewing Context Build deliverables.
  Book a call to discuss.

CTA: Book a call
```

---

### 1B. New page: `/fractional/`

**Positioning:** What comes after. Not a starter engagement — for teams that have completed a Context Build or Orchestration Build and want the system to compound over time.

**Structure:**

```
Hero
  Headline: "Intelligence infrastructure compounds when someone owns it."
  Subtext: 1–2 days/week, ongoing retainer, part-time Head of AI

01 What this is
  An ongoing retainer. I act as your part-time Head of AI — maintaining and
  evolving the context system and agent coordination, closing feedback loops
  so the system gets smarter as the org changes.

02 What I do
  - Maintain and evolve both layers as the org changes
  - Close feedback loops (what's working, what's drifting, what needs tuning)
  - Adapt systems when team structure, tooling, or processes shift
  - Make sure the transition from hierarchy to intelligence infrastructure
    compounds instead of stalling

03 Who it's for
  Teams that have completed a Context Build or Orchestration Build.
  Not a starter engagement. The system needs to exist before it can be owned.

04 Investment
  Monthly retainer. Rate discussed on call — depends on scope and how much
  of both layers are in place.

CTA: Book a call
```

---

### 1C. Case study placeholder

Hold the case study until real metrics are confirmed and client permission is obtained. Add a placeholder on the About page:

> **Case study coming Q2 2026** — An autonomous coding agent system for a national professional services organization. Median task completion: 15 minutes from dispatch to PR, down from 2–3 days. Publishing when engagement closes.

---

### 1D. Terminology sweep

Replace all instances of old terms across every page with canonical plain-English equivalents:

| Old | New |
|-----|-----|
| Intelligence Stack | the AI stack (or "the stack" after first mention) |
| Intelligence Maturity / Intelligence Maturity level | AI readiness score |
| Context Layer | context system |
| Orchestration Layer | agent coordination |
| Coordination layer / coordination function | coordination overhead (keep) |
| AI Scan | keep |
| Fractional AI Leadership | keep (it's a page name now) |

Pages to sweep: `/`, `/scan/`, `/context-build/`, `/about/`, `/contact/`, and both new pages.

The 4-layer stack diagram on the homepage relabels:
- "Orchestration" → "Agent Coordination"
- "Context" → "Context System"

---

## Track 2: Code & Structure

### 2A. Fix Scrollytelling.svelte

File: `src/lib/components/ui/Scrollytelling.svelte`

Replace all Tailwind default `slate-*` classes with design tokens:

| Old class | New class |
|-----------|-----------|
| `text-slate-900` | `text-charcoal` |
| `bg-slate-900` | `bg-ink` |
| `text-slate-600` | `text-charcoal/60` |
| `text-slate-400` | `text-charcoal/40` |
| `bg-slate-800` | `bg-ink/90` |
| `border-slate-700` | `border-charcoal/20` |

Audit the full file — replace every `slate-*` occurrence. Do not change layout, animation, or structure.

---

### 2B. Homepage section reorder

File: `src/routes/+page.svelte`

Current order:
```
01 The problem isn't the tools
02 The Intelligence Stack
03 How it works
04 Who this is for
   CTA
```

New order:
```
01 The problem isn't the tools
02 Who this is for       ← moved up
03 The Intelligence Stack (renamed: "The AI stack")
04 How it works
   CTA
```

Update `eyebrow` prop values on each `<Section>` to match new numbering.

---

### 2C. Homepage: 4th service card

In the "How it works" section (`eyebrow="04"`), add a 4th card for Fractional AI Leadership after the Orchestration Build card:

```svelte
<a href="/fractional/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col">
  <span class="inline-block px-3 py-1 text-xs font-medium text-copper bg-copper/10 rounded-full mb-4 w-fit">
    What comes after
  </span>
  <h3 class="text-xl font-medium text-charcoal mb-2">Fractional AI Leadership</h3>
  <p class="text-2xl font-normal font-serif text-charcoal mb-4">Monthly retainer</p>
  <p class="text-charcoal/60 text-sm flex-grow">
    1–2 days/week. I maintain and evolve the context system and agent coordination, close feedback loops, and make sure the infrastructure compounds as your org changes.
  </p>
  <p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>
</a>
```

Grid changes from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4`.

Also remove the Fractional AI Leadership callout box from within the Intelligence Stack section — it's now a first-class page.

---

### 2D. Header nav update

File: `src/lib/components/layout/Header.svelte`

Add to desktop and mobile nav:
- "Orchestration Build" → `/orchestration-build/`
- "Fractional" → `/fractional/`

Nav order: AI Scan · Context Build · Orchestration Build · Fractional · About · Contact

---

### 2E. Footer nav update

File: `src/lib/components/layout/Footer.svelte`

Mirror the same nav additions to the footer link grid.

---

## Parallel Execution Notes

- Track 1 and Track 2 touch different files and can run simultaneously
- Coordination point: Track 2 links to `/fractional/` before Track 1 creates it — this is fine, the link can exist before the page does during development
- Both tracks should terminate with `yarn check` passing
- No new dependencies introduced by either track

---

## Out of Scope

- New visual design changes (hero redesign is tracked separately on `hero-redesign` branch)
- Blog or resource section
- Analytics or tracking changes
- Any changes to `/scan/` page content beyond terminology sweep
