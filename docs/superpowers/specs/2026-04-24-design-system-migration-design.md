# DomeWorks Editorial Design System Migration — Spec

**Date:** 2026-04-24
**Status:** Draft — awaiting user review
**Supersedes scope of:** `2026-04-22-design-system-modernization-design.md` (prior doc codified tokens; this doc applies them site-wide)

## Summary

DomeWorks has a codified editorial design system (`DESIGN.md`) derived from
the SMB Assessment page at `/smb`. Every other page still runs on the legacy
teal/stone/copper palette. This migration applies the new system site-wide at
three depths — token sweep everywhere, pattern adoption on enterprise pages,
full editorial restyle on the homepage — and reorganizes the enterprise track
under a new `/leaders/*` URL root.

## Goals

1. Every non-`/smb` page renders on the vermilion / ink / paper palette.
2. Enterprise service pages share a pattern library with the SMB canonical
   reference — no bespoke reimplementations of eyebrows, hairline grids, or
   callouts.
3. Enterprise track lives at `/leaders/*` with 301s from the old root-level
   paths, paralleling the `/smb/*` audience funnel.
4. Homepage adopts the editorial argument structure (numbered spine,
   pull-quote break, one-accent-per-viewport) without losing the AI Stack
   visualization.
5. Shared chrome (Header, Footer) matches the new palette, minus decorative
   layers that DESIGN.md forbids.

## Non-Goals

- Copy rewrites on enterprise pages. Layout and palette only. If a sentence
  reads awkwardly in the new design, flag it as a follow-up.
- Modifying `AssessmentPage.svelte` beyond optional pattern-component
  adoption in the final phase. No behavior, copy, or layout changes to the
  canonical reference.
- New pages. Log IA gaps as follow-ups.
- Additional pattern components beyond the six listed. Pages retain freedom
  to lay out their own hero and aside.
- Theming, dark mode, or accent variations.
- A/B tests, feature flags, or staged rollouts.
- Motion overhaul — `reveal` action and existing motion stay as-is.
- Accessibility improvements beyond parity.
- New analytics events.

## Design Decisions

Taken during brainstorming; each locked by user confirmation.

| Decision              | Choice                                                        | Rationale                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration depth       | Level B site-wide + Level C homepage                          | B = palette + patterns + rhythm. C = full editorial restyle, homepage only.                                                                                                                                           |
| Header/Footer         | Migrate to new palette; keep `isLanding` exclusion on `/smb*` | Preserves the deliberate standalone feel of the SMB pitch while fixing the legacy look elsewhere.                                                                                                                     |
| Legacy `/assessment`  | Migrate, don't redirect                                       | Tier-2 enterprise landing, not superseded by `/smb`.                                                                                                                                                                  |
| Track differentiation | Shared tokens, looser rhythm                                  | Enterprise pages keep the existing `§01–§05` methodology structure they already have; skip SMB-only devices (pull-quote break, display-stat, inline dropdown, sticky mobile CTA, strict paper/paper-alt alternation). |
| Component extraction  | Small pattern library                                         | Six components, thin extractions from `AssessmentPage.svelte`. No new heroes or asides.                                                                                                                               |
| Enterprise URL root   | `/leaders/*`                                                  | Audience-by-buyer-role. Parallels `/smb/*`. Works for engineering VPs, accounting-institute COOs, agency operators — not industry-bound.                                                                              |
| Hub page              | `/leaders/` _is_ the tier-2 assessment                        | Same model as `/smb/` where the landing is the pitch.                                                                                                                                                                 |

## Architecture

Three parallel tracks, all required before any page is "done":

### 1. Token layer — `src/tailwind.css`

**Delete** from `@theme`:

- `--color-primary` (`#0d6b63` teal)
- `--color-primary-hover`
- `--color-primary-light`
- `--color-warm-white`
- `--color-stone`
- `--color-warm-gray`
- `--color-warm-gray-light`
- `--color-copper`
- `--color-charcoal` — _conditional on no remaining usages after migration_

