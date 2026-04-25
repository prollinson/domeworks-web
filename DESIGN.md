---
version: alpha
name: DomeWorks Editorial
description: >-
  Editorial-newspaper visual language for DomeWorks — an AI consultancy for
  owner-operated services firms. Codified from the /smb Assessment page
  (src/lib/components/smb/AssessmentPage.svelte), which is the canonical
  reference implementation. When any other page diverges from the tokens or
  patterns below, this document is the tie-breaker.

colors:
  # Neutrals — the page is built from these. Accent is used sparingly.
  ink: '#0A0A0A' # Primary text, strong top rules, dark backgrounds.
  charcoal: '#1A1A1A' # Reserved for depth variants on dark surfaces.
  paper: '#FFFFFF' # Primary background.
  paper-alt: '#FAFAFA' # Muted section background — alternates with paper.
  rule: '#E5E5E5' # Default hairline.
  rule-strong: '#0A0A0A' # Structural top rule above card grids.
  muted: '#525252' # Secondary body text.
  subtle: '#6B6B6B' # Tertiary text, demoted eyebrows.
  faint: '#A3A3A3' # Rarely used; meta labels on paper.

  # Accent — vermilion. A single hue carries all emphasis on the page.
  accent: '#C2410C' # On paper: CTAs, rules, selected states, copper emphasis.
  accent-hover: '#9A3412' # Hover state of accent on paper.
  accent-light: '#FB923C' # On ink: hero eyebrows, inline emphasis, dark-surface accents.

  # Functional aliases used by components.
  primary: '{colors.accent}'
  on-primary: '{colors.paper}'
  surface: '{colors.paper}'
  surface-muted: '{colors.paper-alt}'
  surface-dark: '{colors.ink}'
  on-surface: '{colors.ink}'
  on-surface-dark: '{colors.paper}'

typography:
  # Two families do everything:
  #   Sans  — General Sans (UI, headlines, eyebrows). Weights 400, 500, 600.
  #   Serif — Recia        (editorial body, pull-quotes).  Weights 400, 500.

  # Display — hero headline. Fluid clamp() so it breathes across viewports.
  hero-h1:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.5rem, 7vw, 4.5rem)'
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: '-0.035em'

  # Section titles (H2). Rendered by Section.svelte with text-wrap: balance.
  section-title:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem)'
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: '-0.02em'

  # Editorial pull-quote / thesis breaks (the shape-break section between §04 and §05).
  pull-quote:
    fontFamily: 'Recia, Georgia, serif'
    fontSize: 'clamp(1.625rem, 3.6vw, 2.625rem)'
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: '-0.015em'

  # Big-number display — the "5–7 hours/week" math block.
  display-stat:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(3rem, 6vw, 5rem)'
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: '-0.03em'

  # Body — serif, editorial. The long-form default.
  body-serif-lg:
    fontFamily: 'Recia, Georgia, serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.65
  body-serif:
    fontFamily: 'Recia, Georgia, serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.55
  body-serif-sm:
    fontFamily: 'Recia, Georgia, serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.55

  # UI body — sans. Used in controls, meta rows, FAQ summaries, CTAs.
  body-sans:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  body-sans-sm:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5

  # Eyebrow — the signature micro-typographic device. Two variants.
  eyebrow-strong:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.6875rem' # 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '0.14em'
  eyebrow-quiet:
    fontFamily: 'General Sans, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.6875rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '0.14em'

rounded:
  none: '0px'
  sm: '2px' # focus-visible rings; small pill marks
  md: '6px' # dropdown panels, tag-like chips
  lg: '8px' # buttons, callout boxes, portrait frames
  pill: '9999px' # reserved; not used on Assessment page

