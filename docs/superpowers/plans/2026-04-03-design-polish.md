# Homepage Design Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the site's visual design to match the hero's editorial ambition — swap the generic sans-serif, break section monotony, strengthen the AI Stack diagram, differentiate service cards, tighten spacing, and fix the footer CTA.

**Architecture:** All changes are CSS/HTML-level. No new components needed. Font swap touches `app.html` (Google Fonts link) and `tailwind.css` (@theme). Layout changes are in `+page.svelte` (homepage). Section padding change is in `Section.svelte`. Footer CTA change is in `Footer.svelte`.

**Tech Stack:** SvelteKit 5, Tailwind CSS 4, Google Fonts

---

### Task 1: Swap Inter for Plus Jakarta Sans

Inter is flagged as a generic AI aesthetic font. Plus Jakarta Sans is geometric like Inter (so it pairs well with Newsreader) but has more personality — slightly rounder terminals, warmer feel. It's on Google Fonts, same weights available.

**Files:**

- Modify: `src/app.html:9-10` (Google Fonts link)
- Modify: `src/tailwind.css:19` (font-sans variable)

- [ ] **Step 1: Update Google Fonts link in app.html**

Replace the existing fonts link:

```html
<link
	href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
	rel="stylesheet"
/>
```

- [ ] **Step 2: Update font-sans in tailwind.css**

Change the `--font-sans` variable:

```css
--font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
```

- [ ] **Step 3: Visual check**

Open https://domeworks.localhost:1355/ and verify:

- Body text renders in Plus Jakarta Sans (check DevTools computed font)
- Navigation, buttons, eyebrow labels all use the new font
- Newsreader serif is unaffected in headlines
- No FOUT or layout shift

- [ ] **Step 4: Commit**

```bash
git add src/app.html src/tailwind.css
git commit -m "design: swap Inter for Plus Jakarta Sans"
```

---

### Task 2: Tighten section padding

Current `lg` padding is `py-20 md:py-28` (80px/112px). This makes the page very tall with a lot of whitespace between sections that all look the same. Reducing to `py-16 md:py-24` (64px/96px) tightens the rhythm without feeling cramped.

**Files:**

- Modify: `src/lib/components/layout/Section.svelte:33`

- [ ] **Step 1: Update padding classes**

Change the `paddingClasses` object:

```typescript
const paddingClasses = {
	sm: 'py-10 md:py-14',
	md: 'py-14 md:py-18',
	lg: 'py-16 md:py-24',
	xl: 'py-24 md:py-32'
};
```

- [ ] **Step 2: Visual check**

Scroll through the full homepage. Sections should feel tighter but not cramped. The alternating warm-white/stone rhythm should still be clear.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/layout/Section.svelte
git commit -m "design: tighten section padding for better rhythm"
```

---

### Task 3: Redesign the AI Stack diagram as the visual anchor

The AI Stack is DomeWorks' intellectual centerpiece but it's currently four small bordered divs. Redesign it as a bold, full-width visual with larger type, color blocking, and spatial drama. Make it the visual climax of the homepage.

**Files:**

- Modify: `src/routes/+page.svelte:200-263` (The AI Stack section)

- [ ] **Step 1: Replace the AI Stack section content**

Replace everything between `<!-- The AI Stack -->` and `<!-- How It Works -->` with:

```svelte
<!-- The AI Stack -->
<Section background="white" padding="lg" eyebrow="03" title="The AI stack">
	<div class="max-w-5xl mx-auto" use:reveal>
		<p class="text-lg text-charcoal/70 leading-relaxed text-center mb-16 max-w-2xl mx-auto">
			Every organization running on AI needs four layers. Most have the top and bottom. The middle
			two are where AI actually coordinates work instead of just helping individuals.
		</p>

		<!-- AI Stack visual: bold stacked layers -->
		<div class="relative mb-16">
			<!-- "DomeWorks builds" indicator on left -->
			<div
				class="absolute -left-2 md:left-0 top-0 bottom-0 hidden lg:flex flex-col items-center"
				style="width: 3rem;"
			>
				<div class="flex-1"></div>
				<div class="relative flex flex-col items-center" style="height: 50%;">
					<div
						class="w-px h-full bg-gradient-to-b from-primary via-copper to-primary opacity-40"
					></div>
					<span
						class="absolute top-1/2 -translate-y-1/2 -translate-x-2 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase whitespace-nowrap"
						style="writing-mode: vertical-lr; transform: rotate(180deg) translateX(100%) translateY(-50%);"
						>DomeWorks builds</span
					>
				</div>
				<div class="flex-1"></div>
			</div>

			<div class="space-y-1 lg:pl-16">
				<!-- Surface layer -->
				<div class="rounded-t-2xl bg-stone border border-charcoal/8 px-8 py-6 md:px-10 md:py-7">
					<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
						<span class="text-sm font-semibold tracking-[0.15em] text-warm-gray uppercase"
							>Surface</span
						>
						<span class="text-charcoal/50 text-sm md:text-base">Where humans decide and act</span>
					</div>
				</div>

				<!-- Agent Coordination layer — primary highlight -->
				<div class="bg-primary px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
					<div
						class="absolute inset-0 opacity-10"
						style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%); background-size: 20px 20px;"
					></div>
					<div class="relative">
						<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
							<span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase"
								>Agent Coordination</span
							>
							<span class="text-white/60 text-sm md:text-base"
								>Routes work, validates output, closes feedback loops</span
							>
						</div>
						<p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
							Replaces the coordination work that hierarchy exists to perform.
						</p>
					</div>
				</div>

				<!-- Context System layer — copper highlight -->
				<div class="bg-copper px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
					<div
						class="absolute inset-0 opacity-8"
						style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.08) 75%); background-size: 20px 20px;"
					></div>
					<div class="relative">
						<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
							<span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase"
								>Context System</span
							>
							<span class="text-white/60 text-sm md:text-base"
								>Domain knowledge fed into every AI interaction</span
							>
						</div>
						<p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
							Builds the world model so AI doesn't start from zero every time.
						</p>
					</div>
				</div>

				<!-- Edge layer -->
				<div class="rounded-b-2xl bg-stone border border-charcoal/8 px-8 py-6 md:px-10 md:py-7">
					<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
						<span class="text-sm font-semibold tracking-[0.15em] text-warm-gray uppercase"
							>Edge</span
						>
						<span class="text-charcoal/50 text-sm md:text-base">Tools, APIs, repos, CI/CD</span>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-2xl mx-auto">
			<p class="text-lg text-charcoal/70 leading-relaxed border-l-2 border-copper pl-6">
				I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a
				strategy deck. I stay until the context system and agent coordination are running and your
				team can maintain them without me.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual check**

