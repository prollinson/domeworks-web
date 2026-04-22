# Design System Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize DomeWorks design system from "premium editorial consultancy" to "editorial hairlines" — drop serif headlines, copper accent, ambient texture. Adopt General Sans + Recia, vermilion accent, broadsheet hairline structure. First full rollout on `/ai-tools-assessment/`; system floor (tokens, Button, Section) applies site-wide.

**Architecture:** Two-layer change. **System floor** (Tasks 1–3) updates `tailwind.css`, `app.html`, `Button`, `Section` — affects every page. **Page revision** (Tasks 4–13) rewrites every section of `/ai-tools-assessment/+page.svelte` using the new system. Tasks are grouped so each produces a clean atomic commit. Design changes are verified visually via the dev server; TypeScript/lint checks catch regressions.

**Tech Stack:** SvelteKit 5 (runes), Tailwind CSS 4 (`@theme` in `tailwind.css`), Fontshare CDN (General Sans + Recia), Heroicons (inline SVGs where icons are needed).

**Spec:** [docs/superpowers/specs/2026-04-22-design-system-modernization-design.md](../specs/2026-04-22-design-system-modernization-design.md)

---

## Pre-flight

Before starting, confirm:

- Dev server is running at `https://domeworks.localhost:1355` (or start it with `dev domeworks`).
- You're on branch `seo-sitemap-llms` with the spec already committed (commit `b10fdf1` or later).
- No uncommitted changes that would conflict (running `git status` shows only the expected in-progress work).

---

## Task 1: Swap font loading — General Sans + Recia

**Files:**
- Modify: `src/app.html` (line 10)
- Modify: `src/tailwind.css` (lines 18–20)

- [ ] **Step 1: Update font preload + stylesheet link in app.html**

Replace the Google Fonts link with Fontshare. Edit `src/app.html`:

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=recia@400,500&display=swap" rel="stylesheet">
```

Remove the existing `<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, and the `Plus+Jakarta+Sans` / `Newsreader` Google Fonts stylesheet line.

- [ ] **Step 2: Update typography tokens in tailwind.css `@theme`**

Replace lines 18–20 with:

```css
/* Typography: General Sans (display + UI) + Recia (long-form prose, subheads) */
--font-sans: 'General Sans', ui-sans-serif, system-ui, sans-serif;
--font-serif: 'Recia', Georgia, serif;
```

- [ ] **Step 3: Visually verify fonts load**

Start or reload dev server. Open `https://domeworks.localhost:1355/ai-tools-assessment/`. Open DevTools > Network > Fonts. Confirm you see `general-sans-*.woff2` and `recia-*.woff2` loaded from `cdn.fontshare.com`. The body should already render in General Sans (body currently applies `font-sans` which now resolves to General Sans). Headlines still render in Recia via `font-serif` — the hero will look wrong mid-migration; that's expected.

- [ ] **Step 4: Commit**

```bash
git add src/app.html src/tailwind.css
git commit -m "design: swap font stack to General Sans + Recia (Fontshare)"
```

---

## Task 2: New design tokens + delete dead hero CSS

**Files:**
- Modify: `src/tailwind.css` (lines 3–21 `@theme` block; lines 29–145 dead hero CSS; line 486 ambient-warm; lines 493–497 texture-grain; 555–593 stack-build if unused)

- [ ] **Step 1: Expand the `@theme` block with new tokens**

Replace the existing `@theme` block (lines 3–21) with:

```css
@theme {
	/* --- Core palette --- */
	--color-ink: #0a0a0a;
	--color-charcoal: #1a1a1a;
	--color-paper: #ffffff;
	--color-paper-alt: #fafafa;
	--color-rule: #e5e5e5;
	--color-rule-strong: #0a0a0a;
	--color-muted: #525252;
	--color-subtle: #737373;
	--color-faint: #a3a3a3;

	/* --- Accent: vermilion --- */
	--color-accent: #ea580c;
	--color-accent-hover: #c2410c;
	--color-accent-light: #fb923c;

	/* --- Retained (legacy aliases for pages not yet migrated) --- */
	--color-primary: #0d6b63;
	--color-primary-hover: #0a5850;
	--color-primary-light: rgba(13, 107, 99, 0.06);
	--color-warm-white: #fafaf7;
	--color-stone: #f3f1ec;
	--color-warm-gray: #a3a096;
	--color-warm-gray-light: #bbb8ad;
	--color-copper: #b07d4f;

	/* --- Typography --- */
	--font-sans: 'General Sans', ui-sans-serif, system-ui, sans-serif;
	--font-serif: 'Recia', Georgia, serif;
}
```

(Note: Task 1 already set the fonts — this step keeps them inside the new block.)

- [ ] **Step 2: Delete all dead hero CSS**

Delete the following contiguous CSS blocks in `src/tailwind.css` (search for the selector names):

- `.hero-grid { ... }` (lines ~32–37)
- `.hero-glow { ... }` (~40–45)
- `.hero-rules { ... }` (~48–60)
- `.hero-monogram-container { ... }` (~63–68)
- `.hero-monogram { ... }` + `@keyframes monogram-settle` (~70–98)
- `.hero-accent-line { ... }` + `@keyframes accent-line-draw` + associated `@media (max-width: 640px)` block (~103–136)
- `.hero-headline-em { ... }` (~260–264)
- `.hero-line { ... }`, `.hero-line-1/2/3/4 { ... }`, `@keyframes hero-line-in { ... }` (~226–257)
- The `prefers-reduced-motion` block targeting `.hero-line, .hero-aside, .hero-stat-bar, .hero-eyebrow-row, .hero-monogram, .hero-accent-line` (~379–397)
- `.ambient-warm { ... }` (~484–490)
- `.texture-grain { ... }` (~493–497)
- `.stack-build` block + `.stack-build.revealed` + reduce-motion variant (~555–593) — only delete after confirming no other page uses it (grep: `grep -rn "stack-build" src/routes`). If in use, leave as-is and flag for follow-up.

