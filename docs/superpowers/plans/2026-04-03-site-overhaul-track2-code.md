# Site Overhaul — Track 2: Code & Structure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Scrollytelling design token violations, restructure the homepage (section reorder + 4th Fractional card + terminology), and update nav/footer to include the two new pages.

**Architecture:** All changes are structural or token-level — no new components needed. Homepage changes are coordinated: reorder first, then add Fractional card, then sweep terminology on the homepage itself. Track 1 handles all other pages.

**Tech Stack:** SvelteKit 5, Svelte 5 runes, Tailwind CSS 4, design tokens defined in `src/tailwind.css`.

**File ownership (no overlap with Track 1):**
- Track 2 owns: `src/routes/+page.svelte`, `src/lib/components/layout/Header.svelte`, `src/lib/components/layout/Footer.svelte`, `src/lib/components/ui/Scrollytelling.svelte`
- Track 1 owns all other route pages

**Design token reference** (from `src/tailwind.css`):
- `text-charcoal` = `#2C2A25` — primary dark text (replaces `text-slate-900`)
- `text-charcoal/70` — body text (replaces `text-slate-600`)
- `text-charcoal/50` — is not suitable for dark backgrounds
- `bg-ink` = `#141414` — dark panel background (replaces `bg-slate-900`)
- `text-warm-gray` = `#A3A096` — muted label text on dark bg (replaces `text-slate-500`)
- `text-warm-gray-light` = approx `#BBB8AD` — secondary text on dark bg (replaces `text-slate-400`)
- `border-white/10` — divider on dark bg (replaces `border-slate-800`)
- `bg-white/5` — subtle dark bg card (replaces `bg-slate-800`)

---

### Task 1: Fix Scrollytelling.svelte design token violations

**Files:**
- Modify: `src/lib/components/ui/Scrollytelling.svelte`

The component uses `slate-*` Tailwind classes that bypass the design system. Replace them all with the warm-toned design tokens.

- [ ] **Step 1: Fix left-column text (light background)**

Lines 76–79 are the step heading and body text on the left scrolling side (page background, no dark container). Replace:

```svelte
<h3 class="text-2xl md:text-3xl font-serif font-semibold text-slate-900 mb-4">
  {step.title}
</h3>
<p class="text-lg text-slate-600 leading-relaxed">
  {step.description}
</p>
```

With:

```svelte
<h3 class="text-2xl md:text-3xl font-serif font-semibold text-charcoal mb-4">
  {step.title}
</h3>
<p class="text-lg text-charcoal/70 leading-relaxed">
  {step.description}
</p>
```

- [ ] **Step 2: Fix right-panel container (dark background)**

Line 89 is the sticky visual panel container. Replace:

```svelte
<div class="sticky top-32 h-[60vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
```

With:

```svelte
<div class="sticky top-32 h-[60vh] rounded-2xl overflow-hidden bg-ink border border-white/10">
```

- [ ] **Step 3: Fix labels inside dark panel**

There are four `text-slate-500` label spans (one per visual step: "Current State", "Architecture", "Implementation", "Live Dashboard"). Replace all four:

```svelte
<span class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
```

With:

```svelte
<span class="text-xs font-medium text-warm-gray uppercase tracking-wider mb-4">
```

- [ ] **Step 4: Fix question mark in Discovery visual**

Line 114:

```svelte
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-slate-700 opacity-20 animate-pulse">
```

Replace with:

```svelte
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-warm-white opacity-20 animate-pulse">
```

- [ ] **Step 5: Fix code text in Build visual**

Line 164:

```svelte
<div class="flex-1 font-mono text-xs text-slate-400 overflow-hidden">
```

Replace with:

```svelte
<div class="flex-1 font-mono text-xs text-warm-gray-light overflow-hidden">
```

- [ ] **Step 6: Fix Deploy visual dark cards**

Replace all `bg-slate-800` instances in the Deploy visual (lines ~196, 204, 209, 214, 220) with `bg-white/5`:

```svelte
<!-- Each of these: -->
<div class="... bg-slate-800 rounded-lg">
<!-- Becomes: -->
<div class="... bg-white/5 rounded-lg">
```

