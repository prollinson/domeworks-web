# SMB Pivot Option B — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `/ai-audit/` landing page for SMB professional services outreach, and make light-touch copy updates on the homepage to soften engineering-only language.

**Architecture:** Two independent workstreams. Workstream 1 creates a new route at `src/routes/ai-audit/+page.svelte` using existing `Section`, `Button`, and `reveal` patterns. Workstream 2 edits text in `src/routes/+page.svelte` and `src/lib/utils/mailto.ts`. No new components or dependencies.

**Tech Stack:** SvelteKit 5 (runes), Tailwind CSS 4, existing component library (`Section.svelte`, `Button.svelte`, `reveal` action)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/routes/ai-audit/+page.svelte` | SMB AI Audit landing page |
| Modify | `src/routes/+page.svelte` | Homepage copy softening |
| Modify | `src/lib/utils/mailto.ts` | Add audit-specific booking helper |

---

### Task 1: Add audit booking helper to mailto utils

**Files:**
- Modify: `src/lib/utils/mailto.ts`

- [ ] **Step 1: Add `getAuditCallUrl` function**

Add to the bottom of `src/lib/utils/mailto.ts`:

```typescript
export function getAuditCallUrl(): string {
  return CALENDLY
}
```

This reuses the same Calendly link. Having a separate function lets us swap to a dedicated audit scheduling link later without changing the page.

- [ ] **Step 2: Verify the file builds**

Run: `cd /Users/piers/Projects/domeworks-web && npx svelte-check --threshold error 2>&1 | tail -5`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/mailto.ts
git commit -m "feat: add audit booking URL helper"
```

---

### Task 2: Create `/ai-audit/` landing page

**Files:**
- Create: `src/routes/ai-audit/+page.svelte`

**Reference:** Read `docs/superpowers/specs/2026-04-06-smb-pivot-option-b-design.md` for full section-by-section spec. Read `src/routes/scan/+page.svelte` for the route pattern (meta tags, JSON-LD, imports, Section usage).

- [ ] **Step 1: Create the page file with meta tags and imports**

Create `src/routes/ai-audit/+page.svelte`:

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getAuditCallUrl } from '$lib/utils/mailto';
</script>

<svelte:head>
	<title>AI Audit for Professional Services | DomeWorks</title>
	<meta
		name="description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm. Free for the first 5 firms in Henderson/Las Vegas."
	/>
	<link rel="canonical" href="https://domeworks.tech/ai-audit/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/ai-audit/" />
	<meta property="og:title" content="AI Audit for Professional Services | DomeWorks" />
	<meta
		property="og:description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="AI Audit for Professional Services | DomeWorks"
	/>
	<meta
		name="twitter:description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Audit for Professional Services',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Structured assessment of where AI tools can recover time for professional services firms. Discovery call, AI analysis, written report with prioritized opportunities.',
		areaServed: {
			'@type': 'Place',
			name: 'Henderson / Las Vegas, Nevada'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			description: 'Free for the first 5 firms (normally $999)',
			eligibleRegion: {
				'@type': 'Place',
				name: 'Henderson / Las Vegas, Nevada'
			}
		}
	})}</script>`}
</svelte:head>
```

- [ ] **Step 2: Add the hero section**

Append below `</svelte:head>`:

```svelte
<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl" use:reveal>
		<h1 class="font-serif font-normal text-warm-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
			Your firm runs on manual workflows<span class="text-copper">.</span>
			<br />
			<span class="text-warm-white/70">Most of them don't have to.</span>
		</h1>
		<p class="text-lg md:text-xl text-warm-white/80 leading-relaxed max-w-2xl mb-8">
			A structured assessment of where AI tools can recover real time in your
			practice — not a sales pitch, not a software demo.
		</p>
		<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
	</div>
</Section>
```

- [ ] **Step 3: Add the problem section**

Append below the hero:

```svelte
<!-- The problem -->
<Section background="white" padding="lg" eyebrow="01" title="Where the time goes">
	<div class="max-w-3xl mx-auto space-y-8" use:reveal>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			Every professional services firm has the same pattern: skilled people spending
			hours on work that follows rules, not judgment. The work gets done, but it
			costs more time than it should.
		</p>

		<div class="grid sm:grid-cols-2 gap-6">
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Client intake & onboarding</h3>
				<p class="text-sm text-charcoal/60">
					Back-and-forth emails for missing documents, manual checklists,
					follow-ups that fall through the cracks. The same intake sequence
					repeated for every new client.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Correspondence & drafting</h3>
				<p class="text-sm text-charcoal/60">
					Engagement letters, client updates, notice responses — drafted from
					scratch or from templates that haven't been updated in years.
					AI cuts drafting time by 70%+.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Meeting prep & follow-up</h3>
				<p class="text-sm text-charcoal/60">
					Reviewing prior-year files before client calls, summarizing meeting
					notes, tracking action items. 30-60 minutes per meeting that AI
					handles in seconds.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Research & staying current</h3>
				<p class="text-sm text-charcoal/60">
					Regulatory changes, jurisdiction-specific rules, industry updates.
					Hours of manual research that AI can surface in minutes.
				</p>
			</div>
		</div>

		<div class="p-5 bg-warm-white rounded-lg border border-charcoal/10">
			<p class="text-sm text-charcoal/60">
				<strong class="text-charcoal">For accounting firms</strong>, this also includes
				transaction categorization, bookkeeping review, and IRS notice responses —
				rule-based work that AI handles particularly well.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 4: Add the "what you get" section**

```svelte
<!-- What you get -->
<Section background="muted" padding="lg" eyebrow="02" title="What you get">
	<div class="max-w-3xl mx-auto" use:reveal>
		<div class="space-y-6">
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">1</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">45-minute discovery call</h3>
					<p class="text-charcoal/60">
						I ask about your workflow — where time gets stuck, what you've tried,
						what you dread. No pitch, just questions.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">2</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">AI analysis of your situation</h3>
					<p class="text-charcoal/60">
						I map your workflow against existing AI tools and identify where real
						time can be recovered — not theoretical, specific to how your firm
						actually operates.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">3</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Written report</h3>
					<p class="text-charcoal/60">
						Your top 3-7 AI opportunities, prioritized by impact and ease.
						Specific tool recommendations, a quick-start plan, and a financial
						impact estimate. Not a slide deck — a document you can act on.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">4</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Review call</h3>
					<p class="text-charcoal/60">
						Walk through the report together, answer questions, decide what to
						act on. Total time from your side: about 90 minutes across two calls.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>
```

- [ ] **Step 5: Add the math section**

```svelte
<!-- The math -->
<Section background="white" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<div class="p-8 md:p-12 bg-stone rounded-2xl border border-charcoal/10">
			<p class="text-3xl md:text-4xl font-serif text-charcoal mb-2">
				5–7 hours<span class="text-copper">/</span>week
			</p>
			<p class="text-charcoal/60 mb-6">recovered per professional, on average</p>
			<div class="h-px bg-charcoal/10 mb-6"></div>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				At billing rates of $150–$300/hour, that's
				<strong class="text-charcoal">$750–$2,100 per week</strong> in recovered
				capacity — or the ability to take on more clients without adding headcount.
			</p>
			<p class="text-sm text-charcoal/50 mt-4">
				The tools cost $30–$80/month in aggregate. Payback is measured in days.
			</p>
		</div>
	</div>
</Section>
```

- [ ] **Step 6: Add the about and offer sections**

```svelte
<!-- About Piers -->
<Section background="muted" padding="lg" eyebrow="03" title="Who's behind this">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="space-y-4 text-lg text-charcoal/70 leading-relaxed">
			<p>
				I'm <strong class="text-charcoal">Piers Rollinson</strong>, founder of
				DomeWorks. I've spent 15 years building systems that replace manual
				coordination — first at DoorDash, Square, and Mudflap, now for
				professional services firms.
			</p>
			<p>
				I live in Henderson with my wife and three kids. I'm not a software
				salesman. I build working systems, not strategy decks — and every
				engagement is designed to end. You keep what I build.
			</p>
		</div>
	</div>
</Section>

