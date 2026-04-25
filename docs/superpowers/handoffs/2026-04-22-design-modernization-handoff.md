# Handoff: Design System Modernization (editorial-hairlines)

**Date:** 2026-04-22
**Branch:** `seo-sitemap-llms` (not yet merged to `main`)
**Status:** AI Tools Assessment page fully rewritten. Other pages pending follow-up.

---

## TL;DR

DomeWorks had a "premium consultancy" look (Newsreader serif + copper + architectural monogram + ambient glow/grain). Piers wanted modern. We picked **modernized-editorial direction with editorial hairlines** — no card backgrounds, vertical rules between cells, broadsheet rhythm. Fully shipped on `/ai-tools-assessment/`; system floor (fonts, tokens, Button, Section) landed site-wide. Other pages render cleanly but are visually half-modernized until their per-page pass happens.

**Do not re-litigate the direction.** Piers validated it via visual mockups in brainstorming. See the "Decisions locked" section below.

---

## Where to read first

| File                                                                      | What it is                                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `docs/superpowers/specs/2026-04-22-design-system-modernization-design.md` | Full design spec — tokens, components, per-section page direction, migration strategy |
| `docs/superpowers/plans/2026-04-22-design-system-modernization.md`        | Implementation plan — 16 tasks with exact code blocks                                 |
| This file                                                                 | Where we left off + what's next                                                       |

The 20 commits from this session are prefixed `spec:`, `plan:`, `wip:`, or `design:`. Run:

```bash
git log --oneline b10fdf1^..HEAD
```

to see the full arc from spec commit onward.

---

## What shipped

### System floor (affects every page)

- **Fonts:** Google Fonts (Plus Jakarta + Newsreader) → Fontshare CDN (General Sans + Recia). Imports in `src/app.html` lines 8–10, tokens in `src/tailwind.css` lines 29–30.
- **Tokens added to `@theme`** (`src/tailwind.css` top): `--color-paper`, `--color-paper-alt`, `--color-rule`, `--color-rule-strong`, `--color-muted`, `--color-subtle`, `--color-faint`, `--color-accent` (vermilion `#c2410c`, tuned for WCAG AA on white), `--color-accent-hover` (`#9a3412`), `--color-accent-light` (`#fb923c` — on dark only).
- **Legacy tokens kept** as aliases (`warm-white`, `stone`, `copper`, `primary`, `warm-gray`, etc.) so unmodernized pages still render.
- **Deleted ~193 lines of hero CSS** from `tailwind.css`: `.hero-grid`, `.hero-glow`, `.hero-rules`, `.hero-monogram*`, `.hero-accent-line`, `.hero-headline-em`, `.hero-line/1-4`, `.ambient-warm`, `.texture-grain`, plus associated keyframes and `prefers-reduced-motion` block.
- **Kept layout-critical hero classes** (`.hero-section`, `.hero-content-pad`, `.hero-eyebrow-row/text/index`, `.hero-middle`, `.hero-headline`, `.hero-aside`, `.hero-aside-rule`, `.hero-body-text`, `.hero-stat-*`, `.hero-cta-secondary*`) — homepage and quiz still reference these, will be deleted when those pages are modernized.
- **Kept `.stack-build`** — still used at `src/routes/+page.svelte:434`.
- **New utilities:** `.hairline-grid` + `.hairline-grid > .cell` + `.rule-left-accent` (bottom of `tailwind.css`).
- **Body bg** in `src/app.html`: `bg-warm-white` → `bg-paper`.
- **Button component** (`src/lib/components/ui/Button.svelte`): primary now `bg-accent` (vermilion) with `text-white`, `rounded-lg` (8px — not pill), dropped the teal glow shadow, subtle `hover:-translate-y-px`.
- **Section component** (`src/lib/components/layout/Section.svelte`): `bgClasses` uses `paper`/`paper-alt`/`ink`, `h2` is `font-sans font-medium` (no more Newsreader), eyebrows use `text-subtle` (light) / `text-accent-light` (dark), removed `.section-rule` decorative div + `ruleReveal` action, tightened `lg`/`xl` padding scale.