**Retain:** `ink`, `paper`, `paper-alt`, `rule`, `rule-strong`, `muted`,
`subtle`, `faint`, `accent`, `accent-hover`, `accent-light`, `font-sans`,
`font-serif`.

Removing the tokens is the irreversible forcing function — any page still
referencing them fails to compile, flushing legacy code out of hiding.

### 2. Pattern library — `src/lib/components/patterns/`

Six components, each a thin extraction from `AssessmentPage.svelte`. Markup
and classes preserved verbatim; the components exist to lock usage, not
reimagine patterns.

#### `Eyebrow.svelte`

```ts
props: {
  label: string;
  index?: string;                                // "01", "02" — prepends with hairline divider glyph
  tone?: 'accent' | 'subtle' | 'accent-light';   // default 'subtle'
  as?: 'p' | 'span';                             // default 'p'
}
```

Output: `text-[0.6875rem] font-semibold tracking-[0.14em] uppercase` +
tone-mapped color. Divider glyph
(`<span class="h-3 w-px bg-current/25">`) is built in when `index` is set.

#### `HairlineGrid.svelte`

```ts
props: {
  cols?: 1 | 2 | 3 | 4;   // maps to sm:grid-cols-{cols} (>=2) or lg:grid-cols-{cols} (=4)
  onMuted?: boolean;      // adds .on-muted class
  stagger?: boolean;      // passes through to use:reveal
  children: Snippet;
}
```

Emits `.hairline-grid` wrapper. Cells are written by the caller with
`class="cell"`. Enforces no-radius, no-per-cell-border via convention.

#### `NumberedSection.svelte`

```ts
props: {
  index: string;          // "01" | "02" | ...
  title: string;
  id?: string;
  background?: 'white' | 'muted' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  children: Snippet;
}
```

Thin wrapper over `Section`. Passes `eyebrow={index}` and `centered={false}`
automatically. Both tracks use this where numbered spines exist.

#### `TitledSection.svelte`

```ts
props: {
  title: string;
  id?: string;
  background?, padding?, description?;
  children: Snippet;
}
```

Same as `NumberedSection` without the index. For enterprise pages that drop
numbering, `/about`, `/contact` — prevents reverting to centered titles.

#### `PullQuote.svelte`

```ts
props: {
  children: Snippet;       // the quote
  attribution?: string;
}
```

Full-bleed paper section with top + bottom rules, Recia serif at
`clamp(1.625rem, 3.6vw, 2.625rem)`. SMB-track + homepage only.

#### `DisplayStat.svelte`

```ts
props: {
  value: string;           // "5–7"
  unit: string;            // "hours/week"
  lede?: string;           // small qualifier above
  children: Snippet;       // serif explanatory paragraph
}
```

Display-stat typography for value + unit; `rule-left-accent` wrapping the
paragraph. SMB-track + homepage only.

#### `Callout.svelte`

```ts
props: {
	variant: 'accent' | 'accent-strong' | 'rule-left' | 'rule-left-sm';
	children: Snippet;
}
```

Variants:

- `accent` — `bg-accent/6 rounded-lg p-6`
- `accent-strong` — `bg-accent/18 rounded-lg p-6`
- `rule-left` — `.rule-left-accent` (2px left border)
- `rule-left-sm` — `.rule-left-accent-sm` (1px left border)

### 3. Shared chrome

#### `Header.svelte`

Rewrite against new palette:

- `bg-warm-white/80` → `bg-paper/80` (scrolled state)
- `border-charcoal/5` → `border-rule`
- `text-charcoal` → `text-ink`
- Active link: `text-primary bg-primary/5` → `text-accent bg-accent/6`
- Hero-mode overlay colors: `text-warm-white` → `text-paper`
- CTA: `bg-primary hover:bg-primary-hover` → `bg-accent hover:bg-accent-hover`
- Hover surfaces: `hover:bg-stone` → `hover:bg-paper-alt`
- Update `serviceLinks` hrefs to `/leaders/*`

