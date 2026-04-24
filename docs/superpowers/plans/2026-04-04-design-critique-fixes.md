# Design Critique Fixes + Narrative Continuity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 12 design improvements from full-site critique plus the Narrative Continuity journey system (Direction B) across all pages.

**Architecture:** New JourneyBar component integrates into each service page hero. Service page heroes get gradient tints + architectural SVGs. Per-page bottom CTAs replaced by a journey nudge above the footer. Homepage gets scannable qualification checklist and card affordance fixes. Mobile nav gets accordion grouping.

**Tech Stack:** SvelteKit 5 (runes), Tailwind 4, inline SVGs

---

### Task 1: Create JourneyBar component

**Files:**

- Create: `src/lib/components/ui/JourneyBar.svelte`

- [ ] **Step 1: Create the component**

```svelte
<script lang="ts">
	type ServicePage = 'scan' | 'context-build' | 'orchestration-build' | 'fractional';

	let { current }: { current: ServicePage } = $props();

	const steps: { key: ServicePage; label: string; href: string }[] = [
		{ key: 'scan', label: 'AI Scan', href: '/scan/' },
		{ key: 'context-build', label: 'Context Build', href: '/context-build/' },
		{ key: 'orchestration-build', label: 'Orchestration Build', href: '/orchestration-build/' },
		{ key: 'fractional', label: 'Fractional', href: '/fractional/' }
	];

	const currentIndex = $derived(steps.findIndex((s) => s.key === current));

	function segmentColor(stepIndex: number): string {
		const isCurrent = stepIndex === currentIndex;
		const isPast = stepIndex < currentIndex;
		const usesCopper = stepIndex >= 2;

		if (isCurrent) return usesCopper ? 'bg-copper' : 'bg-primary';
		if (isPast) return usesCopper ? 'bg-copper/30' : 'bg-primary/30';
		// Future
		const distance = stepIndex - currentIndex;
		if (distance === 1) return usesCopper ? 'bg-copper/15' : 'bg-primary/15';
		return usesCopper ? 'bg-copper/8' : 'bg-primary/8';
	}

	function labelColor(stepIndex: number): string {
		if (stepIndex === currentIndex) return 'text-charcoal font-semibold';
		return 'text-charcoal/60 hover:text-charcoal';
	}
</script>

<nav class="mb-8" aria-label="Service journey">
	<div class="flex items-center gap-1.5 mb-3">
		{#each steps as step, i}
			<div
				class="flex-1 h-[3px] rounded-full {segmentColor(i)} transition-colors duration-300"
			></div>
		{/each}
	</div>
	<div class="flex items-center gap-1 text-[11px] tracking-wide">
		{#each steps as step, i}
			<div class="flex-1">
				{#if step.key === current}
					<span class={labelColor(i)}>{step.label}</span>
				{:else}
					<a href={step.href} class="{labelColor(i)} transition-colors">{step.label}</a>
				{/if}
			</div>
		{/each}
	</div>
</nav>
```

- [ ] **Step 2: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors (component is valid even if unused yet).

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ui/JourneyBar.svelte
git commit -m "feat: add JourneyBar component for service page navigation"
```

---

### Task 2: Delete orphaned Scrollytelling component (Item #8)

**Files:**

- Delete: `src/lib/components/ui/Scrollytelling.svelte`

- [ ] **Step 1: Verify component is unused**

Run: `grep -r "Scrollytelling" src/routes/ src/lib/ --include="*.svelte" -l`
Expected: Only `src/lib/components/ui/Scrollytelling.svelte` itself (no imports).

- [ ] **Step 2: Delete the file**

```bash
rm src/lib/components/ui/Scrollytelling.svelte
```

- [ ] **Step 3: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add -u src/lib/components/ui/Scrollytelling.svelte
git commit -m "chore: remove orphaned Scrollytelling component"
```

---

### Task 3: Fix contrast failures across all pages (Item #1)

**Files:**

- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/about/+page.svelte`
- Modify: `src/routes/scan/+page.svelte`
- Modify: `src/routes/context-build/+page.svelte`
- Modify: `src/routes/orchestration-build/+page.svelte`
- Modify: `src/routes/fractional/+page.svelte`

- [ ] **Step 1: Find all instances**

Run: `grep -rn "text-charcoal/[45]0" src/routes/ --include="*.svelte"`
This shows every line that needs fixing.

- [ ] **Step 2: Fix homepage**

In `src/routes/+page.svelte`:

- Change `text-charcoal/40` to `text-charcoal/60` (BCG-style citation text)
- Change `text-charcoal/50` to `text-charcoal/60` (service card secondary text like "1-2 week assessment + 4-week build", "Day rate, scoped from assessment", pricing footnotes, "That's where DomeWorks comes in")

- [ ] **Step 3: Fix about page**

In `src/routes/about/+page.svelte`:

- Change `text-charcoal/40` to `text-charcoal/60` (BCG citation span)

- [ ] **Step 4: Fix scan page**

In `src/routes/scan/+page.svelte`:

- Change `text-charcoal/50` to `text-charcoal/60` (pricing footnote)

- [ ] **Step 5: Fix context-build page**

In `src/routes/context-build/+page.svelte`:

- Change `text-charcoal/50` to `text-charcoal/60` (pricing footnote, deliverable description text)

- [ ] **Step 6: Fix orchestration-build page**

In `src/routes/orchestration-build/+page.svelte`:

- Change `text-charcoal/50` to `text-charcoal/60` (pricing footnote)

- [ ] **Step 7: Fix fractional page**

In `src/routes/fractional/+page.svelte`:

- Change `text-charcoal/50` to `text-charcoal/60` (pricing footnote)

- [ ] **Step 8: Verify no remaining instances**

Run: `grep -rn "text-charcoal/[45]0" src/routes/ --include="*.svelte"`
Expected: No matches (or only matches inside dark backgrounds like `bg-ink` where contrast is fine).

- [ ] **Step 9: Commit**

```bash
git add src/routes/+page.svelte src/routes/about/+page.svelte src/routes/scan/+page.svelte src/routes/context-build/+page.svelte src/routes/orchestration-build/+page.svelte src/routes/fractional/+page.svelte
git commit -m "fix: improve tertiary text contrast to meet WCAG AA"
```

---

### Task 4: Homepage improvements (Items #3, #5)

**Files:**

- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Add "Learn more" to Context Build card**

Find the Context Build card (the one with `border-2 border-primary`). After the existing `<p class="mt-4 text-sm text-charcoal/60">1-2 week assessment + 4-week build</p>`, add:

```svelte
<p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
```

Note: The card already has no "Learn more" link. The existing `text-charcoal/60` on the duration text should already be fixed to `/60` from Task 3.

- [ ] **Step 2: Add "Learn more" to Orchestration Build card**

Find the Orchestration Build card (the one with `hover:border-copper`). After the existing `<p class="mt-4 text-sm text-charcoal/60">Day rate, scoped from assessment</p>`, add:

```svelte
<p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>
```

- [ ] **Step 3: Replace "Who this is for" dense paragraph with checklist**

Find the `<!-- Who This Is For -->` section. Replace the content inside the `<div class="p-8 md:p-12 bg-stone rounded-2xl border border-charcoal/10">` with:

```svelte
<ul class="space-y-5 text-lg text-charcoal/70 leading-relaxed mb-6">
	<li class="flex items-start gap-4">
		<span
			class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"
		>
			<span class="w-2 h-2 rounded-full bg-primary"></span>
		</span>
		<span
			>You're a <strong class="text-charcoal">VP of Engineering, Head of Engineering, or CTO</strong
			> at a mid-market SaaS company (50–500 people) or a funded startup</span
		>
	</li>
	<li class="flex items-start gap-4">
		<span
			class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"
		>
			<span class="w-2 h-2 rounded-full bg-primary"></span>
		</span>
		<span
			>Your engineers have AI tools but your organization still runs on human coordination:
			meetings, status updates, managers routing information between teams</span
		>
	</li>
	<li class="flex items-start gap-4">
		<span
			class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"
		>
			<span class="w-2 h-2 rounded-full bg-primary"></span>
		</span>
		<span
			>You've probably thought about assigning a senior engineer to figure this out — but building
			intelligence infrastructure that replaces coordination overhead isn't a side project</span
		>
	</li>
	<li class="flex items-start gap-4">
		<span
			class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1"
		>
			<span class="w-2 h-2 rounded-full bg-primary"></span>
		</span>
		<span
			>You need someone who's already built this, who knows what works and what doesn't, so your
			team gets the infrastructure without the trial-and-error tax</span
		>
	</li>