### AI Tools Assessment page — fully revised

`src/routes/ai-tools-assessment/+page.svelte` rewritten section by section:

| Section                     | Treatment                                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero                        | Flat dark, no monogram/glow/grid/grain. General Sans semibold headline, Recia serif subhead with `text-accent-light not-italic font-medium` emphasis. 3-col hairline-top stat strip. |
| Orientation "short version" | 3-col `.hairline-grid` with Recia body + accent eyebrows                                                                                                                             |
| 01 Where time goes          | Accent-fill pills for business-type selector, hairline grid for problem cards, accent-wash callout for speed-to-lead                                                                 |
| 02 Talk/Plan/Build          | 3-col hairline grid, accent-colored tagline                                                                                                                                          |
| 03 Don't automate           | 4-col hairline grid, accent-wash closer                                                                                                                                              |
| 04 Math                     | Big stat (General Sans semibold), `.rule-left-accent` quote block, Heroicons check-circle for guarantee                                                                              |
| 05 Right fit / Not a fit    | 2-col hairline grid, accent ✓ / subtle ✕                                                                                                                                             |
| 06 Who's behind this        | Recia 3-paragraph prose + left-accent-rule meta boxes                                                                                                                                |
| 07 FAQ                      | Migrated 8 `<details>` blocks to `{#each}` inline array, hairline-separator list, Recia answers                                                                                      |
| Dark CTA footer             | Flat black (no grid, no glow), sans h2, keeps 8px-radius soft cards on dark as exception (hairlines disappear on black)                                                              |
| Sticky mobile CTA           | Restyled with paper tokens                                                                                                                                                           |

---

## Decisions locked (don't re-litigate)

These came out of brainstorming with visual mockups. Piers reviewed and picked each explicitly.

- **Direction:** modernized editorial, NOT product-utility (Linear), swiss-minimal, or dev-tool-playful. Keep editorial structure (numbered 01–07 rhythm, eyebrow labels, stat bar), drop premium-editorial flourishes (serif display, copper, monogram, italic).
- **Type pairing:** General Sans (display + UI) + Recia (long-form prose, subheads). Fontshare CDN. Chose over Switzer-both, General+Gambetta, General+Quicksand.
- **Hero treatment:** dark hero → light body, not all-light. Keeps anchor contrast.
- **Accent:** vermilion (was copper). Currently `#c2410c` (tuned for WCAG AA). The lighter `#ea580c` was initially specified but failed AA — lesson learned.
- **Card style:** editorial hairlines (no backgrounds, vertical rules between cells), NOT soft cards (radius + borders + fills). More editorial, commits to direction.
- **Button radius:** 8px (`rounded-lg`), NOT pill (`rounded-full`). Pill reads startup-SaaS; 8px reads editorial.
- **Section-top hairlines:** intentionally SKIPPED. Alternating `paper` / `paper-alt` backgrounds plus per-section `.hairline-grid` do the structural work. Adding a third section-top rule would create visible double-underlining. See Task 5 Step 5 in the plan for the rationale.
- **Motion:** restrained. Kept only the `reveal` IntersectionObserver fade-up. Dropped monogram settle, accent-line draw, per-line stagger, ambient glow, grain texture.
- **FAQ refactor:** 8 repeated `<details>` → `{#each}` over inline array. Reduces 84 → 28 lines on the page. Copy edits require finding the array (minor discoverability cost, accepted).

---

## What's still drift (follow-up work)

Final review confirmed all quality gates pass (`yarn check`, `yarn build`) but every page except `/ai-tools-assessment/` is visually half-modernized. The new Button and Section propagated, but inline markup still references legacy tokens and/or uses deleted hero CSS classes.