<!-- The offer -->
<Section background="white" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<div class="p-8 md:p-12 rounded-2xl border-2 border-primary bg-primary/[0.03]">
			<p class="text-xs font-semibold tracking-widest text-primary uppercase mb-4">
				Limited
			</p>
			<h2 class="font-serif text-3xl font-normal text-charcoal mb-2">
				Free for the first 5 firms
			</h2>
			<p class="text-charcoal/60 mb-2">
				Henderson / Las Vegas area. Normally $999.
			</p>
			<p class="text-sm text-charcoal/50 mb-8">
				Guarantee: implement the recommendations and save 5+ hours/week,
				or full refund on paid audits.
			</p>
			<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
		</div>
	</div>
</Section>
```

- [ ] **Step 7: Verify the page builds and renders**

Run: `cd /Users/piers/Projects/domeworks-web && npx svelte-check --threshold error 2>&1 | tail -10`
Expected: no errors

Then run the dev server and verify at `https://domeworks.localhost:1355/ai-audit/`:
```bash
curl -s https://domeworks.localhost:1355/ai-audit/ | head -20
```
Expected: HTML output with the page title

- [ ] **Step 8: Commit**

```bash
git add src/routes/ai-audit/+page.svelte
git commit -m "feat: add /ai-audit/ landing page for SMB professional services outreach"
```

---

### Task 3: Light-touch homepage copy updates

**Files:**
- Modify: `src/routes/+page.svelte`

**Reference:** Read the current file first. Changes are small text edits — no structural changes.

- [ ] **Step 1: Update the "Who this is for" first bullet**

In `src/routes/+page.svelte`, find the first `<li>` in the "Who this is for" section (around line 240). Replace:

```svelte
>You're a <strong class="text-charcoal"
	>VP of Engineering, Head of Engineering, or CTO</strong
> at a mid-market SaaS company (50–500 people) or a funded startup</span
```

With:

```svelte
>You're a <strong class="text-charcoal"
	>technical leader or firm owner</strong
> whose team has AI tools but still coordinates through meetings, status updates, and manual handoffs</span
```

- [ ] **Step 2: Update the hero secondary paragraph**

Find the `<p>` tag with "10+ years of engineering leadership" (around line 157). Replace:

```svelte
<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
	10+ years of engineering leadership at DoorDash, Square, and Mudflap. The biggest
	bottleneck was never the engineering — it was the coordination. That layer can now be
	built as infrastructure.
</p>
```

With:

```svelte
<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
	10+ years leading teams at DoorDash, Square, and Mudflap. The biggest
	bottleneck was never the work — it was the coordination. That layer can now be
	built as infrastructure.
</p>
```

- [ ] **Step 3: Update meta description and OG tags**

Find and update the `<meta name="description">` tag (around line 40). Replace "Your engineering team runs on" with "Your team runs on" in all three places it appears:

1. `<meta name="description" content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure. DomeWorks builds it." />`

2. `<meta property="og:description" content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />`

3. `<meta name="twitter:description" content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />`

- [ ] **Step 4: Update JSON-LD Organization description**

Find the Organization description in the JSON-LD block (around line 74). Replace:

```
'Intelligence infrastructure engineering consultancy. Replaces coordination overhead with context pipelines, agent orchestration, and quality gates for engineering teams.'
```

With:

```
'Intelligence infrastructure consultancy. Replaces coordination overhead with context pipelines, agent orchestration, and quality gates.'
```

- [ ] **Step 5: Verify the page builds**

Run: `cd /Users/piers/Projects/domeworks-web && npx svelte-check --threshold error 2>&1 | tail -10`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "copy: soften homepage engineering-only language for broader audience"
```

---

### Task 4: Build verification

- [ ] **Step 1: Run full production build**

```bash
cd /Users/piers/Projects/domeworks-web && yarn build 2>&1 | tail -20
```

Expected: successful build with `/ai-audit/` in the list of prerendered pages.

- [ ] **Step 2: Run lint and format**

```bash
cd /Users/piers/Projects/domeworks-web && yarn format && yarn lint 2>&1 | tail -10
```

Expected: no errors. If format changed files, stage and amend the previous commit or create a new commit:

```bash
git add -A && git commit -m "chore: format after SMB pivot updates"
```

- [ ] **Step 3: Run type check**

```bash
cd /Users/piers/Projects/domeworks-web && yarn check 2>&1 | tail -10
```

Expected: no errors.
