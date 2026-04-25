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

	const contextBuildSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Context Build: AI Readiness Assessment & Context System Design',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Two-week engagement: stakeholder interviews, AI readiness assessment, tool and spend audit, context system design, workflow mapping, blocker analysis, and a prioritized opportunity map.',
		dateModified: '2026-04',
		offers: {
			'@type': 'AggregateOffer',
			lowPrice: '10000',
			highPrice: '15000',
			priceCurrency: 'USD'
		}
	};
</script>

<SEO
	title="Context Build: Build Your Organization's Context System | DomeWorks"
	description="A two-week engagement that diagnoses your AI readiness and designs the context system your AI tools need to work at the team level. $10,000-$15,000."
	schema={contextBuildSchema}
/>

<!-- Hero -->
<Section background="dark" padding="xl" hero>
	<div class="max-w-3xl">
		<Eyebrow label="Context Build" tone="accent-light" />
		<h1
			class="mt-4 font-sans font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
			style="font-size: clamp(2.5rem, 7vw, 4.5rem);"
		>
			Build the world model your AI tools need to be useful<span class="text-accent-light">.</span>
		</h1>
		<p class="mt-6 font-serif text-lg text-paper/80 leading-[1.65] max-w-2xl">
			A two-week engagement that designs the context system — the infrastructure that feeds your
			domain knowledge, team conventions, and codebase patterns into every AI interaction. The
			foundation for everything that comes after.
		</p>
		<div class="mt-8">
			<Button href={getBookCallUrl()} size="lg">Book a call</Button>
		</div>
	</div>
</Section>