There are 5 occurrences: the status bar, each of the 3 metric cards, and the activity feed container.

- [ ] **Step 7: Fix status/text colors inside Deploy visual**

Line ~221 (activity feed label):
```svelte
<div class="text-xs text-slate-500 mb-2">Recent Activity</div>
```
→
```svelte
<div class="text-xs text-warm-gray mb-2">Recent Activity</div>
```

Lines ~223–234 (activity feed items):
```svelte
<div class="flex items-center gap-2 text-slate-400">
```
→
```svelte
<div class="flex items-center gap-2 text-warm-gray-light">
```
(3 occurrences — one per activity row)

Line ~247 (handoff badge subtext):
```svelte
<div class="text-xs text-slate-400">Full docs + admin access transferred</div>
```
→
```svelte
<div class="text-xs text-warm-gray">Full docs + admin access transferred</div>
```

- [ ] **Step 8: Verify no slate-* classes remain**

Run: `grep -n "slate-" src/lib/components/ui/Scrollytelling.svelte`
Expected: No output (zero matches)

- [ ] **Step 9: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 10: Commit**

```bash
git add src/lib/components/ui/Scrollytelling.svelte
git commit -m "fix: replace slate-* classes in Scrollytelling with design tokens"
```

---

### Task 2: Homepage — reorder sections and rename "Intelligence Stack"

**Files:**
- Modify: `src/routes/+page.svelte`

Current section order: Hero → 01 Problem → 02 Intelligence Stack → 03 How it works → 04 Who this is for → CTA

New order: Hero → 01 Problem → 02 Who this is for → 03 The AI stack → 04 How it works → CTA

Also: rename section title from "The Intelligence Stack" → "The AI stack", update layer labels in the diagram.

- [ ] **Step 1: Move "Who this is for" to position 02**

In `src/routes/+page.svelte`, physically move the entire `<!-- Who This Is For -->` section (the `<Section background="white" padding="lg" eyebrow="04" ...>` block and all its content) to appear immediately after the `<!-- The Problem -->` section.

After the move, update its eyebrow: `eyebrow="04"` → `eyebrow="02"`

The section block to move starts with:
```svelte
<!-- Who This Is For -->
<Section background="white" padding="lg" eyebrow="04" title="Who this is for">
```
And ends just before `<!-- Bottom CTA -->`.

After the move, it should sit between `<!-- The Problem -->` and `<!-- What I Build: The Intelligence Stack -->`.

- [ ] **Step 2: Renumber remaining sections**

- "What I Build: The Intelligence Stack" section: `eyebrow="02"` → `eyebrow="03"`
- "How it works" section: `eyebrow="03"` → `eyebrow="04"`

- [ ] **Step 3: Rename Intelligence Stack section**

Change the Section title and comment:

```svelte
<!-- What I Build: The Intelligence Stack -->
<Section background="white" padding="lg" eyebrow="03" title="The Intelligence Stack">
```

→

```svelte
<!-- The AI Stack -->
<Section background="white" padding="lg" eyebrow="03" title="The AI stack">
```

Also update the intro paragraph:

```svelte
<p class="text-lg text-charcoal/70 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
  Every organization running on AI needs four layers. Most companies have the top and bottom but are missing the middle two.
</p>
```

→

```svelte
<p class="text-lg text-charcoal/70 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
  Every organization running on AI needs four layers. Most have the top and bottom. The middle two are where AI actually coordinates work instead of just helping individuals.
</p>
```

- [ ] **Step 4: Update stack diagram labels**

In the diagram, find and update the layer label spans:

```svelte
<span class="text-xs font-medium tracking-widest text-primary uppercase shrink-0">Orchestration</span>
<span class="text-charcoal/60 text-sm">Coordinates work, routes output, enforces quality gates</span>
```

→

```svelte
<span class="text-xs font-medium tracking-widest text-primary uppercase shrink-0">Agent Coordination</span>
<span class="text-charcoal/60 text-sm">Routes work, validates output, closes feedback loops</span>
```

