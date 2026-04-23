# Design Critique Fixes + Narrative Continuity

**Date:** 2026-04-04
**Branch:** hero-redesign
**Scope:** 12 design improvements from full-site critique + Direction B (Narrative Continuity journey system)

## Summary

Implement all findings from the Apple Design Director-style critique of the DomeWorks site. The central new feature is a "Narrative Continuity" journey system that treats the four service pages as a linear progression (Scan → Context Build → Orchestration Build → Fractional) with a hero progress bar and dynamic next-step CTAs.

## Design Decisions

- **Journey bar style:** Hero Progress Bar (Option B) — segmented bar + text labels integrated into each service hero above the headline, replacing the current eyebrow text
- **CTA priority:** "Book a call" stays primary on every page. Journey nudge is secondary below it ("Or explore the next step: Context Build →")
- **Hero differentiation:** Gradient tint (teal→copper across the journey) + subtle architectural SVG watermarks per page at ~7% opacity
- **All other items:** Confirmed as proposed in critique

## Items

### 1. Fix contrast failures on tertiary text (Critical)

**Problem:** `text-charcoal/50` and `text-charcoal/40` on light backgrounds fail WCAG AA (4.5:1 contrast ratio for normal text).

**Fix:** Find all instances of `text-charcoal/50` and `text-charcoal/40` used on light backgrounds (`bg-warm-white`, `bg-stone`). Replace:
- `text-charcoal/40` → `text-charcoal/60`
- `text-charcoal/50` → `text-charcoal/60`

**Affected files:**
- `src/routes/+page.svelte` — Block proof point ("That's where DomeWorks comes in"), service card durations, pricing footnote
- `src/routes/about/+page.svelte` — BCG citation
- `src/routes/scan/+page.svelte` — pricing footnote
- `src/routes/context-build/+page.svelte` — pricing footnote, deliverable descriptions
- `src/routes/orchestration-build/+page.svelte` — pricing footnote
- `src/routes/fractional/+page.svelte` — pricing footnote

### 2. Service page hero differentiation (Critical)

**Problem:** All four service pages have identical `bg-warm-white` + `grid-overlay` heroes.

**Fix:** Each service page hero gets:

1. **Background gradient tint** — subtle directional gradient matching the page's position in the teal→copper spectrum:
   - Scan: `linear-gradient(135deg, #FAFAF7 70%, rgba(13,107,99,0.04))`
   - Context Build: `linear-gradient(135deg, #FAFAF7 65%, rgba(13,107,99,0.06))`
   - Orchestration Build: `linear-gradient(135deg, #FAFAF7 65%, rgba(160,115,65,0.05))`
   - Fractional: `linear-gradient(135deg, #FAFAF7 65%, rgba(176,125,79,0.05))`

2. **Architectural SVG watermark** — faint (~7% opacity), positioned in the hero's right/bottom area, `pointer-events-none`, `aria-hidden="true"`:
   - Scan: Radar/sweep concentric circles with a scan line
   - Context Build: Pipeline diagram — three source boxes converging into one output
   - Orchestration Build: Multi-node routing — central node distributing to 3 child nodes
   - Fractional: Compound growth curve — exponential curve with subtle axis

3. **Journey progress bar** (see item below) replaces the current static eyebrow text

### 3. Add "Learn more" affordance to middle service cards (Critical)

**Problem:** Homepage service cards for Context Build and Orchestration Build lack the "Learn more →" text that Scan and Fractional have.

**Fix:** Add `<p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>` to the Context Build card and `<p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>` to the Orchestration Build card on the homepage.

Note: Context Build card currently has a "Deep dive" badge and different styling (border-2 border-primary). Keep that styling but add the "Learn more" text for consistency. Orchestration Build uses copper accent, so use copper text color for its link.

### 4. Add visual relief to Fractional page (Important)

**Problem:** Most text-heavy page with least visual differentiation.

**Fix:** Add a "What a typical week looks like" visual section between "What I do" (02) and "Who this is for" (03). Structure as a simple horizontal timeline or card layout:

```
Mon/Tue: Embedded with your team — standups, pairing, system maintenance
Wed-Fri: Async — monitoring, feedback loop review, planning next iteration
```

Use a two-column card layout with day groupings, styled consistently with the site's card patterns (`bg-stone rounded-2xl border border-charcoal/10`). Add a `use:reveal` animation.

### 5. Make "Who this is for" scannable (Important)

**Problem:** The qualification section on the homepage is a single dense paragraph.

**Fix:** Replace the paragraph with a structured checklist. Keep the same content but break into scannable items:

