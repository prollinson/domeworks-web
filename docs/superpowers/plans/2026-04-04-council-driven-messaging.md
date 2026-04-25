# Council-Driven Messaging Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure DomeWorks site messaging to lead with pain and differentiators instead of framework jargon, addressing all 6 concerns from the LLM Council review.

**Architecture:** Copy and section-order changes only. No layout, CSS, or component changes. The editorial hero structure, D monogram, stat bar, and Section component patterns all stay intact.

**Tech Stack:** SvelteKit 5, Tailwind 4, static site. All changes are in `.svelte` page files.

**Spec:** `docs/superpowers/specs/2026-04-04-council-driven-messaging-design.md`

---

### Task 1: Homepage Hero — Pain-First Headline and Differentiators

**Files:**

- Modify: `src/routes/+page.svelte:83-121` (hero eyebrow, headline, aside)

- [ ] **Step 1: Remove eyebrow row**

Replace lines 83-88:

```svelte
<!-- Top zone: Eyebrow -->
<div class="hero-eyebrow-row">
	<span class="hero-eyebrow-text">Intelligence Infrastructure Engineering</span>
	<div class="flex-1 h-px bg-warm-white/8 ml-6" aria-hidden="true" role="presentation"></div>
	<span class="hero-eyebrow-index">San Francisco</span>
</div>
```

With an empty spacer to preserve the three-zone layout spacing:

```svelte
<!-- Top zone: spacer (eyebrow removed per council feedback) --><div class="hero-eyebrow-row"></div>
```

- [ ] **Step 2: Replace headline with pain-first language**

Replace lines 92-97:

```svelte
<h1 class="hero-headline font-serif font-normal text-warm-white">
	<span class="hero-line hero-line-1">Coordination</span>
	<span class="hero-line hero-line-2">is overhead<span class="text-copper">.</span></span>
	<span class="hero-line hero-line-3"><em class="hero-headline-em">Build it as</em></span>
	<span class="hero-line hero-line-4 text-warm-white/70"
		>infrastructure<span class="text-copper/70">.</span></span
	>
</h1>
```

With:

```svelte
<h1 class="hero-headline font-serif font-normal text-warm-white">
	<span class="hero-line hero-line-1">Your team bought</span>
	<span class="hero-line hero-line-2">AI tools<span class="text-copper">.</span></span>
	<span class="hero-line hero-line-3"><em class="hero-headline-em">Nobody built</em></span>
	<span class="hero-line hero-line-4 text-warm-white/70"
		>the systems between them<span class="text-copper/70">.</span></span
	>
</h1>
```

- [ ] **Step 3: Replace aside body copy with differentiator-forward text**

Replace lines 102-107:

```svelte
<p class="hero-body-text text-warm-white/85 leading-relaxed">
	I spent 10+ years leading engineering teams at DoorDash, Square, and Mudflap. The biggest
	bottleneck was never the engineering. It was the coordination. That layer can now be built as
	intelligence infrastructure.
</p>
<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
	Most companies bought AI tools and watched adoption flatline. The companies getting real leverage
	are replacing the coordination layer itself with intelligence infrastructure. DomeWorks builds
	that infrastructure.
</p>
```

With:

```svelte
<p class="hero-body-text text-warm-white/85 leading-relaxed">
	I embed with your team and build working systems — not strategy decks. Every engagement is
	designed to end. You keep what I build.
</p>
<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
	10+ years of engineering leadership at DoorDash, Square, and Mudflap. The biggest bottleneck was
	never the engineering — it was the coordination. That layer can now be built as infrastructure.
</p>
```

- [ ] **Step 4: Verify the hero renders correctly**

Run: `yarn dev` (or check the running dev server at `https://domeworks.localhost:1355`)