```svelte
<span class="text-xs font-medium tracking-widest text-copper uppercase shrink-0">Context</span>
<span class="text-charcoal/60 text-sm">The world model: domain knowledge, conventions, project state</span>
```

→

```svelte
<span class="text-xs font-medium tracking-widest text-copper uppercase shrink-0">Context System</span>
<span class="text-charcoal/60 text-sm">Domain knowledge, team conventions, project state — fed into every AI interaction</span>
```

- [ ] **Step 5: Update layer description headings and copy**

Find the two layer description `<h3>` blocks and update:

```svelte
<h3 class="font-medium text-charcoal flex items-center gap-2">
  <span class="w-2.5 h-2.5 rounded-full bg-copper"></span>
  The Context Layer
</h3>
<p class="text-charcoal/70 leading-relaxed">
  Builds your organization's world model: machine-readable representations of your domain knowledge, team conventions, codebase patterns, and project state. With it, every AI interaction has full organizational context. Without it, every prompt starts from zero.
</p>
```

→

```svelte
<h3 class="font-medium text-charcoal flex items-center gap-2">
  <span class="w-2.5 h-2.5 rounded-full bg-copper"></span>
  The context system
</h3>
<p class="text-charcoal/70 leading-relaxed">
  Builds your organization's world model: domain knowledge, team conventions, codebase patterns, and project state in machine-readable form. With it, every AI interaction has full organizational context. Without it, every prompt starts from zero.
</p>
```

```svelte
<h3 class="font-medium text-charcoal flex items-center gap-2">
  <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
  The Orchestration Layer
</h3>
<p class="text-charcoal/70 leading-relaxed">
  Replaces the coordination function that hierarchy exists to perform. Multi-agent systems that route tasks, compose capabilities, enforce quality gates, and handle failures, so your team reviews and decides instead of relaying and coordinating.
</p>
```

→

```svelte
<h3 class="font-medium text-charcoal flex items-center gap-2">
  <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
  Agent coordination
</h3>
<p class="text-charcoal/70 leading-relaxed">
  Replaces the coordination work that hierarchy exists to perform. Multi-agent systems that route tasks, validate output, and handle failures — so your team reviews and decides instead of relaying and coordinating.
</p>
```

- [ ] **Step 6: Remove the Fractional AI Leadership callout box**

Find and remove the entire callout box div (it will become a proper page instead):

```svelte
<!-- Fractional AI Leadership -->
<div class="p-6 bg-stone rounded-xl border border-charcoal/10">
  <h3 class="font-medium text-charcoal mb-2">Fractional AI Leadership</h3>
  <p class="text-charcoal/70 leading-relaxed text-sm">
    An ongoing retainer where I act as your part-time Head of AI, 1-2 days a week. I maintain and evolve both layers, close feedback loops so the system gets smarter over time, and make sure the transition from hierarchy to intelligence infrastructure compounds instead of stalling.
  </p>
</div>
```

- [ ] **Step 7: Update the embedded quote below the stack section**

Find:
```svelte
<p class="text-lg text-charcoal/70 leading-relaxed border-l-2 border-copper pl-6">
  I embed with your team 2-3 days a week for 4-12 weeks and build both layers. Most consultancies hand you a strategy deck. I stay until the intelligence infrastructure is running and your team can maintain it without me.
</p>
```

Replace with:
```svelte
<p class="text-lg text-charcoal/70 leading-relaxed border-l-2 border-copper pl-6">
  I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a strategy deck. I stay until the context system and agent coordination are running and your team can maintain them without me.
</p>
```

- [ ] **Step 8: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 9: Update hero stat bar terminology**

Find and update the desktop stat bar (both instances — desktop and mobile):

Desktop:
```svelte
<span class="hero-stat-label">Intelligence Stack</span>
```
→
```svelte
<span class="hero-stat-label">AI stack</span>
```

Mobile:
```svelte
<span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Intel Stack</span>
```
→
```svelte
<span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">AI stack</span>
```

