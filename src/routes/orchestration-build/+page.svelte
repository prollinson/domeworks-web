<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
	import JourneyBar from '$lib/components/ui/JourneyBar.svelte';
</script>

<svelte:head>
	<title>Orchestration Build: AI Coordination for Engineering Teams | DomeWorks</title>
	<meta
		name="description"
		content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Milestone-based, scoped from Context Build assessment."
	/>
	<link rel="canonical" href="https://domeworks.tech/orchestration-build/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/orchestration-build/" />
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
				The layer on top of the context system: multi-agent workflows, quality gates, and output
				routing that replace the human coordination overhead. Scope and milestones flow directly
				from the Context Build assessment.
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
		<p class="text-center text-charcoal/60 text-sm mt-4">
			Exact scope and rate are defined after reviewing Context Build deliverables. Book a call to
			discuss.
		</p>
	</div>
</Section>

<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal"
			>
				Do we need a Context Build first?
				<svg
					class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform"
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
					class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform"
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
					class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform"
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
