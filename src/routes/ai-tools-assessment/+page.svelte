<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getAssessmentCallUrl } from '$lib/utils/mailto';

	let showStickyCta = $state(false);

	function trackHeroExit(node: HTMLElement) {
		const observer = new IntersectionObserver(
			([entry]) => {
				showStickyCta = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		observer.observe(node);
		return { destroy() { observer.disconnect(); } };
	}

	type Pattern = {
		label: string;
		lead: string;
		cards: Array<{ title: string; body: string }>;
		leadsWithSpeed?: boolean;
	};

	const patterns: Record<string, Pattern> = {
		generic: {
			label: 'Services (general)',
			lead: 'Different businesses, same few leaks. Pick your vertical to see what I usually find.',
			cards: [
				{ title: 'The inbox never clears', body: 'Invoices, scheduling, document chasing, email triage. Rule-based work that eats the hours your best people should be billing.' },
				{ title: 'Drafting from scratch, every time', body: 'Proposals, client updates, status emails. Template-shaped but not template-speed. Thirty minutes of manual tweaks, every single one.' },
				{ title: 'Meeting prep is its own meeting', body: 'Pre-read, briefing docs, notes, action items. 30–60 minutes per interaction — and most of it goes stale before the next one.' },
				{ title: 'Staying current costs a full day', body: 'Industry news, competitor scans, regulatory changes. Hours you would rather spend on client work.' }
			]
		},
		accounting: {
			label: 'Accounting / bookkeeping',
			lead: 'Small accounting and bookkeeping firms typically lose time in the same four places.',
			cards: [
				{ title: 'Client intake and document chasing', body: 'Tax documents, 1099s, W-2s, engagement letters. The same intake sequence repeated every season.' },
				{ title: 'Correspondence drafting', body: 'IRS notice responses, client updates, engagement letters. Drafted from templates that need refresh.' },
				{ title: 'Meeting prep', body: 'Prior-year file review before every client call. 30 to 60 minutes per meeting.' },
				{ title: 'Regulatory research', body: 'IRS updates, state rule changes, industry news. Hours that AI can surface in minutes.' }
			]
		},
		legal: {
			label: 'Legal',
			lead: 'Small law firms lose hours to the same coordination layer as every other services business.',
			cards: [
				{ title: 'Conflict checks and matter intake', body: 'Same intake questions and conflict searches for every new matter.' },
				{ title: 'Drafting and contract review', body: 'Contracts, demand letters, correspondence. Template-based work that still takes hours.' },
				{ title: 'Case and rule research', body: 'Jurisdiction-specific rules and case updates. First-pass research AI handles well.' },
				{ title: 'Meeting prep and client updates', body: 'Prior-matter review, status summaries, follow-up notes.' }
			]
		},
		medical: {
			label: 'Medical / dental',
			lead: 'Medical and dental practices see the same patterns regardless of specialty.',
			cards: [
				{ title: 'Patient intake and forms', body: 'Insurance verification, records transfer, new-patient paperwork.' },
				{ title: 'Scheduling and no-show follow-up', body: 'Reminder sequences, reschedules, confirmations.' },
				{ title: 'Post-visit summaries and treatment plans', body: 'Drafted from scratch for each patient. Routine structure, detailed content.' },
				{ title: 'Insurance and billing correspondence', body: 'Denial follow-ups, claim resubmissions, patient billing questions.' }
			]
		},
		trades: {
			label: 'Trades / field services',
			lead: 'HVAC, plumbing, landscaping, electrical. The pattern is more leads than you can answer fast enough.',
			leadsWithSpeed: true,
			cards: [
				{ title: 'After-hours lead response', body: 'Inbound quote requests at 9pm. By 8am the prospect called two competitors.' },
				{ title: 'Quoting turnaround', body: 'Site measurement to written quote takes days. Most jobs go to whoever quotes first.' },
				{ title: 'Dispatch and scheduling', body: 'Route optimization, job confirmations, reminder calls.' },
				{ title: 'Invoice chase and review requests', body: 'Post-job payment follow-up, review asks, customer check-ins.' }
			]
		},
		'real-estate': {
			label: 'Real estate',
			lead: 'Real estate agents and teams run on response speed. The slow link is usually admin, not judgement.',
			leadsWithSpeed: true,
			cards: [
				{ title: 'Lead response and showing requests', body: 'Minutes matter. Prospects who get a reply in 5 minutes convert far better than those who wait an hour.' },
				{ title: 'Listing prep and CMA generation', body: 'Comparative market analyses, photo coordination, MLS entry.' },
				{ title: 'Client coordination', body: 'Document chasing, inspection scheduling, closing coordination.' },
				{ title: 'Listing content and social posts', body: 'Listing descriptions, social promos, email blasts.' }
			]
		},
		agency: {
			label: 'Marketing / creative agency',
			lead: 'Marketing and creative agencies lose time to internal coordination, not client work.',
			leadsWithSpeed: true,
			cards: [
				{ title: 'New-business proposals and pitches', body: 'Custom decks and scopes drafted from scratch for every lead.' },
				{ title: 'Monthly client reports', body: 'Analytics compilation across platforms, narrative write-up, packaging.' },
				{ title: 'Content production cycles', body: 'First drafts, revisions, approvals, asset handoff.' },
				{ title: 'Project status and internal syncs', body: 'Weekly status docs, PM notes, client-facing summaries.' }
			]
		},
		consulting: {
			label: 'Consulting',
			lead: 'Consultancies lose hours to the work around the work: research, reports, follow-ups.',
			cards: [
				{ title: 'Discovery and scoping', body: 'SOWs, kickoff docs, stakeholder interview synthesis.' },
				{ title: 'Recurring deliverables', body: 'Weekly status, monthly reports, executive summaries.' },
				{ title: 'Research and desk work', body: 'Industry data, competitor scans, benchmarking.' },
				{ title: 'Meeting prep and notes', body: 'Pre-read, agenda, follow-up summaries, action-item tracking.' }
			]
		},
		ecommerce: {
			label: 'E-commerce',
			lead: "E-commerce brands lose time to the repeatable work that doesn't ship product.",
			cards: [
				{ title: 'Customer service triage', body: 'Returns, shipping status, sizing, order changes. Mostly the same 15 questions.' },
				{ title: 'Product descriptions and copy', body: 'New SKU copy, PDP updates, collection pages.' },
				{ title: 'Email flows and marketing', body: 'Welcome series, cart abandonment, post-purchase.' },
				{ title: 'Inventory and reorder alerts', body: 'Stock notifications, vendor chase, SKU forecasting.' }
			]
		}
	};

	let selectedType = $state<keyof typeof patterns>('generic');
	const currentPattern = $derived(patterns[selectedType]);
</script>

<svelte:head>
	<title>AI Tools Assessment | DomeWorks</title>
	<meta
		name="description"
		content="A 45-minute assessment of where AI tools fit in your services business — and the workflows where they'd do more harm than good. For owner-operated firms with 10–50 people."
	/>
	<link rel="canonical" href="https://domeworks.tech/ai-tools-assessment/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/ai-tools-assessment/" />
	<meta property="og:title" content="AI Tools Assessment | DomeWorks" />
	<meta
		property="og:description"
		content="A structured assessment of where AI tools fit in your business, and where they shouldn't go. Not a sales pitch."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="AI Tools Assessment | DomeWorks" />
	<meta
		name="twitter:description"
		content="A structured assessment of where AI tools fit in your business, and where they shouldn't go. Not a sales pitch."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Tools Assessment',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'45-minute assessment of where AI tools fit in a services business and where they shouldn\'t. Discovery call, written action plan, review call. Talk, Plan, Build.',
		offers: {
			'@type': 'Offer',
			price: '999',
			priceCurrency: 'USD',
			description: '45-minute AI Tools Assessment for services businesses with 10–50 people'
		}
	})}</script>`}
</svelte:head>

<!-- Hero: flat dark, editorial -->
<section class="relative bg-ink text-paper overflow-hidden -mt-16 md:-mt-20" aria-label="Hero" use:trackHeroExit>
	<div class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-36 md:pt-40 pb-14 md:pb-20 flex flex-col gap-12 min-h-[clamp(70svh,80svh,90svh)]">
		<!-- Top: eyebrow -->
		<div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
			<span class="text-accent-light">AI Tools Assessment</span>
			<span class="text-paper/55 font-normal tracking-[0.08em]">Services businesses · 10–50 people</span>
		</div>

		<!-- Middle: headline + aside -->
		<div class="flex-1 flex flex-col justify-center max-w-4xl">
			<h1 class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]">
				Stop bleeding hours, leads, revenue.
			</h1>
			<p class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/75 max-w-2xl font-normal">
				A 45 minute call. An action plan <em class="text-accent-light not-italic font-medium">you can start this week</em>. What to install, what to skip.
			</p>
			<p class="mt-4 text-sm text-paper/65 max-w-2xl">
				Ex-DoorDash, Square, Mudflap. I'll handle the AI — you handle your business.
			</p>
			<div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
				<Button href={getAssessmentCallUrl()} size="lg">Book the assessment</Button>
				<a href="/quiz/" class="text-sm text-paper/85 underline underline-offset-4 hover:text-accent-light transition-colors">
					Not ready? Take the 2-min quiz first →
				</a>
			</div>
		</div>

		<!-- Bottom: stat strip -->
		<div class="pt-6 border-t border-paper/10 grid grid-cols-3 gap-4 md:gap-12">
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">5–7 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Recovered / week</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">45 min</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Your time</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">48 hrs</div>
				<div class="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-paper/55 font-medium">Plan delivered</div>
			</div>
		</div>
	</div>
</section>

<!-- Orientation: at-a-glance what this is / who it's for / why me -->
<Section background="muted" padding="md" eyebrow="The short version">
	<div class="max-w-6xl mx-auto" use:reveal>
		<div class="hairline-grid grid md:grid-cols-3">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">What this is</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed mb-3">
					A 45-minute assessment. You walk away with:
				</p>
				<ul class="space-y-2 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>Where hours, leads, and revenue are actually leaking</span></li>
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>The 3–7 AI tools worth installing this week</span></li>
					<li class="flex items-start gap-2"><span class="text-accent flex-shrink-0 mt-0.5">→</span><span>An explicit list of what <em>not</em> to automate</span></li>
				</ul>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">Who it's for</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed">
					Owner-operated services businesses with 10–50 people. Where staff time is expensive, leads go cold, and admin eats the week. Accountants, attorneys, trades, real estate, and similar firms.
				</p>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">Why me</p>
				<p class="font-serif text-sm text-ink/80 leading-relaxed">
					I'll tell you where AI doesn't belong as clearly as where it does. No software reselling, no affiliate deals. 15 years at DoorDash, Square, and Mudflap before this, now based in Henderson.
				</p>
			</div>
		</div>
	</div>
</Section>

<!-- 01: Where the time goes -->
<Section id="where-time-goes" background="white" padding="md" eyebrow="01" title="Where the time goes">
	<div use:reveal>
		<div class="max-w-3xl mx-auto mb-10 text-center">
			<p class="font-serif text-lg text-ink/75 leading-relaxed">
				Every services business leaks hours, leads, and revenue in the same few places. Pick yours to see where it's probably hiding.
			</p>
		</div>

		<div class="max-w-5xl mx-auto mb-8">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-3 text-center">Your business type</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each Object.entries(patterns) as [key, p]}
					<button
						type="button"
						onclick={() => (selectedType = key as keyof typeof patterns)}
						class="px-4 py-2 text-sm rounded-lg border transition-all {selectedType === key
							? 'bg-accent text-white border-accent'
							: 'bg-paper text-ink/75 border-rule hover:border-ink/30 hover:bg-paper-alt'}"
						aria-pressed={selectedType === key}
					>
						{p.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="max-w-3xl mx-auto mb-8 text-center">
			<p class="font-serif text-sm text-subtle italic">{currentPattern.lead}</p>
		</div>

		{#snippet speedCallout(spacingClass: string)}
			<div class="max-w-5xl mx-auto {spacingClass} p-6 bg-accent/[0.06] rounded-lg">
				<div class="flex items-start gap-4">
					<span class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase flex-shrink-0 pt-1">The #1 pattern</span>
					<div>
						<h3 class="font-sans font-medium text-ink mb-2">Speed-to-lead: inbound response latency</h3>
						<p class="font-serif text-sm text-ink/80 leading-relaxed">
							The single highest-value pattern I find in owner-operated businesses. Prospect sends an inquiry at 9pm. You see it at 8am. By then they've already called two competitors. Cutting that response time from hours to minutes is often worth more than everything else on this page combined.
						</p>
					</div>
				</div>
			</div>
		{/snippet}

		{#if currentPattern.leadsWithSpeed}
			{@render speedCallout('mb-6')}
		{/if}

		<div class="max-w-5xl mx-auto hairline-grid grid sm:grid-cols-2">
			{#each currentPattern.cards as card (selectedType + card.title)}
				<div class="cell">
					<h3 class="font-sans font-medium text-ink mb-2">{card.title}</h3>
					<p class="font-serif text-sm text-ink/75 leading-relaxed">{card.body}</p>
				</div>
			{/each}
		</div>

		{#if !currentPattern.leadsWithSpeed}
			{@render speedCallout('mt-6')}
		{/if}
	</div>
</Section>

<!-- 02: What you walk away with — Talk. Plan. Build. -->
<Section background="muted" padding="md" eyebrow="02" title="What you walk away with">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="text-center mb-12">
			<p class="font-sans font-semibold text-2xl md:text-3xl text-ink leading-tight tracking-[-0.02em]">
				<span class="text-accent">Talk.</span>
				<span class="text-accent">Plan.</span>
				<span class="text-accent">Build.</span>
			</p>
			<p class="mt-3 text-xs text-subtle tracking-[0.12em] uppercase font-medium">
				Three phases. Fixed scope.
			</p>
		</div>

		<div class="hairline-grid grid md:grid-cols-3">
			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 01</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Talk</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					A 45-minute conversation about how your business actually runs day to day. Where time gets stuck, what you've tried, what you dread. You talk. I take notes. No pitch.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45 minutes. One call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 02</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Plan</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					Written action plan in 48 hours. The 3–7 AI tools worth installing this week, an explicit list of what <em>not</em> to automate, and financial impact in hours and dollars. Yours to use — implement on your own or hand it to your team.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45-minute review call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Phase 03</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Build</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed mb-4">
					Optional. If you want hands-on implementation rather than a self-serve roadmap, I embed for a fixed-scope engagement. I build the systems, train the staff who'll actually use them, and handle the change-resistance that always comes with new tools. You keep what I build.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Priced separately. Zero obligation from the Assessment.</p>
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-sm text-subtle">
				Two 45-minute calls across the process. Everything in between is on me.
			</p>
		</div>
	</div>
</Section>

<!-- 03: What I won't automate — honesty gate -->
<Section background="white" padding="md" eyebrow="03" title="What I won't tell you to automate">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="mb-10 max-w-3xl">
			<p class="font-serif text-lg text-ink/75 leading-relaxed">
				Half the value of this Assessment is the workflows I tell you to leave alone. AI is the wrong tool in more places than most consultants will admit. Here's where I'll push back.
			</p>
		</div>

		<div class="hairline-grid grid sm:grid-cols-2 lg:grid-cols-4">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Your sales motion</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					Automated outbound cold sequences destroy more trust than they generate. If anything, your sales motion needs more human attention, not less. I'll be the first to say so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Broken processes</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					If clients are unhappy or staff is burned out, AI on top only speeds up the problem. Fix the process first. I'll tell you so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Human-judgement work</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					Client calls, review that requires context, exception handling, anything where your reputation is on the line. These stay human. That's your edge.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">Don't automate</p>
				<h3 class="font-sans font-medium text-ink mb-2">Low-volume tasks</h3>
				<p class="font-serif text-sm text-ink/75 leading-relaxed">
					If the task happens twice a month, the setup cost of automating it is higher than the time you'd save. Keep it manual. I'll say so.
				</p>
			</div>
		</div>

		<div class="mt-8 p-5 bg-accent/[0.06] rounded-lg max-w-4xl">
			<p class="font-serif text-sm text-ink/80 leading-relaxed">
				<strong class="font-sans font-semibold text-ink">If the honest answer is "don't use AI here," I'll say so on the call.</strong> If the honest answer is "hire the person you were going to hire," I'll say so. The action plan you walk away with reflects what I actually found, not what I'm paid to recommend.
			</p>
		</div>
	</div>
</Section>

<!-- 04: The math -->
<Section background="muted" padding="md" eyebrow="04" title="The math">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
			<div class="text-center md:text-left">
				<p class="font-sans font-semibold text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
					5–7 hours<span class="text-accent">/</span><span class="text-subtle">week</span>
				</p>
				<p class="font-serif text-ink/70 mt-3 text-lg">recovered per person, on average</p>
			</div>
			<div class="space-y-5">
				<div class="rule-left-accent">
					<p class="font-serif text-lg text-ink/75 leading-relaxed">
						For a team where staff time is worth $50–$200/hour loaded, that's
						<strong class="font-sans font-semibold text-ink">$250–$1,400 per person per week</strong> in recovered capacity, or the ability to take on more clients without adding headcount. Most teams land around <strong class="font-sans font-semibold text-ink">$600–$800 per person per week</strong>.
					</p>
					<p class="font-serif text-sm text-ink/60 mt-3">
						Your own hours count too — and those are usually the most expensive.
					</p>
					<p class="font-serif text-sm text-ink/50 mt-4 pt-4 border-t border-rule">
						The tools cost $30–$80/month in aggregate. Most teams recoup the $999 within the first week of implementation.
					</p>
				</div>
				<div class="flex items-start gap-3 pt-4 border-t border-rule-strong">
					<svg class="w-5 h-5 text-accent flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
					<p class="font-serif text-sm text-ink/80 leading-relaxed">
						<strong class="font-sans font-semibold text-ink">Guarantee:</strong> implement the recommendations and save 5+ hours/week within 30 days, or full refund. No questions asked.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 05: Right fit / Not a fit -->
<Section background="white" padding="md" eyebrow="05" title="Is this the right fit?">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="hairline-grid grid md:grid-cols-2">
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-4">Right fit if you</p>
				<ul class="space-y-3 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Own or lead a services business doing $3M to $10M in annual revenue.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Have 10 to 50 people and a repeatable service delivered week after week.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Run on software your team mostly likes (QuickBooks, HubSpot, your job-management or practice-management system).</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Lose hours to admin, leads to slow response, or revenue to both.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-accent flex-shrink-0 mt-0.5 font-sans font-semibold">✓</span>
						<span>Want to know where AI shouldn't go, not just where it should.</span>
					</li>
				</ul>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-4">Not a fit if you</p>
				<ul class="space-y-3 font-serif text-sm text-ink/80 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want a tool list without spending 45 minutes on how your business actually works.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want software resold or managed. I don't do either.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Have a process broken at the client, vendor, or staffing level. AI won't fix a human problem.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want a "transformation" or a six-figure roadmap. I do small, specific, measurable.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-ink/30 flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Have no core software or repeatable process yet. Start there, then come back.</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Section>

<!-- 06: Who's behind this -->
<Section background="muted" padding="md" eyebrow="06" title="Who's behind this">
	<div class="max-w-4xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-3 gap-10 items-start">
			<div class="md:col-span-2 space-y-4 font-serif text-lg text-ink/80 leading-relaxed">
				<p>
					I'm <strong class="font-sans font-semibold text-ink">Piers Rollinson</strong>. Fifteen years at DoorDash,
					Square, and Mudflap building systems that move millions of orders, payments, and drivers.
					The same thinking that lands 10 million orders correctly at DoorDash lands 100 client
					intakes correctly at a 12-person firm.
				</p>
				<p>
					I've been an entrepreneur and advisor to small businesses throughout my career. That's
					where DomeWorks comes from.
				</p>
				<p>
					I live in Henderson with my wife and three kids. I'm direct — no BS, no glossy pitch
					decks, no software to resell. I build working systems. Fixed scope. You keep what I build.
				</p>
			</div>
			<div class="space-y-5">
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Previously</p>
					<p class="font-sans text-sm text-ink font-medium">DoorDash, Square, Mudflap</p>
				</div>
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Focus</p>
					<p class="font-sans text-sm text-ink font-medium">AI for services firms</p>
				</div>
				<div class="border-l border-accent pl-4">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">Based in</p>
					<p class="font-sans text-sm text-ink font-medium">Henderson, NV</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 07: FAQ — objection handling -->
<Section background="white" padding="md" eyebrow="07" title="Common questions">
	<div class="max-w-3xl mx-auto space-y-4" use:reveal>
		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What if I've already tried AI and it didn't stick?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Common — most owners have dabbled with ChatGPT or tried a tool their accountant mentioned, and not much changed. The difference here is specificity. You walk away with a written plan tied to specific workflows in your business, not a generic "try AI" suggestion. And if the honest answer is "you tried the right thing, it just needs better prompts," I'll say so.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What if the honest answer is "don't use AI for that"?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				That's half the value. The action plan explicitly flags workflows where AI is the wrong tool — broken processes, human-judgement work, low-volume tasks. I'll also tell you if the honest answer is "hire the person you were going to hire anyway." No pretending AI solves problems it doesn't.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What does this cost?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				$999 flat. Includes the 45-minute call, written action plan, and review call. If you don't find the Assessment valuable, I'll refund you — no conditions. There's no upsell during the Assessment and no obligation to hire me afterward.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What do I need to prepare?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Nothing. You don't need to know AI — that's my job. Just show up ready to talk about how your business actually works day-to-day. I'll ask the questions. No homework, no intake forms.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Who will I be on the call with?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Me. Every call, every action plan, every build. No junior consultants, no handoffs. If you hire me for the Build phase, I'm still the one doing the work.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Do you sell software?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				No. The action plan recommends existing tools — things like ChatGPT, Claude, Dext, Karbon — whatever fits your workflow. I don't resell software and I have no affiliate deals. The recommendations are genuinely neutral.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				How long until I get the action plan?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Within 48 hours of the discovery call. The review call happens shortly after, at a time that works for you. Total calendar time from first call to final action plan: about one week.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What happens after the Assessment?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				That's entirely up to you. Many owners implement on their own — the action plan is designed for that. If you want hands-on help, we can talk about the Build phase. Fixed-scope engagements typically run $3K–$15K depending on what we're building. Zero pressure either way.
			</p>
		</details>
	</div>
</Section>

<!-- CTA: dark closing section — strong finish -->
<section class="relative bg-ink overflow-hidden" aria-label="Book your Assessment">
	<!-- Subtle grid echo from hero -->
	<div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
	<div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 60% at 50% 80%, rgba(176, 125, 79, 0.12), transparent 70%);" aria-hidden="true" role="presentation"></div>

	<div class="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-28" use:reveal>
		<!-- What comes next — Phases of the method -->
		<div class="grid sm:grid-cols-2 gap-5 mb-14">
			<div class="p-5 rounded-xl border border-warm-white/10 bg-warm-white/[0.04]">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">After Talk + Plan</p>
				<h3 class="font-medium text-warm-white mb-1.5">Implement on your own</h3>
				<p class="text-sm text-warm-white/60 leading-relaxed">
					The action plan includes specific tool recommendations and a quick-start sequence.
					Many owners take it and run. That's the whole point.
				</p>
			</div>
			<div class="p-5 rounded-xl border border-warm-white/10 bg-warm-white/[0.04]">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Or add the Build phase</p>
				<h3 class="font-medium text-warm-white mb-1.5">I embed and build it</h3>
				<p class="text-sm text-warm-white/60 leading-relaxed">
					I build the systems, train your team, and hand off working infrastructure.
					Fixed scope. You keep what I build.
				</p>
			</div>
		</div>

		<!-- Primary CTA -->
		<div class="text-center">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-4">Ready when you are</p>
			<h2 class="font-serif text-3xl md:text-4xl font-normal text-warm-white mb-3">
				Stop bleeding. Start this week.
			</h2>
			<p class="text-warm-white/60 mb-2">$999 flat. 45-minute call. Written action plan in 48 hours.</p>
			<p class="text-sm text-warm-white/50 mb-10">If you don't find the Assessment valuable, I'll refund you. No questions asked.</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href={getAssessmentCallUrl()} size="lg">Book the $999 assessment</Button>
				<a href="mailto:piers@domeworks.tech?subject=AI%20Tools%20Assessment%20question" class="text-sm text-warm-white/60 hover:text-copper transition-colors">
					Or email a question first
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Sticky mobile CTA -->
{#if showStickyCta}
<div class="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-warm-white/10 px-4 py-3 flex items-center justify-between gap-3" role="complementary" aria-label="Book Assessment">
	<p class="text-sm text-warm-white/70 truncate">45-min AI assessment</p>
	<Button href={getAssessmentCallUrl()} size="sm">Book it</Button>
</div>
{/if}