- [ ] **Step 10: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "refactor: reorder homepage sections, rename Intelligence Stack to AI stack"
```

---

### Task 3: Homepage — add Fractional as 4th service card

**Files:**
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Update the "How it works" service grid**

Find the grid container div in the "How it works" section:

```svelte
<div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
```

Replace with:

```svelte
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
```

- [ ] **Step 2: Add the Fractional card**

After the existing Orchestration Build card (the third `<a href="/orchestration-build/" ...>` block), add the fourth card:

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

- [ ] **Step 3: Update Orchestration Build card copy**

While in this section, update the Orchestration Build card to use plain terminology:

Find the Orchestration Build card description:
```svelte
<p class="text-charcoal/60 text-sm flex-grow">
  I build the Orchestration Layer: multi-agent coordination, quality gates, output routing. Your team goes from "AI helps individual engineers" to "AI coordinates our work."
</p>
```

Replace with:
```svelte
<p class="text-charcoal/60 text-sm flex-grow">
  I build the agent coordination layer: multi-agent workflows, quality gates, output routing. Your team goes from "AI helps individuals" to "AI coordinates our work."
</p>
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: add Fractional AI Leadership as 4th service card on homepage"
```

---

### Task 4: Update Header navigation

**Files:**
- Modify: `src/lib/components/layout/Header.svelte`

- [ ] **Step 1: Update navLinks array**

Find:
```typescript
const navLinks = [
  { href: '/scan/', label: 'AI Scan' },
  { href: '/context-build/', label: 'Context Build' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
]
```

Replace with:
```typescript
const navLinks = [
  { href: '/scan/', label: 'AI Scan' },
  { href: '/context-build/', label: 'Context Build' },
  { href: '/orchestration-build/', label: 'Orchestration Build' },
  { href: '/fractional/', label: 'Fractional' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
]
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/layout/Header.svelte
git commit -m "feat: add Orchestration Build and Fractional to header nav"
```

---

### Task 5: Update Footer navigation

**Files:**
- Modify: `src/lib/components/layout/Footer.svelte`

- [ ] **Step 1: Update navLinks array**

Find:
```typescript
const navLinks = [
  { href: '/scan/', label: 'AI Scan' },
  { href: '/context-build/', label: 'Context Build' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
]
```

Replace with:
```typescript
const navLinks = [
  { href: '/scan/', label: 'AI Scan' },
  { href: '/context-build/', label: 'Context Build' },
  { href: '/orchestration-build/', label: 'Orchestration Build' },
  { href: '/fractional/', label: 'Fractional' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
]
```

- [ ] **Step 2: Update footer tagline**

Find:
```svelte
<p class="mt-4 text-sm text-warm-gray-light">
  Intelligence infrastructure that replaces coordination overhead
</p>
```

Replace with:
```svelte
<p class="mt-4 text-sm text-warm-gray-light">
  AI infrastructure that replaces coordination overhead
</p>
```

Also update the bottom bar tagline:
```svelte
<p class="text-xs text-warm-gray">
  Replacing coordination overhead with intelligence infrastructure
</p>
```

→

```svelte
<p class="text-xs text-warm-gray">
  Replacing coordination overhead with AI infrastructure
</p>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/layout/Footer.svelte
git commit -m "feat: add Orchestration Build and Fractional to footer nav, update tagline"
```

---

### Task 6: Final verification

- [ ] **Step 1: Full type check**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: Zero errors

- [ ] **Step 2: Build check**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build completes. All 4 service cards link to valid routes (including `/fractional/` which Track 1 creates — if Track 1 hasn't run yet, the link will still build cleanly as a static href).

- [ ] **Step 3: Verify no slate-* remain in Scrollytelling**

Run: `grep -n "slate-" src/lib/components/ui/Scrollytelling.svelte`
Expected: No output

- [ ] **Step 4: Verify no Intelligence Stack / Context Layer / Orchestration Layer remain in Track 2 files**

Run: `grep -rn "Intelligence Stack\|Context Layer\|Orchestration Layer\|Intelligence Maturity" src/routes/+page.svelte src/lib/components/layout/Header.svelte src/lib/components/layout/Footer.svelte`
Expected: No output