- [ ] **Step 3: Keep essential hero styles that the page still references**

These stay (Task 4 will use them or refactor them):
- `.hero-section`, `.hero-content-pad`, `.hero-eyebrow-row`, `.hero-eyebrow-text`, `.hero-eyebrow-index`, `.hero-middle`, `.hero-headline`, `.hero-aside`, `.hero-aside-rule`, `.hero-body-text`, `.hero-stat-bar`, `.hero-stat-cell`, `.hero-stat-cell-mobile`, `.hero-stat-value`, `.hero-stat-label`, `.hero-stat-divider`

These will be replaced in Task 4. For now they stay so the page still renders (with the old hero) while Task 4 is the single clean "hero rewrite" commit.

- [ ] **Step 4: Update body background class**

Edit `src/app.html` body: change `class="bg-warm-white font-sans leading-normal tracking-normal antialiased"` to `class="bg-paper font-sans leading-normal tracking-normal antialiased"`.

- [ ] **Step 5: Run type check + build to confirm nothing breaks**

```bash
yarn check
```
Expected: 0 errors, 0 warnings.

```bash
yarn build
```
Expected: build succeeds. If it fails with missing class errors, a Tailwind class in a Svelte file references a token we just aliased — track it down before proceeding.

- [ ] **Step 6: Visual smoke test**

Reload `/ai-tools-assessment/` and one other page (`/`). Note: the hero on the assessment page will look partly broken — monogram gone, accent line gone, serif gone from fonts. That's expected; Task 4 fixes it. On `/`, the homepage will still use old token aliases so visually it should look similar (body may shift from warm-white to pure white).

- [ ] **Step 7: Commit**

```bash
git add src/tailwind.css src/app.html
git commit -m "design: add editorial tokens, drop dead hero CSS (monogram/glow/grid/grain)"
```

---

## Task 3: Add `.hairline-grid` utility classes

**Files:**
- Modify: `src/tailwind.css` (append a new, clearly labeled section)

- [ ] **Step 1: Append the hairline utilities**

At the bottom of `src/tailwind.css`, add:

```css
/* ===== Editorial hairlines ===== */
/* Broadsheet-style card grid: structural top/bottom rules, vertical cell dividers, no card backgrounds. */

.hairline-grid {
	border-top: 1px solid var(--color-rule-strong);
	border-bottom: 1px solid var(--color-rule);
}

.hairline-grid > .cell {
	padding: 1.5rem 1.25rem;
	border-right: 1px solid var(--color-rule);
}

.hairline-grid > .cell:last-child {
	border-right: none;
}

@media (max-width: 767px) {
	.hairline-grid > .cell {
		border-right: none;
		border-bottom: 1px solid var(--color-rule);
	}
	.hairline-grid > .cell:last-child {
		border-bottom: none;
	}
}

/* Left-accent rule: for side-of-block emphasis (e.g., Math section quote block). */
.rule-left-accent {
	border-left: 2px solid var(--color-accent);
	padding-left: 1.25rem;
}
```

- [ ] **Step 2: Verify Tailwind JIT picks up the new classes**

```bash
yarn build
```
Expected: build succeeds. Tailwind 4 via `@tailwindcss/vite` doesn't need JIT safelisting — any class used in source or declared in the CSS file is available.

- [ ] **Step 3: Commit**

```bash
git add src/tailwind.css
git commit -m "design: add hairline-grid, section-hairline-top, rule-left-accent utilities"
```

---

## Task 4: Update Button component — vermilion, 8px, drop glow

**Files:**
- Modify: `src/lib/components/ui/Button.svelte` (lines 20–24)

- [ ] **Step 1: Rewrite the `variantClasses` block**

Replace lines 20–24 with:

```svelte
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/50 shadow-sm hover:shadow hover:-translate-y-px',
    secondary: 'bg-transparent text-ink border border-ink hover:bg-paper-alt focus:ring-ink/30',
    ghost: 'text-ink/70 hover:text-accent hover:bg-paper-alt focus:ring-ink/30'
  }
```

Also update `baseClasses` on line 18 — change `rounded-lg` to stay `rounded-lg` (8px). No change needed there; just confirm.

Replace `text-white` with `text-paper` only if you want it semantic — white works fine; leave `text-white`. Confirm the line reads:
```
primary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/50 shadow-sm hover:shadow hover:-translate-y-px',
```

- [ ] **Step 2: Run type check**

```bash
yarn check
```
Expected: 0 errors.

- [ ] **Step 3: Visual verify — primary button on multiple pages**