```svelte
<ul class="space-y-4">
  <li class="flex items-start gap-3">
    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
      <span class="w-2 h-2 rounded-full bg-primary"></span>
    </span>
    <span>You're a <strong>VP of Engineering, Head of Engineering, or CTO</strong> at a mid-market SaaS company (50-500 people) or a funded startup</span>
  </li>
  <!-- ... more items -->
</ul>
```

Items:
1. VP Eng / Head of Eng / CTO at mid-market SaaS (50-500 people) or funded startup
2. Your engineers have AI tools but your organization still runs on human coordination
3. You've probably thought about assigning a senior engineer to figure this out
4. Building intelligence infrastructure isn't a side project — you need someone who's already built this

Keep the copper-bordered pull quote at the end: "You don't need another tool or a strategy deck..."

### 6. Group mobile nav (Important)

**Problem:** 6 nav items + CTA is a lot for mobile without grouping.

**Fix:** Add a "Services" accordion group in the mobile menu that contains the four service links. Top-level mobile nav becomes:

1. **Services** (expandable → AI Scan, Context Build, Orchestration Build, Fractional)
2. About
3. Contact
4. Book a call (button)

Implementation: In `Header.svelte`, split `navLinks` into `serviceLinks` and `otherLinks`. In the mobile menu, render a `<details>` element for Services with the four service links inside, followed by About and Contact as direct links.

Desktop nav stays unchanged — all 6 items remain visible.

### 7. Fix footer CTA / page CTA weight mismatch (Important)

**Problem:** Per-page bottom CTAs are lightweight centered text, then the footer immediately follows with a massive editorial CTA. Two "Book a call" prompts back-to-back with different visual weights.

**Fix:** Remove the per-page bottom `<Section>` CTA entirely from service pages. The footer CTA already serves this purpose with more visual impact. Instead, add the journey nudge (next-step link) as a lighter element just above the footer — a simple text link like:

```html
<div class="max-w-2xl mx-auto text-center py-8">
  <p class="text-sm text-charcoal/60">
    Next step in the journey: <a href="/context-build/" class="text-primary hover:underline font-medium">Context Build →</a>
  </p>
</div>
```

This eliminates the redundant CTA while keeping the journey navigation. The footer's "Let's figure out what's missing" + "Book a discovery call" becomes the sole conversion CTA.

Pages affected: Scan, Context Build, Orchestration Build, Fractional. The homepage and About page keep their bottom CTAs since the footer CTA context is different there. Contact page has no bottom CTA to remove.

### 8. Remove orphaned Scrollytelling component (Important)

**Problem:** `src/lib/components/ui/Scrollytelling.svelte` exists but isn't used on any page.

