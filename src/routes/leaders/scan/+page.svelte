<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';

	const scanSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Scan',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			"48-hour audit of your team's AI tool spend, adoption patterns, and wasted seats. Fixed price, clear deliverables.",
		dateModified: '2026-03',
		offers: {
			'@type': 'AggregateOffer',
			lowPrice: '2500',
			highPrice: '3500',
			priceCurrency: 'USD'
		}
	};
</script>

<SEO
	title="AI Scan: 48-hour audit of your team's AI tooling | DomeWorks"
	description="A 48-hour audit of your team's AI tooling: every tool, every seat, every dollar — plus three quick wins and a readiness score. $2,500–$3,500 fixed price."
	schema={scanSchema}
/>

<!-- Hero -->
<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl">
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

<!-- What Happens -->
<NumberedSection index="01" title="What happens">
	<div class="max-w-2xl mx-auto space-y-8" use:reveal>
		{#each [{ step: '1', title: 'You give me access', desc: 'Admin credentials or exports from your AI tools (Cursor, Copilot, Claude, ChatGPT for Teams, etc.) plus a 15-minute walkthrough of your team structure.' }, { step: '2', title: 'I survey the team', desc: 'A structured 5-minute async questionnaire goes to 5-10 engineers. Specific questions about what they use, how often, and where they hit friction.' }, { step: '3', title: '48 hours later, you get the report', desc: 'Five concrete deliverables. No fluff, no recommendations-without-data. Just a clear picture of where you stand.' }] as item (item.step)}
			<div class="flex items-start gap-6">
				<span
					class="flex-shrink-0 w-10 h-10 rounded-lg bg-accent text-paper flex items-center justify-center text-sm font-medium"
				>
					{item.step}
				</span>
				<div>
					<h3 class="font-medium text-ink mb-1">{item.title}</h3>
					<p class="font-serif text-muted">{item.desc}</p>
				</div>
			</div>
		{/each}
	</div>
</NumberedSection>

<!-- What You Get -->
<NumberedSection index="02" title="What you get">
	<HairlineGrid cols={3} stagger staggerDelay={100}>
		{#each [{ title: 'AI Spend Map', desc: "Every AI tool your company pays for, what it costs, who has access, and who's actually using it. Most teams discover 20-40% of their AI seats are idle." }, { title: 'Adoption Heatmap', desc: "Where AI usage is concentrated (usually 2-3 power users) and where it's absent (usually 70-80% of the team). The gap visualized." }, { title: 'Wasted Spend Report', desc: 'Licensed-but-idle seats, redundant subscriptions, misconfigured plans. Typically finds $2,000-$8,000/year in immediate savings.' }, { title: '3 Quick Wins', desc: 'Specific actions your team can take this week. Not "consider an AI strategy," but things like "cancel these 12 idle seats" or "set up a team working agreement for AI-assisted code review."' }, { title: 'AI Readiness Score', desc: 'A 1-5 rating across five dimensions: tool coverage, adoption rate, workflow integration, spend efficiency, team capability. Shows where you are on the path from "bought tools" to "AI coordinates our work," designed to be shareable with your CEO.' }] as item (item.title)}
			<div class="cell">
				<h3 class="font-medium text-ink mb-2">{item.title}</h3>
				<p class="font-serif text-sm text-muted leading-[1.55]">{item.desc}</p>
			</div>
		{/each}
	</HairlineGrid>
</NumberedSection>

<!-- What Your Scan Tells You -->
<NumberedSection index="03" title="Most teams find the same gap">
	<div class="max-w-2xl mx-auto" use:reveal>
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
	</div>
</NumberedSection>

<!-- Pricing -->
<NumberedSection index="04" title="Investment">
	<div class="max-w-2xl mx-auto" use:reveal>
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
	</div>
</NumberedSection>

<!-- FAQ -->
<NumberedSection index="05" title="Common questions">
	<div class="max-w-2xl mx-auto space-y-0" use:reveal>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				What access do you need?
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
				Admin credentials or exports from your AI tools (Cursor, Copilot, Claude, ChatGPT for Teams,
				etc.) plus a 15-minute walkthrough of your team structure.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				What if we're a remote team?
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
				Fully remote-friendly. The survey is async, the report is delivered digitally. No on-site
				requirement.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				Is there any obligation after the Scan?
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
				No. Many teams take the quick wins and run. The Scan stands on its own — if you want to go
				further, the <a href="/leaders/context-build/" class="text-accent hover:underline"
					>Context Build</a
				> is the next step, but there's no obligation.
			</p>
		</details>
	</div>
</NumberedSection>

<!-- Journey nudge -->
<div class="border-t border-rule py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-subtle">
			Next in the journey: <a
				href="/leaders/context-build/"
				class="text-accent hover:underline font-medium">Context Build &rarr;</a
			>
		</p>
	</div>
</div>