Expected: Hero displays with new headline, no eyebrow, differentiators in the aside. D monogram, stat bar, and CTAs unchanged. Staggered line layout preserved.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "copy: pain-first hero — lead with problem, not framework"
```

---

### Task 2: Homepage Sections Reorder — Buyer Self-Selection First

**Files:**

- Modify: `src/routes/+page.svelte:164-299` (sections 01-03)

- [ ] **Step 1: Swap Section 01 and Section 02**

The current order is:

- Lines 164-188: Section 01 "The problem isn't the tools" (background="muted")
- Lines 191-225: Section 02 "Who this is for" (background="white")

Swap these two sections so "Who this is for" comes first. Update their eyebrow numbers:

The "Who this is for" section (currently eyebrow="02") becomes eyebrow="01".
The "The problem isn't the tools" section (currently eyebrow="01") becomes eyebrow="02".

After the swap, the order should be:

1. "Who this is for" (eyebrow="01", background="white")
2. "The problem isn't the tools" (eyebrow="02", background="muted")
3. "The AI stack" (eyebrow="03", unchanged)
4. "How it works" (eyebrow="04", unchanged)

Note: The alternating background colors (white/muted) should follow the new order. "Who this is for" was white, "The problem" was muted. After swap, the first section should be muted (to contrast with the dark hero above it) and the second should be white. So update:

- "Who this is for": change `background="white"` to `background="muted"`
- "The problem isn't the tools": change `background="muted"` to `background="white"`

- [ ] **Step 2: Add transitional intro to the AI Stack section**

The AI Stack section (eyebrow="03") currently opens with:

```svelte
<p class="text-lg text-charcoal/70 leading-relaxed text-center mb-16 max-w-2xl mx-auto">
	Every organization running on AI needs four layers. Most have the top and bottom. The middle two
	are where AI actually coordinates work instead of just helping individuals.
</p>
```

Replace with:

```svelte
<p class="text-lg text-charcoal/70 leading-relaxed text-center mb-16 max-w-2xl mx-auto">
	Here's the architecture that fixes it. Every organization running on AI needs four layers. Most
	have the top and bottom. The middle two are where coordination becomes infrastructure.
</p>
```

- [ ] **Step 3: Verify section order and visual flow**

Check at `https://domeworks.localhost:1355`:

- After the dark hero, first content section is "Who this is for" with buyer profile
- Second section is "The problem isn't the tools" with Block callout
- Third is "The AI stack"
- Fourth is "How it works"
- Background colors alternate correctly

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "copy: reorder homepage sections — buyer self-selection first"
```

---

### Task 3: Block Reference Reframing — Convergent Validation

**Files:**

- Modify: `src/routes/+page.svelte` (Block callout inside "The problem isn't the tools" section)

- [ ] **Step 1: Replace Block callout content**

Find the Block proof point card (inside the "The problem isn't the tools" section, right column). Replace lines 180-184:

```svelte
<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10 sticky top-24">
	<p class="text-charcoal/70 leading-relaxed">
		<strong class="text-charcoal">Block</strong> (the company behind Square and Cash App) recently
		published how they're rebuilding their entire organization this way, replacing middle
		management's coordination function with what they call a <em>"company world model."</em> They have
		the engineering capacity to build it internally. Most companies don't.
	</p>
	<p class="text-sm text-charcoal/60 mt-3">That's where DomeWorks comes in.</p>
</div>
```

With:

```svelte
<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10 sticky top-24">
	<p class="text-charcoal/70 leading-relaxed">
		<strong class="text-charcoal">Block</strong> (the company behind Square and Cash App) recently
		published how they're replacing coordination overhead with what they call a
		<em>"company world model."</em> It's the same architecture I've been building with engineering teams
		— the Context and Orchestration layers of the stack.
	</p>
	<p class="text-sm text-charcoal/60 mt-3">
		The pattern is showing up independently because the problem is structural, not novel.
	</p>
</div>
```

- [ ] **Step 2: Verify the callout reads naturally in context**

Check the "The problem isn't the tools" section at `https://domeworks.localhost:1355`. The Block callout should feel like evidence of a trend, not the origin of the idea.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "copy: reframe Block reference as convergent validation"
```

---

### Task 4: Scan Page — Prescriptive Conversion to Context Build

**Files:**

- Modify: `src/routes/scan/+page.svelte:111-123` (Section 03 "What this isn't")

- [ ] **Step 1: Replace "What this isn't" with "What your Scan tells you"**

Replace lines 111-123:

```svelte
<!-- What This Isn't -->
<Section background="muted" padding="lg" eyebrow="03" title="What this isn't">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-lg text-charcoal/70 leading-relaxed mb-4">
				This isn't a strategy engagement. I won't interview your stakeholders, diagnose cultural
				blockers, or design an implementation plan. That's what the <a
					href="/context-build/"
					class="text-primary hover:underline">Context Build</a
				> does.
			</p>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				The Scan shows you <strong class="text-charcoal">what's happening</strong>. If you want to
				understand <strong class="text-charcoal">why</strong> and design
				<strong class="text-charcoal">what to build</strong>, the
				<a href="/context-build/" class="text-primary hover:underline">Context Build</a> is the next step.
				There's no obligation, though. Plenty of teams take the Scan, implement the quick wins, and handle
				the rest internally.
			</p>
		</div>
	</div>
