# Site Overhaul — Track 1: Content & Copy

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write the Orchestration Build page, Fractional AI Leadership page, case study placeholder on About, and sweep all pages for terminology consistency.

**Architecture:** New pages follow the same structure as context-build/+page.svelte (Section component, reveal action, Button component, getBookCallUrl). Terminology sweep replaces specific strings across existing pages. Track 2 handles homepage and nav — this track handles all other pages.

**Tech Stack:** SvelteKit 5, Svelte 5 runes, Tailwind CSS 4, mdsvex, static adapter.

**File ownership (no overlap with Track 2):**

- Track 1 owns: `src/routes/orchestration-build/+page.svelte`, `src/routes/fractional/+page.svelte`, `src/routes/scan/+page.svelte`, `src/routes/context-build/+page.svelte`, `src/routes/about/+page.svelte`, `src/routes/contact/+page.svelte`
- Track 2 owns: `src/routes/+page.svelte`, `src/lib/components/layout/Header.svelte`, `src/lib/components/layout/Footer.svelte`, `src/lib/components/ui/Scrollytelling.svelte`

---

### Task 1: Write the Orchestration Build page

**Files:**

- Modify: `src/routes/orchestration-build/+page.svelte` (replace "Coming soon" with full page)

- [ ] **Step 1: Replace the file with full page content**

Replace entire contents of `src/routes/orchestration-build/+page.svelte` with:

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>

<svelte:head>
	<title>Orchestration Build: AI Coordination for Engineering Teams | DomeWorks</title>
	<meta
		name="description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Milestone-based, scoped from Context Build assessment."
	/>
	<link rel="canonical" href="https://domeworks.ai/orchestration-build/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.ai/orchestration-build/" />
	<meta
		property="og:title"
		content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks"
	/>
	<meta
		property="og:description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead."
	/>
	<meta property="og:image" content="https://domeworks.ai/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks"
	/>
	<meta
		name="twitter:description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead."
	/>
	<meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Orchestration Build',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Milestone-based engagement building the agent coordination layer: multi-agent workflows, quality gates, and output routing. Scoped from Context Build assessment.',
		dateModified: '2026-04'
	})}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<p class="text-xs font-medium tracking-widest text-primary uppercase mb-6">
				Orchestration Build
			</p>
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

<!-- What This Is -->
<Section background="muted" padding="lg" eyebrow="01" title="What this is">
	<div class="max-w-2xl mx-auto space-y-6" use:reveal>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			A milestone-based engagement, not a fixed process. The exact systems built depend on what the
			Context Build assessment revealed about your organization's coordination overhead.
		</p>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			I embed with your team 2–3 days a week and build the agent coordination layer: the systems
			that route work, validate output, distribute context, and close feedback loops. Your team
			stops spending time coordinating what AI is doing and starts reviewing what it produces.
		</p>
		<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<p class="text-sm text-charcoal/70 leading-relaxed">
				Common milestones: multi-agent task routing, quality gates replacing manual review,
				automated context distribution to AI tools, feedback loops that tune agent behavior over
				time. Which of these gets built first depends on your specific blockers.
			</p>
		</div>
	</div>
</Section>