</ul>
<p class="text-lg text-charcoal leading-relaxed font-medium border-l-2 border-copper pl-6">
	You don't need another tool or a strategy deck. You need someone who can build the missing layers
	of your AI stack.
</p>
```

- [ ] **Step 4: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "design: add card affordances and scannable qualification checklist"
```

---

### Task 5: Mobile nav accordion grouping (Item #6)

**Files:**

- Modify: `src/lib/components/layout/Header.svelte`

- [ ] **Step 1: Split nav links into groups**

Replace the existing `navLinks` const with:

```typescript
const serviceLinks = [
	{ href: '/scan/', label: 'AI Scan' },
	{ href: '/context-build/', label: 'Context Build' },
	{ href: '/orchestration-build/', label: 'Orchestration Build' },
	{ href: '/fractional/', label: 'Fractional' }
];

const otherLinks = [
	{ href: '/about/', label: 'About' },
	{ href: '/contact/', label: 'Contact' }
];

// Combined for desktop nav (unchanged behavior)
const navLinks = [...serviceLinks, ...otherLinks];
```

- [ ] **Step 2: Add services open state**

Add to the state declarations (near `let menuOpen = $state(false)`):

```typescript
let servicesOpen = $state(false);
```

- [ ] **Step 3: Replace mobile menu content**

Replace the mobile menu `<div class="flex flex-col gap-1">` section (inside the `{#if menuOpen}` block) with:

```svelte
<div class="flex flex-col gap-1">
	<!-- Services accordion -->
	<button
		onclick={() => (servicesOpen = !servicesOpen)}
		class="flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all
      {serviceLinks.some((l) => isActive(l.href))
			? 'text-primary bg-primary/5'
			: 'text-charcoal/70 hover:text-charcoal hover:bg-stone'}"
	>
		Services
		<svg
			class="w-4 h-4 transition-transform duration-200 {servicesOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if servicesOpen}
		<div class="ml-4 flex flex-col gap-1">
			{#each serviceLinks as link}
				<a
					href={link.href}
					class="px-4 py-2.5 text-sm font-medium rounded-lg transition-all
            {isActive(link.href)
						? 'text-primary bg-primary/5'
						: 'text-charcoal/60 hover:text-charcoal hover:bg-stone'}"
					aria-current={isActive(link.href) ? 'page' : undefined}
					onclick={() => {
						menuOpen = false;
						servicesOpen = false;
					}}
				>
					{link.label}
				</a>
			{/each}
		</div>
	{/if}

	{#each otherLinks as link}
		<a
			href={link.href}
			class="px-4 py-3 text-base font-medium rounded-lg transition-all
        {isActive(link.href)
				? 'text-primary bg-primary/5'
				: 'text-charcoal/70 hover:text-charcoal hover:bg-stone'}"
			aria-current={isActive(link.href) ? 'page' : undefined}
			onclick={() => (menuOpen = false)}
		>
			{link.label}
		</a>
	{/each}

	<a
		href={getBookCallUrl()}
		class="mt-4 px-5 py-3 text-center text-base font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all"
	>
		Book a call
	</a>
</div>
```

- [ ] **Step 4: Reset services accordion when menu closes**

In the `toggleMenu` function, add:

```typescript
function toggleMenu() {
	menuOpen = !menuOpen;
	if (!menuOpen) servicesOpen = false;
}
```

- [ ] **Step 5: Verify desktop nav is unchanged**

The desktop nav loop (`{#each navLinks as link}`) still uses the combined `navLinks` array, so desktop behavior is untouched.

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/layout/Header.svelte
git commit -m "design: group mobile nav with Services accordion"
```

---

### Task 6: Scan page — hero, journey bar, FAQ, remove CTA (Items #2, #7, #11, Direction B)

**Files:**

- Modify: `src/routes/scan/+page.svelte`

- [ ] **Step 1: Add JourneyBar import**

Add to the script block:

```typescript
import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
```

- [ ] **Step 2: Replace hero section**

Replace the entire `<!-- Hero -->` section with:

```svelte
<!-- Hero -->
<section
	class="py-20 md:py-28 relative overflow-hidden"
	style="background: linear-gradient(135deg, #FAFAF7 70%, rgba(13,107,99,0.04));"
