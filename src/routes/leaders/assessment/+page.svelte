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

	const assessmentSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Infrastructure Assessment',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Two-week engagement: stakeholder interviews, tool and spend audit, workflow assessment, blocker identification, and a prioritized build plan.',
		dateModified: '2026-03',
		offers: {
			'@type': 'AggregateOffer',
			lowPrice: '10000',
			highPrice: '15000',
			priceCurrency: 'USD'
		}
	};
</script>

<SEO
	title="AI Assessment for Leaders | DomeWorks"
	description="A two-week deep dive into your team's AI adoption. Stakeholder interviews, infrastructure analysis, and a prioritized build plan. $10,000-$15,000."
	schema={assessmentSchema}
/>

<!-- Hero -->
<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl">
		<Eyebrow label="Leaders Assessment" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Find out what's actually happening with AI on your team<span class="text-accent-light">.</span
			>
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

<!-- Four Things Happen -->
<NumberedSection index="01" title="Four things happen">
	<div class="max-w-2xl mx-auto space-y-8" use:reveal>
		{#each [{ step: '1', title: 'Stakeholder interviews', desc: "I talk to your engineering leads, product managers, and ops people. Not a survey — real conversations about how they're using AI, where they're hitting walls, and what would actually help. This is where the real blockers — and the real opportunities — surface." }, { step: '2', title: 'Tool and spend audit', desc: "I map every AI tool, every seat, every subscription. Who's using what, how often, and whether it's doing anything useful." }, { step: '3', title: 'Workflow assessment', desc: "I evaluate what's in place — and what's missing — between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling." }, { step: '4', title: 'Blocker identification', desc: 'Adoption stalls for specific reasons — often structural, not motivational. I find out which blockers are in your way — missing systems, cultural resistance, knowledge silos, tooling gaps — and how severe they are.' }] as item (item.step)}
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
	<HairlineGrid cols={3} stagger staggerDelay={150}>
		<div class="cell">
			<h3 class="text-lg font-medium text-ink mb-3">Where you stand</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				What tools are in use, what's working, what's not. The gap between "engineers have AI" and
				"AI is part of how the team ships." A detailed picture you can share with your leadership
				team.
			</p>
		</div>
		<div class="cell">
			<h3 class="text-lg font-medium text-ink mb-3">What to build, in what order</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				A ranked list of specific systems and changes for your team. Each one has estimated effort,
				expected impact, and dependencies. You'll know exactly what to do first and why.
			</p>
		</div>
		<div class="cell">
			<h3 class="text-lg font-medium text-ink mb-3">Quick wins</h3>
			<p class="font-serif text-sm text-muted leading-[1.55]">
				Two to three things your team can do immediately — before any further engagement. Changes
				that pay off in days, not months. The quick wins alone tend to pay for the assessment.
			</p>
		</div>
	</HairlineGrid>
</NumberedSection>

<!-- What Happens Next -->
<NumberedSection index="03" title="What happens next">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<p class="font-serif text-lg text-muted leading-[1.65] mb-4">
				The assessment feeds into a design and build phase, but there's no obligation. You get the
				deliverables either way.
			</p>
			<p class="font-serif text-lg text-muted leading-[1.65]">
				Some teams take the assessment and build internally. That's fine. If you want to keep going,
				the assessment gives us a clear starting point — no re-discovery, no wasted time.
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
						<td class="px-6 py-4 text-ink">5–20 people, 1-2 squads</td>
						<td class="px-6 py-4 text-right text-ink font-medium">$10,000</td>
					</tr>
					<tr class="bg-paper-alt">
						<td class="px-6 py-4 text-ink">20–80 people, 3-6 squads</td>
						<td class="px-6 py-4 text-right text-ink font-medium">$12,500</td>
					</tr>
					<tr class="bg-paper">
						<td class="px-6 py-4 text-ink">80+ people, multi-department</td>
						<td class="px-6 py-4 text-right text-ink font-medium">$15,000</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mt-6">
			<Callout variant="accent">
				<p class="text-sm text-ink">
					<strong>Founding client rate:</strong> $7,000–$10,000 for the first 3-5 clients, in exchange
					for a case study and testimonial. Mention it on the call.
				</p>
			</Callout>
		</div>
		<p class="text-center text-subtle text-sm mt-4">
			I'll give you an exact number after a 30-minute call. No hourly billing surprises, no change
			orders.
		</p>
	</div>
</NumberedSection>

<!-- CTA -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<h2 class="font-serif text-3xl font-normal text-ink mb-4">
			Ready to find out what's blocking your team?
		</h2>
		<p class="font-serif text-lg text-muted mb-8">
			30-minute call, no obligation. I'll tell you whether an Assessment is the right move — or if a
			Scan is enough.
		</p>
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>