**Legacy token counts per page** (from Task 16 audit):

| Page                                          | Legacy tokens | Deleted class refs                                                                | Priority            |
| --------------------------------------------- | ------------- | --------------------------------------------------------------------------------- | ------------------- |
| `src/routes/+page.svelte` (homepage)          | 70            | 10+ (full old hero: grid, glow, rules, monogram, accent-line, lines, headline-em) | **P0 — entry page** |
| `src/routes/quiz/+page.svelte`                | 64            | 3 (grid, glow, texture-grain)                                                     | P1 — lead magnet    |
| `src/routes/fractional/+page.svelte`          | 41            | 0                                                                                 | P2                  |
| `src/routes/context-build/+page.svelte`       | 38            | 2 (texture-grain)                                                                 | P2                  |
| `src/routes/orchestration-build/+page.svelte` | 35            | 0                                                                                 | P2                  |
| `src/routes/scan/+page.svelte`                | 33            | 0                                                                                 | P2                  |
| `src/routes/assessment/+page.svelte`          | 30            | 0                                                                                 | P3                  |
| `src/routes/about/+page.svelte`               | 25            | 0                                                                                 | P3                  |
| `src/routes/contact/+page.svelte`             | 13            | 0                                                                                 | P4                  |
| `src/routes/ai-audit/+page.svelte`            | 4             | 0                                                                                 | P4                  |
| `src/lib/components/layout/Footer.svelte`     | —             | 2 (ambient-warm, texture-grain)                                                   | P0 — every page     |

**After all P0 pages are modernized, delete the remaining dormant hero CSS from `tailwind.css`:**

- `.hero-section`, `.hero-content-pad`, `.hero-eyebrow-row/text/index`, `.hero-middle`, `.hero-headline`, `.hero-aside`, `.hero-aside-rule`, `.hero-body-text`, `.hero-stat-*`, `.hero-cta-secondary*`, `@keyframes hero-fade-up`, `.stack-build` (if unused).
- Also delete legacy color aliases: `--color-warm-white`, `--color-stone`, `--color-copper`, `--color-warm-gray`, `--color-warm-gray-light`, `--color-primary*`.

---

## Pre-existing issues NOT fixed in this session