>
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<!-- Architectural SVG: Radar sweep -->
	<div
		class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none"
		aria-hidden="true"
	>
		<svg viewBox="0 0 200 200" fill="none">
			<circle cx="100" cy="100" r="90" stroke="#0d6b63" stroke-width="1" />
			<circle cx="100" cy="100" r="60" stroke="#0d6b63" stroke-width="0.8" />
			<circle cx="100" cy="100" r="30" stroke="#0d6b63" stroke-width="0.5" />
			<line x1="100" y1="100" x2="170" y2="40" stroke="#0d6b63" stroke-width="1.5" />
			<circle cx="100" cy="100" r="3" fill="#0d6b63" />
		</svg>
	</div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<JourneyBar current="scan" />
			<h1
				class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]"
			>
				What you're spending on AI<span class="text-primary">.</span> What you're getting from it<span
					class="text-primary">.</span
				>
				In 48 hours<span class="text-primary">.</span>
			</h1>
			<p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
				You're probably paying for more AI tooling than you realize. Some of it's being used well.
				Some of it's shelfware. The AI Scan maps it all (every tool, every seat, every dollar) and
				diagnoses your AI readiness score: where you are on the path from "bought tools" to "AI
				coordinates our work."
			</p>
			<div class="mt-8">
				<Button href={getBookCallUrl()} size="lg">Book a call</Button>
			</div>
		</div>
	</div>
</section>
```

- [ ] **Step 3: Add FAQ section after pricing**

After the `<!-- Pricing -->` Section and before the `<!-- CTA -->` Section, add:

```svelte
<!-- FAQ -->
<Section background="white" padding="lg" eyebrow="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What access do you need?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Admin credentials or exports from your AI tools (Cursor, Copilot, Claude, ChatGPT for Teams,
				etc.) plus a 15-minute walkthrough of your team structure.
			</p>
		</details>
		<details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What if we're a remote team?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Fully remote-friendly. The survey is async, the report is delivered digitally. No on-site
				requirement.
			</p>
		</details>
		<details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				Is there any obligation after the Scan?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				No. Many teams take the quick wins and run. The Scan stands on its own — if you want to go
				further, the <a href="/context-build/" class="text-primary hover:underline">Context Build</a
				> is the next step, but there's no obligation.
			</p>
		</details>
	</div>
</Section>
```

- [ ] **Step 4: Replace bottom CTA with journey nudge**

Remove the entire bottom `<!-- CTA -->` Section (the one with "Find out what your AI spend is doing"). Replace with:

```svelte
<!-- Journey nudge -->
<div class="border-t border-charcoal/8 py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-charcoal/60">
			Next in the journey: <a
				href="/context-build/"
				class="text-primary hover:underline font-medium">Context Build &rarr;</a
			>
		</p>
	</div>
</div>
```

- [ ] **Step 5: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/routes/scan/+page.svelte
git commit -m "design: add journey bar, hero identity, FAQ to Scan page"
```

---

### Task 7: Context Build page — hero, journey bar, FAQ, remove CTA (Items #2, #7, #11, Direction B)

**Files:**

- Modify: `src/routes/context-build/+page.svelte`

- [ ] **Step 1: Add JourneyBar import**

Add to the script block:

```typescript
import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
```

- [ ] **Step 2: Replace hero section**

Replace the entire `<!-- Hero -->` section with:

```svelte
<!-- Hero -->
<section
	class="py-20 md:py-28 relative overflow-hidden"
	style="background: linear-gradient(135deg, #FAFAF7 65%, rgba(13,107,99,0.06));"
>
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<!-- Architectural SVG: Pipeline diagram -->
	<div
		class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none"
		aria-hidden="true"
	>
		<svg viewBox="0 0 200 160" fill="none">
			<rect x="10" y="10" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1" />
			<rect x="10" y="55" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1" />
			<rect x="10" y="100" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1" />
			<rect x="120" y="45" width="70" height="45" rx="8" stroke="#0d6b63" stroke-width="1.5" />
			<line x1="60" y1="25" x2="120" y2="62" stroke="#0d6b63" stroke-width="0.8" />
			<line x1="60" y1="70" x2="120" y2="67" stroke="#0d6b63" stroke-width="0.8" />
			<line x1="60" y1="115" x2="120" y2="75" stroke="#0d6b63" stroke-width="0.8" />
		</svg>
	</div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<JourneyBar current="context-build" />
			<h1
				class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]"
			>
				Build the world model your AI tools need to be useful<span class="text-primary">.</span>
			</h1>
			<p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
				A two-week engagement that diagnoses your AI readiness and designs the context system: the
				infrastructure that feeds domain knowledge, team conventions, and codebase patterns into
				every AI interaction. The foundation for everything that comes after.
			</p>
			<div class="mt-8">
				<Button href={getBookCallUrl()} size="lg">Book a call</Button>
			</div>
		</div>
	</div>
</section>
```

