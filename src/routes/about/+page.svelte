<script lang="ts">
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import TitledSection from '$lib/components/patterns/TitledSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';

	const aboutSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Piers Rollinson',
		jobTitle: 'Founder',
		worksFor: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building the AI infrastructure layer for engineering teams.',
		url: 'https://domeworks.tech/about/'
	};
</script>

<SEO
	title="About | Ex-DoorDash, Square, Mudflap Engineering Leader | DomeWorks"
	description="10+ years of engineering leadership at DoorDash, Square, and Mudflap. Now building the AI infrastructure layer for engineering teams."
	schema={aboutSchema}
/>

<!-- Hero -->
<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl">
		<Eyebrow label="About" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			I've been making engineering teams ship better for a decade. Now I do it with AI.
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			Ten years at DoorDash, Square, and Mudflap, mostly working on one problem: how engineering
			teams actually ship faster — not just look busier.
		</p>
	</div>
</Section>

<!-- Why DomeWorks Exists -->
<TitledSection background="muted" title="Why DomeWorks exists">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="space-y-6 font-serif text-lg text-muted leading-[1.65]">
			<p>
				Recently, that work shifted to AI. Not the hype cycle version, but the engineering version.
				How do you take a team that has AI tools and make those tools actually change how the team
				ships?
			</p>
			<p>
				I watched the same pattern play out at every company: leadership buys Cursor licenses, rolls
				them out in a Slack announcement, maybe runs a lunch-and-learn. Three months later, adoption
				is at 15% and nobody can explain why.
			</p>
			<p>
				I can explain why. There's no intelligence infrastructure that replaces coordination
				overhead. Nothing connects the tools to how the team works. No shared context feeding into
				AI tools. No standard developer workflows automated around AI. No agent infrastructure
				connecting your codebase, tickets, and docs to how engineers actually ship.
			</p>
			<Callout variant="rule-left">
				<p class="text-ink">
					Over 80% of organizations report no measurable impact on EBIT despite their AI investments <span
						class="text-muted">(BCG, 2024)</span
					>. Nobody is building the layer between the tools and the work. That's where DomeWorks
					operates.
				</p>
			</Callout>
		</div>
	</div>
</TitledSection>

<!-- How I Work -->
<TitledSection background="white" title="How I work">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="space-y-8">
			<div class="flex gap-6">
				<span class="flex-shrink-0 text-xs font-medium text-accent tracking-widest">01</span>
				<div>
					<h3 class="font-medium text-ink mb-2">Embedded, not advisory</h3>
					<p class="font-serif text-muted leading-[1.65]">
						I join your standups. I pair with your engineers. I sit in on planning. I write code,
						build systems, and ship alongside your team. You can't transfer capability from a slide
						deck.
					</p>
				</div>
			</div>

			<div class="flex gap-6">
				<span class="flex-shrink-0 text-xs font-medium text-accent tracking-widest">02</span>
				<div>
					<h3 class="font-medium text-ink mb-2">Designed to end</h3>
					<p class="font-serif text-muted leading-[1.65]">
						Every engagement ships a handoff package: documented systems, runbooks, and a knowledge
						transfer session. Your team owns what I built and can maintain it without me. If you
						need ongoing support after that, that's what the <a
							href="/leaders/fractional/"
							class="text-accent hover:underline">Fractional engagement</a
						> is for — but you're never locked in.
					</p>
				</div>
			</div>

			<div class="flex gap-6">
				<span class="flex-shrink-0 text-xs font-medium text-accent tracking-widest">03</span>
				<div>
					<h3 class="font-medium text-ink mb-2">Working systems over opinions</h3>
					<p class="font-serif text-muted leading-[1.65]">
						I deliver running systems, not recommendations. Configured tools, documented workflows,
						measured before-and-after. Things your team can point to and build on.
					</p>
				</div>
			</div>
		</div>
	</div>
</TitledSection>

<!-- Case Study -->
<TitledSection background="muted" title="Current engagement">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<Eyebrow label="Case study — Q2 2026" tone="accent" />
			<h3 class="font-medium text-ink text-lg mb-3 mt-3">
				Autonomous coding agent for a national professional services organization
			</h3>
			<p class="font-serif text-muted leading-relaxed mb-4">
				An engineering organization with a backlog of well-scoped maintenance tasks — lint fixes,
				dependency updates, test coverage gaps — each taking 2–3 days to complete including queue
				time and context-switching, even when the actual work was under an hour.
			</p>
			<p class="font-serif text-muted leading-relaxed mb-4">
				I built a one-shot autonomous coding agent system: receives a task, executes in an isolated
				environment, validates against CI, delivers a pull request. No human intervention during
				execution.
			</p>
			<p class="font-serif text-muted leading-relaxed">
				Target: median task completion of 15 minutes from dispatch to PR, down from 2–3 days.
				Publishing the full case study when the engagement closes.
			</p>
		</Callout>
	</div>
</TitledSection>

<!-- CTA -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<h2 class="font-serif text-3xl font-normal text-ink mb-4">Want to talk about your team?</h2>
		<p class="font-serif text-lg text-muted mb-8">
			30 minutes, no obligation. I'll tell you whether this is something I can help with.
		</p>
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>