- **41 ESLint errors** across `reveal.ts`, `Footer.svelte`, `Header.svelte`, `Button.svelte`, `JourneyBar.svelte`, `quiz/+page.svelte`, layout files. Confirmed pre-existing (errors exist on the baseline WIP commit `b2658e0` before this session's work). Address in a separate cleanup pass.
- **`tests/test.ts`** is a stub — references `h1 === 'Welcome to SvelteKit'` which matches nothing on the real site. E2E coverage needs a real build-out.

---

## Known visual regressions on unmodernized pages

These are expected per the migration strategy — don't treat them as bugs unless Piers flags them:

1. **Homepage hero** lost its monogram, accent line, grid, glow, grain — structural layout intact (still uses `.hero-section`, `.hero-content-pad`, etc.) but visually flat.
2. **Homepage section titles** are now General Sans (not Newsreader serif) because Section component updated.
3. **Homepage primary buttons** are vermilion (not teal).
4. **Footer** lost `.ambient-warm` and `.texture-grain` decoration.
5. **Quiz hero** lost grid/glow/grain.
6. **Backgrounds** shifted from warm-cream (`#fafaf7`) to pure white (`#ffffff`) via body class change.

If any of these look broken rather than just "different," investigate — but the default read should be "yes, that's expected drift."

---

## How to pick this up

### If Piers wants to modernize another page

Start with `/` (homepage) — it's the highest-traffic surface and has the most legacy debt.

1. Read the spec's "Visual Direction" and "Components" sections.
2. Read the Assessment page to see patterns in practice — especially hero, hairline-grid use, Recia prose, Heroicons, left-accent rules.
3. Brainstorm homepage-specific shape (which sections, what copy). The design system is now fixed; the only decision is how to arrange the existing homepage content in the new vocabulary.
4. Write a small page-level plan in `docs/superpowers/plans/`. Use this Assessment plan as the template.
5. Execute with subagent-driven-development.

### If Piers wants the branch merged

`seo-sitemap-llms` is 25 commits ahead of `main` (5 pre-existing Cloudflare/SEO/AI-tools-assessment + 20 from this session). Visual QA needed before merge — have Piers spot-check `/ai-tools-assessment/` at dev server, plus a scan of `/`, `/about/`, `/scan/` to confirm none look broken-broken (just "different").

Then either `/commit-push-pr` or merge locally.

### If Piers flags a visual issue

Debug pattern for CSS / Tailwind / Svelte 5 sites:

- Check the token resolution first (`grep -n "color-accent" src/tailwind.css`)
- Check Tailwind 4 `@theme` auto-generates utilities from `--color-{name}` — so if `--color-accent` exists, `bg-accent` / `text-accent` / `border-accent` all work automatically
- Dev server runs at `https://domeworks.localhost:1355` via portless
- The project uses `pnpm`, NOT global yarn. CLAUDE.md docs say `yarn check` but that fails with a Corepack/packageManager mismatch — use `pnpm check` instead

---

## Files you'll be touching

```
src/tailwind.css                                 # @theme tokens + utilities
src/app.html                                      # body bg class, font link
src/lib/components/ui/Button.svelte               # primary variant
src/lib/components/layout/Section.svelte          # bgClasses + h2 + eyebrow colors
src/lib/components/layout/Header.svelte           # not yet modernized
src/lib/components/layout/Footer.svelte           # not yet modernized
src/routes/ai-tools-assessment/+page.svelte       # DONE — reference for patterns
src/routes/+page.svelte                           # NEXT (homepage)
src/routes/quiz/+page.svelte                      # NEXT
src/routes/{about,scan,context-build,...}         # later
```

---

## Commits in this session (chronological)

```
b10fdf1 spec: modernize design system to editorial-hairline direction
ccee8b9 plan: implementation plan for design system modernization
b2658e0 wip: preserve in-progress design work before modernization rewrite
73be8f2 design: swap font stack to General Sans + Recia (Fontshare)
00bfbb3 design: add editorial tokens, drop dead hero CSS (monogram/glow/grid/grain)
07e83a0 design: add hairline-grid and rule-left-accent utilities
304337c design: Button goes vermilion 8px, drop teal glow shadow
397e3b4 design: Section uses sans h2, drops copper rule, neutral eyebrows
f285dd1 design: rewrite Assessment hero flat-dark editorial
2790400 design: orientation block → hairline grid, Recia body
636d8ff design: Section 01 Where-the-time-goes → hairline grid, accent pills
30ee8d9 design: Section 02 Talk/Plan/Build → hairline grid
2fd5bd2 design: Section 03 Don't-automate → hairline grid, accent callout
420349d design: Section 04 Math → left-accent rule, heroicons guarantee
b6e1e38 design: Section 05 Right-fit → hairline grid, Recia body
ac410df design: Section 06 Who's-behind-this → Recia prose, left-accent meta
dcd8662 design: Section 07 FAQ → hairline list, Recia answers
1378a8f design: Dark CTA footer + sticky mobile → flat black, sans h2
295cadd design: prettier format after modernization pass
0d10c0e design: tune accent palette for WCAG AA, fix ink opacity body-text contrast
```

---

## Reminder for the next session

- Invoke `/using-superpowers` at the start (part of the environment)
- Use the `brainstorming` skill before making new design decisions — the system direction is locked, but each page needs its own content layout brainstorm
- Use `writing-plans` + `subagent-driven-development` to execute — it worked well for this session
- Dev server: `dev domeworks` → `https://domeworks.localhost:1355`
- Project uses pnpm (despite CLAUDE.md saying yarn; it's a Corepack thing)