The two middle layers (Agent Coordination and Context System) should be bold, color-blocked bands — teal and copper respectively — with larger serif pull quotes. The outer layers should be muted stone. The "DomeWorks builds" indicator should appear on desktop as a vertical label with a gradient line.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "design: redesign AI Stack as bold visual anchor"
```

---

### Task 4: Differentiate the service cards

Currently four identical white cards. Add color-coding and visual weight differences to signal the service progression.

**Files:**

- Modify: `src/routes/+page.svelte:266-313` (How It Works section cards)

- [ ] **Step 1: Replace the service cards grid**

Replace the content inside the How It Works Section (the `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ...">` and its children) with:

```svelte
<div
	class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
	use:reveal={{ stagger: true, staggerDelay: 150 }}
>
	<a
		href="/scan/"
		class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-primary card-lift flex flex-col relative overflow-hidden"
	>
		<div class="absolute top-0 left-0 right-0 h-1 bg-primary/30"></div>
		<span
			class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4 w-fit"
		>
			<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
			Start here
		</span>
		<h3 class="text-xl font-medium text-charcoal mb-2">AI Scan</h3>
		<p class="text-2xl font-normal font-serif text-charcoal mb-4">$2,500–$3,500</p>
		<p class="text-charcoal/60 text-sm flex-grow">
			In 48 hours, I diagnose where you are on the path from "bought tools" to "AI coordinates our
			work." You get a clear picture of what's missing and quick wins your team can act on this
			week.
		</p>
		<p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
	</a>

	<a
		href="/context-build/"
		class="group p-8 rounded-2xl border-2 border-primary bg-primary/[0.03] flex flex-col relative overflow-hidden"
	>
		<div class="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
		<span
			class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full"
		>
			Deep dive
		</span>
		<h3 class="text-xl font-medium text-charcoal mb-2 mt-2">Context Build</h3>
		<p class="text-2xl font-normal font-serif text-charcoal mb-4">$10,000–$15,000+</p>
		<p class="text-charcoal/60 text-sm flex-grow">
			I map your organization's world model gaps, design the context system, and build the
			infrastructure that feeds your domain knowledge into every AI interaction. Your team goes from
			"every prompt starts from zero" to "AI knows our business."
		</p>
		<p class="mt-4 text-sm text-charcoal/50">1-2 week assessment + 4-week build</p>
	</a>

	<a
		href="/orchestration-build/"
		class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col relative overflow-hidden"
	>
		<div class="absolute top-0 left-0 right-0 h-1 bg-copper/30"></div>
		<h3 class="text-xl font-medium text-charcoal mb-2">Orchestration Build</h3>
		<p class="text-2xl font-normal font-serif text-charcoal mb-4">4–12 weeks</p>
		<p class="text-charcoal/60 text-sm flex-grow">
			I build the agent coordination layer: multi-agent workflows, quality gates, output routing.
			Your team goes from "AI helps individuals" to "AI coordinates our work."
		</p>
		<p class="mt-4 text-sm text-charcoal/50">Day rate, scoped from assessment</p>
	</a>

	<a
		href="/fractional/"
		class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col relative overflow-hidden"
	>
		<div class="absolute top-0 left-0 right-0 h-1 bg-copper/30"></div>
		<span
			class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-copper bg-copper/10 rounded-full mb-4 w-fit"
		>
			<span class="w-1.5 h-1.5 rounded-full bg-copper"></span>
			What comes after
		</span>
		<h3 class="text-xl font-medium text-charcoal mb-2">Fractional AI Leadership</h3>
		<p class="text-2xl font-normal font-serif text-charcoal mb-4">Monthly retainer</p>
		<p class="text-charcoal/60 text-sm flex-grow">
			1–2 days/week. I maintain and evolve the context system and agent coordination, close feedback
			loops, and make sure the infrastructure compounds as your org changes.
		</p>
		<p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>
	</a>
</div>
```

