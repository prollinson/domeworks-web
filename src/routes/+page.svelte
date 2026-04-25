<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';

	const homepageSchema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				name: 'DomeWorks',
				url: 'https://domeworks.tech',
				foundingDate: '2025',
				description:
					'Intelligence infrastructure consultancy. Replaces coordination overhead with context pipelines, agent orchestration, and quality gates.',
				founder: {
					'@type': 'Person',
					name: 'Piers Rollinson',
					jobTitle: 'Founder',
					sameAs: []
				},
				contactPoint: {
					'@type': 'ContactPoint',
					email: 'piers@domeworks.tech',
					contactType: 'sales'
				}
			},
			{
				'@type': 'WebSite',
				name: 'DomeWorks',
				url: 'https://domeworks.tech'
			}
		]
	};
</script>

<SEO
	title="DomeWorks | Intelligence Infrastructure Engineering"
	description="DomeWorks builds the systems around AI tools. Two starting points: an assessment for owner-operators picking what to use, and infrastructure for leaders running teams of 50–500."
	schema={homepageSchema}
/>

<!-- Skip to content -->
<a
	href="#tracks"
	class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
>
	Skip to tracks
</a>

<!-- Compact dark hero — sets the brand line and points to the picker below. -->
<Section background="dark" padding="lg" hero>
	<Eyebrow label="DomeWorks · Intelligence Infrastructure" tone="accent-light" />
	<h1
		class="mt-6 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
		style="font-size: clamp(2.25rem, 5.5vw, 3.75rem);"
	>
		Your team bought AI tools<span class="text-accent-light">.</span>
		<em class="text-paper/85">Now what</em><span class="text-accent-light">?</span>
	</h1>
	<p class="mt-6 max-w-2xl font-serif text-lg text-paper/80 leading-[1.65]">
		Two starting points, depending on the shape of your team. Owner-operators figure out what's
		worth using. Leaders build what comes between the tools their engineers already have.
	</p>
	<div class="mt-8">
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>

<!-- Two tracks picker — primary content of the page. -->
<Section
	id="tracks"
	background="white"
	padding="lg"
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
						$3M to $10M in revenue, 10 to 50 people. AI tools keep coming, admin keeps piling up,
						and you want to know what's actually worth your attention and what to leave alone.
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
					Or start with the <span class="text-accent underline underline-offset-2"
						>2-minute AI Readiness Quiz</span
					>
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
						50 to 500 people. Your team already uses AI tools. Individual productivity is up.
						Team-level throughput is flat. You need the infrastructure between the tools, not
						another tool.
					</p>
					<p class="mt-4 font-serif text-sm text-subtle">
						AI Scan, Context Build, Orchestration, Fractional AI Leadership.
					</p>
				</div>
				<div class="mt-auto pt-5 border-t border-rule flex items-center justify-between gap-3">
					<span class="text-sm font-medium text-ink">Leaders hub</span>
					<span class="text-accent text-lg group-hover:translate-x-1 transition-transform">→</span>
				</div>
				<p class="mt-3 text-xs text-subtle">
					Or jump to the <span class="text-accent underline underline-offset-2">AI Scan</span>
				</p>
			</a>
		</HairlineGrid>
	</div>

	<div class="max-w-3xl mx-auto mt-10 text-center">
		<p class="font-serif text-base text-muted">
			Not sure which fits? <a
				href={getBookCallUrl()}
				class="text-accent underline underline-offset-2">Book a 30-minute call</a
			> and I'll point you to the right one.
		</p>
	</div>
</Section>
