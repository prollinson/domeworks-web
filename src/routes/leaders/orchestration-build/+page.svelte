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

<svelte:head>
	<title>Orchestration Build: AI Coordination for Engineering Teams | DomeWorks</title>
	<meta
		name="description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Milestone-based, scoped from Context Build assessment."
	/>
	<link rel="canonical" href="https://domeworks.tech/leaders/orchestration-build/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/leaders/orchestration-build/" />
	<meta
		property="og:title"
		content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks"
	/>
	<meta
		property="og:description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks"
	/>
	<meta
		name="twitter:description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

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
<Section background="dark" padding="xl">
	<div class="max-w-3xl">
		<div class="mb-6"><JourneyBar current="orchestration-build" /></div>
		<Eyebrow label="Orchestration Build" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Your team goes from AI helping individuals to AI coordinating your work<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			The layer on top of the context system: multi-agent workflows, quality gates, and output
			routing that replace the human coordination overhead. Scope and milestones flow directly
			from the Context Build assessment.
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>

<!-- What This Is -->
<NumberedSection index="01" background="muted" title="What this is">
	<div class="max-w-2xl mx-auto space-y-6" use:reveal>
		<p class="text-lg text-muted leading-relaxed">
			A milestone-based engagement, not a fixed process. The exact systems built depend on what the
			Context Build assessment revealed about your organization's coordination overhead.
		</p>
		<p class="text-lg text-muted leading-relaxed">
			I embed with your team 2–3 days a week and build the agent coordination layer: the systems
			that route work, validate output, distribute context, and close feedback loops. Your team
			stops spending time coordinating what AI is doing and starts reviewing what it produces.
		</p>
		<Callout variant="rule-left-sm">
			<p class="font-serif text-sm text-muted leading-[1.55]">
				Common milestones: multi-agent task routing, quality gates replacing manual review,
				automated context distribution to AI tools, feedback loops that tune agent behavior over
				time. Which of these gets built first depends on your specific blockers.
			</p>
		</Callout>
	</div>
</NumberedSection>

<!-- Outcomes -->
<NumberedSection index="02" background="white" title="What changes">
	<div class="max-w-3xl mx-auto space-y-4" use:reveal={{ stagger: true, staggerDelay: 100 }}>
		{#each [{ before: 'Status meetings to coordinate across teams', after: 'Agent coordination routes work and routes outputs automatically' }, { before: 'Manual review of every AI-generated output', after: 'Quality gates validate before humans see it' }, { before: 'Engineers prompting individually with no shared context', after: 'Coordinated agent workflows with full organizational context' }, { before: 'Managers aggregating context from multiple teams', after: 'Systems that distribute context automatically' }] as row}
			<HairlineGrid cols={2}>
				<div class="cell">
					<p class="text-xs font-medium text-subtle uppercase tracking-widest mb-2">Before</p>
					<p class="text-muted">{row.before}</p>
				</div>
				<div class="cell">
					<p class="text-xs font-medium text-accent uppercase tracking-widest mb-2">After</p>
					<p class="text-ink">{row.after}</p>
				</div>
			</HairlineGrid>
		{/each}
	</div>
</NumberedSection>

<!-- Prerequisites -->
<NumberedSection index="03" background="muted" title="What's required">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<p class="font-serif text-lg text-muted leading-[1.65] mb-4">
				A completed <a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a> (or
				equivalent assessment) is required. The context system is what agent coordination runs on. Without
				it, you're automating noise.
			</p>
			<p class="font-serif text-lg text-muted leading-[1.65]">
				Most Orchestration Builds follow directly from a Context Build — the assessment gives us the
				blueprint; this is where we build it. If you're starting from scratch, begin with the <a
					href="/leaders/context-build/"
					class="text-accent hover:underline">Context Build</a
				>.
			</p>
		</Callout>
	</div>
</NumberedSection>

<!-- Investment -->
<NumberedSection index="04" background="white" title="Investment">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="accent">
			<div class="flex flex-col gap-4">
				<div class="flex justify-between items-baseline border-b border-rule pb-4">
					<span class="font-medium text-ink">Timeline</span>
					<span class="text-ink">4–12 weeks typical</span>
				</div>
				<div class="flex justify-between items-baseline border-b border-rule pb-4">
					<span class="font-medium text-ink">Engagement model</span>
					<span class="text-ink">2–3 days/week, embedded</span>
				</div>
				<div class="flex justify-between items-baseline">
					<span class="font-medium text-ink">Pricing</span>
					<span class="text-ink">Day rate, scoped on call</span>
				</div>
			</div>
		</Callout>
		<p class="text-center text-subtle text-sm mt-4">
			Exact scope and rate are defined after reviewing Context Build deliverables. Book a call to
			discuss.
		</p>
	</div>
</NumberedSection>

<!-- FAQ -->
<NumberedSection index="05" background="muted" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-0" use:reveal>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				Do we need a Context Build first?
				<svg
					class="w-5 h-5 text-subtle group-open:rotate-180 transition-transform"
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
			<p class="mt-4 font-serif text-muted leading-relaxed">
				Yes, or an equivalent assessment. Agent coordination without a context system is automating
				noise. The Context Build gives us the blueprint — this is where we build it.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				How embedded are you?
				<svg
					class="w-5 h-5 text-subtle group-open:rotate-180 transition-transform"
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
			<p class="mt-4 font-serif text-muted leading-relaxed">
				2–3 days/week, in standups, pairing with engineers, shipping alongside your team. I'm not
				advising from the outside — I'm building with you.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				What does the handoff look like?
				<svg
					class="w-5 h-5 text-subtle group-open:rotate-180 transition-transform"
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
			<p class="mt-4 font-serif text-muted leading-relaxed">
				Documented systems, runbooks, and knowledge transfer sessions. Your team owns everything.
				The goal is always a team that can maintain the systems without me.
			</p>
		</details>
	</div>
</NumberedSection>

<!-- Journey nudge -->
<div class="border-t border-rule py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-subtle">
			Next in the journey: <a href="/leaders/fractional/" class="text-accent hover:underline font-medium"
				>Fractional AI Leadership &rarr;</a
			>
		</p>
	</div>
</div>