</Section>
```

With:

```svelte
<!-- What Your Scan Tells You -->
<Section background="muted" padding="lg" eyebrow="03" title="What your Scan tells you">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-lg text-charcoal/70 leading-relaxed mb-4">
				The Scan shows you where you are. For most teams, the readout surfaces a clear gap: no
				shared context flowing into AI interactions, no coordination between tools and how the team
				ships.
			</p>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				When that's the case, I'll tell you exactly what a <a
					href="/context-build/"
					class="text-primary hover:underline">Context Build</a
				> would address and what it wouldn't — so you can decide whether to build it internally or with
				me. Plenty of teams take the quick wins and run. There's no obligation.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 2: Verify scan page flow**

Check at `https://domeworks.localhost:1355/scan/`. The new section should feel like a natural continuation of the deliverables, connecting diagnosis to prescription.

- [ ] **Step 3: Commit**

```bash
git add src/routes/scan/+page.svelte
git commit -m "copy: scan page — prescriptive conversion to Context Build"
```

---

### Task 5: "Designed to End" Proof Mechanism

**Files:**

- Modify: `src/routes/about/+page.svelte:93-95` (How I work, item 02)

- [ ] **Step 1: Expand "Designed to end" on About page**

Replace lines 93-95:

```svelte
<h3 class="font-medium text-charcoal mb-2">Designed to end</h3>
<p class="text-charcoal/70 leading-[1.65]">
	Every engagement has a built-in exit. The goal is a team that has the systems they need and knows
	how to maintain them. The AI landscape moves fast, and there's always a next phase to build. But
	you should be choosing it, not depending on me.
</p>
```

With:

```svelte
<h3 class="font-medium text-charcoal mb-2">Designed to end</h3>
<p class="text-charcoal/70 leading-[1.65]">
	Every engagement ships a handoff package: documented systems, runbooks, and a knowledge transfer
	session. Your team owns what I built and can maintain it without me. If you need ongoing support
	after that, that's what the <a href="/fractional/" class="text-primary hover:underline"
		>Fractional engagement</a
	> is for — but you're never locked in.
</p>
```

- [ ] **Step 2: Verify the About page**

Check at `https://domeworks.localhost:1355/about/`. The "Designed to end" item should now feel concrete (handoff package) rather than abstract (built-in exit). The link to Fractional creates a natural bridge.

- [ ] **Step 3: Check Fractional page for "designed to end" language**

Read the Fractional page. It doesn't use "designed to end" as a standalone claim — it references the concept through "the goal is always a team that doesn't need me" in the FAQ. No changes needed there.

- [ ] **Step 4: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "copy: 'designed to end' proof mechanism — handoff package"
```

---

### Task 6: Final Verification and Build Check

**Files:** None (verification only)

- [ ] **Step 1: Run type check**

```bash
yarn check
```

Expected: No errors (these are copy-only changes, no type implications).

- [ ] **Step 2: Run lint**

```bash
yarn lint
```

Expected: Clean. If Prettier flags formatting issues from the edits, run `yarn format` and commit.

- [ ] **Step 3: Run production build**

```bash
yarn build
```

Expected: Static build succeeds with all pages prerendered.

- [ ] **Step 4: Visual spot-check all changed pages**

Check each page at the dev server:

- `/` — Hero shows pain headline, no eyebrow. Sections reordered (buyer → problem → stack → services). Block callout reframed.
- `/scan/` — "What your Scan tells you" section replaces "What this isn't"
- `/about/` — "Designed to end" has handoff package proof and Fractional link

- [ ] **Step 5: Format and commit if needed**

```bash
yarn format
git add -A
git commit -m "chore: format after messaging restructure"
```

Only commit if `yarn format` changed files.