**Fix:** Delete `src/lib/components/ui/Scrollytelling.svelte`. Remove any related CSS if present (check for `.node-pulse-teal`, `.animate-code-scroll`, `.counter-animate`, `.status-dot` — these are defined in `<style>` within the component so they'll be removed with it).

### 9. Page-specific accent colors in heroes (Polish)

Covered by item #2 — the gradient tints accomplish this.

### 10. Contact page visual warmth (Polish)

**Problem:** Contact page is functional but sterile.

**Fix:** Add a simple "What happens on the call" mini-timeline between the two-card grid and the "What to expect" section:

```
1. You tell me about your team → 2. I share 2-3 observations → 3. We figure out if there's a fit
```

Implement as three inline items with numbered circles and connecting lines, using the same visual language as the numbered steps on other pages. Light treatment — no cards, just inline elements.

### 11. Add FAQ sections to service pages (Polish)

**Problem:** Common objections aren't addressed in a scannable format.

**Fix:** Add a FAQ section using `<details>` elements to each service page, after the pricing section and before the (now-removed) bottom CTA. The `details[open]` animation CSS already exists in `tailwind.css`.

**Scan FAQs:**
- "What access do you need?" — Admin credentials or exports from AI tools, plus a 15-min walkthrough.
- "What if we're a remote team?" — Fully remote-friendly. The survey is async, the report is delivered digitally.
- "Is there any obligation after the Scan?" — No. Many teams take the quick wins and run.

**Context Build FAQs:**
- "What access do you need?" — Stakeholder time (30-min interviews with 3-5 people), plus tool admin access.
- "Do you sign NDAs?" — Yes, standard mutual NDA before any access is granted.
- "What if we want to build internally after?" — That's fine. The deliverables are designed to be actionable without me.

**Orchestration Build FAQs:**
- "Do we need a Context Build first?" — Yes, or an equivalent assessment. Agent coordination without a context system is automating noise.
- "How embedded are you?" — 2-3 days/week, in standups, pairing with engineers, shipping alongside your team.
- "What does the handoff look like?" — Documented systems, runbooks, and knowledge transfer sessions. Your team owns everything.

**Fractional FAQs:**
- "How is this different from a contractor?" — I own the intelligence infrastructure as a system, not just execute tasks.
- "What's the minimum commitment?" — 3 months recommended to see compounding effects. Month-to-month after that.
- "Can this evolve into a full-time hire?" — If your org grows to need a full-time Head of AI, I'll help you hire one and transition.

### 12. Reframe case study on About page (Polish)

**Problem:** "Work in progress" slightly undermines credibility.

**Fix:** Change section title from "Work in progress" to "Current engagement". Change the eyebrow from `03` to keep numbering consistent. No other content changes needed — the existing copy already explains that the full case study will be published when the engagement closes.

### Direction B: Narrative Continuity Journey System

The central new feature tying everything together.

#### Journey Progress Bar Component

Create a new component `src/lib/components/ui/JourneyBar.svelte` that:

1. Accepts a `current` prop indicating which service page we're on: `'scan' | 'context-build' | 'orchestration-build' | 'fractional'`
2. Renders a segmented progress bar (4 segments) with text labels below
3. Current segment is filled with the page's accent color (teal for scan/context, copper for orchestration/fractional)
4. Past segments are filled at 30% opacity
5. Future segments are filled at 8-15% opacity
6. Text labels below each segment: clickable links to other service pages, current page is bold

The bar replaces the current `<p class="text-xs font-medium tracking-widest text-primary uppercase mb-6">Service Name</p>` eyebrow in each service hero.

#### Segment colors by page:

| Page | Segment 1 (Scan) | Segment 2 (Context) | Segment 3 (Orchestration) | Segment 4 (Fractional) |
|---|---|---|---|---|
| Scan | `bg-primary` | `bg-primary/15` | `bg-primary/8` | `bg-primary/5` |
| Context Build | `bg-primary/30` | `bg-primary` | `bg-primary/15` | `bg-primary/8` |
| Orchestration | `bg-primary/20` | `bg-primary/30` | `bg-copper` | `bg-copper/15` |
| Fractional | `bg-primary/15` | `bg-primary/20` | `bg-copper/30` | `bg-copper` |

#### Journey Nudge

A lightweight next-step link placed just above the footer on service pages:

```svelte
{#if nextStep}
  <div class="border-t border-charcoal/8 py-8">
    <div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
      <p class="text-sm text-charcoal/60">
        Next in the journey:
        <a href={nextStep.href} class="text-primary hover:underline font-medium">
          {nextStep.label} →
        </a>
      </p>
    </div>
  </div>
{/if}
```

Mapping:
- Scan → "Context Build" (`/context-build/`)
- Context Build → "Orchestration Build" (`/orchestration-build/`)
- Orchestration Build → "Fractional AI Leadership" (`/fractional/`)
- Fractional → none (terminal page)

## Files Changed

**New files:**
- `src/lib/components/ui/JourneyBar.svelte` — journey progress bar component

**Deleted files:**
- `src/lib/components/ui/Scrollytelling.svelte` — orphaned component

**Modified files:**
- `src/tailwind.css` — add hero gradient/SVG styles
- `src/routes/+page.svelte` — contrast fixes, "Learn more" on middle cards, "Who this is for" checklist
- `src/routes/scan/+page.svelte` — journey bar, hero differentiation, FAQ, remove bottom CTA, contrast fixes
- `src/routes/context-build/+page.svelte` — journey bar, hero differentiation, FAQ, remove bottom CTA, contrast fixes
- `src/routes/orchestration-build/+page.svelte` — journey bar, hero differentiation, FAQ, remove bottom CTA, contrast fixes
- `src/routes/fractional/+page.svelte` — journey bar, hero differentiation, FAQ, "typical week" visual, remove bottom CTA, contrast fixes
- `src/routes/about/+page.svelte` — "Current engagement" reframe, contrast fixes
- `src/routes/contact/+page.svelte` — call timeline visual
- `src/lib/components/layout/Header.svelte` — mobile nav accordion grouping
- `src/lib/components/layout/Footer.svelte` — no changes (already strong)

## Out of Scope

- Dark mode
- Search functionality
- Desktop nav changes
- Homepage hero changes (already strong)
- Blog/content pages
- SEO schema changes beyond what's already in place