Dev server running, open:
- `https://domeworks.localhost:1355/` (homepage, "Get in touch" or similar) — button should now be vermilion (#ea580c), 8px radius, subtle shadow on hover, tiny lift on hover
- `https://domeworks.localhost:1355/ai-tools-assessment/` — hero "Book the assessment" is vermilion now
- `https://domeworks.localhost:1355/scan/`, `/context-build/`, `/orchestration-build/` — confirm no layout break

If the color looks wrong (still teal), the accent token isn't resolving — check Task 2 landed correctly.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/ui/Button.svelte
git commit -m "design: Button goes vermilion 8px, drop teal glow shadow"
```

---

## Task 5: Update Section component — sans h2, top hairline, neutral eyebrows

**Files:**
- Modify: `src/lib/components/layout/Section.svelte`

- [ ] **Step 1: Update background class mapping**

In `<script>`, replace `bgClasses` with:

```ts
const bgClasses = {
  white: 'bg-paper',
  muted: 'bg-paper-alt',
  dark: 'bg-ink text-paper'
};
```

- [ ] **Step 2: Update eyebrow and title colors**

Replace the `$derived` lines with:

```ts
const eyebrowColor = $derived(background === 'dark' ? 'text-accent-light' : 'text-subtle');
const titleColor = $derived(background === 'dark' ? 'text-paper' : 'text-ink');
const descColor = $derived(background === 'dark' ? 'text-paper/70' : 'text-ink/70');
```

- [ ] **Step 3: Change the `<h2>` from serif to sans, update weight**

In the `<section>` markup, find the line `<h2 class="section-title font-serif font-normal {titleColor}">` and change it to:

```svelte
<h2 class="section-title font-sans font-medium {titleColor}">
```

- [ ] **Step 4: Drop the copper section-rule div**

Delete the `<div class="section-rule" aria-hidden="true" use:ruleReveal></div>` line entirely, along with the `ruleReveal` function in `<script>` (it's now unused) and the `.section-rule` CSS in `<style>`. Also remove the `prefers-reduced-motion` block that references `.section-rule`.

- [ ] **Step 5: Skip section-top hairlines (design decision)**

The spec suggested a top hairline on every Section. On reflection, alternating `paper` / `paper-alt` backgrounds already delineate sections cleanly, and the `.hairline-grid` inside many sections has its own top hairline — adding a section-top rule creates a visible double-rule (two black lines 3–4 line-heights apart). Skip it. If a section needs extra separation later, apply `section-hairline-top` manually — we'll add that utility only if needed.

No code change for this step.

- [ ] **Step 6: Update padding scale to tighter rhythm**

Replace `paddingClasses` with:

```ts
const paddingClasses = {
  sm: 'py-10 md:py-14',
  md: 'py-14 md:py-18',
  lg: 'py-16 md:py-20',
  xl: 'py-20 md:py-28'
};
```

(lg/xl reduced to support the denser editorial feel.)

- [ ] **Step 7: Confirm final component file**

Review the diff — `<style>` block should no longer contain `.section-rule` rules. Only `.section-title` (with the clamp sizing) should remain. Keep that.

- [ ] **Step 8: Run type check**

```bash
yarn check
```
Expected: 0 errors.

- [ ] **Step 9: Visual verify across pages**

Open each page that uses Section: `/`, `/about/`, `/scan/`, `/context-build/`, `/orchestration-build/`, `/ai-tools-assessment/`. Confirm:
- Section headlines render in General Sans (not Newsreader serif) at medium weight
- Eyebrows are gray (muted/subtle), not copper
- No copper rule under titles
- Nothing visually broken or overflowing

- [ ] **Step 10: Commit**

```bash
git add src/lib/components/layout/Section.svelte
git commit -m "design: Section uses sans h2, drops copper rule, adds topRule prop"
```

---

## Task 6: Rewrite AI Tools Assessment hero

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines 168–256 — the `<!-- Hero -->` section)
- Modify: `src/tailwind.css` (remove now-unused `.hero-*` utility classes)

- [ ] **Step 1: Replace the hero section markup**

In `src/routes/ai-tools-assessment/+page.svelte`, find the entire `<!-- Hero — editorial vocabulary from homepage -->` block through its closing `</section>` (lines 168–256) and replace with:

```svelte
<!-- Hero: flat dark, editorial -->
<section class="relative bg-ink text-paper overflow-hidden -mt-16 md:-mt-20" aria-label="Hero" use:trackHeroExit>
	<div class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-36 md:pt-40 pb-14 md:pb-20 flex flex-col gap-12 min-h-[clamp(70svh,80svh,90svh)]">
		<!-- Top: eyebrow -->
		<div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
			<span class="text-accent-light">AI Tools Assessment</span>
			<span class="text-paper/55 font-normal tracking-[0.08em]">Services businesses · 10–50 people</span>
		</div>

		<!-- Middle: headline + aside -->
		<div class="flex-1 flex flex-col justify-center max-w-4xl">
			<h1 class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]">
				Stop bleeding hours, leads, revenue.
			</h1>
			<p class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/75 max-w-2xl font-normal">
				A 45 minute call. An action plan <em class="text-accent-light not-italic font-medium">you can start this week</em>. What to install, what to skip.
			</p>
			<p class="mt-4 text-sm text-paper/65 max-w-2xl">
				Ex-DoorDash, Square, Mudflap. I'll handle the AI — you handle your business.
			</p>
			<div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
				<Button href={getAssessmentCallUrl()} size="lg">Book the assessment</Button>
				<a href="/quiz/" class="text-sm text-paper/85 underline underline-offset-4 hover:text-accent-light transition-colors">
					Not ready? Take the 2-min quiz first →
				</a>
			</div>
		</div>

		<!-- Bottom: stat strip -->
		<div class="pt-6 border-t border-paper/10 grid grid-cols-3 gap-4 md:gap-12">
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">5–7 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Recovered / week</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">45 min</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Your time</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">48 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Plan delivered</div>
			</div>
		</div>
	</div>
