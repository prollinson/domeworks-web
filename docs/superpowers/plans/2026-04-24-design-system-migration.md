# DomeWorks Editorial Design System Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** `docs/superpowers/specs/2026-04-24-design-system-migration-design.md`

**Goal:** Migrate every non-`/smb` page to the editorial design system codified in `DESIGN.md`, reorganize the enterprise track under `/leaders/*`, and apply a full editorial restyle to the homepage.

**Architecture:** Three parallel tracks — token layer (delete legacy CSS vars), pattern library (seven new components in `src/lib/components/patterns/`), and shared chrome (rewritten Header + Footer). Pages then consume those artifacts. Enterprise pages move to `/leaders/*` with 301s; homepage gets a Level-C editorial restyle; `/smb/*` is untouched.

**Tech Stack:** SvelteKit 5 (static adapter, prerender), Tailwind CSS 4 (`@theme` tokens), mdsvex, Playwright, pnpm, `yarn` as the package-runner alias.

---

## File Structure

### Created

- `src/lib/components/patterns/Eyebrow.svelte`
- `src/lib/components/patterns/HairlineGrid.svelte`
- `src/lib/components/patterns/NumberedSection.svelte`
- `src/lib/components/patterns/TitledSection.svelte`
- `src/lib/components/patterns/PullQuote.svelte`
- `src/lib/components/patterns/DisplayStat.svelte`
- `src/lib/components/patterns/Callout.svelte`
- `src/routes/leaders/+page.svelte` (moved from `src/routes/assessment/+page.svelte`)
- `src/routes/leaders/scan/+page.svelte` (moved from `src/routes/scan/+page.svelte`)
- `src/routes/leaders/context-build/+page.svelte` (moved from `src/routes/context-build/+page.svelte`)
- `src/routes/leaders/orchestration-build/+page.svelte` (moved from `src/routes/orchestration-build/+page.svelte`)
- `src/routes/leaders/fractional/+page.svelte` (moved from `src/routes/fractional/+page.svelte`)

### Modified

- `src/tailwind.css` — remove legacy color tokens, decorative classes tied to legacy palette
- `src/lib/components/layout/Header.svelte` — palette rewrite + `/leaders/*` hrefs
- `src/lib/components/layout/Footer.svelte` — palette rewrite, remove `ambient-warm`/`texture-grain` layers, `/leaders/*` hrefs
- `src/lib/components/ui/JourneyBar.svelte` — update hrefs + remove `copper` palette references
- `src/routes/+page.svelte` — Level C homepage restyle (multiple commits)
- `src/routes/about/+page.svelte` — Level B migration
- `src/routes/contact/+page.svelte` — Level B migration
- `src/routes/ai-audit/+page.svelte` — token sweep on fallback copy
- `src/routes/ai-tools-assessment/+page.svelte` — token sweep on fallback copy
- `_redirects` — add 5 new 301 entries
- `static/sitemap.xml` — update all `/scan/`, `/context-build/`, `/orchestration-build/`, `/fractional/`, `/assessment/` → `/leaders/*`
- `static/llms.txt` — update service URLs and remove `/assessment/` entry (hub is now `/leaders/`)

### Deleted (as directories, after moves)

- `src/routes/assessment/` (directory emptied by move)
- `src/routes/scan/` (directory emptied by move)
- `src/routes/context-build/` (directory emptied by move)
- `src/routes/orchestration-build/` (directory emptied by move)
- `src/routes/fractional/` (directory emptied by move)

---

## Phase 1 — Tokens & Chrome

Remove legacy color tokens and rewrite Header + Footer against the new palette. The SMB canonical reference (`/smb`) must render identically before/after this phase.

### Task 1: Pre-flight visual diff gate

**Files:** none (screenshot capture)

- [ ] **Step 1: Start the dev server and capture a baseline screenshot of `/smb/`**

```bash
dev domeworks
# In a second terminal, once the server is up:
curl -sf https://domeworks.localhost:1355/smb/ > /dev/null && echo "server up"
```

Open `https://domeworks.localhost:1355/smb/` in the browser and save a full-page screenshot to `test-results/smb-baseline.png`. This is the gate we diff against at the end of Phase 1.

- [ ] **Step 2: Commit the baseline (not the screenshot — just note the commit SHA)**

```bash
git rev-parse HEAD > test-results/phase1-baseline-sha.txt
```

No git commit here; the baseline artifacts live under `test-results/` (already gitignored via `.gitignore`).

---

### Task 2: Remove legacy color tokens from `tailwind.css`

**Files:** Modify `src/tailwind.css:4-33`

- [ ] **Step 1: Write the failing build check**

Run:
```bash
yarn build 2>&1 | tail -20
```
Expected: build succeeds (pre-change baseline).

- [ ] **Step 2: Edit `src/tailwind.css` `@theme` block to retain only new-palette tokens**