Structure (services dropdown, mobile accordion) preserved.

#### `Footer.svelte`

Rewrite against new palette; remove decorative layers:

- **Remove** `<div class="absolute inset-0 ambient-warm opacity-50"></div>`
- **Remove** `<div class="absolute inset-0 texture-grain"></div>`
- `text-primary` (teal period) → `text-accent`
- `text-warm-gray` / `text-warm-gray-light` → `text-paper/60` / `text-paper/80`
- `bg-primary` CTA + teal shadow → `bg-accent` + standard shadow
- `border-stone` / `border-white/10` → `border-paper/10`
- Update `navLinks` hrefs to `/leaders/*`

`bg-ink` foundation preserved.

#### `+layout.svelte`

`isLanding` logic unchanged. `/smb*` stays standalone; `/leaders*` gets the
shared Header + Footer.

## URL Structure

### New structure

```
/                                 homepage — Level C restyle
/about/                           about — Level B
/contact/                         contact — Level B

/smb/                             SMB track — unchanged (canonical reference)
/smb/[slug]/
/smb/quiz/

/leaders/                         tier-2 hub (formerly /assessment)
/leaders/scan/
/leaders/context-build/
/leaders/orchestration-build/
/leaders/fractional/
```

### Redirects — `_redirects`

```
/assessment/                /leaders/                  301
/scan/                      /leaders/scan/             301
/context-build/             /leaders/context-build/    301
/orchestration-build/       /leaders/orchestration-build/   301
/fractional/                /leaders/fractional/       301
```

Existing redirects (`/ai-audit/` → `/smb/`, `/ai-tools-assessment/` →
`/smb/`) untouched.

### Internal link updates

- `Header.svelte` — `serviceLinks` hrefs
- `Footer.svelte` — `navLinks` hrefs
- `+page.svelte` (homepage) — CTAs linking to service pages, two-tracks
  picker hrefs
- Cross-references between enterprise pages (FAQ links, next-steps blocks)
- `<svelte:head>` `<link rel="canonical">` on each moved page
- `static/sitemap.xml`
- `static/llms.txt`

## Per-Page Plan

### SMB track — out of scope

`/smb/+page.svelte`, `/smb/[slug]/+page.svelte`, `/smb/quiz/+page.svelte`,
`AssessmentPage.svelte` all remain. Optional refactor of
`AssessmentPage.svelte` internals to consume new pattern components is
deferred to Phase 5 as a nice-to-have.

### Enterprise track — `/leaders/*` (Level B)

Each page:

1. Move file from `src/routes/<old>/+page.svelte` →
   `src/routes/leaders/<new>/+page.svelte`.
2. Replace hero chrome (currently
   `<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">`
   with custom eyebrow/headline) with a `<Section background="dark"
padding="xl">` containing: an accent-light `Eyebrow`, the page headline
   (one `<h1>`), a short serif lead paragraph, and a primary CTA. Enterprise
   heroes intentionally do _not_ reuse SMB's three-mode responsive grid,
   right-rail aside, or meta `<dl>` — those are SMB-specific devices.
3. Swap `<Section eyebrow="01">` → `<NumberedSection index="01">`.
4. Convert card grids to `HairlineGrid` components.
5. Convert left-accent emphasis blocks to `Callout variant="rule-left"`.
6. Swap any remaining legacy color classes
   (`text-primary`, `text-copper`, `bg-warm-white`, `border-stone`, etc.)
   to new-palette equivalents.
7. Update `<link rel="canonical">` in `<svelte:head>`.

Page order (small → large): `/leaders/fractional` (285 lines) →
`/leaders/scan` (271) → `/leaders/orchestration-build` (264) → `/leaders/`
(191, from `/assessment`) → `/leaders/context-build` (478).

### `/about` — Level B

- Hero (currently `bg-warm-white` with `text-charcoal` headline) →
  `<Section background="dark" padding="xl">` per the enterprise-hero shape
  above.