</section>
```

Note on the `<em>` — using `not-italic` because italic in General Sans is less distinctive than the serif italic we used to have. The emphasis is carried by color (accent-light) + weight (medium). If you prefer italic from Recia, swap `font-serif italic font-normal` onto the `<em>`.

- [ ] **Step 2: Delete the hero utility classes that are now unused**

In `src/tailwind.css`, find and delete these class blocks (they remain from Task 2 only because the old hero still used them):

- `.hero-section`, `.hero-content-pad` and their `@media` variants
- `.hero-eyebrow-row`, `.hero-eyebrow-text`, `.hero-eyebrow-index` and their `@media` variant
- `.hero-middle` and its `@media` variant
- `.hero-headline` and its two `@media` variants
- `.hero-aside`, `.hero-aside-rule` and `@keyframes hero-fade-up`
- `.hero-body-text`
- `.hero-stat-bar`, `.hero-stat-cell`, `.hero-stat-value`, `.hero-stat-label`, `.hero-stat-divider`, `.hero-stat-cell-mobile` and `@media (max-width: 359px)` variant
- `.hero-cta-secondary`, `.hero-cta-secondary-arrow` and hover variants (used only by old hero)

Confirm nothing else references these — grep: `grep -rn "hero-eyebrow\|hero-headline\|hero-stat\|hero-aside\|hero-content-pad\|hero-monogram" src/`. Should return no hits after this task.

- [ ] **Step 3: Run type check + build**

```bash
yarn check
yarn build
```
Expected: both pass, 0 errors.

- [ ] **Step 4: Visual verify the new hero**

Open `https://domeworks.localhost:1355/ai-tools-assessment/`. Confirm:
- Hero is fully dark, flat (no monogram, no glow, no grid, no grain, no accent line)
- Eyebrow reads "AI TOOLS ASSESSMENT · Services businesses · 10–50 people" in vermilion + muted
- H1 "Stop bleeding hours, leads, revenue." in General Sans semibold, line-height tight
- Subhead in Recia serif, italic "you can start this week" is vermilion
- CTA is vermilion with 8px radius
- Stat strip across the bottom has 1px hairline above it
- On mobile (resize to 375px), 3-col stat strip stays; no layout break

- [ ] **Step 5: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte src/tailwind.css
git commit -m "design: rewrite Assessment hero flat-dark editorial, drop dead hero utilities"
```

---

## Task 7: Orientation block ("The short version") — hairline grid

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~258–292)

- [ ] **Step 1: Replace the orientation block**

Find the `<!-- Orientation block -->` through its closing `</Section>` and replace with:

```svelte
<!-- Orientation: at-a-glance what this is / who it's for / why me -->
<Section background="muted" padding="md" eyebrow="The short version">
	<div class="max-w-6xl mx-auto" use:reveal>
		<div class="hairline-grid grid md:grid-cols-3">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">What this is</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed mb-3">
					A 45-minute assessment. You walk away with:
				</p>
				<ul class="space-y-2 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>Where hours, leads, and revenue are actually leaking</span></li>
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>The 3–7 AI tools worth installing this week</span></li>
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>An explicit list of what <em>not</em> to automate</span></li>
				</ul>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">Who it's for</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed">
					Owner-operated services businesses with 10–50 people. Where staff time is expensive, leads go cold, and admin eats the week. Accountants, attorneys, trades, real estate, and similar firms.
				</p>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">Why me</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed">
					I'll tell you where AI doesn't belong as clearly as where it does. No software reselling, no affiliate deals. 15 years at DoorDash, Square, and Mudflap before this, now based in Henderson.
				</p>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload page. Confirm:
- Section background is neutral gray (`#fafafa`), not warm-cream
- 3 columns on desktop with vertical hairline dividers between
- Top hairline (black 1px) and bottom hairline (gray 1px) frame the grid
- No card backgrounds, no rounded corners
- Body text renders in Recia serif
- Eyebrows in vermilion
- On mobile (<768px), columns stack with horizontal hairlines between

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: orientation block → hairline grid, Recia body"
```

---

## Task 8: Section 01 "Where the time goes"

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~294–362)

- [ ] **Step 1: Replace business-type buttons, cards, and speed callout**

Find `<!-- 01: Where the time goes -->` through its closing `</Section>` and replace with:

```svelte
<!-- 01: Where the time goes -->
<Section id="where-time-goes" background="white" padding="md" eyebrow="01" title="Where the time goes">
	<div use:reveal>
		<div class="max-w-3xl mx-auto mb-10 text-center">
			<p class="font-serif text-lg text-ink/75 leading-relaxed">
				Every services business leaks hours, leads, and revenue in the same few places. Pick yours to see where it's probably hiding.
			</p>
		</div>

		<div class="max-w-5xl mx-auto mb-8">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3 text-center">Your business type</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each Object.entries(patterns) as [key, p]}
					<button
						type="button"
						onclick={() => (selectedType = key as keyof typeof patterns)}
						class="px-4 py-2 text-sm rounded-lg border transition-all {selectedType === key
							? 'bg-accent text-white border-accent'
							: 'bg-paper text-ink/75 border-rule hover:border-ink/30 hover:bg-paper-alt'}"
						aria-pressed={selectedType === key}
					>
						{p.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="max-w-3xl mx-auto mb-8 text-center">
			<p class="font-serif text-sm text-subtle italic">{currentPattern.lead}</p>
		</div>

		{#snippet speedCallout(spacingClass: string)}
			<div class="max-w-5xl mx-auto {spacingClass} p-6 bg-accent/[0.06] rounded-lg">
				<div class="flex items-start gap-4">
					<span class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase flex-shrink-0 pt-1">The #1 pattern</span>
					<div>
						<h3 class="font-sans font-medium text-ink mb-2">Speed-to-lead: inbound response latency</h3>
						<p class="font-serif text-sm text-ink/80 leading-relaxed">
							The single highest-value pattern I find in owner-operated businesses. Prospect sends an inquiry at 9pm. You see it at 8am. By then they've already called two competitors. Cutting that response time from hours to minutes is often worth more than everything else on this page combined.
						</p>
					</div>
				</div>
			</div>
		{/snippet}

		{#if currentPattern.leadsWithSpeed}
			{@render speedCallout('mb-6')}
		{/if}

		<div class="max-w-5xl mx-auto hairline-grid grid sm:grid-cols-2">
			{#each currentPattern.cards as card (selectedType + card.title)}
				<div class="cell">
					<h3 class="font-sans font-medium text-ink mb-2">{card.title}</h3>
					<p class="font-serif text-sm text-ink/75 leading-relaxed">{card.body}</p>
				</div>
			{/each}
		</div>

		{#if !currentPattern.leadsWithSpeed}
			{@render speedCallout('mt-6')}
		{/if}
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Selector pills: inactive = white with gray border, active = vermilion fill, hover state works
- Click through 2–3 business types to confirm the card grid swaps in cleanly (hairlines re-render)
- Problem cards: no backgrounds, no rounded corners, hairline grid with 2-col vertical dividers
- Speed-to-lead callout: vermilion 6% wash, no border, 8px radius
- Lead italic under selector is still italic (Recia italic)

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 01 Where-the-time-goes → hairline grid, accent pills"
```

---

## Task 9: Section 02 "What you walk away with" (Talk. Plan. Build.)

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~364–424)

- [ ] **Step 1: Replace the section**

Find `<!-- 02: What you walk away with -->` through its closing `</Section>` and replace with:

```svelte
<!-- 02: What you walk away with — Talk. Plan. Build. -->
<Section background="muted" padding="md" eyebrow="02" title="What you walk away with">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="text-center mb-12">
			<p class="font-sans font-semibold text-2xl md:text-3xl text-ink leading-tight tracking-[-0.02em]">
				<span class="text-accent">Talk.</span>
				<span class="text-accent">Plan.</span>
				<span class="text-accent">Build.</span>
			</p>
			<p class="mt-3 text-xs text-subtle tracking-[0.12em] uppercase font-medium">
				Three phases. Fixed scope.
			</p>
		</div>

		<div class="hairline-grid grid md:grid-cols-3">
			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 01</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Talk</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					A 45-minute conversation about how your business actually runs day to day. Where time gets stuck, what you've tried, what you dread. You talk. I take notes. No pitch.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45 minutes. One call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 02</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Plan</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					Written action plan in 48 hours. The 3–7 AI tools worth installing this week, an explicit list of what <em>not</em> to automate, and financial impact in hours and dollars. Yours to use — implement on your own or hand it to your team.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45-minute review call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 03</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Build</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					Optional. If you want hands-on implementation rather than a self-serve roadmap, I embed for a fixed-scope engagement. I build the systems, train the staff who'll actually use them, and handle the change-resistance that always comes with new tools. You keep what I build.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Priced separately. Zero obligation from the Assessment.</p>
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-sm text-subtle">
				Two 45-minute calls across the process. Everything in between is on me.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- "Talk. Plan. Build." is General Sans semibold, accent-colored
- Three phase cells in hairline grid, no backgrounds
- Each cell has phase eyebrow + sans h3 + Recia body + meta line separated by internal hairline

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 02 Talk/Plan/Build → hairline grid"
```

---

## Task 10: Section 03 "What I won't tell you to automate"

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~426–472)

- [ ] **Step 1: Replace the section**

Find `<!-- 03: What I won't tell you to automate -->` through its closing `</Section>` and replace with:

```svelte
<!-- 03: What I won't automate — honesty gate -->
<Section background="white" padding="md" eyebrow="03" title="What I won't tell you to automate">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="mb-10 max-w-3xl">
			<p class="font-serif text-lg text-ink/75 leading-relaxed">
				Half the value of this Assessment is the workflows I tell you to leave alone. AI is the wrong tool in more places than most consultants will admit. Here's where I'll push back.
			</p>
		</div>

		<div class="hairline-grid grid sm:grid-cols-2 lg:grid-cols-4">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Your sales motion</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					Automated outbound cold sequences destroy more trust than they generate. If anything, your sales motion needs more human attention, not less. I'll be the first to say so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Broken processes</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					If clients are unhappy or staff is burned out, AI on top only speeds up the problem. Fix the process first. I'll tell you so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Human-judgement work</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					Client calls, review that requires context, exception handling, anything where your reputation is on the line. These stay human. That's your edge.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Low-volume tasks</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					If the task happens twice a month, the setup cost of automating it is higher than the time you'd save. Keep it manual. I'll say so.
				</p>
			</div>
		</div>

		<div class="mt-8 p-5 bg-accent/[0.06] rounded-lg max-w-4xl">
			<p class="font-serif text-sm text-ink/80 leading-relaxed">
				<strong class="font-sans font-semibold text-ink">If the honest answer is "don't use AI here," I'll say so on the call.</strong> If the honest answer is "hire the person you were going to hire," I'll say so. The action plan you walk away with reflects what I actually found, not what I'm paid to recommend.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Four "Don't automate" cells in a single hairline row on desktop (lg), 2-col on sm, stacked on xs
- Bottom callout wash is vermilion 6% opacity, 8px radius, body in Recia
- The bold opener "If the honest answer..." is General Sans semibold, stands out from serif body

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 03 Don't-automate → hairline grid, accent callout"
```

---

## Task 11: Section 04 "The math"

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~474–507)

- [ ] **Step 1: Replace the section**

Find `<!-- 04: The math -->` through its closing `</Section>` and replace with:

```svelte
<!-- 04: The math -->
<Section background="muted" padding="md" eyebrow="04" title="The math">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
			<div class="text-center md:text-left">
				<p class="font-sans font-semibold text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
					5–7 hours<span class="text-accent">/</span><span class="text-subtle">week</span>
				</p>
				<p class="font-serif text-ink/70 mt-3 text-lg">recovered per person, on average</p>
			</div>
			<div class="space-y-5">
				<div class="rule-left-accent">
					<p class="font-serif text-lg text-ink/75 leading-relaxed">
						For a team where staff time is worth $50–$200/hour loaded, that's
						<strong class="font-sans font-semibold text-ink">$250–$1,400 per person per week</strong> in recovered capacity, or the ability to take on more clients without adding headcount. Most teams land around <strong class="font-sans font-semibold text-ink">$600–$800 per person per week</strong>.
					</p>
					<p class="font-serif text-sm text-ink/60 mt-3">
						Your own hours count too — and those are usually the most expensive.
					</p>
					<p class="font-serif text-sm text-ink/50 mt-4 pt-4 border-t border-rule">
						The tools cost $30–$80/month in aggregate. Most teams recoup the $999 within the first week of implementation.
					</p>
				</div>
				<div class="flex items-start gap-3 pt-4 border-t border-rule-strong">
					<svg class="w-5 h-5 text-accent flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
					<p class="font-serif text-sm text-ink/80 leading-relaxed">
						<strong class="font-sans font-semibold text-ink">Guarantee:</strong> implement the recommendations and save 5+ hours/week within 30 days, or full refund. No questions asked.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Big stat "5–7 hours / week" is General Sans semibold, huge, `/` is vermilion, "week" is muted gray
- Right column body text is in Recia
- Left accent rule (2px vermilion) sits left of the body block
- Guarantee row has a Heroicons shield/check SVG in vermilion, separated by black top-hairline

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 04 Math → left-accent rule, heroicons guarantee"
```

---

## Task 12: Section 05 "Is this the right fit?"

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~509–568)

- [ ] **Step 1: Replace the section**

Find `<!-- 05: Right fit / Not a fit -->` through its closing `</Section>` and replace with:

```svelte
<!-- 05: Right fit / Not a fit -->
<Section background="white" padding="md" eyebrow="05" title="Is this the right fit?">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="hairline-grid grid md:grid-cols-2">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-4">Right fit if you</p>
				<ul class="space-y-3 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Own or lead a services business doing $3M to $10M in annual revenue.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Have 10 to 50 people and a repeatable service delivered week after week.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Run on software your team mostly likes (QuickBooks, HubSpot, your job-management or practice-management system).</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Lose hours to admin, leads to slow response, or revenue to both.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Want to know where AI shouldn't go, not just where it should.</span>
					</li>
				</ul>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-4">Not a fit if you</p>
				<ul class="space-y-3 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want a tool list without spending 45 minutes on how your business actually works.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want software resold or managed. I don't do either.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Have a process broken at the client, vendor, or staffing level. AI won't fix a human problem.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want a "transformation" or a six-figure roadmap. I do small, specific, measurable.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Have no core software or repeatable process yet. Start there, then come back.</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Two columns, vertical hairline between, no card backgrounds
- Right fit eyebrow = vermilion; Not a fit eyebrow = gray
- ✓ in vermilion, ✕ in muted gray
- Body in Recia

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 05 Right-fit → hairline grid, Recia body"
```

---

## Task 13: Section 06 "Who's behind this"

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~570–606)

- [ ] **Step 1: Replace the section**

Find `<!-- 06: Who's behind this -->` through its closing `</Section>` and replace with:

```svelte
<!-- 06: Who's behind this -->
<Section background="muted" padding="md" eyebrow="06" title="Who's behind this">
	<div class="max-w-4xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-3 gap-10 items-start">
			<div class="md:col-span-2 space-y-4 font-serif text-lg text-ink/80 leading-relaxed">
				<p>
					I'm <strong class="font-sans font-semibold text-ink">Piers Rollinson</strong>. Fifteen years at DoorDash,
					Square, and Mudflap building systems that move millions of orders, payments, and drivers.
					The same thinking that lands 10 million orders correctly at DoorDash lands 100 client
					intakes correctly at a 12-person firm.
				</p>
				<p>
					I've been an entrepreneur and advisor to small businesses throughout my career. That's
					where DomeWorks comes from.
				</p>
				<p>
					I live in Henderson with my wife and three kids. I'm direct — no BS, no glossy pitch
					decks, no software to resell. I build working systems. Fixed scope. You keep what I build.
				</p>
			</div>
			<div class="space-y-5">
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Previously</p>
					<p class="font-sans text-sm text-ink font-medium">DoorDash, Square, Mudflap</p>
				</div>
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Focus</p>
					<p class="font-sans text-sm text-ink font-medium">AI for services firms</p>
				</div>
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Based in</p>
					<p class="font-sans text-sm text-ink font-medium">Henderson, NV</p>
				</div>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Left: 3 Recia paragraphs, "Piers Rollinson" in sans semibold
- Right: 3 meta boxes, each with 1px vermilion left border (no background)
- Responsive stack on mobile

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 06 Who's-behind-this → Recia prose, left-accent meta"
```

---

## Task 14: Section 07 "Common questions" (FAQ)

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~608–691)

- [ ] **Step 1: Replace the FAQ section**

Find `<!-- 07: FAQ -->` through its closing `</Section>` and replace with:

```svelte
<!-- 07: FAQ -->
<Section background="white" padding="md" eyebrow="07" title="Common questions">
	<div class="max-w-3xl mx-auto" use:reveal>
		<div class="border-t border-rule-strong">
			{#each [
				{ q: "What if I've already tried AI and it didn't stick?", a: "Common — most owners have dabbled with ChatGPT or tried a tool their accountant mentioned, and not much changed. The difference here is specificity. You walk away with a written plan tied to specific workflows in your business, not a generic \"try AI\" suggestion. And if the honest answer is \"you tried the right thing, it just needs better prompts,\" I'll say so." },
				{ q: 'What if the honest answer is "don\'t use AI for that"?', a: "That's half the value. The action plan explicitly flags workflows where AI is the wrong tool — broken processes, human-judgement work, low-volume tasks. I'll also tell you if the honest answer is \"hire the person you were going to hire anyway.\" No pretending AI solves problems it doesn't." },
				{ q: 'What does this cost?', a: "$999 flat. Includes the 45-minute call, written action plan, and review call. If you don't find the Assessment valuable, I'll refund you — no conditions. There's no upsell during the Assessment and no obligation to hire me afterward." },
				{ q: 'What do I need to prepare?', a: "Nothing. You don't need to know AI — that's my job. Just show up ready to talk about how your business actually works day-to-day. I'll ask the questions. No homework, no intake forms." },
				{ q: 'Who will I be on the call with?', a: "Me. Every call, every action plan, every build. No junior consultants, no handoffs. If you hire me for the Build phase, I'm still the one doing the work." },
				{ q: 'Do you sell software?', a: "No. The action plan recommends existing tools — things like ChatGPT, Claude, Dext, Karbon — whatever fits your workflow. I don't resell software and I have no affiliate deals. The recommendations are genuinely neutral." },
				{ q: 'How long until I get the action plan?', a: "Within 48 hours of the discovery call. The review call happens shortly after, at a time that works for you. Total calendar time from first call to final action plan: about one week." },
				{ q: 'What happens after the Assessment?', a: "That's entirely up to you. Many owners implement on their own — the action plan is designed for that. If you want hands-on help, we can talk about the Build phase. Fixed-scope engagements typically run $3K–$15K depending on what we're building. Zero pressure either way." }
			] as faq}
				<details class="group border-b border-rule py-5">
					<summary class="flex items-center justify-between cursor-pointer list-none font-sans font-medium text-ink">
						{faq.q}
						<svg class="w-5 h-5 text-ink/40 transition-transform duration-200 group-open:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
					</summary>
					<p class="mt-3 font-serif text-muted leading-relaxed">
						{faq.a}
					</p>
				</details>
			{/each}
		</div>
	</div>
</Section>
```

Note: migrated from 8 repeated `<details>` blocks to a `{#each}` over an inline array. Functionally equivalent, but less repetition. If you prefer keeping 8 explicit blocks for future copy edits, you can do that — preference, not correctness.

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- FAQ has a top hairline (black 1px) and each item has bottom hairline (gray 1px)
- No card backgrounds
- Summary in General Sans medium, question mark chevron in gray
- Click to expand: answer reveals in Recia
- Open animation from existing `details[open]` CSS still works

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Section 07 FAQ → hairline list, Recia answers"
```

---

## Task 15: Dark CTA footer + sticky mobile CTA

**Files:**
- Modify: `src/routes/ai-tools-assessment/+page.svelte` (lines ~693–744)

- [ ] **Step 1: Replace the dark CTA footer**

Find `<!-- CTA: dark closing section -->` through the sticky mobile CTA `{/if}` and replace with:

```svelte
<!-- Dark CTA footer -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="Book your Assessment">
	<div class="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-24" use:reveal>
		<!-- What comes next -->
		<div class="grid sm:grid-cols-2 gap-5 mb-14">
			<div class="p-5 rounded-lg border border-paper/10 bg-paper/[0.04]">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-2">After Talk + Plan</p>
				<h3 class="font-sans font-medium text-paper mb-1.5">Implement on your own</h3>
				<p class="font-serif text-sm text-paper/65 leading-relaxed">
					The action plan includes specific tool recommendations and a quick-start sequence.
					Many owners take it and run. That's the whole point.
				</p>
			</div>
			<div class="p-5 rounded-lg border border-paper/10 bg-paper/[0.04]">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-2">Or add the Build phase</p>
				<h3 class="font-sans font-medium text-paper mb-1.5">I embed and build it</h3>
				<p class="font-serif text-sm text-paper/65 leading-relaxed">
					I build the systems, train your team, and hand off working infrastructure.
					Fixed scope. You keep what I build.
				</p>
			</div>
		</div>

		<!-- Primary CTA -->
		<div class="text-center">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-4">Ready when you are</p>
			<h2 class="font-sans font-semibold text-3xl md:text-4xl text-paper mb-3 tracking-[-0.025em]">
				Stop bleeding. Start this week.
			</h2>
			<p class="text-paper/65 mb-2">$999 flat. 45-minute call. Written action plan in 48 hours.</p>
			<p class="text-sm text-paper/50 mb-10">If you don't find the Assessment valuable, I'll refund you. No questions asked.</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href={getAssessmentCallUrl()} size="lg">Book the $999 assessment</Button>
				<a href="mailto:piers@domeworks.tech?subject=AI%20Tools%20Assessment%20question" class="text-sm text-paper/65 hover:text-accent-light transition-colors">
					Or email a question first
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Sticky mobile CTA -->
{#if showStickyCta}
	<div class="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-paper/10 px-4 py-3 flex items-center justify-between gap-3" role="complementary" aria-label="Book Assessment">
		<p class="text-sm text-paper/70 truncate font-sans">45-min AI assessment</p>
		<Button href={getAssessmentCallUrl()} size="sm">Book it</Button>
	</div>
{/if}
```

- [ ] **Step 2: Visual verify**

Reload. Confirm:
- Dark CTA footer: no radial glow, no grid overlay — flat black
- Two option cards on black: keep subtle white/4% bg + 8px radius (exception per spec — hairlines disappear on black)
- H2 "Stop bleeding. Start this week." in General Sans semibold (not serif), tight tracking
- CTA is vermilion (from updated Button)
- Scroll up to hero, then back down past the hero → sticky mobile CTA appears on narrow widths

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai-tools-assessment/+page.svelte
git commit -m "design: Dark CTA footer + sticky mobile → flat black, sans h2"
```

---

## Task 16: Smoke-test every page + final verification

**Files:** (no changes — verification only)

- [ ] **Step 1: Start fresh dev server**

Restart the dev server: `dev kill domeworks && dev domeworks`. Hard-reload the browser to bust font/CSS caches.

- [ ] **Step 2: Walk every page and check for breakage**

Open each and scroll through:
- `https://domeworks.localhost:1355/`
- `https://domeworks.localhost:1355/about/`
- `https://domeworks.localhost:1355/scan/`
- `https://domeworks.localhost:1355/context-build/`
- `https://domeworks.localhost:1355/orchestration-build/`
- `https://domeworks.localhost:1355/ai-audit/`
- `https://domeworks.localhost:1355/fit/`
- `https://domeworks.localhost:1355/fractional/`
- `https://domeworks.localhost:1355/assessment/`
- `https://domeworks.localhost:1355/workshop/`
- `https://domeworks.localhost:1355/quiz/`
- `https://domeworks.localhost:1355/contact/`
- `https://domeworks.localhost:1355/ai-tools-assessment/` (full review)

On pages other than `/ai-tools-assessment/`, expect:
- Backgrounds now neutral white/gray instead of warm cream — **OK**
- Section headlines in General Sans (no more Newsreader serif) — **OK**
- Primary buttons in vermilion — **OK**
- No copper rule under section titles — **OK**
- Hero sections on `/`, `/scan/`, `/context-build/`, etc. may still use their own `.hero-*` classes and copper references inline — **OK** (these pages haven't been modernized yet)
- Layout-broken pages — **NOT OK**. If any page overflows, has undefined classes, or renders a blank section, that's a bug. Investigate and fix or roll back.

- [ ] **Step 3: Run all quality gates**

```bash
yarn check
```
Expected: 0 errors, 0 warnings.

```bash
yarn lint
```
Expected: 0 errors. If Prettier complains about formatting, run `yarn format`.

```bash
yarn build
```
Expected: build succeeds, static output generated in `.svelte-kit/`.

- [ ] **Step 4: Mobile responsive check on the Assessment page**

Open DevTools > Device Toolbar. Test `/ai-tools-assessment/` at:
- iPhone SE (375px) — hero stat strip readable, headline doesn't overflow, all hairline grids stack correctly
- iPad Mini (768px) — 3-col and 4-col hairline grids work
- Desktop 1280px — full layout as designed
- Desktop 1920px — content capped at `max-w-7xl`, no awkward stretching

- [ ] **Step 5: Dark mode / reduced-motion sanity**

In DevTools > Rendering, toggle "prefers-reduced-motion: reduce". Reload `/ai-tools-assessment/`. Confirm:
- No scroll-in animations play
- Page is fully visible immediately
- FAQ details still expand on click (the rotation on chevron can stay — it's 200ms, not decorative)

- [ ] **Step 6: Final commit if any formatting fixes landed**

If `yarn format` changed anything in Step 3:

```bash
git add -A
git commit -m "design: prettier format after modernization pass"
```

Otherwise, nothing to commit — you're done.

---

## Follow-ups (not in this plan)

- Modernize homepage (`/`) — biggest remaining editorial/copper surface
- Modernize `/scan/`, `/context-build/`, `/orchestration-build/` service pages
- Modernize `/about/` and `/ai-audit/`
- Update Header and Footer components to match
- Update brand docs in `piers-os/resources/domeworks/`
- Consider removing `.stack-build` CSS if no page uses it (skipped in Task 2 if it was in use)
- Consider self-hosting General Sans + Recia (Fontshare CDN is fine for now; self-host later for performance)
- Write real Playwright E2E coverage (`tests/test.ts` is currently a stub)

---

## Acceptance criteria

- `/ai-tools-assessment/` reads as modern editorial, not premium consultancy
- No serif headlines anywhere on the Assessment page
- No copper anywhere on the Assessment page
- No monogram, no ambient glow, no grain
- General Sans + Recia throughout the Assessment page
- Every card-style section uses `.hairline-grid`, not card backgrounds
- Motion is purposeful (reveal-on-scroll + button hover + details toggle), not decorative
- Mobile hero reads cleanly at 360px
- Site-wide: primary buttons vermilion, section headlines sans, backgrounds neutral
- `yarn check`, `yarn lint`, `yarn build` all pass