Replace lines 4–33 with:
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
	--color-subtle: #6b6b6b;
	--color-faint: #a3a3a3;

	/* --- Accent: vermilion (tuned for WCAG AA on white) --- */
	--color-accent: #c2410c;
	--color-accent-hover: #9a3412;
	--color-accent-light: #fb923c;

	/* --- Typography --- */
	--font-sans: 'General Sans', ui-sans-serif, system-ui, sans-serif;
	--font-serif: 'Recia', Georgia, serif;
}
```

Note: `--color-charcoal` retained for now — removed in Phase 6 if unused after migration.

- [ ] **Step 3: Run the build; expect failures**

Run:
```bash
yarn build 2>&1 | tail -40
```
Expected: **fails** with errors about missing Tailwind utilities (e.g., `bg-primary`, `bg-warm-white`, `text-copper`, `text-warm-gray`, `bg-stone`). This is the forcing function — these fail-points mark every legacy usage that must be migrated. Save the error list as a work-log: `yarn build 2>&1 > test-results/phase1-build-errors.txt`.

- [ ] **Step 4: Do NOT commit yet**

The build is red. Committing on red is explicit — Phase 1 ends with Tasks 2–4 bundled into one commit, once Header and Footer are also rewritten.

---

### Task 3: Rewrite `Header.svelte` against new palette + `/leaders/*` hrefs

**Files:** Modify `src/lib/components/layout/Header.svelte`

- [ ] **Step 1: Replace the full file contents**

Full new file:
```svelte
<script lang="ts">
	import { page } from '$app/stores';
	import { getBookCallUrl } from '$lib/utils/mailto';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let menuOpen = $state(false);
	let scrolled = $state(false);
	let isHeroPage = $derived($page.url.pathname === '/');

	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}

	const serviceLinks = [
		{ href: '/leaders/scan/', label: 'AI Scan' },
		{ href: '/leaders/context-build/', label: 'Context Build' },
		{ href: '/leaders/orchestration-build/', label: 'Orchestration Build' },
		{ href: '/leaders/fractional/', label: 'Fractional' }
	];

	const otherLinks = [
		{ href: '/about/', label: 'About' },
		{ href: '/contact/', label: 'Contact' }
	];

	const navLinks = [...serviceLinks, ...otherLinks];

	let servicesOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
		if (!menuOpen) servicesOpen = false;
	}

	/* On hero page, header text is light until scrolled past the dark section */
	let heroMode = $derived(isHeroPage && !scrolled);

	let reducedMotion = $state(false);

	if (typeof window !== 'undefined') {
		$effect(() => {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
			reducedMotion = mq.matches;
			const handler = (e: MediaQueryListEvent) => {
				reducedMotion = e.matches;
			};
			mq.addEventListener('change', handler);
			return () => mq.removeEventListener('change', handler);
		});

		$effect(() => {
			const handleScroll = () => {
				scrolled = window.scrollY > 20;
			};
			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
		});
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300
    {scrolled
		? 'bg-paper/80 backdrop-blur-md shadow-sm border-b border-rule'
		: 'bg-transparent'}"
>
	<nav class="max-w-6xl mx-auto px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 md:h-20">
			<a
				href="/"
				class="text-xl font-semibold tracking-tight transition-colors
          {heroMode
					? 'text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:text-paper/90'
					: 'text-ink hover:text-accent'}"
			>
				DomeWorks
			</a>

			<div class="hidden lg:flex items-center gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-4 py-2 text-sm font-medium rounded-lg transition-all
              {isActive(link.href)
							? heroMode
								? 'text-paper bg-paper/10'
								: 'text-accent bg-accent/6'
							: heroMode
								? 'text-paper/70 hover:text-paper hover:bg-paper/5'
								: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
						aria-current={isActive(link.href) ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}

				<a
					href={getBookCallUrl()}
					class="ml-4 px-5 py-2.5 text-sm font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all shadow-sm hover:shadow"
				>
					Book a call
				</a>
			</div>

			<button
				onclick={toggleMenu}
				class="lg:hidden p-2 -mr-2 rounded-lg transition-all
          {heroMode
					? 'text-paper/70 hover:text-paper hover:bg-paper/5'
					: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
				aria-label="Toggle menu"
				aria-expanded={menuOpen}
			>
				{#if menuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if menuOpen}
			<div
				transition:slide={{ duration: reducedMotion ? 0 : 250, easing: cubicOut }}
				class="lg:hidden pb-6 border-t border-rule mt-2 pt-4"
			>
				<div class="flex flex-col gap-1">
					<button
						onclick={() => (servicesOpen = !servicesOpen)}
						class="flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all
              {serviceLinks.some((l) => isActive(l.href))
							? 'text-accent bg-accent/6'
							: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
					>
						Services
						<svg
							class="w-4 h-4 transition-transform duration-200 {servicesOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if servicesOpen}
						<div
							transition:slide={{ duration: reducedMotion ? 0 : 200, easing: cubicOut }}
							class="ml-4 flex flex-col gap-1"
						>
							{#each serviceLinks as link}
								<a
									href={link.href}
									class="px-4 py-2.5 text-sm font-medium rounded-lg transition-all
                    {isActive(link.href)
										? 'text-accent bg-accent/6'
										: 'text-ink/60 hover:text-ink hover:bg-paper-alt'}"
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
								? 'text-accent bg-accent/6'
								: 'text-ink/70 hover:text-ink hover:bg-paper-alt'}"
							aria-current={isActive(link.href) ? 'page' : undefined}
							onclick={() => (menuOpen = false)}
						>
							{link.label}
						</a>
					{/each}

					<a
						href={getBookCallUrl()}
						class="mt-4 px-5 py-3 text-center text-base font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all"
					>
						Book a call
					</a>
				</div>
			</div>
		{/if}
	</nav>
</header>
```

- [ ] **Step 2: Verify no legacy tokens remain in Header**

Run:
```bash
grep -En "primary|copper|warm-white|warm-gray|stone|charcoal" src/lib/components/layout/Header.svelte
```
Expected: no output.

---

### Task 4: Rewrite `Footer.svelte` — new palette, drop decorative layers, `/leaders/*` hrefs

**Files:** Modify `src/lib/components/layout/Footer.svelte`

- [ ] **Step 1: Replace the full file contents**

Full new file:
```svelte
<script lang="ts">
	import { getBookCallUrl } from '$lib/utils/mailto';

	const navLinks = [
		{ href: '/leaders/scan/', label: 'AI Scan' },
		{ href: '/leaders/context-build/', label: 'Context Build' },
		{ href: '/leaders/orchestration-build/', label: 'Orchestration Build' },
		{ href: '/leaders/fractional/', label: 'Fractional' },
		{ href: '/about/', label: 'About' },
		{ href: '/contact/', label: 'Contact' }
	];
</script>

<footer class="bg-ink text-paper relative">
	<div class="relative border-b border-paper/10">
		<div class="max-w-6xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
			<div class="max-w-4xl">
				<h2 class="footer-headline font-serif font-normal text-paper mb-8">
					Let's figure out<br class="hidden sm:block" /> what's missing<span class="text-accent-light"
						>.</span
					>
				</h2>
				<p class="text-lg md:text-xl text-paper/70 max-w-xl mb-10">
					30 minutes on a call and I can tell you whether your team's AI adoption is a tooling
					problem or a systems problem.
				</p>
				<a
					href={getBookCallUrl()}
					class="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-paper bg-accent hover:bg-accent-hover rounded-lg transition-all active:scale-[0.98] shadow-sm hover:shadow"
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
			</div>
		</div>
	</div>

	<div class="relative">
		<div class="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
				<div class="col-span-2 md:col-span-1">
					<a href="/" class="text-xl font-medium tracking-tight">DomeWorks</a>
					<p class="mt-4 text-sm text-paper/60">
						AI infrastructure that replaces coordination overhead
					</p>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">
						Services
					</p>
					<ul class="space-y-3">
						{#each navLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-paper/70 hover:text-paper transition-colors"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">
						Background
					</p>
					<ul class="space-y-3">
						<li><span class="text-sm text-paper/70">Ex-DoorDash</span></li>
						<li><span class="text-sm text-paper/70">Ex-Square</span></li>
						<li><span class="text-sm text-paper/70">10+ years eng leadership</span></li>
					</ul>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.14em] text-paper/60 mb-5">
						Contact
					</p>
					<p class="text-sm text-paper/70">piers@domeworks.tech</p>
					<p class="mt-2 text-sm text-paper/70">Remote / US-based</p>
				</div>
			</div>

			<div
				class="mt-16 pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-4"
			>
				<p class="text-xs text-paper/50">
					&copy; {new Date().getFullYear()} DomeWorks. All rights reserved.
				</p>
				<p class="text-xs text-paper/50">Replacing coordination overhead with AI infrastructure</p>
			</div>
		</div>
	</div>
</footer>
```

- [ ] **Step 2: Verify no legacy tokens or decorative layers remain**

Run:
```bash
grep -En "primary|copper|warm-white|warm-gray|stone|ambient-warm|texture-grain" src/lib/components/layout/Footer.svelte
```
Expected: no output.

---

### Task 5: Verify Phase 1 gate — SMB canonical renders identically

**Files:** none

- [ ] **Step 1: Build and start preview**

Run:
```bash
yarn build 2>&1 | tail -10
```
Expected: **still fails** because enterprise pages still reference legacy tokens. That's expected — the forcing function for Phase 3+4. Capture the error list:
```bash
yarn build 2>&1 > test-results/phase1-post-errors.txt
```

- [ ] **Step 2: Run type check on the chrome files**

Run:
```bash
yarn check 2>&1 | grep -A2 "Header\|Footer" | head -30
```
Expected: no errors in `Header.svelte` or `Footer.svelte`.

- [ ] **Step 3: Spot-check Assessment page compiles**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/smb/AssessmentPage.svelte 2>&1 | tail -10
```
Expected: no errors.

- [ ] **Step 4: Manual visual verification of `/smb/`**

Restart dev server (`dev domeworks`), open `https://domeworks.localhost:1355/smb/`, scroll the entire page. Compare against `test-results/smb-baseline.png`. Any pixel-level difference is a Phase 1 failure — investigate before committing.

- [ ] **Step 5: Commit Phase 1**

```bash
git add src/tailwind.css src/lib/components/layout/Header.svelte src/lib/components/layout/Footer.svelte
git commit -m "$(cat <<'EOF'
chore(design): remove legacy color tokens; migrate Header/Footer to vermilion

Phase 1 of the editorial design system migration. Strips primary/copper/
stone/warm-white/warm-gray tokens from tailwind.css, leaving the ink/paper/
accent palette codified in DESIGN.md. Header and Footer rewritten against
the new palette; Footer drops the ambient-warm and texture-grain decorative
layers per DESIGN.md's "restraint is the ornament" rule. /leaders/* hrefs
replace the old root-level service paths.

Build is expected to fail on the non-SMB pages until Phase 3+4 lands —
the missing tokens are the forcing function.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Pattern Library

Seven components under `src/lib/components/patterns/`. Each is a thin extraction from `AssessmentPage.svelte`. No consumer code references these yet.

### Task 6: Create `Eyebrow.svelte`

**Files:** Create `src/lib/components/patterns/Eyebrow.svelte`

- [ ] **Step 1: Create the file with full contents**

```svelte
<script lang="ts">
	type Tone = 'accent' | 'subtle' | 'accent-light';

	let {
		label,
		index = undefined,
		tone = 'subtle',
		as = 'p'
	}: {
		label: string;
		index?: string;
		tone?: Tone;
		as?: 'p' | 'span';
	} = $props();

	const toneClass: Record<Tone, string> = {
		accent: 'text-accent',
		subtle: 'text-subtle',
		'accent-light': 'text-accent-light'
	};

	const base = `text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ${toneClass[tone]}`;
</script>

{#if as === 'span'}
	<span class={base}>
		{#if index}
			<span>{index}</span>
			<span class="inline-block h-3 w-px bg-current/25 align-middle mx-2" aria-hidden="true"></span>
		{/if}
		{label}
	</span>
{:else}
	<p class="{base} flex items-center gap-2">
		{#if index}
			<span>{index}</span>
			<span class="h-3 w-px bg-current/25" aria-hidden="true"></span>
		{/if}
		<span>{label}</span>
	</p>
{/if}
```

- [ ] **Step 2: Type-check the file**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/Eyebrow.svelte 2>&1 | tail -5
```
Expected: no errors.

---

### Task 7: Create `HairlineGrid.svelte`

**Files:** Create `src/lib/components/patterns/HairlineGrid.svelte`

- [ ] **Step 1: Create the file with full contents**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	let {
		cols = 3,
		onMuted = false,
		stagger = false,
		staggerDelay = 120,
		children
	}: {
		cols?: 1 | 2 | 3 | 4;
		onMuted?: boolean;
		stagger?: boolean;
		staggerDelay?: number;
		children: Snippet;
	} = $props();

	const colClass: Record<1 | 2 | 3 | 4, string> = {
		1: 'grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-2 lg:grid-cols-3',
		4: 'sm:grid-cols-2 lg:grid-cols-4'
	};
</script>

{#if stagger}
	<div
		class="hairline-grid grid {colClass[cols]} {onMuted ? 'on-muted' : ''}"
		use:reveal={{ stagger: true, staggerDelay }}
	>
		{@render children()}
	</div>
{:else}
	<div class="hairline-grid grid {colClass[cols]} {onMuted ? 'on-muted' : ''}">
		{@render children()}
	</div>
{/if}
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/HairlineGrid.svelte 2>&1 | tail -5
```
Expected: no errors.

---

### Task 8: Create `NumberedSection.svelte` and `TitledSection.svelte`

**Files:**
- Create `src/lib/components/patterns/NumberedSection.svelte`
- Create `src/lib/components/patterns/TitledSection.svelte`

- [ ] **Step 1: Create `NumberedSection.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Section from '$lib/components/layout/Section.svelte';

	let {
		index,
		title,
		id = undefined,
		background = 'white',
		padding = 'lg',
		description = undefined,
		children
	}: {
		index: string;
		title: string;
		id?: string;
		background?: 'white' | 'muted' | 'dark';
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		description?: string;
		children: Snippet;
	} = $props();
</script>

<Section
	{id}
	{background}
	{padding}
	eyebrow={index}
	{title}
	{description}
	centered={false}
>
	{@render children()}
</Section>
```

- [ ] **Step 2: Create `TitledSection.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Section from '$lib/components/layout/Section.svelte';

	let {
		title,
		id = undefined,
		background = 'white',
		padding = 'lg',
		description = undefined,
		children
	}: {
		title: string;
		id?: string;
		background?: 'white' | 'muted' | 'dark';
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		description?: string;
		children: Snippet;
	} = $props();
</script>

<Section {id} {background} {padding} {title} {description} centered={false}>
	{@render children()}
</Section>
```

- [ ] **Step 3: Type-check both**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/ 2>&1 | tail -5
```
Expected: no errors.

---

### Task 9: Create `PullQuote.svelte`

**Files:** Create `src/lib/components/patterns/PullQuote.svelte`

- [ ] **Step 1: Create the file**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		attribution = undefined,
		children
	}: {
		attribution?: string;
		children: Snippet;
	} = $props();
</script>

<section class="bg-paper border-t border-b border-rule py-16 md:py-24">
	<div class="max-w-4xl mx-auto px-6 lg:px-8">
		<blockquote
			class="font-serif text-ink leading-[1.18] tracking-[-0.015em]"
			style="font-size: clamp(1.625rem, 3.6vw, 2.625rem);"
		>
			{@render children()}
		</blockquote>
		{#if attribution}
			<p class="mt-6 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-subtle">
				{attribution}
			</p>
		{/if}
	</div>
</section>
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/PullQuote.svelte 2>&1 | tail -5
```
Expected: no errors.

---

### Task 10: Create `DisplayStat.svelte`

**Files:** Create `src/lib/components/patterns/DisplayStat.svelte`

- [ ] **Step 1: Create the file**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		value,
		unit,
		lede = undefined,
		children
	}: {
		value: string;
		unit: string;
		lede?: string;
		children: Snippet;
	} = $props();
</script>

<div class="max-w-3xl mx-auto">
	{#if lede}
		<p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-subtle mb-4">
			{lede}
		</p>
	{/if}
	<div class="flex items-baseline gap-4 mb-6">
		<span
			class="font-sans font-semibold text-ink leading-[0.95] tracking-[-0.03em]"
			style="font-size: clamp(3rem, 6vw, 5rem);"
		>
			{value}
		</span>
		<span class="font-sans text-muted text-lg">{unit}</span>
	</div>
	<div class="rule-left-accent font-serif text-muted text-lg leading-[1.65]">
		{@render children()}
	</div>
</div>
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/DisplayStat.svelte 2>&1 | tail -5
```
Expected: no errors.

---

### Task 11: Create `Callout.svelte`

**Files:** Create `src/lib/components/patterns/Callout.svelte`

- [ ] **Step 1: Create the file**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'accent' | 'accent-strong' | 'rule-left' | 'rule-left-sm';

	let {
		variant,
		children
	}: {
		variant: Variant;
		children: Snippet;
	} = $props();

	const variantClass: Record<Variant, string> = {
		accent: 'bg-accent/6 rounded-lg p-6',
		'accent-strong': 'bg-accent/18 rounded-lg p-6',
		'rule-left': 'rule-left-accent',
		'rule-left-sm': 'rule-left-accent-sm'
	};
</script>

<div class={variantClass[variant]}>
	{@render children()}
</div>
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx svelte-check --threshold error --workspace src/lib/components/patterns/Callout.svelte 2>&1 | tail -5
```
Expected: no errors.

---

### Task 12: Phase 2 commit

- [ ] **Step 1: Verify all pattern files exist and type-check cleanly**

Run:
```bash
ls src/lib/components/patterns/
yarn check 2>&1 | tail -10
```
Expected: seven `.svelte` files listed; `yarn check` still shows errors only for unmigrated pages (not for patterns).

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/patterns/
git commit -m "$(cat <<'EOF'
feat(patterns): extract editorial design pattern library from AssessmentPage

Adds seven components under src/lib/components/patterns/:
Eyebrow, HairlineGrid, NumberedSection, TitledSection, PullQuote,
DisplayStat, Callout. Each preserves the exact markup/classes codified
in DESIGN.md — no reinvention. Downstream pages consume these in
Phase 3+4 to stop reimplementing eyebrows, grids, and callouts by hand.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3+4 — IA Move + Enterprise Page Migrations

Moves five enterprise pages to `/leaders/*`, adds redirects, migrates pages to the new palette + pattern library, then migrates `/about` and `/contact`. **These tasks land in one logical push** (branch or PR) — the build is red until Task 23 completes.

### Task 13: Add `/leaders/*` 301 redirects to `_redirects`

**Files:** Modify `_redirects`

- [ ] **Step 1: Replace the file**

```
# Cloudflare Pages / Netlify redirects
# Preserve SEO and inbound links

# Legacy SMB aliases
/ai-audit/      /smb/           301
/ai-audit       /smb/           301
/ai-tools-assessment/   /smb/   301
/ai-tools-assessment    /smb/   301

# Quiz moved under /smb/ on 2026-04-23
/quiz/          /smb/quiz/      301
/quiz           /smb/quiz/      301

# Enterprise track moved under /leaders/ on 2026-04-24
/assessment/            /leaders/                           301
/assessment             /leaders/                           301
/scan/                  /leaders/scan/                      301
/scan                   /leaders/scan/                      301
/context-build/         /leaders/context-build/             301
/context-build          /leaders/context-build/             301
/orchestration-build/   /leaders/orchestration-build/       301
/orchestration-build    /leaders/orchestration-build/       301
/fractional/            /leaders/fractional/                301
/fractional             /leaders/fractional/                301
```

Note: the working tree already has `_redirects` modified on this branch (visible in `git status`) — that included prior changes for the SMB rename. The replacement above subsumes those.

- [ ] **Step 2: Verify**

```bash
cat _redirects | grep -c "301"
```
Expected: `16` (10 legacy + 6 new pairs… actually recount — 10 lines have 301, 2 SMB aliases + 2 quiz + 10 enterprise = 14). Accept any count ≥ 14.

---

### Task 14: Update `static/sitemap.xml` with new URLs

**Files:** Modify `static/sitemap.xml`

- [ ] **Step 1: Replace file contents**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domeworks.tech/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/leaders/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/leaders/scan/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/leaders/context-build/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/leaders/orchestration-build/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/leaders/fractional/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/cpa/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/law/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/insurance/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/dental/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/real-estate/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/mortgage-broker/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/smb/quiz/</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/about/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://domeworks.tech/contact/</loc>
    <lastmod>2026-04-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify no legacy paths remain in sitemap**

```bash
grep -E "domeworks.tech/(scan|context-build|orchestration-build|fractional|assessment)/" static/sitemap.xml
```
Expected: no output.

---

### Task 15: Update `static/llms.txt` with new URLs

**Files:** Modify `static/llms.txt`

- [ ] **Step 1: Replace file contents**

```markdown
# DomeWorks

> DomeWorks builds intelligence infrastructure for engineering teams and leader-owned organizations — replacing coordination overhead (meetings, status updates, information routing) with AI systems that do that work automatically.

Founded by Piers Rollinson, an engineering leader with 10+ years at DoorDash, Square, and Mudflap. DomeWorks offers a structured engagement path from diagnostic through build to ongoing ownership.

## For Leaders (enterprise track)

- [AI Scan](https://domeworks.tech/leaders/scan/): A 48-hour audit of your team's AI tool spend, adoption patterns, and wasted seats. Fixed price $2,500–$3,500. Deliverable: clear picture of what your AI investment is actually doing and where the waste is.
- [Context Build](https://domeworks.tech/leaders/context-build/): A two-week engagement diagnosing AI readiness and designing the context system your AI tools need to work at the team level. $10,000–$15,000. Deliverable: stakeholder interviews, tool and spend audit, context system design, workflow mapping, and a prioritized opportunity map.
- [Orchestration Build](https://domeworks.tech/leaders/orchestration-build/): Milestone-based build of the agent coordination layer — multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Scoped from the Context Build assessment.
- [Fractional AI Leadership](https://domeworks.tech/leaders/fractional/): Ongoing monthly retainer, 1–2 days per week. Part-time Head of AI role — maintaining and evolving the context system and agent coordination as the organization changes.
- [Leaders Assessment](https://domeworks.tech/leaders/): Structured diagnostic for leaders running in-house teams. Two-week engagement: stakeholder interviews, infrastructure analysis, and a prioritized build plan.

## For SMB / Owner-Operators

- [AI Readiness Quiz](https://domeworks.tech/smb/quiz/): Free 2-minute quiz that pinpoints your biggest time leak across admin, marketing, and delivery. Delivers a personalized Action Plan by email within 24 hours with three quick wins and step-by-step setup instructions (30–60 min each, no technical background required). Also names workflows where AI is the wrong tool.
- [AI Tools Assessment for Professional Services](https://domeworks.tech/smb/): A structured diagnostic of where AI tools fit in your services business and where they shouldn't go. For owner-operated services businesses doing $3–10M in revenue with 10–50 people. Three-phase method: Assess, Prescribe, Build. Deliverable includes a discovery call, a written report in 48 hours with prioritized opportunities, an explicit list of workflows not to automate, and a review call.

## Company

- [About](https://domeworks.tech/about/): Piers Rollinson — founder background, engineering leadership experience at DoorDash, Square, and Mudflap, and the reasoning behind DomeWorks.
- [Contact](https://domeworks.tech/contact/): Get in touch or book a call.
```

- [ ] **Step 2: Verify**

```bash
grep -E "domeworks.tech/(scan|context-build|orchestration-build|fractional|assessment)/" static/llms.txt
```
Expected: no output.

---

### Task 16: Update `JourneyBar.svelte` for new `/leaders/*` paths and new palette

**Files:** Modify `src/lib/components/ui/JourneyBar.svelte`

- [ ] **Step 1: Replace file contents**

```svelte
<script lang="ts">
	type ServicePage = 'scan' | 'context-build' | 'orchestration-build' | 'fractional';

	let { current }: { current: ServicePage } = $props();

	const steps: { key: ServicePage; label: string; href: string }[] = [
		{ key: 'scan', label: 'AI Scan', href: '/leaders/scan/' },
		{ key: 'context-build', label: 'Context Build', href: '/leaders/context-build/' },
		{
			key: 'orchestration-build',
			label: 'Orchestration Build',
			href: '/leaders/orchestration-build/'
		},
		{ key: 'fractional', label: 'Fractional', href: '/leaders/fractional/' }
	];

	const currentIndex = $derived(steps.findIndex((s) => s.key === current));

	function segmentColor(stepIndex: number): string {
		const isCurrent = stepIndex === currentIndex;
		const isPast = stepIndex < currentIndex;

		if (isCurrent) return 'bg-accent';
		if (isPast) return 'bg-accent/40';
		const distance = stepIndex - currentIndex;
		if (distance === 1) return 'bg-accent/15';
		return 'bg-rule';
	}

	function labelColor(stepIndex: number): string {
		if (stepIndex === currentIndex) return 'text-ink font-semibold';
		return 'text-ink/60 hover:text-ink';
	}
</script>

<nav class="mb-8" aria-label="Service journey">
	<div class="flex items-center gap-1.5 mb-3">
		{#each steps as step, i}
			<div
				class="flex-1 h-[3px] rounded-full {segmentColor(i)} transition-all duration-300 {i ===
				currentIndex
					? 'scale-y-[1.6] origin-center'
					: ''}"
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

- [ ] **Step 2: Verify no legacy tokens**

```bash
grep -En "primary|copper|charcoal" src/lib/components/ui/JourneyBar.svelte
```
Expected: no output.

---

### Task 17: Move `/fractional` → `/leaders/fractional/` and migrate

**Files:**
- Create: `src/routes/leaders/fractional/+page.svelte`
- Delete: `src/routes/fractional/+page.svelte` (and the empty `fractional/` directory)

This is the smallest service page (285 lines) — do it first to build muscle memory before Context Build (478 lines).

- [ ] **Step 1: Create directory and move the file**

Run:
```bash
mkdir -p src/routes/leaders/fractional
git mv src/routes/fractional/+page.svelte src/routes/leaders/fractional/+page.svelte
rmdir src/routes/fractional
```

- [ ] **Step 2: Edit the moved file — update `<svelte:head>` canonical + OG URLs**

In `src/routes/leaders/fractional/+page.svelte` lines 15, 19, and 27 (approximate), change every `https://domeworks.tech/fractional/` occurrence to `https://domeworks.tech/leaders/fractional/`. Four replacements total (canonical, og:url, twitter — verify with grep).

Run:
```bash
grep -n "domeworks.tech/fractional/" src/routes/leaders/fractional/+page.svelte
```
Replace each line's URL with the `/leaders/fractional/` variant. After edits:
```bash
grep -cn "domeworks.tech/fractional/" src/routes/leaders/fractional/+page.svelte
```
Expected: `0`.

- [ ] **Step 3: Replace the hero block (lines ~51–90)**

Find the hero block:
```svelte
<!-- Hero -->
<section
	class="py-20 md:py-28 relative overflow-hidden"
	style="background: linear-gradient(135deg, #FAFAF7 65%, rgba(176,125,79,0.05));"
>
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<!-- Architectural SVG: Compound growth curve -->
	...decorative SVG...
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<JourneyBar current="fractional" />
			<h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
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

Replace with:
```svelte
<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<div class="mb-6"><JourneyBar current="fractional" /></div>
		<Eyebrow label="Fractional AI Leadership" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Intelligence infrastructure compounds when someone owns it<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			An ongoing retainer where I act as your part-time Head of AI, 1–2 days a week. I maintain
			and evolve the context system and agent coordination, close feedback loops, and adapt the
			infrastructure as your org changes.
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>
```

Update the imports at the top:
```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import TitledSection from '$lib/components/patterns/TitledSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
	import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
</script>
```

Note: `JourneyBar` is rendered inside the dark `Section`, so verify its `text-ink/60` base color contrasts enough on dark. If it looks washed out, the follow-up task covers a `dark` variant for JourneyBar — but out of scope for this task.

- [ ] **Step 4: Swap `<Section ... eyebrow="01">` to `<NumberedSection index="01">` (and 02, 03, 04, 05)**

Five occurrences. For each:

Before:
```svelte
<Section background="muted" padding="lg" eyebrow="01" title="What this is">
```
After:
```svelte
<NumberedSection index="01" background="muted" title="What this is">
```

Do the same for 02, 03, 04, 05. Keep the body markup inside untouched in this step.

For §02 "What I do" (lines ~121-131), the rendered list uses a `bg-copper` bullet — swap `bg-copper` → `bg-accent` in this step. Verify no other `copper` remains after swap.

- [ ] **Step 5: Replace "Typical Week" section (lines ~134–158)**

Before:
```svelte
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

After:
```svelte
<TitledSection background="muted" title="What a typical week looks like">
	<HairlineGrid cols={2} onMuted>
		<div class="cell">
			<Eyebrow label="Mon – Tue" tone="accent" />
			<h3 class="mt-3 font-medium text-ink mb-2">Embedded with your team</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				Standups, pairing sessions, system maintenance. Hands-on with the infrastructure and the
				people who depend on it.
			</p>
		</div>
		<div class="cell">
			<Eyebrow label="Wed – Fri" tone="accent" />
			<h3 class="mt-3 font-medium text-ink mb-2">Async &amp; strategic</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				Monitoring, feedback loop review, planning next iteration. Identifying what your team is
				still doing manually that infrastructure could replace.
			</p>
		</div>
	</HairlineGrid>
</TitledSection>
```

- [ ] **Step 6: Convert §03 "Who this is for" rounded callout box → `Callout variant="rule-left"`**

Before:
```svelte
<NumberedSection index="03" background="muted" title="Who this is for">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-lg text-charcoal/70 leading-relaxed mb-6">
				Teams that have completed a <a href="/context-build/" class="text-primary hover:underline">Context Build</a>
				or <a href="/orchestration-build/" class="text-primary hover:underline">Orchestration Build</a> — or have equivalent infrastructure in place — and want the system to keep getting smarter as the org changes.
			</p>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				If you're still figuring out your AI tooling or haven't built a context system yet, this
				isn't the right entry point. Start with the <a href="/scan/" class="text-primary hover:underline">AI Scan</a>.
			</p>
		</div>
	</div>
</NumberedSection>
```

After:
```svelte
<NumberedSection index="03" background="muted" title="Who this is for">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<p class="font-serif text-lg text-muted leading-[1.65] mb-6">
				Teams that have completed a <a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a>
				or <a href="/leaders/orchestration-build/" class="text-accent hover:underline">Orchestration Build</a> — or have equivalent infrastructure in place — and want the system to keep getting smarter as the org changes.
			</p>
			<p class="font-serif text-lg text-muted leading-[1.65]">
				If you're still figuring out your AI tooling or haven't built a context system yet, this
				isn't the right entry point. Start with the <a href="/leaders/scan/" class="text-accent hover:underline">AI Scan</a>.
			</p>
		</Callout>
	</div>
</NumberedSection>
```

- [ ] **Step 7: Convert §04 "Investment" box**

Before:
```svelte
<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
	...content with text-charcoal and border-charcoal/10...
</div>
```

After:
```svelte
<Callout variant="accent">
	<div class="flex flex-col gap-4">
		<div class="flex justify-between items-baseline border-b border-rule pb-4">
			<span class="font-medium text-ink">Commitment</span>
			<span class="text-ink">1–2 days/week</span>
		</div>
		<div class="flex justify-between items-baseline border-b border-rule pb-4">
			<span class="font-medium text-ink">Typical duration</span>
			<span class="text-ink">6+ months</span>
		</div>
		<div class="flex justify-between items-baseline">
			<span class="font-medium text-ink">Pricing</span>
			<span class="text-ink">Monthly retainer, discussed on call</span>
		</div>
	</div>
</Callout>
<p class="text-center text-subtle text-sm mt-4">
	Rate depends on scope and what infrastructure is already in place.
</p>
```

- [ ] **Step 8: Convert §01 "What this is" inner callout**

The §01 section has an inner `div` with `bg-warm-white rounded-xl border border-charcoal/10` wrapping a "This is not a starter engagement" paragraph. Replace:

Before:
```svelte
<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
	<p class="text-sm text-charcoal/70 leading-relaxed">
		This is not a starter engagement. The system needs to exist before it can be owned. If
		you're earlier in the journey, start with the <a href="/scan/" class="text-primary hover:underline">AI Scan</a>
		or <a href="/context-build/" class="text-primary hover:underline">Context Build</a>.
	</p>
</div>
```

After:
```svelte
<Callout variant="rule-left-sm">
	<p class="font-serif text-sm text-muted leading-[1.55]">
		This is not a starter engagement. The system needs to exist before it can be owned. If
		you're earlier in the journey, start with the <a href="/leaders/scan/" class="text-accent hover:underline">AI Scan</a>
		or <a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a>.
	</p>
</Callout>
```

- [ ] **Step 9: Convert FAQ section (§05) — remove `bg-warm-white rounded-xl border border-charcoal/10` wrappers; use plain `border-b border-rule`**

For each `<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">`, change to:
```svelte
<details class="group border-b border-rule py-5">
```

And inside each `<summary>`, change `font-medium text-charcoal` to `font-medium text-ink`, and `text-charcoal/60` chevron color to `text-subtle`. Inside each answer `<p>`, change `text-charcoal/70` to `text-muted` and add `font-serif` prefix.

- [ ] **Step 10: Final grep for legacy tokens on this file**

Run:
```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal" src/routes/leaders/fractional/+page.svelte
```
Expected: no output (should only have `font-sans`/`font-serif` references, not palette tokens — verify nothing matches).

- [ ] **Step 11: Type-check the page**

Run:
```bash
npx svelte-check --threshold error --workspace src/routes/leaders/fractional/+page.svelte 2>&1 | tail -5
```
Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/routes/leaders/fractional src/routes/fractional 2>/dev/null
git rm -r src/routes/fractional 2>/dev/null || true
git add src/routes/leaders/
git commit -m "$(cat <<'EOF'
feat(leaders): migrate /fractional → /leaders/fractional/ with new palette

Moves Fractional page under /leaders/* and adopts the editorial pattern
library (NumberedSection, HairlineGrid, Callout, Eyebrow). Hero replaced
with Section background=dark. All legacy palette tokens swapped to
ink/paper/accent. Canonical URLs updated.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 18: Move `/scan` → `/leaders/scan/` and migrate

**Files:**
- Create: `src/routes/leaders/scan/+page.svelte`
- Delete: `src/routes/scan/+page.svelte`

- [ ] **Step 1: Move the file**

```bash
mkdir -p src/routes/leaders/scan
git mv src/routes/scan/+page.svelte src/routes/leaders/scan/+page.svelte
rmdir src/routes/scan
```

- [ ] **Step 2: Update `<svelte:head>` URLs — change every `domeworks.tech/scan/` to `domeworks.tech/leaders/scan/`**

Four occurrences (canonical, og:url, og:image stays, og:title, etc.). Verify with:
```bash
grep -cn "domeworks.tech/scan/" src/routes/leaders/scan/+page.svelte
```
After edits, expected: `0`.

Also update internal text links to other services:
- `/context-build/` → `/leaders/context-build/` (appears twice — inside §03 and FAQ)

```bash
grep -n 'href="/context-build/"\|href="/scan/"\|href="/fractional/"\|href="/orchestration-build/"' src/routes/leaders/scan/+page.svelte
```
Replace each to the `/leaders/<name>/` variant.

- [ ] **Step 3: Replace hero block (lines ~57–97)**

Replace the `<section style="background: linear-gradient(135deg, #FAFAF7 70%, rgba(13,107,99,0.04));">` and the inner radar SVG with:
```svelte
<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<div class="mb-6"><JourneyBar current="scan" /></div>
		<Eyebrow label="AI Scan" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			What you're spending on AI<span class="text-accent-light">.</span> What you're getting from it<span
				class="text-accent-light">.</span
			>
			In 48 hours<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			You're paying for more AI tooling than you realize. Some of it works. Some of it sits idle.
			The Scan maps every tool, every seat, every dollar — and tells you whether your team is
			actually moving from "bought tools" to "AI coordinates our work."
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>
```

Also add imports at the top:
```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>
```

- [ ] **Step 4: Swap §01–§05 to `NumberedSection`**

Five occurrences. For each `<Section ... eyebrow="0N" title="...">` → `<NumberedSection index="0N" ...>`.

- [ ] **Step 5: Convert §01 step-numbered list — swap `bg-primary` number badges to `bg-accent`**

Inside §01, the list renders numbered badges using `bg-primary text-white`. Change to `bg-accent text-paper`. Change `text-charcoal` labels to `text-ink`, `text-charcoal/70` descriptions to `text-muted` + `font-serif`.

- [ ] **Step 6: Convert §02 "What you get" card grid to `HairlineGrid`**

Before:
```svelte
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 100 }}>
	{#each [...] as item}
		<div class="p-6 bg-stone rounded-xl border border-charcoal/10">
			<h3 class="font-medium text-charcoal mb-2">{item.title}</h3>
			<p class="text-sm text-charcoal/60">{item.desc}</p>
		</div>
	{/each}
</div>
```

After:
```svelte
<HairlineGrid cols={3} stagger staggerDelay={100}>
	{#each [...] as item}
		<div class="cell">
			<h3 class="font-medium text-ink mb-2">{item.title}</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">{item.desc}</p>
		</div>
	{/each}
</HairlineGrid>
```

Keep the `each` array literal untouched — only the wrappers change.

- [ ] **Step 7: Convert §03 "Most teams find the same gap" callout box**

The inner `<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">` becomes:
```svelte
<Callout variant="rule-left">
	<p class="font-serif text-lg text-muted leading-[1.65] mb-4">
		No shared context flowing into AI interactions. No coordination between the tools and how
		the team actually ships. Individual engineers are faster; the team isn't.
	</p>
	<p class="font-serif text-lg text-muted leading-[1.65]">
		When that's what the Scan surfaces, I'll tell you exactly what a <a
			href="/leaders/context-build/"
			class="text-accent hover:underline">Context Build</a
		> would address and what it wouldn't — so you can decide whether to build it in-house or with
		me. Plenty of teams take the quick wins and run. There's no obligation.
	</p>
</Callout>
```

- [ ] **Step 8: Convert §04 Investment pricing table**

The `<table>` has `<thead>` with `bg-primary text-white` — change to `bg-ink text-paper`. The alternating rows `bg-warm-white` and `bg-stone` become `bg-paper` and `bg-paper-alt`. Remove `rounded-2xl`, use `.hairline-grid`-style borders instead. Simpler: keep the table rectangular, just swap tokens:

```svelte
<div class="overflow-hidden border-t border-b border-rule">
	<table class="w-full">
		<thead>
			<tr class="bg-ink text-paper">
				<th class="text-left px-6 py-4 text-sm font-medium">Team Size</th>
				<th class="text-right px-6 py-4 text-sm font-medium">Price</th>
			</tr>
		</thead>
		<tbody>
			<tr class="bg-paper">
				<td class="px-6 py-4 text-ink">5–20 people</td>
				<td class="px-6 py-4 text-right text-ink font-medium">$2,500</td>
			</tr>
			<tr class="bg-paper-alt">
				<td class="px-6 py-4 text-ink">20–80 people</td>
				<td class="px-6 py-4 text-right text-ink font-medium">$3,000</td>
			</tr>
			<tr class="bg-paper">
				<td class="px-6 py-4 text-ink">80+ people</td>
				<td class="px-6 py-4 text-right text-ink font-medium">$3,500</td>
			</tr>
		</tbody>
	</table>
</div>
<p class="text-center text-subtle text-sm mt-4">
	Fixed price, no surprises. 48-hour turnaround.
</p>
```

- [ ] **Step 9: Convert FAQ (§05) — plain `border-b border-rule`, no bg/rounded wrappers**

Per pattern established in Task 17 Step 9. For each `<details class="group p-6 bg-stone rounded-xl border border-charcoal/10">`, change to `<details class="group border-b border-rule py-5">`. Update inner colors: `text-charcoal` → `text-ink`, `text-charcoal/70` → `text-muted font-serif`, `text-charcoal/60` → `text-subtle`, `text-primary hover:underline` → `text-accent hover:underline`.

- [ ] **Step 10: Update the "journey nudge" block at the bottom**

Before:
```svelte
<div class="border-t border-charcoal/8 py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-charcoal/60">
			Next in the journey: <a href="/context-build/" class="text-primary hover:underline font-medium">Context Build &rarr;</a>
		</p>
	</div>
</div>
```

After:
```svelte
<div class="border-t border-rule py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-subtle">
			Next in the journey: <a href="/leaders/context-build/" class="text-accent hover:underline font-medium">Context Build &rarr;</a>
		</p>
	</div>
</div>
```

- [ ] **Step 11: Final grep + type-check**

Run:
```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/leaders/scan/+page.svelte
npx svelte-check --threshold error --workspace src/routes/leaders/scan/+page.svelte 2>&1 | tail -5
```
Expected: no grep output, no svelte-check errors.

- [ ] **Step 12: Commit**

```bash
git add src/routes/leaders/scan
git rm -r src/routes/scan 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(leaders): migrate /scan → /leaders/scan/ with new palette

Moves AI Scan page under /leaders/* and adopts the editorial pattern
library. Hero replaced with Section background=dark. Pricing table,
step list, and FAQ all swapped to new palette tokens. Internal links
to sibling services updated to /leaders/*.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Move `/orchestration-build` → `/leaders/orchestration-build/` and migrate

**Files:**
- Create: `src/routes/leaders/orchestration-build/+page.svelte`
- Delete: `src/routes/orchestration-build/+page.svelte`

Same migration shape as Task 18 (`/scan`) with the following explicit steps for this file.

- [ ] **Step 1: Move the file**

```bash
mkdir -p src/routes/leaders/orchestration-build
git mv src/routes/orchestration-build/+page.svelte src/routes/leaders/orchestration-build/+page.svelte
rmdir src/routes/orchestration-build
```

- [ ] **Step 2: Update `<svelte:head>` canonical and OG URLs**

Replace every `domeworks.tech/orchestration-build/` → `domeworks.tech/leaders/orchestration-build/`. Verify:
```bash
grep -cn "domeworks.tech/orchestration-build/" src/routes/leaders/orchestration-build/+page.svelte
```
Expected after edits: `0`.

- [ ] **Step 3: Replace the script block imports at the top with**

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>
```

- [ ] **Step 4: Replace the hero block (the `<section ... style="background: linear-gradient(...)">` and its inline decorative SVG)**

Full replacement:
```svelte
<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<div class="mb-6"><JourneyBar current="orchestration-build" /></div>
		<Eyebrow label="Orchestration Build" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			<!-- Keep the existing headline text (from the original file) -->
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			<!-- Keep the existing lede text (from the original file) -->
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>
```

Copy the existing headline and lede text verbatim from the file being edited — do not rewrite copy.

- [ ] **Step 5: Swap five `<Section ... eyebrow="0N" title="...">` to `<NumberedSection index="0N" ...>`**

For each of §01–§05, convert as in Task 18 Step 4.

- [ ] **Step 6: Convert card grids to `HairlineGrid`**

Wherever the page uses `<div class="grid md:grid-cols-N gap-6 ...">` with inner `bg-stone`/`bg-warm-white` card boxes, convert to `<HairlineGrid cols={N}>` with `.cell` children (pattern from Task 18 Step 6).

- [ ] **Step 7: Convert inline callout boxes**

- Body callouts (`<div class="p-8 bg-warm-white rounded-2xl ...">` wrapping prose) → `<Callout variant="rule-left">` + `font-serif text-muted`.
- Investment/pricing callouts (`<div class="p-8 bg-stone ...">`) → `<Callout variant="accent">` with `text-ink` inner content.

- [ ] **Step 8: Convert FAQ `<details>` blocks**

For each `<details class="group p-6 bg-stone rounded-xl border border-charcoal/10">`, change to `<details class="group border-b border-rule py-5">`. Swap inner colors: `text-charcoal` → `text-ink`, `text-charcoal/70` → `text-muted font-serif`, `text-charcoal/60` → `text-subtle`, `text-primary hover:underline` → `text-accent hover:underline`.

- [ ] **Step 9: Update internal sibling links**

```bash
grep -n 'href="/scan/"\|href="/context-build/"\|href="/fractional/"\|href="/assessment/"' src/routes/leaders/orchestration-build/+page.svelte
```
Replace each `/<slug>/` with `/leaders/<slug>/`.

- [ ] **Step 10: Final grep + type-check + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/leaders/orchestration-build/+page.svelte
npx svelte-check --threshold error --workspace src/routes/leaders/orchestration-build/+page.svelte 2>&1 | tail -5
```

Then:
```bash
git add src/routes/leaders/orchestration-build
git rm -r src/routes/orchestration-build 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(leaders): migrate /orchestration-build → /leaders/orchestration-build/ with new palette

Moves Orchestration Build page under /leaders/* and adopts the editorial
pattern library. Hero replaced with Section background=dark. All sections
swap to NumberedSection + HairlineGrid + Callout per the pattern.
Internal sibling links updated to /leaders/*.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 20: Move `/assessment` → `/leaders/` (hub) and migrate

**Files:**
- Create: `src/routes/leaders/+page.svelte`
- Delete: `src/routes/assessment/+page.svelte`

This page becomes the tier-2 enterprise hub at `/leaders/`. The copy stays the same — only URL changes and migration.

- [ ] **Step 1: Move the file**

```bash
mkdir -p src/routes/leaders
git mv src/routes/assessment/+page.svelte src/routes/leaders/+page.svelte
rmdir src/routes/assessment
```

- [ ] **Step 2: Update `<svelte:head>` URLs**

Change every `domeworks.tech/assessment/` → `domeworks.tech/leaders/`. Also update the `<title>` to `AI Assessment for Leaders | DomeWorks` (explicit audience signal in title). Verify:
```bash
grep -cn "domeworks.tech/assessment/" src/routes/leaders/+page.svelte
```
Expected: `0`.

- [ ] **Step 3: Apply the same palette/pattern migration as Task 18**

Add imports for `NumberedSection`, `Eyebrow`, `HairlineGrid`, `Callout`. Replace hero with dark `<Section>`. The `/assessment` hero uses `bg-warm-white py-20 md:py-28` (same as about/contact) plus an explicit `<p class="text-xs font-medium tracking-widest text-primary uppercase mb-6">Assessment</p>` eyebrow. Replace with:

```svelte
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<Eyebrow label="Leaders Assessment" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Find out what's actually happening with AI on your team<span class="text-accent-light">.</span>
			Then fix it<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			A two-week engagement where I figure out what's actually happening with AI at your company —
			not what the dashboards say — and what's blocking it from working at the team level.
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>
```

Note: this page does not use `JourneyBar` — `/leaders/` is the hub, not a journey step. Do NOT import JourneyBar.

Then apply the standard pattern to §01–§05:
- §01 "Four things happen" step list → keep structure, swap `bg-primary` badges → `bg-accent text-paper`.
- §02 "What you get" three-card grid → `HairlineGrid cols={3}`.
- §03 "What happens next" callout → `Callout variant="rule-left"`.
- §04 "Investment" table + founding-client note → table token swap; founding-client note becomes `Callout variant="accent"`.
- Final CTA `<Section background="muted">` → `<TitledSection background="muted" title="Ready to find out what's blocking your team?">` (import `TitledSection`) OR keep as centered marketing-CTA block using plain `Section` with `centered` — spec says centered titles are OK for simpler marketing pages, so keep this one as `<Section background="muted" padding="lg">` with inline `<h2>` migrated only on token level.

- [ ] **Step 4: Final grep + type-check + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/leaders/+page.svelte
npx svelte-check --threshold error --workspace src/routes/leaders/+page.svelte 2>&1 | tail -5
```

Then:
```bash
git add src/routes/leaders/+page.svelte
git rm -r src/routes/assessment 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(leaders): migrate /assessment → /leaders/ as tier-2 hub with new palette

The former enterprise assessment page becomes the /leaders/ hub, paralleling
/smb/ as the tier-2 audience funnel. Adopts the editorial pattern library.
Copy unchanged; URL and palette migrated.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 21: Move `/context-build` → `/leaders/context-build/` and migrate

**Files:**
- Create: `src/routes/leaders/context-build/+page.svelte`
- Delete: `src/routes/context-build/+page.svelte`

478 lines — largest enterprise page. Same migration shape as Task 18 with the following explicit steps.

- [ ] **Step 1: Move the file**

```bash
mkdir -p src/routes/leaders/context-build
git mv src/routes/context-build/+page.svelte src/routes/leaders/context-build/+page.svelte
rmdir src/routes/context-build
```

- [ ] **Step 2: Update `<svelte:head>` canonical and OG URLs**

Replace every `domeworks.tech/context-build/` → `domeworks.tech/leaders/context-build/`.

- [ ] **Step 3: Replace the script block imports at the top**

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>
```

- [ ] **Step 4: Replace the hero block**

```svelte
<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<div class="mb-6"><JourneyBar current="context-build" /></div>
		<Eyebrow label="Context Build" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			<!-- Keep the existing headline text (from the original file) -->
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			<!-- Keep the existing lede text (from the original file) -->
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>
```

- [ ] **Step 5: Swap §01–§05 `<Section eyebrow="0N">` → `<NumberedSection index="0N">`**

Five occurrences. Title and body preserved; only the wrapper changes.

- [ ] **Step 6: Migrate the §02 "What you get" sub-section (largest block — lines ~118–333)**

This is the detailed deliverables block and contains multiple nested cards/callouts. Do not rewrite structure — only apply palette + component swaps:
- Outer card grids → `HairlineGrid` with `cols={N}` matching existing grid-cols class.
- `<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">` → `<Callout variant="accent">` (interior content converts to ink/muted tokens).
- `<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">` → `<Callout variant="rule-left">` with `font-serif text-muted` on body prose.
- Any inline `text-primary` → `text-accent`, `text-charcoal` → `text-ink`, `text-charcoal/70` → `text-muted` (+ `font-serif` on body copy), `text-charcoal/60` → `text-subtle`, `border-charcoal/10` → `border-rule`, `bg-stone`/`bg-warm-white` → `bg-paper-alt`/`bg-paper`.

- [ ] **Step 7: Convert FAQ `<details>` blocks to plain hairline style**

For each `<details class="group p-6 bg-... rounded-... border ...">`, change to `<details class="group border-b border-rule py-5">`. Swap inner colors as in Task 19 Step 8.

- [ ] **Step 8: Update internal sibling links**

```bash
grep -n 'href="/scan/"\|href="/fractional/"\|href="/orchestration-build/"\|href="/assessment/"' src/routes/leaders/context-build/+page.svelte
```
Replace each `/<slug>/` with `/leaders/<slug>/`.

- [ ] **Step 9: Final grep + type-check + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/leaders/context-build/+page.svelte
npx svelte-check --threshold error --workspace src/routes/leaders/context-build/+page.svelte 2>&1 | tail -5
```

Then:
```bash
git add src/routes/leaders/context-build
git rm -r src/routes/context-build 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(leaders): migrate /context-build → /leaders/context-build/ with new palette

Moves Context Build page (largest of the enterprise service pages) under
/leaders/* and adopts the editorial pattern library. Hero, spine, and all
sub-sections migrated to the ink/paper/accent palette.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 22: Migrate `/about` (Level B, no numbering)

**Files:** Modify `src/routes/about/+page.svelte`

- [ ] **Step 1: Add imports**

Change imports at top to:
```svelte
<script lang="ts">
	import Section from '$lib/components/layout/Section.svelte';
	import TitledSection from '$lib/components/patterns/TitledSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>
```

- [ ] **Step 2: Replace hero (lines 51–70) with dark `<Section>`**

```svelte
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<Eyebrow label="About" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			I've been making engineering teams ship better for a decade<span class="text-accent-light"
				>.</span
			>
			Now I do it with AI<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			Ten years at DoorDash, Square, and Mudflap, mostly working on one problem: how engineering
			teams actually ship faster — not just look busier.
		</p>
	</div>
</Section>
```

- [ ] **Step 3: Convert three body `Section` blocks → `TitledSection` (no index — about is a margin page)**

For each of `§01 Why DomeWorks exists`, `§02 How I work`, `§03 Current engagement`:
- Remove inline `<p class="text-xs font-medium tracking-widest text-warm-gray uppercase mb-4">01</p>` and `<h2 class="font-serif text-3xl font-normal text-charcoal mb-8">...</h2>` — the title prop now renders these.
- Change `<Section background="muted" padding="lg">` → `<TitledSection background="muted" title="Why DomeWorks exists">` (etc.).
- Inside body, `text-charcoal` → `text-ink`, `text-charcoal/70` → `text-muted font-serif`, `border-l-2 border-copper` → `rule-left-accent` (use `Callout variant="rule-left"`), `text-primary hover:underline` → `text-accent hover:underline`.

- [ ] **Step 4: Convert current-engagement case-study callout (lines ~157–180) to `Callout`**

The inner `<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">` becomes `<Callout variant="rule-left">`. Inside, `<p class="text-xs font-medium tracking-widest text-primary uppercase mb-3">Case study — Q2 2026</p>` stays but with `text-accent` and uses new `<Eyebrow label="Case study — Q2 2026" tone="accent" />`.

- [ ] **Step 5: Convert final CTA section**

The final `<Section background="muted" padding="lg">` at lines 183–193 can stay as plain `<Section background="muted" padding="lg">` (this is a centered marketing CTA — keep it centered). Just migrate tokens: `text-charcoal` → `text-ink`, `text-charcoal/70` → `text-muted font-serif`.

- [ ] **Step 6: Final grep + type-check + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/about/+page.svelte
npx svelte-check --threshold error --workspace src/routes/about/+page.svelte 2>&1 | tail -5
git add src/routes/about/+page.svelte
git commit -m "$(cat <<'EOF'
feat(about): migrate /about to editorial palette + TitledSection pattern

Dark hero with Eyebrow + oversize headline. Body sections use
TitledSection (no numbered spine — about is a margin page, not a
pitch). Current-engagement case study becomes a rule-left Callout.
All legacy tokens swapped.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 23: Migrate `/contact` (Level B)

**Files:** Modify `src/routes/contact/+page.svelte`

- [ ] **Step 1: Replace script block imports**

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import TitledSection from '$lib/components/patterns/TitledSection.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import { getBookCallUrl, generateGeneralMailto } from '$lib/utils/mailto';
</script>
```

- [ ] **Step 2: Replace hero + body**

Replace the entire `<section class="bg-warm-white ...">` (lines 32–115) with:

```svelte
<Section background="dark" padding="xl">
	<div class="max-w-3xl mx-auto text-center">
		<Eyebrow label="Contact" tone="accent-light" as="p" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Let's talk<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-4 font-serif text-lg text-paper/80 leading-[1.65]">
			30 minutes on a call and I can tell you whether your team's AI situation is something I can
			help with.
		</p>
	</div>
</Section>

<Section background="white" padding="lg">
	<div class="max-w-4xl mx-auto">
		<HairlineGrid cols={2}>
			<div class="cell flex flex-col">
				<h2 class="text-xl font-medium text-ink mb-3">Book a call</h2>
				<p class="font-serif text-muted mb-6 flex-grow leading-[1.55]">
					The best way to start. 30-minute discovery call, no obligation. I'll ask about your team,
					your tools, and where things are stuck.
				</p>
				<div>
					<Button href={getBookCallUrl()} size="lg">Book a discovery call</Button>
				</div>
			</div>
			<div class="cell flex flex-col">
				<h2 class="text-xl font-medium text-ink mb-3">Send an email</h2>
				<p class="font-serif text-muted mb-6 flex-grow leading-[1.55]">
					Prefer email? Tell me about your team and I'll get back within 24 hours.
				</p>
				<div>
					<Button href={generateGeneralMailto()} variant="secondary" size="lg">Send an email</Button>
				</div>
			</div>
		</HairlineGrid>

		<div class="mt-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 text-sm text-muted">
			<div class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left">
				<span class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">1</span>
				<span>You tell me about your team</span>
			</div>
			<div class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left">
				<span class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">2</span>
				<span>I share 2–3 observations</span>
			</div>
			<div class="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 text-center sm:text-left">
				<span class="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">3</span>
				<span>We figure out if there's a fit</span>
			</div>
		</div>

		<div class="mt-12 max-w-3xl mx-auto">
			<Callout variant="rule-left">
				<h2 class="text-lg font-medium text-ink mb-4">What to expect</h2>
				<p class="font-serif text-muted leading-[1.65]">
					On the call, I'll ask about your team size, what AI tools you're using, and where things are
					stuck. I'll share 2–3 observations about where you might have leverage. If there's a fit,
					I'll recommend where to start — usually an <a href="/leaders/scan/" class="text-accent hover:underline">AI Scan</a>
					($2,500) if you need a clear picture first, or a
					<a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a> ($10,000+) if
					the gaps are already clear. If there isn't a fit, I'll tell you that too.
				</p>
			</Callout>
		</div>
	</div>
</Section>
```

Note: sibling links inside the Callout now use `/leaders/scan/` and `/leaders/context-build/`.

- [ ] **Step 3: Final grep + type-check + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/contact/+page.svelte
npx svelte-check --threshold error --workspace src/routes/contact/+page.svelte 2>&1 | tail -5
git add src/routes/contact/+page.svelte
git commit -m "$(cat <<'EOF'
feat(contact): migrate /contact to editorial palette + HairlineGrid

Dark hero with centered Eyebrow + headline. Book-a-call / email
two-up becomes HairlineGrid. What-to-expect block becomes rule-left
Callout. Sibling links updated to /leaders/*.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 24: Token sweep on redirect stubs

**Files:**
- Modify `src/routes/ai-audit/+page.svelte`
- Modify `src/routes/ai-tools-assessment/+page.svelte`

These are redirect stubs — fallback copy rarely seen. Five-minute token sweep.

- [ ] **Step 1: In `src/routes/ai-audit/+page.svelte`, replace legacy tokens**

In the fallback copy (the `<main>` block at lines 17–28), change:
- `text-warm-gray` → `text-subtle`
- `text-charcoal` → `text-ink`
- `text-charcoal/70` → `text-muted`
- `text-copper` → `text-accent`

- [ ] **Step 2: Do the same in `src/routes/ai-tools-assessment/+page.svelte`**

Identical copy structure. Same four token swaps.

- [ ] **Step 3: Verify + commit**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal" src/routes/ai-audit/+page.svelte src/routes/ai-tools-assessment/+page.svelte
```
Expected: no output.

```bash
git add src/routes/ai-audit src/routes/ai-tools-assessment
git commit -m "chore(stubs): token sweep on redirect fallback copy

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 25: Phase 3+4 gate — full build + test pass

**Files:** none

- [ ] **Step 1: Run full build**

```bash
yarn build 2>&1 | tail -20
```
Expected: **build succeeds**. Every page prerenders without error. This is the signal Phase 3+4 is complete.

- [ ] **Step 2: Run type check**

```bash
yarn check 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 3: Run lint**

```bash
yarn lint 2>&1 | tail -20
```
Expected: no errors (warnings acceptable).

- [ ] **Step 4: Run Playwright tests and repair breakages**

```bash
yarn test 2>&1 | tail -60
```
Expected breakages: tests that assert legacy URLs (`/scan/`, `/context-build/`, etc.) or legacy class names (`text-primary`, `bg-warm-white`, etc.). For each breakage:
- If the test asserts a URL path that moved, update the test to `/leaders/...`.
- If the test asserts a class name that changed, update to the new-palette equivalent.
- If the test captures a screenshot, re-record baseline with `yarn test --update-snapshots` **only after manual review** confirms the visual change is intended.

Do not stop until `yarn test` passes green.

- [ ] **Step 5: Full-site grep sweep for lingering legacy tokens**

```bash
grep -rEn "text-primary|bg-primary|text-copper|bg-copper|border-copper|bg-warm-white|text-warm-white|text-warm-gray|bg-warm-gray|bg-stone|border-stone|text-charcoal|border-charcoal" src/ --include="*.svelte" --include="*.css"
```
Expected: no output, or only the homepage (`src/routes/+page.svelte`) which will be addressed in Phase 5.

If other files show up, migrate them in a follow-up commit within this task.

- [ ] **Step 6: Manual visual review at each responsive breakpoint**

In the browser, open each migrated page and scroll at widths 360px, 640px, 768px, 1024px, 1280px:
- `https://domeworks.localhost:1355/leaders/`
- `https://domeworks.localhost:1355/leaders/scan/`
- `https://domeworks.localhost:1355/leaders/context-build/`
- `https://domeworks.localhost:1355/leaders/orchestration-build/`
- `https://domeworks.localhost:1355/leaders/fractional/`
- `https://domeworks.localhost:1355/about/`
- `https://domeworks.localhost:1355/contact/`

Verify for each:
- Accent color appears ≤2× per viewport
- Serif for body copy, sans for UI/eyebrows/CTAs
- Hairline grids render with interior rules visible
- Dark hero contrasts correctly on ≥4.5:1
- No orphaned decorative SVGs or legacy gradients

Any regressions → fix + amend the relevant per-page commit (use `git commit --fixup` or cherry-pick). Do not amend if the commit has been pushed elsewhere.

- [ ] **Step 7: Phase 3+4 closing commit (optional, for any sweep fixes)**

If any sweep fixes landed in Step 5 outside of the per-page commits, commit them:

```bash
git add -A
git commit -m "chore(design): phase 3+4 sweep cleanup

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 5 — Homepage Level C Restyle

Single-page, multi-commit work on `src/routes/+page.svelte` and the homepage-specific CSS in `src/tailwind.css`. Each commit is shippable.

### Task 26: Homepage palette swap (keep structure)

**Files:** Modify `src/routes/+page.svelte`

- [ ] **Step 1: Full-file token swap**

Do NOT change any layout yet — only palette tokens. Targeted replacements:
- `text-copper` → `text-accent-light` (on dark hero) or `text-accent` (on paper/muted)
- `text-primary` → `text-accent`
- `bg-primary` → `bg-accent`
- `bg-primary/5`, `bg-primary/10` → `bg-accent/6`, `bg-accent/10`
- `border-primary` → `border-accent`
- `text-warm-white` → `text-paper`
- `text-warm-white/70`, `/85`, `/75`, `/60` → `text-paper/70`, `/85`, `/75`, `/60`
- `border-charcoal/5`, `/8`, `/10` → `border-rule`
- `text-charcoal` → `text-ink`
- `text-charcoal/70` → `text-muted`
- `text-charcoal/60`, `/55`, `/40` → `text-subtle`, `text-faint`
- `text-warm-gray` → `text-paper/60` (on dark) or `text-subtle` (on paper)
- `bg-stone` → `bg-paper-alt`
- `bg-warm-white` → `bg-paper`
- `focus:ring-copper` → `focus:ring-accent`
- `focus:bg-primary` → `focus:bg-accent`
- `hover:border-primary` → `hover:border-accent`
- `hover:border-copper/40` → `hover:border-accent/40`

Run the full grep after editing:
```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal" src/routes/+page.svelte
```
Expected: no output.

- [ ] **Step 2: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte
git commit -m "chore(homepage): palette swap to ink/paper/accent

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 27: Homepage — remove decorative hero layers

**Files:** Modify `src/routes/+page.svelte`, `src/tailwind.css`

- [ ] **Step 1: Delete decorative hero divs from the markup (lines ~107–129)**

Remove these divs from `src/routes/+page.svelte`:
```svelte
<!-- Architectural grid background -->
<div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
<!-- Warm ambient glow: bottom-left copper, top-right teal -->
<div class="absolute inset-0 hero-glow" aria-hidden="true" role="presentation"></div>
<!-- Grain texture -->
<div class="absolute inset-0 texture-grain" aria-hidden="true" role="presentation"></div>
<!-- Horizontal architectural rules -->
<div class="absolute inset-0 pointer-events-none hero-rules" aria-hidden="true" role="presentation"></div>

<!-- Monogram as architectural column, anchored to right edge, structurally integrated -->
<div class="absolute inset-0 pointer-events-none hero-monogram-container" aria-hidden="true" role="presentation">
	<span class="hero-monogram font-serif select-none">D</span>
</div>

<!-- Vertical accent line: copper rule that runs the height of the hero -->
<div class="absolute hero-accent-line" aria-hidden="true" role="presentation"></div>
```

- [ ] **Step 2: Delete the corresponding CSS rules**

The CSS classes `.hero-grid`, `.hero-glow`, `.hero-rules`, `.hero-monogram-container`, `.hero-monogram`, `.hero-accent-line`, `.texture-grain`, `.ambient-warm`, `.grid-overlay` may be defined in `src/tailwind.css` (verify with `grep`). For each that exists there, delete its rule block. If the rules are instead defined via an `@layer utilities` in a component `<style>` block in `+page.svelte`, delete them there.

Run:
```bash
grep -En "\.hero-grid|\.hero-glow|\.hero-rules|\.hero-monogram|\.hero-accent-line|\.texture-grain|\.ambient-warm|\.grid-overlay" src/tailwind.css
```
Delete any matching rule blocks.

Also delete the lines in `src/tailwind.css` that relate to these utilities:
- The `.grid-overlay` block at the top (lines ~36-39)
- Any `.hero-*` or `.ambient-*` or `.texture-*` blocks

- [ ] **Step 3: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte src/tailwind.css
git commit -m "refactor(homepage): remove decorative hero layers per DESIGN.md

Drops hero-grid, hero-glow, texture-grain, monogram-as-column, and the
vertical copper accent rule. DESIGN.md: 'Don't add illustration, gradient
mesh, or decorative SVG. The page's authority comes from restraint.'

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 28: Homepage — restructure two-tracks picker to HairlineGrid + Callout

**Files:** Modify `src/routes/+page.svelte`

- [ ] **Step 1: Add imports for patterns**

At the top of the `<script>` block, add:
```svelte
import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
import Callout from '$lib/components/patterns/Callout.svelte';
import PullQuote from '$lib/components/patterns/PullQuote.svelte';
```

- [ ] **Step 2: Replace the two-tracks picker section (lines ~227–308)**

Replace the whole `<Section eyebrow="Choose your track" title="...">` block with:

```svelte
<Section
	background="white"
	padding="md"
	eyebrow="Choose your track"
	title="Which one sounds like you?"
>
	<div class="max-w-6xl mx-auto" use:reveal>
		<HairlineGrid cols={2}>
			<a
				href="/smb/"
				class="cell group flex flex-col hover:bg-paper-alt transition-colors"
				aria-label="Owner-operator services track — AI Tools Assessment"
			>
				<div class="rule-left-accent">
					<Eyebrow label="Track A · Owner-operator" tone="accent" />
					<h3 class="mt-3 font-sans text-2xl md:text-3xl text-ink leading-tight font-medium">
						You run a services business.
					</h3>
					<p class="mt-4 font-serif text-muted leading-[1.65]">
						$3M to $10M in revenue, 10 to 50 people. AI tools keep coming, admin keeps piling up, and
						you want to know what's actually worth your attention and what to leave alone.
					</p>
					<p class="mt-4 font-serif text-sm text-subtle">
						Accounting, legal, medical and dental, trades, real estate, agencies.
					</p>
				</div>
				<div class="mt-auto pt-5 border-t border-rule flex items-center justify-between gap-3">
					<span class="text-sm font-medium text-ink">AI Tools Assessment</span>
					<span class="text-accent text-lg group-hover:translate-x-1 transition-transform">→</span>
				</div>
				<p class="mt-3 text-xs text-subtle">
					Or start with the <span class="text-accent underline underline-offset-2">2-minute AI Readiness Quiz</span>
				</p>
			</a>

			<a
				href="/leaders/"
				class="cell group flex flex-col hover:bg-paper-alt transition-colors"
				aria-label="Leaders track — AI Scan, Context Build, Orchestration, Fractional"
			>
				<div class="rule-left-accent">
					<Eyebrow label="Track B · Leaders running teams" tone="accent" />
					<h3 class="mt-3 font-sans text-2xl md:text-3xl text-ink leading-tight font-medium">
						You lead a team inside a larger org.
					</h3>
					<p class="mt-4 font-serif text-muted leading-[1.65]">
						50 to 500 people. Your team already uses AI tools. Individual productivity is up. Team-level
						throughput is flat. You need the infrastructure between the tools, not another tool.
					</p>
					<p class="mt-4 font-serif text-sm text-subtle">
						AI Scan, Context Build, Orchestration, Fractional AI Leadership.
					</p>
				</div>
				<div class="mt-auto pt-5 border-t border-rule flex items-center justify-between gap-3">
					<span class="text-sm font-medium text-ink">Leaders Assessment</span>
					<span class="text-accent text-lg group-hover:translate-x-1 transition-transform">→</span>
				</div>
				<p class="mt-3 text-xs text-subtle">
					Or start with the <span class="text-accent underline underline-offset-2">AI Scan</span>
				</p>
			</a>
		</HairlineGrid>
	</div>

	<div class="max-w-4xl mx-auto mt-8 text-center">
		<p class="text-sm text-subtle">
			Not sure which applies? The sections below go deeper on the leaders track. If you're
			owner-operator, the <a href="/smb/" class="text-accent underline underline-offset-2">SMB Assessment page</a> is the better read.
		</p>
	</div>
</Section>
```

Note: Track B href changed from `/scan/` to `/leaders/`, and the Track B kicker text changed from `VP Eng / CTO` to `Leaders running teams` to match the new URL. The "lead engineering at a mid-market SaaS" headline is replaced with the more audience-agnostic "lead a team inside a larger org" to cover both eng and non-eng leaders (AICPA case).

- [ ] **Step 3: Swap numbered `<Section eyebrow="01/02/03/04">` to `<NumberedSection>`**

For §01 "Who this is for", §02 "The problem isn't the tools", §03 "The AI stack", §04 "How it works":
- Change `<Section background="..." padding="..." eyebrow="01" title="Who this is for">` → `<NumberedSection index="01" background="..." title="Who this is for">`.
- Four occurrences.

- [ ] **Step 4: Update §01 "Who this is for" audience copy**

The bullet list currently leads with `You're a VP Engineering, CTO, or technical founder — 50 to 500 engineers, Series B or C, AI tooling already rolled out`. Change to:

```svelte
<span>You're a <strong class="text-ink">VP, director, or senior leader</strong> — running a team of 50 to 500 inside a larger org, engineering or otherwise, with AI tooling already rolled out</span>
```

This broadens the audience signal in-line with the `/leaders/` URL and memory note about AICPA-type clients.

- [ ] **Step 5: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte
git commit -m "refactor(homepage): two-tracks picker → HairlineGrid + Callout; numbered sections → NumberedSection

Replaces the rounded bg-stone card picker with hairline-grid cells
accented by left-rules. Track B links updated to /leaders/ and copy
broadened to 'Leaders running teams' to cover engineering and
non-engineering audiences (e.g., institutes, agencies).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 29: Homepage — insert PullQuote between §03 and §04

**Files:** Modify `src/routes/+page.svelte`

- [ ] **Step 1: Find the §03 closing tag and insert a PullQuote before §04**

Locate where §03 "The AI stack" (`<NumberedSection index="03" ...>...</NumberedSection>`) closes and §04 "How it works" (`<NumberedSection index="04" id="how-it-works" ...>`) opens.

Insert between them:
```svelte
<PullQuote attribution="The coordination layer — the thing managers and meetings used to be — is what now has to be built.">
	Individual productivity is up. Team-level throughput is flat — because the handoffs between
	people haven't changed.
</PullQuote>
```

- [ ] **Step 2: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte
git commit -m "feat(homepage): insert editorial pull-quote between §03 and §04

DESIGN.md: 'The pull-quote break sits roughly at the 60% scroll mark
and resets pace before the qualifying fit section.'

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 30: Homepage — recolor AI stack visualization

**Files:** Modify `src/routes/+page.svelte`

- [ ] **Step 1: Update the "DomeWorks builds" left-rail gradient**

Find the SVG at lines ~414-432. The `bg-gradient-to-b from-primary via-copper to-primary` gradient rail stays — swap to `bg-gradient-to-b from-accent via-accent-light to-accent`. Update the rotated label color: `text-primary` → `text-accent`.

- [ ] **Step 2: Recolor Agent Coordination layer**

Currently `bg-primary` with `opacity-10` lines overlay. Change `bg-primary` → `bg-accent`. Keep the white opacity overlays (`bg-white/10`, `text-white/80`, etc.) — those work on both teal and vermilion.

- [ ] **Step 3: Recolor Context System layer**

Currently `bg-copper`. Change to `bg-accent-light`. The layer remains visually distinct from the Agent Coordination layer because accent and accent-light are different hues. Keep the white opacity overlays.

- [ ] **Step 4: Update Surface/Edge layers (top + bottom bookends)**

Currently `bg-stone border border-charcoal/8`. Change to `bg-paper-alt border border-rule`. The `text-warm-gray` uppercase labels become `text-subtle`.

- [ ] **Step 5: Update Before/After comparison block**

Currently `bg-stone rounded-xl border border-charcoal/10`. Change to `bg-paper-alt rounded-lg border border-rule`. Inside, `text-charcoal/40` → `text-faint`, `text-primary` → `text-accent`. Serif body usage preserved (already serif on some lines; add `font-serif` where missing to bullet items).

- [ ] **Step 6: Update the closing serif blockquote below the stack**

`border-l-2 border-copper pl-6` → use `Callout variant="rule-left"`:

```svelte
<div class="max-w-2xl mx-auto">
	<Callout variant="rule-left">
		<p class="font-serif text-lg text-muted leading-[1.65]">
			I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a
			strategy deck. I stay until the context system and agent coordination are running and your
			team can maintain them without me.
		</p>
	</Callout>
</div>
```

- [ ] **Step 7: Update §04 "How it works" service cards**

The four cards (Scan, Context Build, Orchestration, Fractional) currently use `bg-warm-white`, `bg-primary/[0.03]`, `border-copper`, `text-copper`, `text-primary`, `bg-copper/30`, etc. Convert the whole grid to `HairlineGrid cols={4}` with cells styled uniformly:

Replace the existing `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">` and its four `<a>` cards with:

```svelte
<HairlineGrid cols={4} stagger staggerDelay={150}>
	<a href="/leaders/scan/" class="cell group flex flex-col hover:bg-paper-alt transition-colors">
		<div class="rule-left-accent">
			<Eyebrow label="Start here" tone="accent" />
			<h3 class="mt-3 text-xl font-medium text-ink mb-2">AI Scan</h3>
			<p class="text-2xl font-serif text-ink mb-4">$2,500–$3,500</p>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				In 48 hours, I diagnose where you are on the path from "bought tools" to "AI coordinates our
				work." You get a clear picture of what's missing and quick wins your team can act on this
				week.
			</p>
		</div>
		<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more →</p>
	</a>

	<a href="/leaders/context-build/" class="cell group flex flex-col hover:bg-paper-alt transition-colors">
		<div class="rule-left-accent">
			<Eyebrow label="Deep dive" tone="accent" />
			<h3 class="mt-3 text-xl font-medium text-ink mb-2">Context Build</h3>
			<p class="text-2xl font-serif text-ink mb-4">$10,000–$15,000+</p>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				I map your organization's world model gaps, design the context system, and build the
				infrastructure that feeds your domain knowledge into every AI interaction. Your team goes
				from "every prompt starts from zero" to "AI knows our business."
			</p>
			<p class="mt-3 text-sm text-subtle">1–2 week assessment + 4-week build</p>
		</div>
		<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more →</p>
	</a>

	<a href="/leaders/orchestration-build/" class="cell group flex flex-col hover:bg-paper-alt transition-colors">
		<div>
			<h3 class="text-xl font-medium text-ink mb-2">Orchestration Build</h3>
			<p class="text-2xl font-serif text-ink mb-4">4–12 weeks</p>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				I build the agent coordination layer: multi-agent workflows, quality gates, output routing.
				Your team goes from "AI helps individuals" to "AI coordinates our work."
			</p>
			<p class="mt-3 text-sm text-subtle">Day rate, scoped from assessment</p>
		</div>
		<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more →</p>
	</a>

	<a href="/leaders/fractional/" class="cell group flex flex-col hover:bg-paper-alt transition-colors">
		<div>
			<Eyebrow label="What comes after" tone="subtle" />
			<h3 class="mt-3 text-xl font-medium text-ink mb-2">Fractional AI Leadership</h3>
			<p class="text-2xl font-serif text-ink mb-4">Monthly retainer</p>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				1–2 days/week. I maintain and evolve the context system and agent coordination, close
				feedback loops, and make sure the infrastructure compounds as your org changes.
			</p>
		</div>
		<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more →</p>
	</a>
</HairlineGrid>
```

Note: hrefs now point to `/leaders/*`. The "Start here" and "Deep dive" visual emphasis moves from colored borders/pills to the consistent `rule-left-accent` device — two of four cards get the left-rule.

- [ ] **Step 8: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte
git commit -m "refactor(homepage): recolor AI stack viz; §04 service cards → HairlineGrid

Agent Coordination layer swaps teal → accent. Context System layer
swaps copper → accent-light. Surface/Edge bookends and Before/After
blocks use paper-alt + rule. §04 service grid becomes a HairlineGrid
with rule-left-accent on the two emphasis cards. All hrefs updated
to /leaders/*.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 31: Homepage — hero editorial polish

**Files:** Modify `src/routes/+page.svelte`, possibly `src/tailwind.css`

- [ ] **Step 1: Review hero headline and stat bar**

Read lines ~137–225 of the current `+page.svelte`. The hero uses custom classes `hero-line`, `hero-line-1` through `hero-line-4`, `hero-headline-em`, `hero-stat-*`. These still exist in `src/tailwind.css`.

- [ ] **Step 2: Decide on hero headline emphasis**

The headline's `<em>` tag with custom italic styling can stay — italic serif on sans headline is a classic editorial device and does not conflict with DESIGN.md. Verify the headline renders at `hero-h1` scale (`clamp(2.5rem, 7vw, 4.5rem)`, -0.035em, semibold). If `src/tailwind.css` still has `.hero-headline` with a different scale, update it to match DESIGN.md's `hero-h1` token:

```css
.hero-headline {
	font-size: clamp(2.5rem, 7vw, 4.5rem);
	line-height: 1.02;
	letter-spacing: -0.035em;
}

@media (max-width: 640px) {
	.hero-headline {
		font-size: clamp(2rem, 10vw, 3rem);
		line-height: 1.08;
	}
}
```

- [ ] **Step 3: Update `.hero-eyebrow-text` color (was `#c99a6b` copper) and reinstate an explicit eyebrow above the headline**

The current hero has an empty `.hero-eyebrow-row` (eyebrow removed per council review). Restore an `Eyebrow`:

Before (the empty `.hero-eyebrow-row` div):
```svelte
<div class="hero-eyebrow-row"></div>
```

After:
```svelte
<div class="hero-eyebrow-row">
	<Eyebrow label="DomeWorks · Intelligence Infrastructure" tone="accent-light" />
</div>
```

If `Eyebrow` is not already imported at the top of `+page.svelte`, add it.

In `src/tailwind.css`, update `.hero-eyebrow-text` color: `#c99a6b` → `var(--color-accent-light)` (or simply delete the rule since the Eyebrow component sets its own color). Delete `.hero-eyebrow-index` too — it's unused after the restructure.

- [ ] **Step 4: Update the SKIP-TO-CONTENT link**

The skip link at line 97 uses `focus:bg-primary` — already swapped in Task 26. Verify it reads `focus:bg-accent`.

- [ ] **Step 5: Final homepage grep + type-check**

```bash
grep -En "primary|copper|warm-white|warm-gray|stone|text-charcoal|border-charcoal|\.hero-eyebrow-index" src/routes/+page.svelte src/tailwind.css
npx svelte-check --threshold error --workspace src/routes/+page.svelte 2>&1 | tail -5
```
Expected: no output from grep; no svelte-check errors.

- [ ] **Step 6: Build + commit**

```bash
yarn build 2>&1 | tail -5
git add src/routes/+page.svelte src/tailwind.css
git commit -m "feat(homepage): hero editorial polish — restore Eyebrow, fix token drift

Restores an explicit accent-light Eyebrow above the hero headline
('DomeWorks · Intelligence Infrastructure'). Removes .hero-eyebrow-index
(unused). Updates .hero-headline scale to match DESIGN.md hero-h1 token.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 32: Phase 5 gate — full homepage visual review

**Files:** none

- [ ] **Step 1: Build and preview**

```bash
yarn build 2>&1 | tail -5
yarn preview &
# Opens at port 4173 by default
```

- [ ] **Step 2: Visual verification at 360 / 640 / 768 / 1024 / 1280 px**

For each width:
- Hero renders on `bg-ink` with `accent-light` eyebrow, sans-serif semibold headline, serif lede, primary CTA + quiet secondary link.
- Two-tracks picker shows two hairline-grid cells with left-accent rules, Track A → `/smb/`, Track B → `/leaders/`.
- §01 has numbered eyebrow `01`, left-aligned title.
- AI stack visualization shows 4 layers; Agent Coordination in `accent`, Context System in `accent-light`.
- `PullQuote` appears between §03 and §04, serif, with full-bleed top + bottom rules.
- §04 "How it works" grid has 4 cells, 2 with rule-left-accent emphasis.
- Bottom CTA on `bg-paper-alt`.

Accept: accent color ≤2× per viewport (allowed exceptions: the two-tracks picker has two rule-left-accents in the same viewport, which is intentional — they belong to different tracks).

- [ ] **Step 3: Verify with `prefers-reduced-motion`**

In devtools, emulate `prefers-reduced-motion: reduce`. Confirm:
- `reveal` action short-circuits — content paints in final state immediately.
- `.stack-build` short-circuits (already handled in `tailwind.css`).
- No stray animations.

- [ ] **Step 4: Phase 5 closing note (no commit)**

Phase 5 is complete. Proceed to Phase 6 cleanup.

---

## Phase 6 — Cleanup (Optional)

### Task 33: Remove unused tokens and scratch routes

**Files:** Modify `src/tailwind.css`; possibly delete `src/routes/dev-patterns/` if it was created in Phase 2 Step 1

- [ ] **Step 1: Check if `--color-charcoal` is still in use**

```bash
grep -rEn "text-charcoal|bg-charcoal|border-charcoal|charcoal" src/ --include="*.svelte" --include="*.css" --include="*.ts" --include="*.js"
```
If zero results, remove `--color-charcoal: #1a1a1a;` from `src/tailwind.css`.

- [ ] **Step 2: Check for any `/dev-patterns/` route and remove**

```bash
ls src/routes/dev-patterns 2>&1
```
If present, delete:
```bash
git rm -r src/routes/dev-patterns
```

- [ ] **Step 3: Full-project grep for any remaining legacy references**

```bash
grep -rEn "primary|copper|warm-white|warm-gray|stone|ambient-warm|texture-grain" src/ --include="*.svelte" --include="*.css" --include="*.ts" --include="*.js" | grep -v "font-primary"
```
Review each hit. Expected: only `--color-primary` / `--color-primary-hover` etc. already removed. Real code references should be zero. `font-primary` is a false positive and ignored.

- [ ] **Step 4: Build + commit (if any deletions occurred)**

```bash
yarn build 2>&1 | tail -5
git add -A
git commit -m "chore(cleanup): remove unused charcoal token and scratch routes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 34: Optional — refactor `AssessmentPage.svelte` to consume pattern components

**Files:** Modify `src/lib/components/smb/AssessmentPage.svelte`

This is a nice-to-have. Only do it if there's appetite and the SMB page can be visually regression-tested.

- [ ] **Step 1: Capture baseline screenshot of `/smb/`**

Same procedure as Task 1. Save to `test-results/smb-post-migration-baseline.png`.

- [ ] **Step 2: Replace inline `<p class="text-[0.6875rem] font-semibold tracking-[0.14em] ...">` eyebrows with `<Eyebrow>`**

Grep for the eyebrow pattern:
```bash
grep -n "text-\[0.6875rem\]" src/lib/components/smb/AssessmentPage.svelte
```
For each occurrence, replace with the appropriate `<Eyebrow label="..." tone="..." />`.

- [ ] **Step 3: Replace `.hairline-grid grid ...` blocks with `<HairlineGrid>`**

```bash
grep -n "hairline-grid grid" src/lib/components/smb/AssessmentPage.svelte
```
Convert each.

- [ ] **Step 4: Visual diff against baseline**

Open `/smb/`, compare to `test-results/smb-post-migration-baseline.png`. Zero pixel difference expected.

- [ ] **Step 5: Commit (only if step 4 passes clean)**

```bash
git add src/lib/components/smb/AssessmentPage.svelte
git commit -m "refactor(smb): AssessmentPage consumes pattern library components

Pure refactor — visual output unchanged. The canonical design reference
now uses the canonical primitives extracted in Phase 2.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** All six sections of the spec map to tasks — Phase 1 (tokens, header, footer) = Tasks 1–5; Phase 2 (pattern library) = Tasks 6–12; Phase 3+4 (IA move + enterprise + about/contact + stubs) = Tasks 13–25; Phase 5 (homepage) = Tasks 26–32; Phase 6 (cleanup) = Tasks 33–34.
- **Enterprise-hero shape:** Tasks 17, 18, 19, 20, 21, 22, 23 all use the `<Section background="dark" padding="xl">` + `Eyebrow` + headline + serif lede + CTA pattern established in the spec addendum.
- **/leaders/ hub copy:** Task 20 keeps the /assessment copy unchanged beyond palette + URL. No copy rewrites per non-goals.
- **Two-tracks picker copy adjustment:** Task 28 updates "VP Eng / CTO" → "Leaders running teams" and broadens "mid-market SaaS" to "larger org, engineering or otherwise" to align with the `/leaders/` audience.
- **Phase 3+4 coupling:** Tasks 13–24 are independently committable but the build stays red until Task 24 (`/contact`) completes, unless the work is on a feature branch. Task 25 is the explicit gate.
- **Test repair:** Task 25 Step 4 explicitly budgets for Playwright selector breakage.