- Three body `Section` blocks ("Why DomeWorks exists", "How I work",
  "Current engagement") → `TitledSection` (no index — margin page, not
  spine).
- Replace all `font-serif text-3xl font-normal text-charcoal` inline
  headings with `TitledSection`'s `title` prop.
- Any bio/left-column metadata → `Callout variant="rule-left-sm"`.

### `/contact` — Level B

- Hero (currently `bg-warm-white`) → `<Section background="dark"
padding="xl">` per the enterprise-hero shape.
- "Book a call" / "Send an email" two-up cards → `HairlineGrid cols={2}`.
- "What to expect" block → `Callout variant="rule-left"`.

### Legacy redirect stubs

`/ai-audit` and `/ai-tools-assessment` fallback copy — token sweep only.
Five-minute edits.

### Homepage `/` — Level C

Keep the spine (hero → two-tracks picker → §01 Who this is for → §02 Problem
→ §03 AI Stack → §04 How it works → CTA), retune every layer:

**Hero:**

- Remove decorative layers: `ambient-warm` copper/teal glow, `grid-overlay`,
  `texture-grain`, vertical copper rule.
- Keep the editorial stat bar; recolor `hero-eyebrow-text` (`#c99a6b`) to
  `accent-light`.
- Drop the monogram-as-column decoration (DESIGN.md forbids decorative SVG).

**Two-tracks picker:**

- Convert to `HairlineGrid cols={2}` with left-accent rules on each cell
  (`Callout variant="rule-left"`).
- Track A kicker reads "Owner-operators"; Track B kicker updated to
  "Leaders running teams" (was "VP Eng / CTO") — flag for copy confirmation.
- Each track ends in a primary CTA to `/smb/` or `/leaders/` + quiet text
  link to the tier-sibling.
- Two primary buttons side-by-side is acceptable _because_ they serve
  non-overlapping audiences — the DESIGN.md "one primary CTA per viewport"
  rule is for competing CTAs within one pitch.

**§01–§04 sections:**

- `<Section eyebrow="01">` → `<NumberedSection index="01">`.
- Card grids → `HairlineGrid`.

**AI Stack visualization (§03):**

- Keep as the homepage's signature.
- Recolor layer highlights: Agent Coordination and Context System layers
  currently use `primary` (teal) and `copper` — swap to `accent` and
  `accent-light` respectively, maintaining the two-layer visual distinction.
- Layer labels and build animation preserved.

**Before/After comparison:** structural copy, palette swap only.

**Pull-quote break between §03 and §04:** insert `PullQuote` with a quote
pulled from existing copy (candidate: the "coordination overhead" line, or
a line about the stack vs. the tool). Picks the actual quote at
implementation; spec doesn't lock copy.

**Bottom CTA:** dark band matching SMB final-CTA pattern.

## Rollout Phases

Five phases, each with a clean ship gate. Phase 3 + Phase 4 must land
together (Phase 3 alone leaves the build red).

### Phase 1 — Tokens & chrome

- Remove legacy tokens from `tailwind.css`.
- Rewrite `Header.svelte` and `Footer.svelte` to new palette.
- Drop `ambient-warm`, `texture-grain` overlays in footer.
- Ship gate: SMB canonical pages (`/smb`, `/smb/[slug]`) render identically
  (visual-diff screenshot pre/post). Build is red for other pages — expected.

### Phase 2 — Pattern library

- Create `Eyebrow`, `HairlineGrid`, `NumberedSection`, `TitledSection`,
  `PullQuote`, `DisplayStat`, `Callout` in `src/lib/components/patterns/`.
- Optional: throwaway `/dev-patterns/` route for visual verification
  (gitignored; deleted in Phase 6).
- Ship gate: components compile, types check. No consumer code yet.

### Phase 3 + 4 — IA move + enterprise migrations

Phase 3 (URL restructure) and Phase 4 (page migrations) combine into one
logical push — either in a single PR or on a feature branch, so the build
never stays red on main.