spacing:
  # Scale: the page composes against a small vertical rhythm that spans
  # section gutters, section padding, and card interiors.
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px' # standard page gutter (px-6)
  xl: '32px' # lg page gutter (lg:px-8)
  '2xl': '40px' # card/grid vertical gap
  '3xl': '64px' # column gap between content and aside
  '4xl': '80px' # section bottom padding (md at md+)
  '5xl': '112px' # hero bottom padding / xl section padding at md+

  # Section padding presets (consumed by Section.svelte).
  section-sm: '40px' # py-10
  section-sm-md: '56px' # md:py-14
  section-md: '56px' # py-14
  section-md-md: '72px' # md:py-18
  section-lg: '64px' # py-16
  section-lg-md: '80px' # md:py-20
  section-xl: '80px' # py-20
  section-xl-md: '112px' # md:py-28

  # Content widths. Kept as named tiers; concrete values in px.
  content-sm: '768px' # max-w-3xl — copy blocks
  content-md: '896px' # max-w-4xl — pull quotes
  content-lg: '1024px' # max-w-5xl — card grids
  content-xl: '1280px' # max-w-7xl — hero frame

components:
  # --- Buttons -----------------------------------------------------------

  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.paper}'
    typography: '{typography.body-sans}'
    rounded: '{rounded.lg}'
    padding: '12px' # vertical; horizontal 24px — see prose
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.accent-hover}'
    textColor: '{colors.paper}'
  button-primary-active:
    backgroundColor: '{colors.accent-hover}'
    textColor: '{colors.paper}'

  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.body-sans}'
    rounded: '{rounded.lg}'
    padding: '12px'
    height: '48px'
  button-secondary-hover:
    backgroundColor: '{colors.paper-alt}'
    textColor: '{colors.ink}'

  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.muted}'
    typography: '{typography.body-sans}'
    rounded: '{rounded.lg}'
    padding: '12px'
    height: '48px'
  button-ghost-hover:
    backgroundColor: '{colors.paper-alt}'
    textColor: '{colors.accent}'

  button-sm:
    padding: '8px'
    height: '36px'
  button-lg:
    padding: '16px'
    height: '56px'

  # --- Section surfaces --------------------------------------------------

  section-paper:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
  section-muted:
    backgroundColor: '{colors.paper-alt}'
    textColor: '{colors.ink}'
  section-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'

  # --- Editorial card grid (hairline-grid) ------------------------------

  card-cell:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    padding: '24px'
  card-cell-on-muted:
    backgroundColor: '{colors.paper-alt}'
    textColor: '{colors.ink}'
    padding: '24px'

  # --- Eyebrow chips -----------------------------------------------------

  eyebrow-accent:
    textColor: '{colors.accent}'
    typography: '{typography.eyebrow-strong}'
  eyebrow-accent-light:
    textColor: '{colors.accent-light}'
    typography: '{typography.eyebrow-strong}'
  eyebrow-subtle:
    textColor: '{colors.subtle}'
    typography: '{typography.eyebrow-quiet}'

  # --- Callouts / highlights --------------------------------------------

  callout-accent:
    # The locked "Speed-to-lead" block above §01 cards.
    backgroundColor: '{colors.accent}' # used at 6–18% alpha in use; see prose
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '24px'
  callout-accent-strong:
    backgroundColor: '{colors.accent}' # 18% alpha when vertical leadsWithSpeed
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '24px'
  rule-left-accent:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    padding: '20px' # applied as padding-left only in practice

  # --- Dropdown (vertical selector, §01) --------------------------------

  dropdown-trigger:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.section-title}' # inline w/ section title scale
    rounded: '{rounded.sm}'
  dropdown-panel:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    padding: '8px'
  dropdown-option-active:
    backgroundColor: '{colors.accent}' # 10% alpha in use
    textColor: '{colors.accent}'

  # --- FAQ details -------------------------------------------------------

  faq-summary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.body-sans}'

  # --- Sticky mobile CTA bar --------------------------------------------

  sticky-cta-mobile:
    backgroundColor: '{colors.ink}' # 95% alpha + backdrop-blur
    textColor: '{colors.paper}'
---

## Overview

DomeWorks reads like a broadsheet, not a SaaS landing page. The visual target is
**editorial seriousness** — specific, numbered, typographically confident — with
a single hue (vermilion) carrying all emphasis.

Three non-negotiable commitments:

1. **Lead with pain, not framework.** The hero names a concrete loss ("a day a
   week back") before any architecture. Framework language ("Intelligence
   Stack", methodology labels) stays out of the first screen.
2. **Structure is the aesthetic.** Numbered sections (01 … 05), hairline card
   grids, left-accent rules, and editorial eyebrows are the ornament. There is
   almost no shadow, gradient, or illustration.
3. **One emphasis color per section.** Vermilion is scarce and deliberate.
   Over-using accent shouts; reserving it makes it mean something.

The page alternates `paper` → `paper-alt` → `paper` backgrounds, bookended by
full-bleed `ink` (dark) hero and final-CTA sections. That rhythm is the spine.

## Colors

### Neutrals — where 95% of the surface lives

| Token                | Hex       | Where                                                                 |
| :------------------- | :-------- | :-------------------------------------------------------------------- |
| `{colors.ink}`       | `#0A0A0A` | Body text on paper; dark section backgrounds; `rule-strong` top rules |
| `{colors.paper}`     | `#FFFFFF` | Default background                                                    |
| `{colors.paper-alt}` | `#FAFAFA` | Alternating "muted" section background                                |
| `{colors.muted}`     | `#525252` | Secondary copy — serif body paragraphs                                |
| `{colors.subtle}`    | `#6B6B6B` | Tertiary text, demoted eyebrows, "not a fit" column                   |
| `{colors.rule}`      | `#E5E5E5` | Hairlines between cards and meta rows                                 |

### Accent — vermilion, used sparingly

| Token                   | Hex       | Where                                                                                |
| :---------------------- | :-------- | :----------------------------------------------------------------------------------- |
| `{colors.accent}`       | `#C2410C` | CTAs, selected states, left-accent rules, **on paper only**                          |
| `{colors.accent-hover}` | `#9A3412` | Hover/pressed state of primary CTA                                                   |
| `{colors.accent-light}` | `#FB923C` | Eyebrows and inline emphasis **on ink** — `{colors.accent}` doesn't hit WCAG on dark |

**Rule of thumb:** Accent appears at most twice in any one viewport — once in an
eyebrow or left-rule, once in a CTA or dropdown underline. If a third use
appears, demote one to `{colors.subtle}`.

### What not to use

The legacy tokens `primary` (teal `#0D6B63`), `copper`, `warm-white`, `stone`
remain in `tailwind.css` so older pages still render, but **do not use them on
new work**. They are being migrated out. If you touch a component, convert its
colors to the vermilion palette above.

## Typography

Two families do everything:

- **General Sans** — headlines, eyebrows, UI, data. Weights in use: 400, 500, 600.
- **Recia** (serif) — body paragraphs, pull-quotes, editorial voice. Weights: 400, 500.

### Hierarchy

| Role             | Token                         | Notes                                                                                      |
| :--------------- | :---------------------------- | :----------------------------------------------------------------------------------------- |
| Hero headline    | `{typography.hero-h1}`        | `clamp(2.5rem, 7vw, 4.5rem)`, -0.035em, semibold. One per page.                            |
| Section title    | `{typography.section-title}`  | `clamp(1.875rem, 2.5rem)`, medium. Rendered by `Section.svelte` with `text-wrap: balance`. |
| Pull-quote       | `{typography.pull-quote}`     | Serif. Used once per page as a shape-break between §04 and §05.                            |
| Card title       | 18–20px / 1.2 / medium, sans  | Inside `.hairline-grid > .cell`.                                                           |
| Body (editorial) | `{typography.body-serif-lg}`  | Default for long-form paragraphs.                                                          |
| Body (UI / meta) | `{typography.body-sans-sm}`   | Dropdown options, FAQ summaries, meta rows.                                                |
| Eyebrow          | `{typography.eyebrow-strong}` | 11px, 0.14em tracking, uppercase, semibold. Always paired with a color token.              |
| Display stat     | `{typography.display-stat}`   | Reserved for the math block ("5–7 hours/week"). One per page.                              |

### Serif vs. sans — when to choose

- **Serif** carries slow, considered reading: section leads, card bodies, FAQ
  answers, pull-quotes. It signals editorial voice.
- **Sans** carries scannable information: eyebrows, headlines, card titles,
  CTAs, meta ("$999", "45 min", "48 hours"), dropdown options.

The hero headline is sans. The hero sub-headline is serif. That contrast —
bold claim in sans, qualifying sentence in serif — is the signature.

### Eyebrows

Eyebrows are the workhorse micro-typographic device on the page. Every major
block has one:

- Section numbers (`01`, `02` …) above titles.
- "Time / Flat fee / Plan in" labels above the hero meta values.
- "Right fit if you" / "Not a fit if you" above the two fit columns.
- Kicker labels on the §02 "What I won't automate" cards.

Always: **uppercase, 11px, 0.14em tracking, semibold.** Only the color changes
(`{colors.accent}` for emphasis, `{colors.subtle}` for demoted / quiet,
`{colors.accent-light}` on dark).

## Layout

### Container and gutters

- **Page gutter:** `px-6 lg:px-8` (24px mobile → 32px desktop). Applied on every
  section wrapper.
- **Content widths:** `max-w-3xl` for copy blocks (intro paragraphs, leads),
  `max-w-5xl` for card grids, `max-w-4xl` for pull-quotes, `max-w-7xl` for the
  hero frame. Do not exceed `max-w-5xl` for card content — wider reading lines
  break the editorial feel.

### Section rhythm

Sections alternate `paper` → `paper-alt` strictly:

```
[dark hero]
§01 paper   §02 paper-alt   §03 paper   §04 paper-alt
[pull-quote paper, full-bleed with rule-top/rule-bottom]
§05 paper   [who's behind — paper-alt]   [FAQ paper]
[dark CTA]
```

The two dark bookends frame the argument. The pull-quote break sits roughly at
the 60% scroll mark and resets pace before the qualifying fit section.

### Section padding

From `Section.svelte`:

| Size | Mobile  | ≥768px  |
| :--- | :------ | :------ |
| `sm` | `py-10` | `py-14` |
| `md` | `py-14` | `py-18` |
| `lg` | `py-16` | `py-20` |
| `xl` | `py-20` | `py-28` |

The Assessment page uses `md` throughout. `lg`/`xl` are reserved for hero
framing and dark CTA bands.

### Numbered sections

Sections §01 through §05 carry an `eyebrow` that is literally their index. The
Who's-behind, FAQ, and CTA sections intentionally drop the number — they are
the margins, not the argument. Do not number every section just because you
can. The gap itself communicates that the core argument ended at §05.

### Hero layout

At `lg+` the hero is a two-column grid: headline+subhead on the left, a
right-rail `<aside>` with the three-line "you walk away with" promise and a
three-cell meta dl. At `md` the aside is hidden and the meta row appears under
the CTAs instead. At `<md` the aside re-appears as a stacked block. This
three-mode responsive behavior is intentional — tablet is the hardest
breakpoint for editorial layouts, and restoring meta inline solves it.

## Elevation & Depth

The page is **almost entirely flat**. Depth is expressed through hairlines,
surface color shifts, and motion — not shadow. Specifically:

- **Hairlines over borders.** The `.hairline-grid` pattern uses a 1px grid gap
  over a `rule`-colored background rather than per-cell borders. This gives
  broadsheet-style interior rules that work at any column count with no
  dangling edges.
- **Sticky shadow rail.** When the §01 vertical selector sticks at `md+`, it
  grows a single-pixel bottom shadow (`0 1px 0 0 var(--color-rule)`) to read as
  a separate layer. That is the only shadow on a non-interactive element.
- **Button lift.** `.card-lift` and the primary button both lift 1–2px and gain
  a faint shadow on hover. That is the interactive-depth cue.
- **Dropdown panel.** The only real drop-shadow on the page: the `§01`
  listbox panel uses `shadow-lg shadow-ink/10` because it must read as overlay.
- **Dark surfaces carry no shadow.** The hero and final CTA sit flat on `ink`;
  depth there comes from the `accent-light` eyebrow catching the eye.

### Motion — the kinetic layer

All motion goes through the `reveal` action in `src/lib/actions/reveal.ts`.
Defaults: `240ms`, `cubic-bezier(0.16, 1, 0.3, 1)`, 8px translate, 2–4px blur
lift. Stagger between siblings: 70–180ms.

- Respect `prefers-reduced-motion`. The action short-circuits and paints final
  state. Do not add motion that bypasses this.
- Buttons `active:scale-[0.98]`. Details blocks open with a 300ms slide-down.
- The sticky mobile CTA fades in only after the hero scrolls out of view
  (IntersectionObserver on the hero `<section>`).

## Shapes

Tailwind's default corner scale, used sparingly:

| Token          | Value | Where                          |
| :------------- | :---- | :----------------------------- |
| `{rounded.sm}` | 2px   | Focus rings, small chips       |
| `{rounded.md}` | 6px   | Dropdown panel, portrait frame |
| `{rounded.lg}` | 8px   | Buttons, callout boxes         |

**Do not** use `rounded-2xl` or larger. Hero aside, card cells, and the
hairline grid are all **square-cornered** — roundness is a cue for "this is
interactive / this is a contained object," not decoration.

### Left-accent rule

The most distinctive shape on the page isn't round — it's the 2px vermilion
`border-l` on `.rule-left-accent` (and 1px thin variant `.rule-left-accent-sm`).
It carries editorial emphasis where a pull-quote would be too loud. Used for
the §04 math block and the "Still have questions?" aside.

## Components

All components live under `src/lib/components/` and are documented here against
their token output.

### Button (`ui/Button.svelte`)

Props: `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`,
optional `href` (renders `<a>`), `onclick`.

- **Primary** — vermilion fill, white text, `{rounded.lg}`, `shadow-sm` → lift
  on hover. The only high-chroma element in most sections.
- **Secondary** — transparent with `ink` border and text. Used when the
  primary is already present in the same viewport (e.g., hero CTA + quiz
  link).
- **Ghost** — text-only, `muted` → `accent` on hover. Not used on the
  Assessment page but reserved for future nav-like placements.

Sizes map to `px-4/6/8` × `py-2/3/4`. Always pair `lg` buttons with dark hero
or dark CTA surfaces; pair `md` elsewhere.

### Section (`layout/Section.svelte`)

Props: `background: 'white' | 'muted' | 'dark'`, `padding: 'sm'|'md'|'lg'|'xl'`,
`eyebrow`, `title`, `description`, `centered`.

- Centers title/description by default. **On the Assessment page, every
  numbered section passes `centered={false}`** — the left-aligned title is the
  editorial signal. Centered section titles are for simpler marketing pages,
  not Assessment-style pages.
- `eyebrow` auto-recolors: `{colors.subtle}` on paper, `{colors.accent-light}`
  on dark. Pass numeric indices (`"01"`, `"02"` …) as eyebrows where the
  section is part of the spine.

### Hairline grid (`.hairline-grid` in `tailwind.css`)

The broadsheet card pattern. Structure:

```html
<div class="hairline-grid grid sm:grid-cols-2 lg:grid-cols-4" use:reveal={{ stagger: true }}>
  <div class="cell">...</div>
  ...
</div>
```

- Gap of 1px over a `var(--color-rule)` background paints the interior rules.
- `border-top` is `rule-strong` (`ink`); `border-bottom` is `rule`. The heavier
  top rule visually anchors the group.
- Add `.on-muted` to the grid when it sits in a `paper-alt` section so cells
  match their parent surface.
- **Never** add `rounded-*` or per-cell borders — the grid's aesthetic is
  precisely the absence of those.

### Vertical selector (§01 inline dropdown)

An editorial-styled listbox (see `AssessmentPage.svelte:554–636`). Two things
make it distinct:

1. It reads as **inline copy** ("Show me leaks for **Services (general)** ▾"),
   not a form field — underlined in `{colors.accent}`, rendered at the section
   title's size.
2. It is **sticky at `md+`** so the filter stays in view while card content
   scrolls. Inline (non-sticky) on mobile to avoid conflict with the fixed
   bottom CTA.

Full keyboard + ARIA: `aria-haspopup="listbox"`, `aria-expanded`,
`aria-activedescendant`, Arrow/Home/End/Enter/Escape handling, focus return.
Do not replace with a native `<select>` — we explicitly lose the typographic
integration.

### Eyebrow + numbered index

```html
<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase">01</p>
```

The whole page leans on this pattern. The hero even uses a compound eyebrow —
label + hairline divider + meta — using `<span class="h-3 w-px bg-paper/25">`
as the divider. That glyph-sized rule is the house style for separating
related eyebrow text.

### Right-rail aside

Hero and FAQ both use a right-rail aside with `lg:border-l` / `lg:pl-10`.
Pattern: primary content at `minmax(0, 1fr)`, aside at `minmax(280px, 360px)`
or `minmax(0, 1fr)` for FAQ. The aside collapses to a full-width stacked block
below `lg` with a top rule replacing the left rule.

### FAQ details block

Native `<details>` / `<summary>` with per-row `border-b border-rule`, chevron
that rotates 180° on open, and a single "Expand all" toggle that binds every
row's `open` attribute. A 300ms slide-down animation runs on open via
`details[open] > summary ~ *`. This gets progressive-enhancement for free —
non-JS users still get a working FAQ.

### Sticky mobile CTA

Shown only after the hero scrolls out (`showStickyCta` state, driven by
`IntersectionObserver` on the hero section). `ink/95` background with
`backdrop-blur-sm`, single-line label + `sm` primary button. Hidden at `md+`
because the desktop hero CTA stays reachable.

## Do's and Don'ts

These are distilled from the last fifty commits on the SMB track and the
council review on 2026-04-04. Follow the rule; the memory tracks the "why"
behind it.

### Do

- **Lead with pain, not framework.** The hero should name a concrete loss a
  reader recognizes inside five seconds. Methodology labels go in §03 at
  earliest.
- **Number the spine (§01–§05), not the margins.** Who's-behind, FAQ, and CTA
  sit outside the numbering. If you add a new body section, decide whether
  it's spine or margin before numbering it.
- **Alternate paper / paper-alt strictly.** Two `paper-alt` sections in a row
  collapse the rhythm. If you need three sections of the same type, insert a
  pull-quote or dark band to reset.
- **Serif for long reading, sans for data.** Section leads, card bodies, FAQ
  answers → serif. Numbers, eyebrows, CTAs, meta → sans. This is the signature.
- **One primary CTA per viewport.** Hero has "Book the assessment" + a quiet
  underlined text link to the quiz. FAQ aside has a button. Dark footer has
  the same button. Do not stack two filled buttons side by side.
- **Use `reveal` for entrance; let nothing else move.** Hover depth on
  buttons/cards only. No parallax, no auto-animating hero illustrations.
- **Keep the ✓ / ✕ columns asymmetric.** The "right fit" column uses
  `{colors.accent}` kicker and heavier body; the "not a fit" column uses
  `{colors.subtle}` and lighter body. Equal weight reads as a checklist, not a
  qualifier.
- **Respect `prefers-reduced-motion`.** Every motion source in the codebase
  already does; verify any new addition does too.

### Don't

- **Don't reintroduce the legacy teal (`{colors.primary}` = `#0D6B63`).** It
  clashes with vermilion and belongs to an older positioning. Migrate any page
  still using it rather than adding more.
- **Don't use `{colors.accent}` on dark surfaces.** It doesn't hit WCAG AA on
  ink. Use `{colors.accent-light}` instead, and save `accent` for paper.
- **Don't round card cells or the hairline grid.** Square corners are the
  grid's aesthetic. If something feels "too harsh" the fix is more
  whitespace, not more radius.
- **Don't give the 30-day guarantee hero real estate.** It was demoted
  deliberately — trust signals sit in §04 or the dark footer, not above the
  fold. Hero is for the claim, not the reassurance.
- **Don't number every section.** The gap between §05 and "Who's behind this"
  is communicative — it says the argument has closed. Numbering everything
  flattens that signal.
- **Don't stack a second filled primary button adjacent to the hero CTA.** Pair
  the primary with a quiet text link, not another button. The "Not ready? Take
  the 2-min quiz" link is the template.
- **Don't replace the inline dropdown with a native `<select>`.** Losing the
  typographic integration loses the editorial tone of §01 entirely. If the
  listbox's complexity is a problem, fix the component — don't downgrade it.
- **Don't add illustration, gradient mesh, or decorative SVG.** The page's
  authority comes from restraint. The only SVGs in use are 7×7 inline icons
  in §03 "How it works" and the chevrons on interactive controls.
- **Don't use shadow as a primary depth cue.** Reach for a hairline, a surface
  change, or typography contrast first. The one exception is overlay
  (dropdown panel).
