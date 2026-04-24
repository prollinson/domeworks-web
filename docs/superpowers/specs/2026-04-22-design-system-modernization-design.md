# Design System Modernization — Editorial Hairlines

**Date:** 2026-04-22
**Scope:** Site-wide design system revision, first rolled out on `/ai-tools-assessment/`

## Context

Current site reads as "premium consultancy" — serif display (Newsreader), copper accent (#b07d4f), warm-cream backgrounds (#fafaf7), architectural monogram, italic flourishes, heavy ambient texture (grain, glow, grid). The read is aged editorial. Piers wants modern.

Four modernization directions were considered:

1. **Product-utility** (Linear/Vercel) — rejected, too software-tool for services positioning
2. **Swiss minimal** (Stripe Press) — rejected, too restrained
3. **Dev-tool / playful** (Resend/Cursor) — rejected, fights "grown-up operator" positioning
4. **Modernized editorial** — selected

Within modernized editorial, the polish direction is **editorial hairlines** (no card backgrounds, vertical rules, structural dividers) over soft cards — commits to the direction rather than hedging.

## Visual Direction

**Hero:** dark, flat. No monogram, no ambient glow, no architectural grid, no grain. Black ground, vermilion eyebrow, bold sans headline, short italic-accented serif subhead, 8px-radius vermilion CTA, hairline-bordered stat strip.

**Body sections:** light (neutral, not warm-cream). No card fills. Content sits on the section surface, separated by top-and-bottom hairlines and vertical rules between columns. Reads like a considered broadsheet.

**Motion:** restrained. Drop the monogram settle, accent-line draw, per-line hero stagger. Keep only the `reveal` IntersectionObserver fade-up for scroll entrances.

## Design Tokens

Update `src/tailwind.css` `@theme` block:

```css
@theme {
	/* --- Core palette --- */
	--color-ink: #0a0a0a; /* was #141414 */
	--color-charcoal: #1a1a1a; /* keep */
	--color-paper: #ffffff; /* NEW — pure white, replaces warm-white as primary surface */
	--color-paper-alt: #fafafa; /* NEW — neutral alternation, replaces stone */
	--color-rule: #e5e5e5; /* NEW — hairline color */
	--color-rule-strong: #0a0a0a; /* NEW — structural rule (section top/bottom) */
	--color-muted: #525252; /* NEW — body secondary */
	--color-subtle: #737373; /* NEW — labels, meta */
	--color-faint: #a3a3a3; /* NEW — on-dark body secondary */

	/* --- Accent: vermilion replaces copper --- */
	--color-accent: #ea580c; /* primary vermilion, WCAG AA on white */
	--color-accent-hover: #c2410c;
	--color-accent-light: #fb923c; /* hero eyebrow on dark, secondary accents */

	/* --- Retained (legacy aliases, deprecate progressively) --- */
	--color-primary: #0d6b63; /* teal — keep for "Speed-to-lead" callout, trust signals */
	--color-warm-white: #fafaf7; /* deprecate — migrate to --color-paper */
	--color-stone: #f3f1ec; /* deprecate — migrate to --color-paper-alt */
	--color-copper: #b07d4f; /* deprecate — migrate to --color-accent */

	/* --- Typography --- */
	--font-sans: 'General Sans', ui-sans-serif, system-ui, sans-serif;
	--font-serif: 'Recia', Georgia, serif;
	--font-body: var(--font-sans); /* default */
	--font-prose: var(--font-serif); /* for long-form paragraphs, subheads */
}
```

**Deprecation rule:** don't do a sweep right now. New code uses new tokens. The old tokens stay aliased so existing pages keep working. When each page is modernized, its token usage gets migrated.

## Typography

- **Display** (`h1` hero): General Sans, weight 600, `clamp(2.5rem, 6vw, 3.5rem)`, line-height 1.02, letter-spacing -0.035em.
- **Section titles** (`h2`): General Sans, weight 500, `clamp(1.75rem, 3.5vw, 2.5rem)`, letter-spacing -0.025em.
- **Card/block titles** (`h3`): General Sans, weight 500, 1.125rem–1.25rem.
- **Subhead / lead** (under h1): **Recia**, weight 400, 1.125rem–1.25rem, line-height 1.55. Italic emphasis keyed to vermilion.
- **Body prose**: **Recia**, weight 400, 0.9375rem–1rem, line-height 1.65. Used in orientation block, card body, testimonial, "Math" section.
- **Meta / UI** (eyebrow, stat label, button, form): General Sans, weight 500–600.
- **Eyebrow**: 0.6875rem, weight 600, uppercase, letter-spacing 0.14em. Color `--color-accent` (on light) or `--color-accent-light` (on dark).

**Font loading:** Use Fontshare CDN (`api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=recia@400,500`). Preload the two most-used weights. Remove Plus Jakarta Sans and Newsreader imports.

## Components

### Button

Current primary uses `bg-primary` (teal #0d6b63), `rounded-lg`, with a heavy teal shadow on hover. This changes across the whole site — not just the Assessment page.

- **Primary:** `bg-accent` (#ea580c), white text, General Sans weight 600, `rounded-lg` (8px — not pill; pill reads more startup-SaaS than editorial). Hover: darken to `--color-accent-hover` + subtle `translateY(-1px)`. Keep the `active:scale-[0.98]`. Drop the colored glow-shadow.
- **Secondary:** transparent, 1px `border-rule-strong`, `text-ink`. Same radius. Hover: fill `paper-alt`.
- **Ghost / link:** underlined inline text with `underline-offset-4`, `text-ink/70` → `text-accent` on hover. No background. Used for "Not ready? Take the 2-min quiz" style secondary links.
- Delete the deep teal `shadow-[0_4px_14px_-2px_rgba(13,107,99,0.35)]` hover — replace with a neutral `shadow-sm` on hover only.

**Global impact:** primary buttons on `/`, `/about/`, `/scan/`, all service pages change from teal to vermilion. Accepted trade-off — we want the accent unified.

### Section

Current Section has a `background` prop mapping `white → bg-warm-white`, `muted → bg-stone`. Currently also renders the `h2` title in `font-serif font-normal` with a 2.5rem copper accent rule below. All of this changes in place.

- Update `bgClasses`: `white → bg-paper` (pure white), `muted → bg-paper-alt` (neutral gray), `dark → bg-ink text-paper` (keep dark variant).
- Update `h2` title: `font-sans font-medium` (General Sans 500), keep the fluid-clamp sizing.
- Replace the 2.5rem `.section-rule` under titles: either drop it (lean into hairlines), or retain at 1px `--color-accent` 2.5rem width. **Spec calls for drop** — the section top-hairline does the structural work instead.
- Eyebrow: replace `text-warm-gray` default with `text-subtle` (#737373, neutral); on dark sections, `text-accent-light`. The number portion (`01`, `02`) stays in the copy.
- Add a top hairline on each section: `border-top: 1px solid --color-rule-strong` (black 1px) for section-as-broadsheet-column feel. Exceptions: the hero section has no top rule (it's full-bleed dark), and the dark CTA footer has no top rule (visual reset before page end).
- Section padding: keep existing `sm/md/lg/xl` mapping — no change.

**Global impact:** every section header on every page loses the serif h2 and copper rule, and gains a black top-hairline. This is part of the intended system-wide modernization, not a Assessment-only change.

### Cards (editorial hairlines)

New pattern: `<div class="hairline-grid">` wrapper with top+bottom structural rules and vertical rules between cells. No per-card background, no border-radius, no hover lift.

```svelte
<div class="hairline-grid grid md:grid-cols-3">
	<div class="cell">
		<p class="eyebrow">What this is</p>
		<div class="prose">...</div>
	</div>
	...
</div>
```

CSS:

```css
.hairline-grid {
	border-top: 1px solid var(--color-rule-strong);
	border-bottom: 1px solid var(--color-rule);
}
.cell {
	padding: 1.5rem 1.25rem;
	border-right: 1px solid var(--color-rule);
}
.cell:last-child {
	border-right: none;
}
@media (max-width: 768px) {
	.cell {
		border-right: none;
		border-bottom: 1px solid var(--color-rule);
	}
	.cell:last-child {
		border-bottom: none;
	}
}
```

**Exceptions** — soft cards still used for:

- Dark-on-dark cards inside the dark CTA footer section (subtle `bg-white/[0.04]`, 8px radius).
- The "Speed-to-lead" callout (kept as a colored block, but use vermilion wash at 6% opacity instead of copper; 8px radius; no border, just the fill).

### Hero

Replace all custom `.hero-*` classes with a much leaner set. Drop:

- `.hero-monogram` + `.hero-monogram-container` + `@keyframes monogram-settle`
- `.hero-grid`, `.hero-glow`, `.hero-rules`, `.texture-grain` usage on hero
- `.hero-accent-line` + `@keyframes accent-line-draw`
- `.hero-line-*` staggered animations + `@keyframes hero-line-in`
- `.hero-headline-em` copper italic flourish (replaced with a plain vermilion accent on periods / short ital in Recia subhead)
- The horizontal architectural rule band

Keep:

- Full-bleed dark hero, `-mt-16 md:-mt-20` pull under header
- `hero-eyebrow-row` (simplified: just a flex row with the label + meta)
- `hero-stat-bar` (simplified: hairline top, flex row, no alt-column-layouts — same on desktop/mobile with reduced gap at narrow widths)
- `reveal` scroll-in action on body sections

New hero structure (see AI Tools Assessment page below).

### Icons & motif

- Drop the copper `→` and `✓` arrows rendered inline. Use Heroicons (outline, 16–20px) in `--color-accent`.
- Don't introduce any decorative SVGs. If something needs a visual anchor, use a numbered prefix (`01`, `02`) or a vertical hairline, never a wordmark/monogram.

## AI Tools Assessment page — Revisions

File: `src/routes/ai-tools-assessment/+page.svelte`

### Hero

```svelte
<section
	class="relative bg-ink text-paper overflow-hidden -mt-16 md:-mt-20"
	aria-label="Hero"
	use:trackHeroExit
>
	<div
		class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-36 md:pt-40 pb-16 md:pb-20 flex flex-col gap-14 min-h-[clamp(70svh,80svh,90svh)]"
	>
		<div
			class="flex items-baseline gap-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
		>
			<span class="text-accent-light">AI Tools Assessment</span>
			<span class="text-paper/55 font-normal tracking-[0.08em]"
				>Services businesses · 10–50 people</span
			>
		</div>

		<div class="flex-1 flex flex-col justify-center max-w-4xl">
			<h1
				class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
			>
				Stop bleeding hours, leads, revenue.
			</h1>
			<p class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/75 max-w-2xl">
				A 45 minute call. An action plan <em class="text-accent-light italic"
					>you can start this week</em
				>. What to install, what to skip.
			</p>
			<p class="mt-4 text-sm text-paper/65 max-w-2xl">
				Ex-DoorDash, Square, Mudflap. I'll handle the AI — you handle your business.
			</p>
			<div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
				<Button href={getAssessmentCallUrl()} size="lg">Book the assessment</Button>
				<a
					href="/quiz/"
					class="text-sm text-paper/85 underline underline-offset-4 hover:text-accent-light transition-colors"
				>
					Not ready? Take the 2-min quiz first →
				</a>
			</div>

			<!-- Note: the dark hero overrides Button's default primary (vermilion fill remains), but hover state is tuned on dark — see Button component spec. -->
		</div>

		<div class="pt-6 border-t border-paper/10 grid grid-cols-3 gap-6 md:gap-12">
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">5–7 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">
					Recovered / week
				</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">45 min</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">
					Your time
				</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">48 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">
					Plan delivered
				</div>
			</div>
		</div>
	</div>
</section>
```

No monogram. No accent line. No grid. No glow. No grain. Flat black ground, content does the work.

### Orientation block ("The short version")

Light section, editorial hairline grid (3 columns desktop, 1 col mobile). No card backgrounds. Eyebrow = section label; each cell has its own eyebrow (`What this is`, `Who it's for`, `Why me`) + serif prose body.

### Section 01 — "Where the time goes"

- Business-type selector: pill buttons, light background. Active = `bg-accent text-paper`. Inactive = `border-rule text-ink/75`, hover `border-ink/30`.
- Problem cards: hairline grid (`sm:grid-cols-2`), no card bgs. Each cell has `h3` (General Sans) + Recia body paragraph.
- Speed-to-lead callout: single block with `bg-accent/[0.06]` (no border), 8px radius, accent-colored eyebrow, Recia body.

### Section 02 — "What you walk away with"

- Hero-tagline (`Talk. Plan. Build.`): General Sans weight 600, `clamp(2rem, 4vw, 3rem)`, each word in `text-accent`. Center-aligned.
- Three phases: hairline grid, no card bgs. Phase eyebrow (`Phase 01`) + `h3` title + Recia prose + footer meta line separated by thin top rule.

### Section 03 — "What I won't tell you to automate"

- Lead paragraph in Recia, 1.125rem.
- Four "don't automate" blocks: hairline grid (`sm:grid-cols-2 lg:grid-cols-4`). Each cell: `Don't automate` eyebrow + `h3` + Recia body.
- Bottom callout: `bg-accent/[0.06]`, no border, 8px radius, General Sans for the bold opener + Recia continuation.

### Section 04 — "The math"

- Big stat `5–7 hours/week`: General Sans weight 600, `clamp(3rem, 6vw, 5rem)`. `/` in vermilion, `week` in muted.
- Math-block body: Recia prose. No card background — sits on section ground with a left accent rule (2px solid vermilion, left of text).
- Guarantee callout: hairline-wrapped block (top + bottom hairlines, no background) with Heroicons shield-check in vermilion at left.

### Section 05 — "Is this the right fit?"

- Two-column hairline grid (right fit / not a fit).
- `Right fit` eyebrow in accent; `Not a fit` eyebrow in `--color-subtle`.
- List items: Recia body. Checkmark = Heroicons `check` in accent (8px tall, inline-block). Cross = Heroicons `x-mark` in `--color-subtle`.
- No card backgrounds.

### Section 06 — "Who's behind this"

- 2-col layout: Recia prose left (2 cols of a 3-col grid), meta boxes right.
- Meta boxes: no card bgs, just a left 1px accent rule (`border-l border-accent pl-4`), eyebrow + content stacked.

### Section 07 — "Common questions" (FAQ)

- Details blocks: no card bgs, full-width hairline separators between items (top hairline on each).
- Summary: General Sans weight 500, 1rem. Arrow: Heroicons `chevron-down`, 16px, subtle.
- Answer: Recia prose, 0.9375rem, line-height 1.65, `text-muted`.

### Dark CTA footer

- Stays dark. Drop the grid overlay and the radial glow. Keep simple: black ground, vermilion eyebrow, General Sans `h2` (not serif), Recia subhead, pill button.
- Two "what comes next" cards above the CTA: keep soft radius (8px) on dark because hairlines disappear on black — these are the only cards that retain a bg.

### Sticky mobile CTA

Keep, restyle: `bg-ink/95 backdrop-blur border-t border-paper/10`. Accent pill button. Font = General Sans.

## Motion

Keep only:

- Hero content fade-in once on load (single staggered group, 0.6s duration max, ease-out).
- `reveal` IntersectionObserver fade-up (6px, 0.5s) on scroll entrance.
- Button hover translate-y.
- `details` open animation (existing).
- View transitions between routes (existing).

Drop:

- `hero-monogram` settle
- `hero-accent-line-draw`
- `hero-line-in` per-line stagger
- `stack-build` bottom-to-top layer animation (irrelevant on this page, but flagged for homepage too)
- `ambient-warm` glow
- `.texture-grain`
- `.hero-grid`, `.hero-rules`, `.hero-glow`, `.hero-monogram-container`, `.hero-monogram`, `.hero-accent-line` CSS — delete from `tailwind.css`

`prefers-reduced-motion` block simplifies to disabling the hero fade-in and scroll reveal.

## Migration Strategy

This ships in two layers: a **system floor** (global — affects every page) and a **page revision** (just `/ai-tools-assessment/`).

**System floor — lands site-wide on merge:**

1. **New tokens** added to `@theme`: `--color-paper`, `--color-paper-alt`, `--color-rule`, `--color-rule-strong`, `--color-muted`, `--color-subtle`, `--color-faint`, `--color-accent`, `--color-accent-hover`, `--color-accent-light`, `--font-prose`.
2. **Old token aliases** (`warm-white`, `stone`, `copper`, `font-serif` → Newsreader) left in place for now. Old pages that directly reference these keep working, with two exceptions:
   - `--color-copper` references that render visibly (rules, arrows, eyebrow text) get a visual shift when we update those tokens to a vermilion mapping (see step 3).
   - Components that change (below) propagate their new look everywhere.
3. **Primary buttons** (`Button variant="primary"`) go from teal to vermilion globally. Drop the colored glow-shadow. This is accepted — the unified accent is the point.
4. **Section titles** go from Newsreader serif to General Sans medium globally. Copper accent rule below titles is removed. Section tops gain a black 1px hairline (skipped on hero + dark CTA footer — both opt out).
5. **Typography** globally: load General Sans + Recia from Fontshare; remove Plus Jakarta Sans + Newsreader.
6. **New utility class**: `.hairline-grid` + `.cell` added to `tailwind.css` under a clearly labeled section.
7. **Smoke-check** every page in `src/routes/` at dev time — confirm no layout break, even if they still look half-old/half-new. Flagged pages for future modernization: `/`, `/about/`, `/scan/`, `/context-build/`, `/orchestration-build/`, `/fit/`, `/fractional/`, `/ai-audit/`, `/assessment/`, `/workshop/`, `/quiz/`, `/contact/`.

**Page revision — only `/ai-tools-assessment/`:**

1. All custom hero CSS (`.hero-monogram`, `.hero-grid`, `.hero-glow`, `.hero-rules`, `.hero-accent-line`, `.hero-line-*`, `.hero-headline-em` plus keyframes) deleted from `tailwind.css`.
2. Hero rewritten per spec (flat dark, no monogram, no glow, no grain).
3. All card sections on the page converted from `bg-warm-white rounded-xl border` pattern to `.hairline-grid` / `.cell`.
4. Copper references (`text-copper`, `border-copper/*`, `bg-copper/*`) swapped for `text-accent` / `border-accent/*` / `bg-accent/*` — within the page's own JSX.
5. Motion deleted per the Motion section.

Homepage + other pages get modernized in a follow-up pass. The system floor gives them a softer landing (neutral backgrounds, new accent, sans section titles) without breaking them.

## Out of Scope (for this spec)

- Full modernization of homepage, about, scan, context-build, orchestration-build, quiz, ai-audit, assessment pages.
- Header/Footer component redesign.
- Brand doc updates in `piers-os/resources/domeworks/`.
- Section component API overhaul — we extend, not rebuild, in this pass.

These are follow-ups once the direction is validated on `/ai-tools-assessment/`.

## Success Criteria

- `/ai-tools-assessment/` reads as modern editorial, not premium consultancy.
- No serif headlines anywhere on the page.
- No copper anywhere on the page.
- No monogram, no grain, no ambient glow.
- Type pairs General Sans + Recia throughout.
- Card sections use editorial hairlines, not backgrounds + radius + borders.
- Motion feels purposeful, not decorative.
- Mobile hero reads cleanly at 360px.
- Passes `yarn check`, `yarn lint`, `yarn build` without errors.