Phase 3 sub-steps:

- Move five `+page.svelte` files to `/leaders/*`.
- Add redirects to `_redirects`.
- Update Header, Footer, homepage internal links.
- Update `static/sitemap.xml` and `static/llms.txt`.

Phase 4 sub-steps — per-page, bisectable commits:

1. `/leaders/fractional/`
2. `/leaders/scan/`
3. `/leaders/orchestration-build/`
4. `/leaders/` (from `/assessment`)
5. `/leaders/context-build/`
6. `/about/`
7. `/contact/`

Ship gate per page: `yarn check` clean, Playwright tests adjusted + green,
manual visual review at `https://domeworks.localhost:1355`.

### Phase 5 — Homepage C-treatment

Single-page, multi-commit. Commit sequence:

- (a) Palette swap, keep structure.
- (b) Remove decorative layers.
- (c) Restructure two-tracks picker → `HairlineGrid` + left-accent cells.
- (d) Insert `PullQuote` between §03 and §04.
- (e) Recolor AI stack viz.
- (f) Hero editorial polish.
- Optional: refactor `AssessmentPage.svelte` internals to consume new
  pattern components.

### Phase 6 — Cleanup

- Delete `/dev-patterns/` scratch route if present.
- Delete `--color-charcoal` if unused.
- Remove `/ai-audit` and `/ai-tools-assessment` redirect stubs if
  PostHog confirms no direct traffic.

## Testing

**Automated per phase:**

- `yarn check` — Svelte/TS. Run after every commit.
- `yarn lint` — Prettier + ESLint. Run before commit.
- `yarn test` — Playwright. Likely breakages: selectors referencing legacy
  class names, URL assertions hitting old paths, button label changes on
  homepage. Repair inline.
- `yarn build` — confirms prerender succeeds for every route.

**Manual per phase:**

- Phase 1: visual diff `/smb` before/after — must be identical.
- Phase 4/5: each migrated page scrolled at 360 / 640 / 768 / 1024 / 1280px;
  `prefers-reduced-motion` verified; accent-color appears ≤2× per viewport;
  serif/sans split matches DESIGN.md.

## Risks

| Risk                                                                              | Mitigation                                                                                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO regression from URL moves                                                     | 301 redirects in `_redirects`; submit updated `sitemap.xml` to Google Search Console after Phase 3/4 ships. 2–4 week crawl lag is expected. |
| Hidden token usages break build on Phase 1                                        | Expected; forcing function. Phase 4 resolves all. If a Phase 1 ship gate matters, keep Phase 1 on a feature branch until Phase 4 completes. |
| Playwright selectors tied to legacy class names                                   | Budget test-repair time per migrated page.                                                                                                  |
| Two-tracks picker copy (`VP Eng / CTO` → `Leaders running teams`) isn't confirmed | Flagged for implementation decision, not design decision. Separate copy confirmation before homepage ships.                                 |
| `AssessmentPage.svelte` unintended visual change during Phase 1                   | Visual-diff screenshot gate. Any change fails the phase.                                                                                    |

## Open Questions

None blocking. Resolved during brainstorming:

- Migration depth ✓ B site-wide + C homepage
- Header/Footer treatment ✓ Migrate, keep isLanding exclusion
- Legacy page fate ✓ /assessment migrates, stubs alone
- Track differentiation ✓ Shared tokens, looser rhythm (numbered spine retained where already present)
- Component extraction ✓ Six-component library
- Enterprise URL root ✓ /leaders/\*
- Hub page ✓ /leaders/ = assessment

## References

- `DESIGN.md` — canonical design spec
- `src/lib/components/smb/AssessmentPage.svelte` — canonical reference
  implementation
- `docs/superpowers/specs/2026-04-22-design-system-modernization-design.md`
  — prior doc that codified tokens
- `docs/superpowers/specs/2026-04-06-smb-pivot-option-b-design.md` — SMB
  track origin