<!-- Outcomes -->
<Section background="white" padding="lg" eyebrow="02" title="What changes">
	<div class="max-w-3xl mx-auto space-y-4" use:reveal={{ stagger: true, staggerDelay: 100 }}>
		{#each [{ before: 'Status meetings to coordinate across teams', after: 'Agent coordination routes work and routes outputs automatically' }, { before: 'Manual review of every AI-generated output', after: 'Quality gates validate before humans see it' }, { before: 'Engineers prompting individually with no shared context', after: 'Coordinated agent workflows with full organizational context' }, { before: 'Managers aggregating context from multiple teams', after: 'Systems that distribute context automatically' }] as row}
			<div class="grid md:grid-cols-2 gap-4">
				<div class="p-5 bg-stone rounded-xl border border-charcoal/10">
					<p class="text-xs font-medium text-warm-gray uppercase tracking-widest mb-2">Before</p>
					<p class="text-charcoal/70">{row.before}</p>
				</div>
				<div class="p-5 bg-primary/5 rounded-xl border border-primary/20">
					<p class="text-xs font-medium text-primary uppercase tracking-widest mb-2">After</p>
					<p class="text-charcoal">{row.after}</p>
				</div>
			</div>
		{/each}
	</div>
</Section>

<!-- Prerequisites -->
<Section background="muted" padding="lg" eyebrow="03" title="What's required">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-lg text-charcoal/70 leading-relaxed mb-4">
				A completed <a href="/context-build/" class="text-primary hover:underline">Context Build</a> (or
				equivalent assessment) is required. The context system is what agent coordination runs on. Without
				it, you're automating noise.
			</p>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				Most Orchestration Builds follow directly from a Context Build — the assessment gives us the
				blueprint; this is where we build it. If you're starting from scratch, begin with the <a
					href="/context-build/"
					class="text-primary hover:underline">Context Build</a
				>.
			</p>
		</div>
	</div>
</Section>

<!-- Investment -->
<Section background="white" padding="lg" eyebrow="04" title="Investment">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
			<div class="flex flex-col gap-4">
				<div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
					<span class="text-charcoal font-medium">Timeline</span>
					<span class="text-charcoal">4–12 weeks typical</span>
				</div>
				<div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
					<span class="text-charcoal font-medium">Engagement model</span>
					<span class="text-charcoal">2–3 days/week, embedded</span>
				</div>
				<div class="flex justify-between items-baseline">
					<span class="text-charcoal font-medium">Pricing</span>
					<span class="text-charcoal">Day rate, scoped on call</span>
				</div>
			</div>
		</div>
		<p class="text-center text-charcoal/50 text-sm mt-4">
			Exact scope and rate are defined after reviewing Context Build deliverables. Book a call to
			discuss.
		</p>
	</div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
			Ready to build the coordination layer<span class="text-primary">?</span>
		</h2>
		<p class="text-lg text-charcoal/70 mb-8">
			30-minute call, no obligation. If you've completed a Context Build, I'll walk through the
			assessment and outline the Orchestration Build scope.
		</p>
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors related to orchestration-build/+page.svelte

- [ ] **Step 3: Commit**

```bash
git add src/routes/orchestration-build/+page.svelte
git commit -m "feat: write Orchestration Build page — outcome-focused, prerequisite-gated"
```

---

### Task 2: Write the Fractional AI Leadership page

**Files:**

- Create: `src/routes/fractional/+page.svelte`

- [ ] **Step 1: Create the file**

Create `src/routes/fractional/+page.svelte` with:

```svelte
<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>

<svelte:head>
	<title>Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks</title>
	<meta
		name="description"
		content="1–2 days/week ongoing retainer. I act as your part-time Head of AI, maintaining and evolving your context system and agent coordination as your org changes."
	/>
	<link rel="canonical" href="https://domeworks.ai/fractional/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.ai/fractional/" />
	<meta
		property="og:title"
		content="Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks"
	/>
	<meta
		property="og:description"
		content="1–2 days/week ongoing retainer. Maintain and evolve your context system and agent coordination as your org changes."
	/>
	<meta property="og:image" content="https://domeworks.ai/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks"
	/>
	<meta
		name="twitter:description"
		content="1–2 days/week ongoing retainer. Maintain and evolve your AI infrastructure as your org changes."
	/>
	<meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Fractional AI Leadership',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Ongoing monthly retainer: part-time Head of AI, 1–2 days per week. Maintains and evolves context system and agent coordination as the organization changes.',
		dateModified: '2026-04'
	})}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
	<div class="absolute inset-0 grid-overlay opacity-50"></div>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<div class="max-w-3xl">
			<p class="text-xs font-medium tracking-widest text-copper uppercase mb-6">
				Fractional AI Leadership
			</p>
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

<!-- What This Is -->
<Section background="muted" padding="lg" eyebrow="01" title="What this is">
	<div class="max-w-2xl mx-auto space-y-6" use:reveal>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			After a Context Build or Orchestration Build, the infrastructure is live. The question is who
			owns it. Without ownership, systems drift: agents lose calibration, context goes stale, the
			infrastructure stops reflecting how the team actually works.
		</p>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			1–2 days a week, I'm embedded enough to catch drift before it compounds. I'm not managing your
			engineers or running your AI strategy meetings. I'm maintaining running systems and building
			the next layer when the org is ready for it.
		</p>
		<div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<p class="text-sm text-charcoal/70 leading-relaxed">
				This is not a starter engagement. The system needs to exist before it can be owned. If
				you're earlier in the journey, start with the <a
					href="/scan/"
					class="text-primary hover:underline">AI Scan</a
				>
				or <a href="/context-build/" class="text-primary hover:underline">Context Build</a>.
			</p>
		</div>
	</div>
</Section>

<!-- What I Do -->
<Section background="white" padding="lg" eyebrow="02" title="What I do">
	<div class="max-w-2xl mx-auto space-y-8" use:reveal>
		{#each [{ title: 'Maintain and evolve the context system', desc: 'As your org changes — new teams, new workflows, new tooling — the context system needs to keep up. I update the world model and make sure AI interactions stay grounded in how the team actually works.' }, { title: 'Tune agent coordination', desc: 'Close feedback loops, improve quality gate accuracy, fix routing logic. The system gets smarter over time instead of slowly drifting from what it was designed to do.' }, { title: 'Identify the next layer to build', desc: 'As the infrastructure matures, there are always new systems worth building. I track what your team is still doing manually that intelligence infrastructure could replace, and scope the next engagement when the org is ready.' }, { title: 'Act as your internal AI expert', desc: "I can advise your team, review AI system design decisions, and help your engineers understand and own what we built together. The goal is always a team that doesn't need me — I'm there to keep the compounding going while that capability builds." }] as item}
			<div class="flex items-start gap-6">
				<span class="flex-shrink-0 w-2 h-2 rounded-full bg-copper mt-3"></span>
				<div>
					<h3 class="font-medium text-charcoal mb-1">{item.title}</h3>
					<p class="text-charcoal/70">{item.desc}</p>
				</div>
			</div>
		{/each}
	</div>
</Section>

<!-- Who It's For -->
<Section background="muted" padding="lg" eyebrow="03" title="Who this is for">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-lg text-charcoal/70 leading-relaxed mb-6">
				Teams that have completed a <a href="/context-build/" class="text-primary hover:underline"
					>Context Build</a
				>
				or
				<a href="/orchestration-build/" class="text-primary hover:underline">Orchestration Build</a> —
				or have equivalent infrastructure in place — and want the system to keep getting smarter as the
				org changes.
			</p>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				If you're still figuring out your AI tooling or haven't built a context system yet, this
				isn't the right entry point. Start with the <a
					href="/scan/"
					class="text-primary hover:underline">AI Scan</a
				>.
			</p>
		</div>
	</div>
</Section>

<!-- Investment -->
<Section background="white" padding="lg" eyebrow="04" title="Investment">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
			<div class="flex flex-col gap-4">
				<div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
					<span class="text-charcoal font-medium">Commitment</span>
					<span class="text-charcoal">1–2 days/week</span>
				</div>
				<div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
					<span class="text-charcoal font-medium">Typical duration</span>
					<span class="text-charcoal">6+ months</span>
				</div>
				<div class="flex justify-between items-baseline">
					<span class="text-charcoal font-medium">Pricing</span>
					<span class="text-charcoal">Monthly retainer, discussed on call</span>
				</div>
			</div>
		</div>
		<p class="text-center text-charcoal/50 text-sm mt-4">
			Rate depends on scope and what infrastructure is already in place.
		</p>
	</div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
			Want to keep the infrastructure compounding<span class="text-primary">?</span>
		</h2>
		<p class="text-lg text-charcoal/70 mb-8">
			30-minute call to discuss what's in place and whether fractional makes sense for where your
			team is.
		</p>
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors related to fractional/+page.svelte

- [ ] **Step 3: Commit**

```bash
git add src/routes/fractional/+page.svelte
git commit -m "feat: add Fractional AI Leadership page as 4th service"
```

---

### Task 3: Terminology sweep — scan page

**Files:**

- Modify: `src/routes/scan/+page.svelte`

Changes needed:

- "Intelligence Maturity level" → "AI readiness score"
- "Intelligence Maturity Score" (deliverable title) → "AI Readiness Score"
- Description text for that deliverable: "Shows where you are on the path..." — update to match new term

- [ ] **Step 1: Update the hero subtext**

In the `<p class="mt-6 text-xl ...">` paragraph, change:

```
diagnoses your Intelligence Maturity level: where you are on the path from "bought tools" to "AI coordinates our work."
```

To:

```
diagnoses your AI readiness score: where you are on the path from "bought tools" to "AI coordinates our work."
```

- [ ] **Step 2: Update the deliverable title and description**

In the `{#each}` items array, find the object with `title: 'Intelligence Maturity Score'` and update it:

```javascript
{ title: 'AI Readiness Score', desc: 'A 1-5 rating across five dimensions: tool coverage, adoption rate, workflow integration, spend efficiency, team capability. Shows where you are on the path from "bought tools" to "AI coordinates our work," designed to be shareable with your CEO.' }
```

- [ ] **Step 3: Verify**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/scan/+page.svelte
git commit -m "copy: update scan page terminology (AI readiness score)"
```

---

### Task 4: Terminology sweep — context-build page

**Files:**

- Modify: `src/routes/context-build/+page.svelte`

Changes needed:

- "Intelligence Maturity" → "AI readiness" (in hero subtext)
- "Context Layer" → "context system" (throughout, except in "Context Build" service name and "Context Layer Blueprint" deliverable title → "Context System Blueprint")
- "Intelligence Maturity Assessment" (deliverable title) → "AI Readiness Assessment"
- "Context Layer Blueprint" → "Context System Blueprint"
- "Context Layer diagnosis" (step title) → "Context system diagnosis"

- [ ] **Step 1: Update hero subtext**

Change line:

```
A two-week engagement that diagnoses your Intelligence Maturity and designs the Context Layer: the infrastructure that feeds domain knowledge, team conventions, and codebase patterns into every AI interaction. The transition from Level 1 (tool-first) to Level 2 (context-aware).
```

To:

```
A two-week engagement that diagnoses your AI readiness and designs the context system: the infrastructure that feeds domain knowledge, team conventions, and codebase patterns into every AI interaction. The foundation for everything that comes after.
```

- [ ] **Step 2: Update step 3 title and description**

Find step with `title: 'Context Layer diagnosis'` and update:

```javascript
{ step: '3', title: 'Context system diagnosis', desc: "I evaluate what's in place, and what's missing, between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling. Most teams have none of this. That's why adoption stalls at the individual level." }
```

- [ ] **Step 3: Update deliverable titles**

Find and update the deliverable objects:

```javascript
{ title: 'AI Readiness Assessment', desc: 'What tools are in use, what\'s working, what\'s not. The gap between "engineers have AI" and "AI is part of how the team ships." A detailed picture you can share with your leadership team and use to justify next steps.' }
```

```javascript
{ title: 'Context System Blueprint', desc: 'What domain knowledge needs to flow into AI interactions, and how. A design for the shared context, reliable workflows, and developer tooling that make AI useful beyond ad-hoc prompting.' }
```

- [ ] **Step 4: Update "What happens next" section**

Change:

```
The Context Build is designed to feed into an <a href="/orchestration-build/" ...>Orchestration Build</a>, where we implement the systems the blueprint calls for.
```

To:

```
The Context Build is designed to feed into an <a href="/orchestration-build/" ...>Orchestration Build</a>, where we build the agent coordination layer the blueprint calls for.
```

- [ ] **Step 5: Verify**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/routes/context-build/+page.svelte
git commit -m "copy: update context-build terminology (context system, AI readiness)"
```

---

### Task 5: About page — case study placeholder + terminology

**Files:**

- Modify: `src/routes/about/+page.svelte`

Changes needed:

- No major terminology violations (the copy uses plain descriptions rather than framework terms)
- Add case study placeholder section between "How I Work" and the CTA

- [ ] **Step 1: Add case study placeholder section**

After the closing `</Section>` of the "How I Work" section (after line 107 in the current file), add a new section before the CTA:

```svelte
<!-- Case Study -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto" use:reveal>
		<p class="text-xs font-medium tracking-widest text-warm-gray uppercase mb-4">03</p>
		<h2 class="font-serif text-3xl font-normal text-charcoal mb-8">Work in progress</h2>
		<div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
			<p class="text-xs font-medium tracking-widest text-primary uppercase mb-3">
				Case study — Q2 2026
			</p>
			<h3 class="font-medium text-charcoal text-lg mb-3">
				Autonomous coding agent for a national professional services organization
			</h3>
			<p class="text-charcoal/70 leading-relaxed mb-4">
				An engineering organization with a backlog of well-scoped maintenance tasks — lint fixes,
				dependency updates, test coverage gaps — each taking 2–3 days to complete including queue
				time and context-switching, even when the actual work was under an hour.
			</p>
			<p class="text-charcoal/70 leading-relaxed mb-4">
				I built a one-shot autonomous coding agent system: receives a task, executes in an isolated
				environment, validates against CI, delivers a pull request. No human intervention during
				execution.
			</p>
			<p class="text-charcoal/70 leading-relaxed">
				Target: median task completion of 15 minutes from dispatch to PR, down from 2–3 days.
				Publishing the full case study when the engagement closes.
			</p>
		</div>
	</div>
</Section>
```

Also update the "How I Work" section's eyebrow — currently it uses `<p class="text-xs ...">02</p>` inline, not the Section eyebrow prop. Leave that as-is (it uses the manual pattern, not the Section component).

- [ ] **Step 2: Verify**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "feat: add case study placeholder to About page"
```

---

### Task 6: Contact page — minor copy fix

**Files:**

- Modify: `src/routes/contact/+page.svelte`

Changes needed:

- "a full Context Build" → "a Context Build" (remove "full" — it implies Scan is incomplete)
- Add Orchestration Build and Fractional as possible next steps in "What to expect"

- [ ] **Step 1: Update "What to expect" copy**

Find and replace:

```
If there's a fit, I'll recommend either an <a href="/scan/" class="text-primary hover:underline">AI Scan</a> ($2,500) or a full <a href="/context-build/" class="text-primary hover:underline">Context Build</a> ($10,000+) as a next step. If there isn't a fit, I'll tell you that too.
```

With:

```
If there's a fit, I'll recommend where to start — usually an <a href="/scan/" class="text-primary hover:underline">AI Scan</a> ($2,500) if you need a clear picture first, or a <a href="/context-build/" class="text-primary hover:underline">Context Build</a> ($10,000+) if the gaps are already clear. If there isn't a fit, I'll tell you that too.
```

- [ ] **Step 2: Verify**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/contact/+page.svelte
git commit -m "copy: fix contact page — remove 'full Context Build', clarify next steps"
```

---

### Task 7: Final verification

- [ ] **Step 1: Full type check**

Run: `cd /Users/piers/Projects/domeworks-web && yarn check`
Expected: Zero errors

- [ ] **Step 2: Build check**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build completes with no errors. New routes `/orchestration-build/` and `/fractional/` appear in build output.