- [ ] **Step 3: Add FAQ section after pricing**

After the `<!-- Pricing -->` / `<!-- Investment -->` Section (eyebrow "04"), add:

```svelte
<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What access do you need?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Stakeholder time (30-minute interviews with 3–5 people), plus tool admin access for the
				audit. I'll provide a specific list after the kickoff call.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				Do you sign NDAs?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Yes, standard mutual NDA before any access is granted. I can use yours or provide mine.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What if we want to build internally after?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				That's fine. The deliverables are designed to be actionable without me. Some teams take the
				Context Build and handle the rest internally — the quick wins alone tend to pay for the
				engagement.
			</p>
		</details>
	</div>
</Section>
```

- [ ] **Step 4: Replace bottom CTA with journey nudge**

Remove the entire bottom `<!-- CTA -->` Section. Replace with:

```svelte
<!-- Journey nudge -->
<div class="border-t border-charcoal/8 py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-charcoal/60">
			Next in the journey: <a
				href="/orchestration-build/"
				class="text-primary hover:underline font-medium">Orchestration Build &rarr;</a
			>
		</p>
	</div>
</div>
```

- [ ] **Step 5: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/routes/context-build/+page.svelte
git commit -m "design: add journey bar, hero identity, FAQ to Context Build page"
```

---

### Task 8: Orchestration Build page — hero, journey bar, FAQ, remove CTA (Items #2, #7, #11, Direction B)

**Files:**

- Modify: `src/routes/orchestration-build/+page.svelte`

- [ ] **Step 1: Add JourneyBar import**

Add to the script block:

```typescript
import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
```

- [ ] **Step 2: Replace hero section**

Replace the entire `<!-- Hero -->` section with:

```svelte
<!-- Hero -->
<section
	class="py-20 md:py-28 relative overflow-hidden"
	style="background: linear-gradient(135deg, #FAFAF7 65%, rgba(160,115,65,0.05));"
>
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<!-- Architectural SVG: Multi-node routing -->
	<div
		class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none"
		aria-hidden="true"
	>
		<svg viewBox="0 0 200 160" fill="none">
			<circle cx="100" cy="30" r="16" stroke="#B07D4F" stroke-width="1.5" />
			<circle cx="40" cy="120" r="14" stroke="#B07D4F" stroke-width="1" />
			<circle cx="100" cy="120" r="14" stroke="#B07D4F" stroke-width="1" />
			<circle cx="160" cy="120" r="14" stroke="#B07D4F" stroke-width="1" />
			<line x1="90" y1="44" x2="50" y2="108" stroke="#B07D4F" stroke-width="0.8" />
			<line x1="100" y1="46" x2="100" y2="106" stroke="#B07D4F" stroke-width="0.8" />
			<line x1="110" y1="44" x2="150" y2="108" stroke="#B07D4F" stroke-width="0.8" />
		</svg>
	</div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<JourneyBar current="orchestration-build" />
			<h1
				class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]"
			>
				Your team goes from AI helping individuals to AI coordinating your work<span
					class="text-primary">.</span
				>
			</h1>
			<p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
				The Orchestration Build takes the context system built during the Context Build and
				constructs agent coordination on top of it: multi-agent workflows, quality gates, and output
				routing that replace human coordination overhead. Scope and milestones are defined from the
				Context Build assessment.
			</p>
			<div class="mt-8">
				<Button href={getBookCallUrl()} size="lg">Book a call</Button>
			</div>
		</div>
	</div>