Key changes:

- Top color bar on each card (teal for first two, copper for last two) — signals the service progression
- Dot indicator on badge pills for visual weight
- Orchestration card hovers to copper instead of primary
- Subtle tinted background on the Context Build featured card

- [ ] **Step 2: Visual check**

Cards should show a visual progression: teal-accented cards (Scan, Context Build) are the diagnostic phase, copper-accented cards (Orchestration, Fractional) are the build/maintain phase. The Context Build card should still feel "featured" with its border and badge.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "design: differentiate service cards with color progression"
```

---

### Task 5: Break section monotony — make "The problem" section use asymmetric layout

Currently every section below the hero is centered text in a `max-w-2xl` container. Break the pattern on the first content section by using a two-column layout with a pull quote.

**Files:**

- Modify: `src/routes/+page.svelte:164-180` (The Problem section)

- [ ] **Step 1: Replace the Problem section content**

Replace the entire `<!-- The Problem -->` section with:

```svelte
<!-- The Problem -->
<Section background="muted" padding="lg" eyebrow="01" title="The problem isn't the tools">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-5 gap-10 md:gap-16 items-start">
			<!-- Left column: prose -->
			<div class="md:col-span-3 space-y-6">
				<p class="text-lg text-charcoal/70 leading-relaxed">
					Your team has AI tools. But your organization still coordinates the same way it always
					has: through hierarchy, meetings, and people relaying information.
				</p>
				<p class="text-lg text-charcoal/70 leading-relaxed">
					Engineers re-explain their architecture to every AI prompt. Managers spend their days
					aggregating context from three teams so a fourth team can act on it. Status meetings exist
					because information doesn't flow without human relay chains. The tools work fine
					individually. What's missing is the intelligence infrastructure that replaces the
					coordination overhead.
				</p>
			</div>
			<!-- Right column: Block proof point -->
			<div class="md:col-span-2">
				<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10 sticky top-24">
					<p class="text-charcoal/70 leading-relaxed">
						<strong class="text-charcoal">Block</strong> (the company behind Square and Cash App)
						recently published how they're rebuilding their entire organization this way, replacing
						middle management's coordination function with what they call a
						<em>"company world model."</em> They have the engineering capacity to build it internally.
						Most companies don't.
					</p>
					<p class="text-sm text-charcoal/50 mt-3">That's where DomeWorks comes in.</p>
				</div>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Visual check**

On desktop, the section should show prose on the left (~60%) and the Block proof-point card on the right (~40%) as a sticky sidebar. On mobile, the card should stack below the prose naturally.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "design: break section monotony with asymmetric problem layout"
```

---

### Task 6: Strengthen the footer CTA button

The footer CTA button is white-on-dark, which reads as secondary. Make it teal (primary) to match the site's primary action color and give it more visual weight.

**Files:**

- Modify: `src/lib/components/layout/Footer.svelte:28-35`

- [ ] **Step 1: Update the footer CTA button**

Replace the existing `<a>` CTA button with:

```svelte
<a
	href={getBookCallUrl()}
	class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all active:scale-[0.98] shadow-[0_4px_14px_-2px_rgba(13,107,99,0.4)] hover:shadow-[0_6px_20px_-2px_rgba(13,107,99,0.5)]"
>
	Book a discovery call
	<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17 8l4 4m0 0l-4 4m4-4H3"
		/>
	</svg>
</a>
```

- [ ] **Step 2: Visual check**

The button should be teal with a glow shadow against the dark footer background. It should feel like the primary action, not a secondary element.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/layout/Footer.svelte
git commit -m "design: strengthen footer CTA to primary teal"
```

---

### Task 7: Final visual review and screenshot comparison

**Files:**

- No file changes

- [ ] **Step 1: Take before/after screenshots**

Take full-page screenshots at 1440px and 390px widths using Playwright and compare with the pre-change screenshots saved at `/tmp/domeworks-desktop.png` and `/tmp/domeworks-mobile.png`.

- [ ] **Step 2: Check all pages**

Navigate to each route and verify nothing is broken:

- `/` (homepage)
- `/scan/`
- `/context-build/`
- `/orchestration-build/`
- `/fractional/`
- `/about/`
- `/contact/`

The font change (Task 1) and padding change (Task 2) affect all pages. Tasks 3-5 only affect the homepage. Task 6 affects the footer on all pages.

- [ ] **Step 3: Run type check and lint**

```bash
yarn check
yarn lint
```
