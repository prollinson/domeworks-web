<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';
</script>

<svelte:head>
	<title>DomeWorks | Intelligence Infrastructure Engineering</title>
	<meta
		name="description"
		content="DomeWorks builds the systems around AI tools. Two starting points: an assessment for owner-operators picking what to use, and infrastructure for leaders running teams of 50–500."
	/>
	<link rel="canonical" href="https://domeworks.tech/" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/" />
	<meta property="og:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
	<meta
		property="og:description"
		content="DomeWorks builds the systems around AI tools. Two starting points — one for owner-operators, one for leaders running teams."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
	<meta
		name="twitter:description"
		content="DomeWorks builds the systems around AI tools. Two starting points — one for owner-operators, one for leaders running teams."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

	<!-- JSON-LD: Organization + WebSite -->
	{@html `<script type="application/ld+json">${JSON.stringify({
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
	})}</script>`}
</svelte:head>

<!-- Skip to content -->
<a
	href="#tracks"
	class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
>
	Skip to tracks
</a>

<!-- Compact dark hero — sets the brand line and points to the picker below. -->
<section
	class="relative bg-ink overflow-hidden -mt-16 md:-mt-20 pt-32 md:pt-44 pb-14 md:pb-20"
	aria-label="Hero"
>
	<div class="relative max-w-6xl mx-auto px-6 lg:px-8">
		<Eyebrow label="DomeWorks · Intelligence Infrastructure" tone="accent-light" />
		<h1
			class="mt-6 font-serif font-normal text-paper leading-[1.04] tracking-[-0.025em]"
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
	</div>
</section>

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
			Not sure which fits? <a href={getBookCallUrl()} class="text-accent underline underline-offset-2"
				>Book a 30-minute call</a
			> and I'll point you to the right one.
		</p>
	</div>
</Section>
