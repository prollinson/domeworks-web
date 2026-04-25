<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import TitledSection from '$lib/components/patterns/TitledSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';

	const fractionalSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Fractional AI Leadership',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Ongoing monthly retainer: part-time Head of AI, 1–2 days per week. Maintains and evolves context system and agent coordination as the organization changes.',
		dateModified: '2026-04'
	};
</script>

<SEO
	title="Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks"
	description="1–2 days/week ongoing retainer. I act as your part-time Head of AI, maintaining and evolving your context system and agent coordination as your org changes."
	schema={fractionalSchema}
/>

<!-- Hero -->
<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl">
		<Eyebrow label="Fractional AI Leadership" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Intelligence infrastructure compounds when someone owns it<span class="text-accent-light"
				>.</span
			>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			An ongoing retainer where I act as your part-time Head of AI, 1–2 days a week. I maintain and
			evolve the context system and agent coordination, close feedback loops, and adapt the
			infrastructure as your org changes.
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
			After a Context Build or Orchestration Build, the infrastructure is live. The question is who
			owns it. Without ownership, systems drift: agents lose calibration, context goes stale, the
			infrastructure stops reflecting how the team actually works.
		</p>
		<p class="text-lg text-muted leading-relaxed">
			1–2 days a week, I'm embedded enough to catch drift before it compounds. I'm not managing your
			engineers or running your AI strategy meetings. I'm maintaining running systems and building
			the next layer when the org is ready for it.
		</p>
		<Callout variant="rule-left-sm">
			<p class="font-serif text-sm text-muted leading-[1.55]">
				This is not a starter engagement. The system needs to exist before it can be owned. If
				you're earlier in the journey, start with the <a
					href="/leaders/scan/"
					class="text-accent hover:underline">AI Scan</a
				>
				or <a href="/leaders/context-build/" class="text-accent hover:underline">Context Build</a>.
			</p>
		</Callout>
	</div>
</NumberedSection>

<!-- What I Do -->
<NumberedSection index="02" background="white" title="What I do">
	<div class="max-w-2xl mx-auto space-y-8" use:reveal>
		{#each [{ title: 'Maintain and evolve the context system', desc: 'As your org changes — new teams, new workflows, new tooling — the context system needs to keep up. I update the world model and make sure AI interactions stay grounded in how the team actually works.' }, { title: 'Tune agent coordination', desc: 'Close feedback loops, improve quality gate accuracy, fix routing logic. The system gets smarter over time instead of slowly drifting from what it was designed to do.' }, { title: 'Identify the next layer to build', desc: 'As the infrastructure matures, there are always new systems worth building. I track what your team is still doing manually that intelligence infrastructure could replace, and scope the next engagement when the org is ready.' }, { title: 'Act as your internal AI expert', desc: "I can advise your team, review AI system design decisions, and help your engineers understand and own what we built together. The goal is always a team that doesn't need me — I'm there to keep the compounding going while that capability builds." }] as item (item.title)}
			<div class="flex items-start gap-6">
				<span class="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-3"></span>
				<div>
					<h3 class="font-medium text-ink mb-1">{item.title}</h3>
					<p class="text-muted">{item.desc}</p>
				</div>
			</div>
		{/each}
	</div>
</NumberedSection>

<!-- Typical Week -->
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

<!-- Who It's For -->
<NumberedSection index="03" background="muted" title="Who this is for">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<p class="font-serif text-lg text-muted leading-[1.65] mb-6">
				Teams that have completed a <a
					href="/leaders/context-build/"
					class="text-accent hover:underline">Context Build</a
				>
				or
				<a href="/leaders/orchestration-build/" class="text-accent hover:underline"
					>Orchestration Build</a
				> — or have equivalent infrastructure in place — and want the system to keep getting smarter as
				the org changes.
			</p>
			<p class="font-serif text-lg text-muted leading-[1.65]">
				If you're still figuring out your AI tooling or haven't built a context system yet, this
				isn't the right entry point. Start with the <a
					href="/leaders/scan/"
					class="text-accent hover:underline">AI Scan</a
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
	</div>
</NumberedSection>

<!-- FAQ -->
<NumberedSection index="05" background="muted" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-4" use:reveal>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				How is this different from a contractor?
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
				I own the intelligence infrastructure as a system, not just execute tasks. A contractor
				builds what you spec. I identify what needs building, build it, and make sure it compounds
				over time.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				What's the minimum commitment?
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
				3 months recommended to see compounding effects. Month-to-month after that. The
				infrastructure needs time to prove itself before you can evaluate whether ongoing ownership
				is worth it.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				Can this evolve into a full-time hire?
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
				If your org grows to need a full-time Head of AI, I'll help you hire one and transition. The
				goal is always a team that doesn't need me — the fractional model buys you time while the
				capability builds internally.
			</p>
		</details>
	</div>
</NumberedSection>
