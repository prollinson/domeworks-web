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
	};

	const patterns: Record<string, Pattern> = {
		generic: {
			label: 'Services (general)',
			lead: 'Different businesses, same four leaks. Pick your vertical to see what I usually find.',
			cards: [
				{ title: 'Admin drag', body: 'Invoicing, scheduling, email triage, document chasing. Work that follows rules, not judgement.' },
				{ title: 'Correspondence and drafting', body: 'Proposals, updates, client communications. Template-based work that still takes hours.' },
				{ title: 'Meeting prep and follow-up', body: 'Pre-read, meeting notes, action-item tracking. 30 to 60 minutes per interaction.' },
				{ title: 'Research and staying current', body: 'Industry updates, competitor scans, market data. Hours that a tool can compress to minutes.' }
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
		content="A structured assessment of where AI tools fit in your services business, and where they shouldn't go. Free for the first 5 businesses."
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
			'Structured assessment of where AI tools fit in a services business and where they shouldn\'t go. Discovery call, analysis, written prescription, review call. Assess, Prescribe, Build.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			description: 'Free for the first 5 businesses (normally $999)'
		}
	})}</script>`}
</svelte:head>

<!-- Hero — editorial vocabulary from homepage -->
<section class="relative bg-ink overflow-hidden -mt-16 md:-mt-20" aria-label="Hero" use:trackHeroExit>
	<!-- Architectural grid background -->
	<div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
	<!-- Warm ambient glow -->
	<div class="absolute inset-0 hero-glow" aria-hidden="true" role="presentation"></div>
	<!-- Grain texture -->
	<div class="absolute inset-0 texture-grain" aria-hidden="true" role="presentation"></div>
	<!-- Horizontal architectural rules -->
	<div class="absolute inset-0 pointer-events-none hero-rules" aria-hidden="true" role="presentation"></div>

	<!-- Monogram: "A" for Audit -->
	<div class="absolute inset-0 pointer-events-none hero-monogram-container" aria-hidden="true" role="presentation">
		<span class="hero-monogram font-serif select-none">A</span>
	</div>

	<!-- Vertical copper accent line -->
	<div class="absolute hero-accent-line" aria-hidden="true" role="presentation"></div>

	<div class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 hero-content-pad flex flex-col justify-between min-h-[clamp(70svh,80svh,90svh)]">
		<!-- Top zone: eyebrow -->
		<div class="hero-eyebrow-row">
			<span class="hero-eyebrow-text">AI Tools Assessment</span>
			<span class="hero-eyebrow-index">Services businesses · 10–50 people</span>
		</div>

		<!-- Middle zone: headline + aside -->
		<div class="hero-middle">
			<h1 class="hero-headline font-serif font-normal text-warm-white">
				<span class="hero-line hero-line-1">Your business runs on</span>
				<span class="hero-line hero-line-2">manual workflows<span class="text-copper">.</span></span>
				<span class="hero-line hero-line-3"><em class="hero-headline-em">Most of them</em></span>
				<span class="hero-line hero-line-4 text-warm-white/70">don't have to<span class="text-copper/70">.</span></span>
			</h1>

			<div class="hero-aside">
				<div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
				<p class="hero-body-text text-warm-white/85 leading-relaxed">
					A structured assessment of where AI tools fit in your business <em>and where they shouldn't go</em>. Not a sales pitch. Not a software demo.
				</p>
				<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
					Built by someone who spent 15 years building systems at DoorDash, Square, and Mudflap.
				</p>
				<div class="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
					<Button href={getAssessmentCallUrl()} size="lg">Book the discovery call</Button>
					<a href="/quiz/" class="text-sm text-warm-white/85 hover:text-copper underline underline-offset-4 transition-colors">
						Not ready? Take the 2-min quiz first →
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom zone: stat strip -->
		<div class="hero-stat-bar">
			<div class="hidden md:flex items-stretch">
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">5–7 hrs</span>
					<span class="hero-stat-label">Recovered / week</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">90 min</span>
					<span class="hero-stat-label">Your time investment</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">3 left</span>
					<span class="hero-stat-label">Free spots</span>
				</div>
			</div>
			<div class="flex min-[360px]:flex md:hidden items-stretch">
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-warm-white/95">5–7 hrs</span>
					<span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Recovered / wk</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-warm-white/95">90 min</span>
					<span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Your investment</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-warm-white/95">3 left</span>
					<span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Free spots</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 01: Where the time goes — interactive business-type selector -->
<Section id="where-time-goes" background="white" padding="md" eyebrow="01" title="Where the time goes">
	<div use:reveal>
		<!-- Lead -->
		<div class="max-w-3xl mx-auto mb-8 text-center">
			<p class="text-lg text-charcoal/70 leading-relaxed">
				Services businesses lose hours to work that follows rules, not judgement. The specifics shift by industry. Pick yours to see the pattern I usually find.
			</p>
		</div>

		<!-- Business type selector -->
		<div class="max-w-5xl mx-auto mb-8">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-3 text-center">Your business type</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each Object.entries(patterns) as [key, p]}
					<button
						type="button"
						onclick={() => (selectedType = key as keyof typeof patterns)}
						class="px-4 py-2 text-sm rounded-full border transition-all {selectedType === key
							? 'bg-copper text-warm-white border-copper shadow-sm'
							: 'bg-warm-white text-charcoal/75 border-charcoal/15 hover:border-charcoal/30 hover:bg-stone'}"
						aria-pressed={selectedType === key}
					>
						{p.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Context line for the selected vertical -->
		<div class="max-w-3xl mx-auto mb-8 text-center">
			<p class="text-sm text-charcoal/60 italic">{currentPattern.lead}</p>
		</div>

		<!-- Problem cards: swap based on selection -->
		<div class="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
			{#each currentPattern.cards as card (selectedType + card.title)}
				<div class="p-6 bg-stone rounded-xl border border-charcoal/8 cursor-default">
					<h3 class="font-medium text-charcoal mb-2">{card.title}</h3>
					<p class="text-sm text-charcoal/70">{card.body}</p>
				</div>
			{/each}
		</div>

		<!-- Speed-to-lead: full-width priority callout, distinct treatment -->
		<div class="max-w-5xl mx-auto mt-6 p-6 bg-copper/[0.06] rounded-xl border border-copper/20">
			<div class="flex items-start gap-4">
				<span class="text-xs font-semibold tracking-widest text-copper uppercase flex-shrink-0 pt-1">Priority pattern</span>
				<div>
					<h3 class="font-medium text-charcoal mb-2">Speed-to-lead: inbound response latency</h3>
					<p class="text-sm text-charcoal/75 leading-relaxed">
						The single highest-value pattern I find in owner-operated businesses. Prospect sends an inquiry at 9pm. You see it at 8am. By then they've already called two competitors. Cutting that response time from hours to minutes is often worth more than everything else on this page combined.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 02: How I work — named method: Assess. Prescribe. Build. -->
<Section background="muted" padding="md" eyebrow="02" title="How I work">
	<div class="max-w-5xl mx-auto" use:reveal>
		<!-- Method tagline -->
		<div class="text-center mb-10">
			<p class="font-serif text-2xl md:text-3xl text-charcoal leading-tight">
				<span class="text-copper">Assess.</span>
				<span class="text-copper">Prescribe.</span>
				<span class="text-copper">Build.</span>
			</p>
			<p class="mt-3 text-sm text-charcoal/60 tracking-wider uppercase">
				Three phases. Each designed to end.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-6">
			<!-- Phase 1: Assess -->
			<div class="p-6 bg-warm-white rounded-xl border border-charcoal/8 flex flex-col">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Phase 01</p>
				<h3 class="font-serif text-2xl text-charcoal mb-3">Assess</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed mb-4">
					45-minute discovery call. I ask about your workflow: where time gets stuck, what you've tried, what you dread. No pitch, just questions.
				</p>
				<div class="mt-auto pt-4 border-t border-charcoal/8">
					<p class="text-xs text-charcoal/50">Your time: 45 minutes. One call.</p>
				</div>
			</div>

			<!-- Phase 2: Prescribe -->
			<div class="p-6 bg-warm-white rounded-xl border border-charcoal/8 flex flex-col">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Phase 02</p>
				<h3 class="font-serif text-2xl text-charcoal mb-3">Prescribe</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed mb-4">
					Written report in 48 hours. Top 3 to 7 AI opportunities ranked by impact and effort. An explicit list of workflows I recommend you <em>don't</em> automate. A financial impact estimate you can act on.
				</p>
				<div class="mt-auto pt-4 border-t border-charcoal/8">
					<p class="text-xs text-charcoal/50">Your time: 45-minute review call.</p>
				</div>
			</div>

			<!-- Phase 3: Build -->
			<div class="p-6 bg-warm-white rounded-xl border border-charcoal/8 flex flex-col">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Phase 03</p>
				<h3 class="font-serif text-2xl text-charcoal mb-3">Build</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed mb-4">
					Optional. If you want hands-on implementation rather than a self-serve roadmap, I embed for a fixed-scope engagement. I build the systems, train the staff who'll actually use them, and handle the change-resistance that always comes with new tools. You keep what I build. The engagement ends.
				</p>
				<div class="mt-auto pt-4 border-t border-charcoal/8">
					<p class="text-xs text-charcoal/50">Priced separately. Zero obligation from the Assessment.</p>
				</div>
			</div>
		</div>

		<!-- Total time investment reassurance -->
		<div class="mt-8 text-center">
			<p class="text-sm text-charcoal/60">
				Your total time investment for the Assessment (Phases 01 and 02): about 90 minutes across two calls.
			</p>
		</div>
	</div>
</Section>

<!-- 03: What I won't tell you to automate — honesty gate, the defining section -->
<Section background="white" padding="md" eyebrow="03" title="What I won't tell you to automate">
	<div class="max-w-4xl mx-auto" use:reveal>
		<div class="mb-8">
			<p class="text-lg text-charcoal/70 leading-relaxed">
				Half the value of this Assessment is the workflows I tell you to leave alone. AI is the wrong tool in more places than most consultants will admit. Here's where I'll push back.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
			<div class="p-5 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Don't automate</p>
				<h3 class="font-medium text-charcoal mb-2">Your sales motion</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					Automated outbound cold sequences destroy more trust than they generate. If anything, your sales motion needs more human attention, not less. I'll be the first to say so.
				</p>
			</div>
			<div class="p-5 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Don't automate</p>
				<h3 class="font-medium text-charcoal mb-2">Broken processes</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					If clients are unhappy or staff is burned out, AI on top only speeds up the problem. Fix the process first. I'll tell you so.
				</p>
			</div>
			<div class="p-5 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Don't automate</p>
				<h3 class="font-medium text-charcoal mb-2">Human-judgement work</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					Client calls, review that requires context, exception handling, anything where your reputation is on the line. These stay human. That's the moat.
				</p>
			</div>
			<div class="p-5 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Don't automate</p>
				<h3 class="font-medium text-charcoal mb-2">Low-volume tasks</h3>
				<p class="text-sm text-charcoal/70 leading-relaxed">
					If the task happens twice a month, the setup cost of automating it is higher than the time you'd save. Keep it manual. I'll say so.
				</p>
			</div>
		</div>

		<div class="mt-8 p-5 bg-copper/[0.06] rounded-xl border border-copper/15">
			<p class="text-sm text-charcoal/70 leading-relaxed">
				<strong class="text-charcoal">If the honest answer is "don't use AI here," I'll say so on the call.</strong> If the honest answer is "hire the person you were going to hire," I'll say so. The report you walk away with reflects what I actually found, not what I'm paid to recommend.
			</p>
		</div>
	</div>
</Section>

<!-- 04: The math — full-width, larger treatment -->
<Section background="muted" padding="md" eyebrow="04" title="The math">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-8 items-center">
			<div class="text-center md:text-left">
				<p class="text-5xl md:text-6xl font-serif text-charcoal leading-tight">
					5–7 hours<span class="text-copper">/</span><span class="text-charcoal/50">week</span>
				</p>
				<p class="text-charcoal/70 mt-2 text-lg">recovered per person, on average</p>
			</div>
			<div class="space-y-5">
				<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
					<p class="text-lg text-charcoal/70 leading-relaxed">
						For a team where staff time is worth $50–$200/hour loaded, that's
						<strong class="text-charcoal">$250–$1,400 per person per week</strong> in recovered capacity, or the ability to take on more clients without adding headcount.
					</p>
					<div class="h-px bg-charcoal/10 my-5"></div>
					<p class="text-sm text-charcoal/50">
						The tools cost $30–$80/month in aggregate. Payback is measured in days.
					</p>
				</div>
				<div class="p-4 bg-primary/[0.04] rounded-lg border border-primary/15 flex items-start gap-3">
					<svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
					<p class="text-sm text-charcoal/70">
						<strong class="text-charcoal">Guarantee:</strong> implement the recommendations and save 5+ hours/week within 30 days, or full refund on paid Assessments. No questions asked.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 05: Right fit / Not a fit — explicit disqualifier -->
<Section background="white" padding="md" eyebrow="05" title="Is this the right fit?">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-6">
			<!-- Right fit -->
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-4">Right fit if you</p>
				<ul class="space-y-3 text-sm text-charcoal/75 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-copper flex-shrink-0 mt-0.5">✓</span>
						<span>Own or lead a services business doing $3M to $10M in annual revenue.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-copper flex-shrink-0 mt-0.5">✓</span>
						<span>Have 10 to 50 people and a repeatable service delivered week after week.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-copper flex-shrink-0 mt-0.5">✓</span>
						<span>Run on software your team mostly likes (QuickBooks, HubSpot, your job-management or practice-management system).</span>
					</li>
					<li class="flex gap-3">
						<span class="text-copper flex-shrink-0 mt-0.5">✓</span>
						<span>Lose real hours to rule-based admin work or slow inbound lead response.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-copper flex-shrink-0 mt-0.5">✓</span>
						<span>Want to know where AI shouldn't go, not just where it should.</span>
					</li>
				</ul>
			</div>

			<!-- Not a fit -->
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-4">Not a fit if you</p>
				<ul class="space-y-3 text-sm text-charcoal/75 leading-relaxed">
					<li class="flex gap-3">
						<span class="text-charcoal/40 flex-shrink-0 mt-0.5">✕</span>
						<span>Want a tool list without spending 45 minutes on how your business actually works.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-charcoal/40 flex-shrink-0 mt-0.5">✕</span>
						<span>Want software resold or managed. I don't do either.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-charcoal/40 flex-shrink-0 mt-0.5">✕</span>
						<span>Have a process broken at the client, vendor, or staffing level. AI won't fix a human problem.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-charcoal/40 flex-shrink-0 mt-0.5">✕</span>
						<span>Want a "transformation" or a six-figure roadmap. I do small, specific, measurable.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-charcoal/40 flex-shrink-0 mt-0.5">✕</span>
						<span>Have no core software or repeatable process yet. Start there, then come back.</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Section>

<!-- 06: Who's behind this — with credential badges -->
<Section background="muted" padding="md" eyebrow="06" title="Who's behind this">
	<div class="max-w-4xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-3 gap-8 items-start">
			<div class="md:col-span-2 space-y-4 text-lg text-charcoal/70 leading-relaxed">
				<p>
					I'm <strong class="text-charcoal">Piers Rollinson</strong>, founder of DomeWorks. I've spent
					15 years building systems that replace manual coordination — first at DoorDash, Square, and
					Mudflap, now for owner-operated services businesses.
				</p>
				<p>
					I live in Henderson with my wife and three kids. I'm not a software salesman. I build
					working systems, not strategy decks — and every engagement is designed to end. You keep what
					I build.
				</p>
			</div>
			<div class="space-y-3">
				<div class="p-4 bg-warm-white rounded-lg border border-charcoal/8">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-1">Previously</p>
					<p class="text-sm text-charcoal font-medium">DoorDash, Square, Mudflap</p>
				</div>
				<div class="p-4 bg-warm-white rounded-lg border border-charcoal/8">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-1">Focus</p>
					<p class="text-sm text-charcoal font-medium">AI systems for services businesses</p>
				</div>
				<div class="p-4 bg-warm-white rounded-lg border border-charcoal/8">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-1">Based in</p>
					<p class="text-sm text-charcoal font-medium">Henderson, NV</p>
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
				What if the honest answer is "don't use AI for that"?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				That's half the value. The report explicitly flags workflows where AI is the wrong tool. Broken processes, human-judgement work, low-volume tasks. I'll also tell you if the honest answer is "hire the person you were going to hire anyway." No pretending AI solves problems it doesn't.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Is this actually free?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Yes. The first 5 businesses get the full Assessment at no cost. Same deliverable that normally costs $999. I'm building case studies and relationships. There's no upsell during the Assessment, and no obligation to hire me afterward.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What do I need to prepare?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Nothing. Just show up to the discovery call ready to talk about how your business actually works day-to-day. I'll ask the right questions. No homework, no intake forms.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				How long until I get the report?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Within 48 hours of the discovery call. The review call happens shortly after, at a time that works for you. Total calendar time from first call to final report: about one week.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Do you sell software?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				No. The report recommends existing tools — things like ChatGPT, Claude, Dext, Karbon — whatever fits your workflow. I don't resell software and I have no affiliate deals. The recommendations are genuinely neutral.
			</p>
		</details>

		<details class="group p-5 bg-stone rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What happens after the Assessment?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				That's entirely up to you. Many businesses implement on their own. The report is designed for that. If you want hands-on help, we can talk about the Build phase, a fixed-scope engagement where I embed and build the systems for you. But there's zero pressure either way.
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
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">After Assess + Prescribe</p>
				<h3 class="font-medium text-warm-white mb-1.5">Implement on your own</h3>
				<p class="text-sm text-warm-white/60 leading-relaxed">
					The report includes specific tool recommendations and a quick-start plan.
					Many owners take it and run. That's the whole point.
				</p>
			</div>
			<div class="p-5 rounded-xl border border-warm-white/10 bg-warm-white/[0.04]">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Or add the Build phase</p>
				<h3 class="font-medium text-warm-white mb-1.5">I embed and build it</h3>
				<p class="text-sm text-warm-white/60 leading-relaxed">
					I build the systems, train your team, and hand off working infrastructure.
					Fixed-scope, designed to end. You keep what I build.
				</p>
			</div>
		</div>

		<!-- Primary CTA -->
		<div class="text-center">
			<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-4">Limited availability</p>
			<h2 class="font-serif text-3xl md:text-4xl font-normal text-warm-white mb-3">
				Free for the first 5 businesses
			</h2>
			<p class="text-warm-white/60 mb-2">Services businesses, 10 to 50 people. <span class="line-through text-warm-white/40">Normally $999</span></p>
			<p class="text-sm text-warm-white/50 mb-10">If you don't find the Assessment valuable, I'll refund you. One sentence guarantee, no conditions.</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href={getAssessmentCallUrl()} size="lg">Book the discovery call</Button>
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
	<p class="text-sm text-warm-white/70 truncate">3 free spots left</p>
	<Button href={getAssessmentCallUrl()} size="sm">Book call</Button>
</div>
{/if}