</section>
```

- [ ] **Step 3: Add FAQ section after pricing**

After the `<!-- Investment -->` Section (eyebrow "04"), add:

```svelte
<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				Do we need a Context Build first?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Yes, or an equivalent assessment. Agent coordination without a context system is automating
				noise. The Context Build gives us the blueprint — this is where we build it.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				How embedded are you?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				2–3 days/week, in standups, pairing with engineers, shipping alongside your team. I'm not
				advising from the outside — I'm building with you.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What does the handoff look like?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				Documented systems, runbooks, and knowledge transfer sessions. Your team owns everything.
				The goal is always a team that can maintain the systems without me.
			</p>
		</details>
	</div>
</Section>
```

- [ ] **Step 4: Replace bottom CTA with journey nudge**

Remove the entire bottom `<!-- CTA -->` Section. Replace with:

```svelte
<!-- Journey nudge -->
<div class="border-t border-charcoal/8 py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-charcoal/60">
			Next in the journey: <a href="/fractional/" class="text-copper hover:underline font-medium"
				>Fractional AI Leadership &rarr;</a
			>
		</p>
	</div>
</div>
```

- [ ] **Step 5: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/routes/orchestration-build/+page.svelte
git commit -m "design: add journey bar, hero identity, FAQ to Orchestration Build page"
```

---

### Task 9: Fractional page — hero, journey bar, FAQ, typical week, remove CTA (Items #2, #4, #7, #11, Direction B)

**Files:**

- Modify: `src/routes/fractional/+page.svelte`

- [ ] **Step 1: Add JourneyBar import**

Add to the script block:

```typescript
import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
```

- [ ] **Step 2: Replace hero section**

Replace the entire `<!-- Hero -->` section with:

```svelte
<!-- Hero -->
<section
	class="py-20 md:py-28 relative overflow-hidden"
	style="background: linear-gradient(135deg, #FAFAF7 65%, rgba(176,125,79,0.05));"
>
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<!-- Architectural SVG: Compound growth curve -->
	<div
		class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none"
		aria-hidden="true"
	>
		<svg viewBox="0 0 200 160" fill="none">
			<path
				d="M 20 140 Q 60 135 90 110 Q 120 85 140 50 Q 160 20 180 10"
				stroke="#B07D4F"
				stroke-width="1.5"
			/>
			<line x1="20" y1="140" x2="180" y2="140" stroke="#B07D4F" stroke-width="0.5" />
			<line x1="20" y1="10" x2="20" y2="140" stroke="#B07D4F" stroke-width="0.5" />
		</svg>
	</div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<JourneyBar current="fractional" />
			<h1
				class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]"
			>
				Intelligence infrastructure compounds when someone owns it<span class="text-copper">.</span>
			</h1>
			<p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
				An ongoing retainer where I act as your part-time Head of AI, 1–2 days a week. I maintain
				and evolve the context system and agent coordination, close feedback loops, and adapt the
				infrastructure as your org changes.
			</p>
			<div class="mt-8">
				<Button href={getBookCallUrl()} size="lg">Book a call</Button>
			</div>
		</div>
	</div>
</section>
```

- [ ] **Step 3: Add "What a typical week looks like" section**

After the `<!-- What I Do -->` Section (eyebrow "02") and before `<!-- Who It's For -->` (eyebrow "03"), add:

```svelte
<!-- Typical Week -->
<Section background="muted" padding="lg">
	<div class="max-w-3xl mx-auto" use:reveal>
		<p class="text-xs font-medium tracking-widest text-warm-gray uppercase mb-4 text-center">
			What a typical week looks like
		</p>
		<div class="grid md:grid-cols-2 gap-6">
			<div class="p-6 bg-warm-white rounded-2xl border border-charcoal/10">
				<p class="text-xs font-semibold tracking-widest text-primary uppercase mb-3">Mon – Tue</p>
				<h3 class="font-medium text-charcoal mb-2">Embedded with your team</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					Standups, pairing sessions, system maintenance. Hands-on with the infrastructure and the
					people who depend on it.
				</p>
			</div>
			<div class="p-6 bg-warm-white rounded-2xl border border-charcoal/10">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-3">Wed – Fri</p>
				<h3 class="font-medium text-charcoal mb-2">Async & strategic</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					Monitoring, feedback loop review, planning next iteration. Identifying what your team is
					still doing manually that infrastructure could replace.
				</p>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 4: Update eyebrow numbering**

After inserting the typical week section (which has no eyebrow number), the existing sections need their eyebrows adjusted:

- "Who this is for" stays as "03"
- "Investment" stays as "04"

No changes needed — the typical week section doesn't have an eyebrow number, it uses a standalone label.

- [ ] **Step 5: Add FAQ section after pricing**

After the `<!-- Investment -->` Section (eyebrow "04"), add:

```svelte
<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				How is this different from a contractor?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				I own the intelligence infrastructure as a system, not just execute tasks. A contractor
				builds what you spec. I identify what needs building, build it, and make sure it compounds
				over time.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				What's the minimum commitment?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				3 months recommended to see compounding effects. Month-to-month after that. The
				infrastructure needs time to prove itself before you can evaluate whether ongoing ownership
				is worth it.
			</p>
		</details>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				Can this evolve into a full-time hire?
				<svg
					class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/></svg
				>
			</summary>
			<p class="mt-4 text-charcoal/70 leading-relaxed">
				If your org grows to need a full-time Head of AI, I'll help you hire one and transition. The
				goal is always a team that doesn't need me — the fractional model buys you time while the
				capability builds internally.
			</p>
		</details>
	</div>
</Section>
```

- [ ] **Step 6: Replace bottom CTA with no journey nudge (terminal page)**

Remove the entire bottom `<!-- CTA -->` Section. Fractional is the terminal page — no journey nudge needed. The footer CTA handles the conversion action.

- [ ] **Step 7: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 8: Commit**

```bash
git add src/routes/fractional/+page.svelte
git commit -m "design: add journey bar, hero identity, typical week, FAQ to Fractional page"
```

---

### Task 10: About page — case study reframe + contrast (Item #12)

**Files:**

- Modify: `src/routes/about/+page.svelte`

- [ ] **Step 1: Reframe case study section title**

Find the `<!-- Case Study -->` section. Change:

```svelte
<h2 class="font-serif text-3xl font-normal text-charcoal mb-8">Work in progress</h2>
```

to:

```svelte
<h2 class="font-serif text-3xl font-normal text-charcoal mb-8">Current engagement</h2>
```

- [ ] **Step 2: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "design: reframe case study as 'Current engagement'"
```

---

### Task 11: Contact page — call timeline visual (Item #10)

**Files:**

- Modify: `src/routes/contact/+page.svelte`

- [ ] **Step 1: Add call timeline between cards and "What to expect"**

After the `<div class="grid md:grid-cols-2 gap-6">` block (the two cards) and before the `<!-- What to Expect -->` div, add:

```svelte
<!-- What happens on the call -->
<div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 text-sm text-charcoal/70">
	<div
		class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
	>
		<span
			class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
			>1</span
		>
		<span>You tell me about your team</span>
	</div>
	<div
		class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
	>
		<span
			class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
			>2</span
		>
		<span>I share 2–3 observations</span>
	</div>
	<div
		class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left"
	>
		<span
			class="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
			>3</span
		>
		<span>We figure out if there's a fit</span>
	</div>
</div>
```

- [ ] **Step 2: Verify build passes**

Run: `yarn build 2>&1 | tail -20`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/contact/+page.svelte
git commit -m "design: add call timeline visual to Contact page"
```

---

### Task 12: Final build verification and visual check

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `yarn build 2>&1 | tail -30`
Expected: Build completes with all pages prerendered.

- [ ] **Step 2: Run type check**

Run: `yarn check 2>&1 | tail -20`
Expected: No type errors.

- [ ] **Step 3: Run lint**

Run: `yarn lint 2>&1 | tail -20`
Expected: No lint errors (or only pre-existing ones).

- [ ] **Step 4: Verify all pages prerender**

Check that the build output includes all routes:

- `/`
- `/scan/`
- `/context-build/`
- `/orchestration-build/`
- `/fractional/`
- `/about/`
- `/contact/`

- [ ] **Step 5: Verify Scrollytelling is gone**

Run: `grep -r "Scrollytelling" src/ --include="*.svelte" --include="*.ts"`
Expected: No matches.

- [ ] **Step 6: Verify no remaining contrast issues**

Run: `grep -rn "text-charcoal/[45]0" src/routes/ --include="*.svelte"`
Expected: No matches on light backgrounds.