<!-- Four Things Happen -->
<NumberedSection index="01" background="muted" title="Four things happen">
	<div class="max-w-2xl mx-auto space-y-8" use:reveal>
		{#each [{ step: '1', title: 'Stakeholder interviews', desc: "I talk to your engineering leads, product managers, and ops people. Not a survey, but real conversations about how they're using AI, where they're hitting walls, and what would actually help. This is where the real blockers (and the real opportunities) surface." }, { step: '2', title: 'Tool and spend audit', desc: "I map every AI tool, every seat, every subscription. Who's using what, how often, and whether it's doing anything useful. You're probably paying for more AI tooling than you realize." }, { step: '3', title: 'Context system diagnosis', desc: "I evaluate what's in place, and what's missing, between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling. Most teams have none of this. That's why adoption stalls at the individual level." }, { step: '4', title: 'Blocker identification', desc: 'Adoption stalls for specific reasons, often structural, not motivational. I find out which blockers are in your way (missing systems, cultural resistance, knowledge silos, tooling gaps) and how severe they are.' }] as item (item.step)}
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
<NumberedSection index="02" background="white" title="What you get">
	<HairlineGrid cols={3} stagger staggerDelay={150}>
		<!-- AI Readiness Assessment — dark visual card with blueprint diagram -->
		<div class="cell p-8 bg-ink rounded-2xl relative overflow-hidden">
			<div class="relative">
				<h3 class="text-lg font-medium text-paper mb-1">AI Readiness Assessment</h3>
				<p class="text-xs text-paper/50 mb-6 leading-relaxed">
					How your tools, teams, and workflows map to the four-layer AI stack.
				</p>
				<!-- Blueprint SVG: sources → pipeline → surfaces -->
				<svg
					viewBox="0 0 220 160"
					class="w-full block"
					aria-label="Context system blueprint diagram showing sources flowing through a context pipeline to surfaces"
				>
					<!-- Source nodes -->
					<rect
						x="8"
						y="8"
						width="60"
						height="28"
						rx="6"
						fill="rgba(13,107,99,0.15)"
						stroke="rgba(13,107,99,0.4)"
						stroke-width="1"
					/>
					<text
						x="38"
						y="26"
						text-anchor="middle"
						fill="rgba(255,255,255,0.6)"
						font-size="8"
						font-weight="500">Codebase</text
					>
					<rect
						x="80"
						y="8"
						width="60"
						height="28"
						rx="6"
						fill="rgba(13,107,99,0.15)"
						stroke="rgba(13,107,99,0.4)"
						stroke-width="1"
					/>
					<text
						x="110"
						y="26"
						text-anchor="middle"
						fill="rgba(255,255,255,0.6)"
						font-size="8"
						font-weight="500">Docs</text
					>
					<rect
						x="152"
						y="8"
						width="60"
						height="28"
						rx="6"
						fill="rgba(13,107,99,0.15)"
						stroke="rgba(13,107,99,0.4)"
						stroke-width="1"
					/>
					<text
						x="182"
						y="26"
						text-anchor="middle"
						fill="rgba(255,255,255,0.6)"
						font-size="8"
						font-weight="500">Tickets</text
					>
					<!-- Arrows down -->
					<line x1="38" y1="36" x2="38" y2="58" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
					<line
						x1="110"
						y1="36"
						x2="110"
						y2="58"
						stroke="rgba(255,255,255,0.12)"
						stroke-width="1"
					/>
					<line
						x1="182"
						y1="36"
						x2="182"
						y2="58"
						stroke="rgba(255,255,255,0.12)"
						stroke-width="1"
					/>
					<!-- Context Pipeline -->
					<rect
						x="8"
						y="58"
						width="204"
						height="36"
						rx="8"
						fill="rgba(176,125,79,0.12)"
						stroke="rgba(176,125,79,0.4)"
						stroke-width="1.5"
					/>
					<text
						x="110"
						y="80"
						text-anchor="middle"
						fill="#B07D4F"
						font-size="9"
						font-weight="600"
						letter-spacing="0.08em">CONTEXT PIPELINE</text
					>
					<!-- Arrows down -->
					<line x1="38" y1="94" x2="38" y2="116" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
					<line
						x1="110"
						y1="94"
						x2="110"
						y2="116"
						stroke="rgba(255,255,255,0.12)"
						stroke-width="1"
					/>
					<line
						x1="182"
						y1="94"
						x2="182"
						y2="116"
						stroke="rgba(255,255,255,0.12)"
						stroke-width="1"
					/>
					<!-- Surface nodes -->
					<rect
						x="8"
						y="116"
						width="60"
						height="28"
						rx="6"
						fill="rgba(255,255,255,0.04)"
						stroke="rgba(255,255,255,0.1)"
						stroke-width="1"
					/>
					<text x="38" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8"
						>IDE</text
					>
					<rect
						x="80"
						y="116"
						width="60"
						height="28"
						rx="6"
						fill="rgba(255,255,255,0.04)"
						stroke="rgba(255,255,255,0.1)"
						stroke-width="1"
					/>
					<text x="110" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8"
						>CI/CD</text
					>
					<rect
						x="152"
						y="116"
						width="60"
						height="28"
						rx="6"
						fill="rgba(255,255,255,0.04)"
						stroke="rgba(255,255,255,0.1)"
						stroke-width="1"
					/>
					<text x="182" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8"
						>Chat</text
					>
				</svg>
			</div>
		</div>

		<!-- Prioritized Opportunity Map — dark visual card with impact bars -->
		<div class="cell p-8 bg-ink rounded-2xl relative overflow-hidden">
			<div class="relative">
				<h3 class="text-lg font-medium text-paper mb-1">Prioritized Opportunity Map</h3>
				<p class="text-xs text-paper/50 mb-6 leading-relaxed">
					Ranked actions with effort, impact, and dependencies.
				</p>
				<!-- Opportunity items -->
				<div class="flex flex-col gap-4">
					{#each [{ name: 'Shared context files', effort: '1 week', width: '92%', color: 'bg-accent', dot: 'bg-accent' }, { name: 'PR review agent', effort: '2 weeks', width: '75%', color: 'bg-accent', dot: 'bg-accent' }, { name: 'Onboarding automation', effort: '3 weeks', width: '55%', color: 'bg-subtle', dot: 'bg-subtle' }, { name: 'Meeting summaries', effort: '4 weeks', width: '30%', color: 'bg-rule', dot: 'bg-rule' }] as item (item.name)}
						<div>
							<div class="flex items-center gap-2 mb-1.5">
								<span class="w-1.5 h-1.5 rounded-full {item.dot} shrink-0"></span>
								<span class="text-[11px] text-paper/80">{item.name}</span>
								<span class="ml-auto text-[9px] text-paper/35 font-medium">{item.effort}</span>
							</div>
							<div class="h-[5px] bg-paper/[0.06] rounded-full overflow-hidden ml-3.5">
								<div
									class="h-full {item.color} rounded-full opacity-70"
									style="width: {item.width}"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Context System Blueprint — accent callout card -->
		<div class="cell">
			<Callout variant="accent">
				<h3 class="text-lg font-medium text-ink mb-3">Context System Blueprint</h3>
				<p class="font-serif text-sm text-muted">
					What domain knowledge needs to flow into AI interactions, and how. A design for the shared
					context, reliable workflows, and developer tooling that make AI useful beyond ad-hoc
					prompting.
				</p>
			</Callout>
		</div>
	</HairlineGrid>
</NumberedSection>

<!-- What Happens Next -->
<NumberedSection index="03" background="muted" title="What happens next">
	<div class="max-w-2xl mx-auto" use:reveal>
		<Callout variant="rule-left">
			<p class="font-serif text-lg text-muted leading-relaxed mb-4">
				The Context Build is designed to feed into an <a
					href="/leaders/orchestration-build/"
					class="text-accent hover:underline">Orchestration Build</a
				>, where we build the agent coordination layer the blueprint calls for. But there's no
				obligation. You get the deliverables either way.
			</p>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Some teams take the Context Build and build internally. That's fine. The quick wins alone
				tend to pay for the engagement. If you want to keep going, the Context Build gives us a
				clear starting point with no re-discovery and no wasted time.
			</p>
		</Callout>
	</div>
</NumberedSection>

<!-- Pricing -->
<NumberedSection index="04" background="white" title="Investment">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="overflow-hidden rounded-2xl border border-rule">
			<table class="w-full">
				<thead>
					<tr class="bg-accent text-paper">
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
		<div class="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-xl">
			<p class="font-serif text-sm text-muted">
				<strong class="text-ink">Founding client rate:</strong> $7,000–$10,000 for the first 3-5 clients,
				in exchange for a case study and testimonial. Mention it on the call.
			</p>
		</div>
		<p class="text-center text-subtle text-sm mt-4">
			I'll give you an exact number after a 30-minute call. No hourly billing surprises, no change
			orders.
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
				Stakeholder time (30-minute interviews with 3–5 people), plus tool admin access for the
				audit. I'll provide a specific list after the kickoff call.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				Do you sign NDAs?
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
				Yes, standard mutual NDA before any access is granted. I can use yours or provide mine.
			</p>
		</details>
		<details class="group border-b border-rule py-5">
			<summary
				class="flex items-center justify-between cursor-pointer list-none font-medium text-ink"
			>
				What if we want to build internally after?
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
				That's fine. The deliverables are designed to be actionable without me. Some teams take the
				Context Build and handle the rest internally — the quick wins alone tend to pay for the
				engagement.
			</p>
		</details>
	</div>
</NumberedSection>

<!-- Journey nudge -->
<div class="border-t border-rule py-8">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-sm text-subtle">
			Next in the journey: <a
				href="/leaders/orchestration-build/"
				class="text-accent hover:underline font-medium">Orchestration Build &rarr;</a
			>
		</p>
	</div>
</div>
