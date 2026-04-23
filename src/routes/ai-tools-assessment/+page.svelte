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
		return {
			destroy() {
				observer.disconnect();
			}
		};
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
				{
					title: 'The inbox never clears',
					body: 'Invoices, scheduling, document chasing, email triage. Rule-based work that eats the hours your best people should be billing.'
				},
				{
					title: 'Drafting from scratch, every time',
					body: 'Proposals, client updates, status emails. Template-shaped but not template-speed. Thirty minutes of manual tweaks, every single one.'
				},
				{
					title: 'Meeting prep is its own meeting',
					body: 'Pre-read, briefing docs, notes, action items. 30–60 minutes per interaction — and most of it goes stale before the next one.'
				},
				{
					title: 'Staying current costs a full day',
					body: 'Industry news, competitor scans, regulatory changes. Hours you would rather spend on client work.'
				}
			]
		},
		accounting: {
			label: 'Accounting / bookkeeping',
			lead: 'Small accounting and bookkeeping firms typically lose time in the same four places.',
			cards: [
				{
					title: 'Client intake and document chasing',
					body: 'Tax documents, 1099s, W-2s, engagement letters. The same intake sequence repeated every season.'
				},
				{
					title: 'Correspondence drafting',
					body: 'IRS notice responses, client updates, engagement letters. Drafted from templates that need refresh.'
				},
				{
					title: 'Meeting prep',
					body: 'Prior-year file review before every client call. 30 to 60 minutes per meeting.'
				},
				{
					title: 'Regulatory research',
					body: 'IRS updates, state rule changes, industry news. Hours that AI can surface in minutes.'
				}
			]
		},
		legal: {
			label: 'Legal',
			lead: 'Small law firms lose hours to the same coordination layer as every other services business.',
			cards: [
				{
					title: 'Conflict checks and matter intake',
					body: 'Same intake questions and conflict searches for every new matter.'
				},
				{
					title: 'Drafting and contract review',
					body: 'Contracts, demand letters, correspondence. Template-based work that still takes hours.'
				},
				{
					title: 'Case and rule research',
					body: 'Jurisdiction-specific rules and case updates. First-pass research AI handles well.'
				},
				{
					title: 'Meeting prep and client updates',
					body: 'Prior-matter review, status summaries, follow-up notes.'
				}
			]
		},
		medical: {
			label: 'Medical / dental',
			lead: 'Medical and dental practices see the same patterns regardless of specialty.',
			cards: [
				{
					title: 'Patient intake and forms',
					body: 'Insurance verification, records transfer, new-patient paperwork.'
				},
				{
					title: 'Scheduling and no-show follow-up',
					body: 'Reminder sequences, reschedules, confirmations.'
				},
				{
					title: 'Post-visit summaries and treatment plans',
					body: 'Drafted from scratch for each patient. Routine structure, detailed content.'
				},
				{
					title: 'Insurance and billing correspondence',
					body: 'Denial follow-ups, claim resubmissions, patient billing questions.'
				}
			]
		},
		trades: {
			label: 'Trades / field services',
			lead: 'HVAC, plumbing, landscaping, electrical. The pattern is more leads than you can answer fast enough.',
			leadsWithSpeed: true,
			cards: [
				{
					title: 'After-hours lead response',
					body: 'Inbound quote requests at 9pm. By 8am the prospect called two competitors.'
				},
				{
					title: 'Quoting turnaround',
					body: 'Site measurement to written quote takes days. Most jobs go to whoever quotes first.'
				},
				{
					title: 'Dispatch and scheduling',
					body: 'Route optimization, job confirmations, reminder calls.'
				},
				{
					title: 'Invoice chase and review requests',
					body: 'Post-job payment follow-up, review asks, customer check-ins.'
				}
			]
		},
		'real-estate': {
			label: 'Real estate',
			lead: 'Real estate agents and teams run on response speed. The slow link is usually admin, not judgement.',
			leadsWithSpeed: true,
			cards: [
				{
					title: 'Lead response and showing requests',
					body: 'Minutes matter. Prospects who get a reply in 5 minutes convert far better than those who wait an hour.'
				},
				{
					title: 'Listing prep and CMA generation',
					body: 'Comparative market analyses, photo coordination, MLS entry.'
				},
				{
					title: 'Client coordination',
					body: 'Document chasing, inspection scheduling, closing coordination.'
				},
				{
					title: 'Listing content and social posts',
					body: 'Listing descriptions, social promos, email blasts.'
				}
			]
		},
		agency: {
			label: 'Marketing / creative agency',
			lead: 'Marketing and creative agencies lose time to internal coordination, not client work.',
			leadsWithSpeed: true,
			cards: [
				{
					title: 'New-business proposals and pitches',
					body: 'Custom decks and scopes drafted from scratch for every lead.'
				},
				{
					title: 'Monthly client reports',
					body: 'Analytics compilation across platforms, narrative write-up, packaging.'
				},
				{
					title: 'Content production cycles',
					body: 'First drafts, revisions, approvals, asset handoff.'
				},
				{
					title: 'Project status and internal syncs',
					body: 'Weekly status docs, PM notes, client-facing summaries.'
				}
			]
		},
		consulting: {
			label: 'Consulting',
			lead: 'Consultancies lose hours to the work around the work: research, reports, follow-ups.',
			cards: [
				{
					title: 'Discovery and scoping',
					body: 'SOWs, kickoff docs, stakeholder interview synthesis.'
				},
				{
					title: 'Recurring deliverables',
					body: 'Weekly status, monthly reports, executive summaries.'
				},
				{ title: 'Research and desk work', body: 'Industry data, competitor scans, benchmarking.' },
				{
					title: 'Meeting prep and notes',
					body: 'Pre-read, agenda, follow-up summaries, action-item tracking.'
				}
			]
		},
		ecommerce: {
			label: 'E-commerce',
			lead: "E-commerce brands lose time to the repeatable work that doesn't ship product.",
			cards: [
				{
					title: 'Customer service triage',
					body: 'Returns, shipping status, sizing, order changes. Mostly the same 15 questions.'
				},
				{
					title: 'Product descriptions and copy',
					body: 'New SKU copy, PDP updates, collection pages.'
				},
				{
					title: 'Email flows and marketing',
					body: 'Welcome series, cart abandonment, post-purchase.'
				},
				{
					title: 'Inventory and reorder alerts',
					body: 'Stock notifications, vendor chase, SKU forecasting.'
				}
			]
		}
	};

	let selectedType = $state<keyof typeof patterns>('generic');
	const currentPattern = $derived(patterns[selectedType]);

	let faqAllOpen = $state(false);
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
			"45-minute assessment of where AI tools fit in a services business and where they shouldn't. Discovery call, written action plan, review call. Talk, Plan, Build.",
		offers: {
			'@type': 'Offer',
			price: '999',
			priceCurrency: 'USD',
			description: '45-minute AI Tools Assessment for services businesses with 10–50 people'
		}
	})}</script>`}
</svelte:head>

<!-- Hero: flat dark, editorial -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="Hero" use:trackHeroExit>
	<!-- Minimal home link: the only navigation escape on this landing page -->
	<a
		href="/"
		class="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 text-sm font-sans font-semibold tracking-tight text-paper/80 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
	>
		DomeWorks<span class="text-accent-light">.</span>
	</a>

	<div
		class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 md:pt-28 pb-14 md:pb-20 flex flex-col gap-12 min-h-[clamp(70svh,80svh,90svh)]"
	>
		<!-- Top: eyebrow (vertical-rule divider avoids dual-eyebrow collision) -->
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
		>
			<span class="text-accent-light">AI Tools Assessment</span>
			<span class="h-3 w-px bg-paper/25" aria-hidden="true"></span>
			<span class="text-paper/65 font-normal tracking-[0.08em]"
				>Services businesses · 10–50 people</span
			>
		</div>

		<!-- Middle: headline + meta aside (meta balances right-half weight on lg+) -->
		<div class="flex-1 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-center">
			<div class="max-w-4xl">
				<h1
					class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
				>
					Stop bleeding hours, leads, revenue.
				</h1>
				<p
					class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/75 max-w-2xl font-normal"
				>
					A 45-minute call. An action plan <strong class="text-accent-light font-medium font-serif"
						>you can start this week</strong
					>. What to install, what to skip.
				</p>
				<p class="mt-4 text-sm text-paper/65 max-w-2xl">
					Ex-DoorDash, Square, Mudflap. I'll handle the AI — you handle your business.
				</p>
				<div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
					<Button href={getAssessmentCallUrl()} size="lg">Book the assessment</Button>
					<a
						href="/quiz/"
						class="text-sm text-paper/85 underline underline-offset-4 hover:text-accent-light transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
					>
						Not ready? Take the 2-min quiz first →
					</a>
				</div>

				<!-- Tablet-only meta row: surfaces trust signals where the vertical aside is hidden (md↔lg). -->
				<div
					class="hidden md:flex lg:hidden flex-wrap items-baseline gap-x-8 gap-y-3 mt-8 pt-6 border-t border-paper/10"
					aria-label="Assessment details"
				>
					<div class="flex items-baseline gap-2">
						<span
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light"
							>Flat fee</span
						>
						<span class="text-sm text-paper/80">$999</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light"
							>Plan in</span
						>
						<span class="text-sm text-paper/80">48 hours</span>
					</div>
				</div>
			</div>

			<!-- Meta aside: balances right-half weight on desktop. Reads as a dateline. -->
			<aside
				class="hidden lg:flex flex-col gap-4 border-l border-paper/15 pl-8 text-[0.6875rem] uppercase tracking-[0.14em] font-semibold self-center"
				aria-label="Assessment details"
			>
				<div>
					<div class="text-accent-light mb-1">Time</div>
					<div class="text-paper/80 font-normal tracking-[0.08em] normal-case text-sm">45 min</div>
				</div>
				<div>
					<div class="text-accent-light mb-1">Flat fee</div>
					<div class="text-paper/80 font-normal tracking-[0.08em] normal-case text-sm">$999</div>
				</div>
				<div>
					<div class="text-accent-light mb-1">Plan in</div>
					<div class="text-paper/80 font-normal tracking-[0.08em] normal-case text-sm">
						48 hours
					</div>
				</div>
			</aside>
		</div>

		<!-- Bottom: stat strip. At <sm we stack rows (number + label inline) so 375px stays legible;
			 at sm+ a 3-col strip. Contrast upgraded from /55 → /75 for small-text AA. -->
		<div
			class="pt-6 border-t border-paper/10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-12"
		>
			<div class="flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1">
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">5–7 hrs</div>
				<div class="text-[0.6875rem] uppercase tracking-[0.12em] text-paper/75 font-medium">
					Recovered / week
				</div>
			</div>
			<div class="flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1">
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">45 min</div>
				<div class="text-[0.6875rem] uppercase tracking-[0.12em] text-paper/75 font-medium">
					Your time
				</div>
			</div>
			<div class="flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1">
				<div class="text-2xl md:text-3xl font-medium tracking-[-0.02em]">48 hrs</div>
				<div class="text-[0.6875rem] uppercase tracking-[0.12em] text-paper/75 font-medium">
					Plan delivered
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Orientation: at-a-glance what this is / who it's for / why me -->
<Section background="muted" padding="md" centered={false}>
	<div>
		<div
			class="hairline-grid on-muted grid md:grid-cols-3"
			use:reveal={{ stagger: true, staggerDelay: 90, duration: 450 }}
		>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">
					What this is
				</p>
				<p class="font-serif text-sm text-muted leading-relaxed mb-3">
					A 45-minute assessment. You walk away with:
				</p>
				<ul class="space-y-2 font-serif text-sm text-muted leading-relaxed">
					<li class="flex items-start gap-2">
						<span class="text-accent flex-shrink-0 mt-0.5">→</span><span
							>Where hours, leads, and revenue are actually leaking</span
						>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-accent flex-shrink-0 mt-0.5">→</span><span
							>The 3–7 AI tools worth installing this week</span
						>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-accent flex-shrink-0 mt-0.5">→</span><span
							>An explicit list of what <em>not</em> to automate</span
						>
					</li>
				</ul>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">
					Who it's for
				</p>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Owner-operated services businesses with 10–50 people. Where staff time is expensive, leads
					go cold, and admin eats the week. Accountants, attorneys, trades, real estate, and similar
					firms.
				</p>
			</div>

			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-3">
					Why me
				</p>
				<p class="font-serif text-sm text-muted leading-relaxed">
					I'll tell you where AI doesn't belong as clearly as where it does. No software reselling,
					no affiliate deals. 15 years at DoorDash, Square, and Mudflap before this, now based in
					Henderson.
				</p>
			</div>
		</div>
	</div>
</Section>

<!-- 01: Where the time goes -->
<Section
	id="where-time-goes"
	background="white"
	padding="md"
	title="Where the time goes"
	centered={false}
>
	<div>
		<div class="max-w-3xl mb-10" use:reveal={{ duration: 400 }}>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Every services business leaks hours, leads, and revenue in the same few places. Pick yours
				to see where it's probably hiding.
			</p>
		</div>

		<!-- Editorial inline dropdown: reads like a published author byline, not a form control.
			 "Show me leaks for [Legal ▾]" — the selected vertical is the sentence verb.
			 Single control at all breakpoints; the sticky bar keeps it in view while cards scroll. -->
		<div
			class="sticky top-0 z-20 bg-paper -mx-6 lg:-mx-8 px-6 lg:px-8 py-5 mb-10 border-b border-rule shadow-[0_1px_0_0_var(--color-rule)]"
		>
			<div class="max-w-3xl mx-auto flex flex-wrap items-baseline gap-x-3 gap-y-2">
				<span class="font-serif text-base md:text-lg text-muted">Show me leaks for</span>
				<label for="biz-type-select" class="sr-only">Your business type</label>
				<div class="relative inline-block">
					<select
						id="biz-type-select"
						bind:value={selectedType}
						class="appearance-none bg-transparent border-0 border-b-2 border-accent text-ink font-sans font-semibold text-xl md:text-2xl leading-tight tracking-tight py-1 pl-0 pr-8 cursor-pointer hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm transition-colors"
					>
						{#each Object.entries(patterns) as [key, p]}
							<option value={key}>{p.label}</option>
						{/each}
					</select>
					<!-- Accent chevron, slightly weighted to read as a pencil mark -->
					<svg
						class="pointer-events-none absolute right-0 top-1/2 -translate-y-[45%] w-5 h-5 text-accent"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>
		</div>

		<div class="max-w-3xl mb-6">
			<p class="font-serif text-sm text-subtle italic">{currentPattern.lead}</p>
		</div>

		<!-- Speed-to-lead callout: locked above cards. Intensity increases when the
			selected vertical leadsWithSpeed. -->
		<div
			class="max-w-5xl mb-6 p-6 rounded-lg border-l-2 {currentPattern.leadsWithSpeed
				? 'bg-accent/[0.14] border-accent'
				: 'bg-accent/[0.1] border-accent/60'}"
		>
			<div class="flex flex-col md:flex-row items-start gap-3 md:gap-5">
				<span
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase flex-shrink-0 md:pt-1 md:w-32"
					>The #1 pattern</span
				>
				<div class="flex-1">
					<h3 class="font-sans font-medium text-ink mb-2">
						Speed-to-lead: inbound response latency
					</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">
						The single highest-value pattern I find in owner-operated businesses. Prospect sends an
						inquiry at 9pm. You see it at 8am. By then they've already called two competitors.
						Cutting that response time from hours to minutes is often worth more than everything
						else on this page combined.
					</p>
				</div>
			</div>
		</div>

		<div
			class="max-w-5xl hairline-grid grid sm:grid-cols-2"
			use:reveal={{ stagger: true, staggerDelay: 80, duration: 420 }}
		>
			{#each currentPattern.cards as card (selectedType + card.title)}
				<div class="cell">
					<h3 class="font-sans font-medium text-ink mb-2">{card.title}</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">{card.body}</p>
				</div>
			{/each}
		</div>
	</div>
</Section>

<!-- 02: What you walk away with -->
<Section background="muted" padding="md" title="What you walk away with" centered={false}>
	<div class="max-w-5xl">
		<div class="mb-10 max-w-3xl" use:reveal={{ duration: 400 }}>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Three phases, fixed scope. A 45-minute <strong class="text-ink font-medium">Talk</strong>, a
				written <strong class="text-ink font-medium">Plan</strong> in 48 hours, and — if you want
				hands-on implementation — an optional <strong class="text-ink font-medium">Build</strong>.
				Two 45-minute calls across the whole process; everything in between is on me.
			</p>
		</div>

		<div
			class="hairline-grid on-muted grid md:grid-cols-3"
			use:reveal={{ stagger: true, staggerDelay: 120, duration: 500, delay: 100 }}
		>
			<div class="cell flex flex-col">
				<!-- Icon: chat-bubble (Heroicons outline) — subtle visual anchor, accent color -->
				<svg
					class="w-7 h-7 text-accent mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
					/></svg
				>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Talk
				</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">The discovery call</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					A 45-minute conversation about how your business actually runs day to day. Where time gets
					stuck, what you've tried, what you dread. You talk. I take notes. No pitch.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45 minutes. One call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<!-- Icon: document-text (Heroicons outline) -->
				<svg
					class="w-7 h-7 text-accent mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/></svg
				>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Plan
				</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">The written action plan</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					Delivered in 48 hours. The 3–7 AI tools worth installing this week, an explicit list of
					what <em>not</em> to automate, and financial impact in hours and dollars. Yours to use — implement
					on your own or hand it to your team.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45-minute review call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
				<!-- Icon: wrench-screwdriver (Heroicons outline) — optional phase -->
				<svg
					class="w-7 h-7 text-accent mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					aria-hidden="true"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
					/></svg
				>
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Build <span class="text-subtle font-normal normal-case tracking-normal">— optional</span>
				</p>
				<h3 class="font-sans font-medium text-xl text-ink mb-3">Hands-on implementation</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					If you want implementation rather than a self-serve roadmap, I embed for a fixed-scope
					engagement. I build the systems, train the staff who'll actually use them, and handle the
					change-resistance that always comes with new tools. You keep what I build.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Priced separately. Zero obligation from the Assessment.</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 03: What I won't automate — honesty gate -->
<Section background="white" padding="md" title="What I won't tell you to automate" centered={false}>
	<div class="max-w-5xl">
		<div class="mb-10 max-w-3xl" use:reveal={{ duration: 400 }}>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Half the value of this Assessment is the workflows I tell you to leave alone. AI is the
				wrong tool in more places than most consultants will admit. Here's where I'll push back.
			</p>
		</div>

		<div
			class="hairline-grid grid sm:grid-cols-2 lg:grid-cols-4"
			use:reveal={{ stagger: true, staggerDelay: 70, duration: 420 }}
		>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Don't automate
				</p>
				<h3 class="font-sans font-medium text-ink mb-2">Your sales motion</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Automated outbound cold sequences destroy more trust than they generate. If anything, your
					sales motion needs more human attention, not less. I'll be the first to say so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Don't automate
				</p>
				<h3 class="font-sans font-medium text-ink mb-2">Broken processes</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					If clients are unhappy or staff is burned out, AI on top only speeds up the problem. Fix
					the process first. I'll tell you so.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Don't automate
				</p>
				<h3 class="font-sans font-medium text-ink mb-2">Human-judgement work</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Client calls, review that requires context, exception handling, anything where your
					reputation is on the line. These stay human. That's your edge.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Don't automate
				</p>
				<h3 class="font-sans font-medium text-ink mb-2">Low-volume tasks</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					If the task happens twice a month, the setup cost of automating it is higher than the time
					you'd save. Keep it manual. I'll say so.
				</p>
			</div>
		</div>

		<div class="mt-8 p-5 bg-accent/[0.1] border-l-2 border-accent/60 rounded-lg max-w-4xl">
			<p class="font-serif text-sm text-muted leading-relaxed">
				<strong class="font-sans font-semibold text-ink"
					>If the honest answer is "don't use AI here," I'll say so on the call.</strong
				> If the honest answer is "hire the person you were going to hire," I'll say so. The action plan
				you walk away with reflects what I actually found, not what I'm paid to recommend.
			</p>
		</div>
	</div>
</Section>

<!-- 04: The math -->
<Section background="muted" padding="md" title="The math" centered={false}>
	<div>
		<div
			class="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
			use:reveal={{ stagger: true, staggerDelay: 180, duration: 550 }}
		>
			<div>
				<p
					class="font-sans font-semibold text-[clamp(3rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink"
					aria-label="Five to seven hours per week"
				>
					5–7 hours<span class="text-accent">/</span><span class="text-subtle">week</span>
				</p>
				<p class="font-serif text-muted mt-3 text-lg">recovered per person, on average</p>
			</div>
			<div class="space-y-5">
				<div class="rule-left-accent">
					<p class="font-serif text-lg text-muted leading-relaxed">
						For a team where staff time is worth $50–$200/hour loaded, that's
						<strong class="font-sans font-semibold text-ink">$250–$1,400 per person per week</strong
						>
						in recovered capacity, or the ability to take on more clients without adding headcount. Most
						teams land around
						<strong class="font-sans font-semibold text-ink">$600–$800 per person per week</strong>.
					</p>
					<p class="font-serif text-sm text-subtle mt-3">
						Your own hours count too — and those are usually the most expensive.
					</p>
					<p class="font-serif text-sm text-muted mt-4 pt-4 border-t border-rule">
						The tools cost $30–$80/month in aggregate. Most teams recoup the $999 within the first
						week of implementation.
					</p>
				</div>
			</div>
		</div>

		<!-- Guarantee — hairline callout, not a button. Matches #1-pattern vocabulary. -->
		<div class="mt-12 max-w-3xl" use:reveal={{ duration: 450, delay: 150 }}>
			<div class="rule-left-accent py-1">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-accent mb-1">
					30-day guarantee
				</p>
				<p class="font-serif text-lg text-ink leading-snug">
					Save 5+ hours/week within 30 days, or I refund the $999.
					<span class="text-subtle">No questions asked.</span>
				</p>
			</div>
		</div>
	</div>
</Section>

<!-- Mid-page CTA: catches buy-signal after the math before qualifying sections -->
<section class="bg-paper border-y border-rule-strong" aria-label="Book assessment">
	<div
		class="max-w-5xl mx-auto px-6 lg:px-8 py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
	>
		<div class="flex-1">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
				Seen enough of the math?
			</p>
			<p class="font-sans text-lg md:text-xl font-medium text-ink leading-snug">
				Book the $999 Assessment. Written plan in 48 hours. Refund if it doesn't pay.
			</p>
		</div>
		<div class="flex items-center gap-5 flex-shrink-0">
			<Button href={getAssessmentCallUrl()} size="md">Book the assessment</Button>
			<a
				href="#common-questions"
				class="text-sm text-muted underline underline-offset-4 decoration-accent/60 hover:text-ink hover:decoration-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
			>
				Questions first →
			</a>
		</div>
	</div>
</section>

<!--
	Proof — uncomment and fill in when a real, attributable testimonial is available.
	Placement here is intentional: after "The math" (claim) → proof (evidence) → "Right fit" (qualify).
	Needs: 2–3 sentence quote with a specific outcome (hours/week, lead speed, revenue), name, title, firm.

<Section background="white" padding="md">
	<div class="max-w-3xl mx-auto" use:reveal>
		<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-6 text-center">
			What this looked like for one firm
		</p>
		<blockquote class="rule-left-accent">
			<p class="font-serif text-xl md:text-2xl text-ink leading-[1.45]">
				TODO — drop real 2–3 sentence testimonial here.
			</p>
			<footer class="mt-4">
				<p class="font-sans font-medium text-sm text-ink">— TODO Name, TODO Title</p>
				<p class="font-sans text-xs text-subtle mt-0.5">TODO Firm · TODO Vertical · TODO Size</p>
			</footer>
		</blockquote>
	</div>
</Section>
-->

<!-- 05: Right fit / Not a fit -->
<Section background="white" padding="md" title="Is this the right fit?" centered={false}>
	<div class="max-w-5xl">
		<div
			class="hairline-grid grid md:grid-cols-2"
			use:reveal={{ stagger: true, staggerDelay: 120, duration: 460 }}
		>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-4">
					Right fit if you
				</p>
				<ul class="space-y-3 font-serif text-sm text-muted leading-relaxed">
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
						<span
							>Run on software your team mostly likes (QuickBooks, HubSpot, your job-management or
							practice-management system).</span
						>
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
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-4">
					Not a fit if you
				</p>
				<ul class="space-y-3 font-serif text-sm text-muted leading-relaxed">
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span
							>Want a tool list without spending 45 minutes on how your business actually works.</span
						>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span>Want software resold or managed. I don't do either.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span
							>Have a process broken at the client, vendor, or staffing level. AI won't fix a human
							problem.</span
						>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span
							>Want a "transformation" or a six-figure roadmap. I do small, specific, measurable.</span
						>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans font-semibold">✕</span>
						<span
							>Have no core software or repeatable process yet. Start there, then come back.</span
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Section>

<!-- 06: Who's behind this -->
<Section background="muted" padding="md" title="Who's behind this" centered={false}>
	<div class="max-w-4xl">
		<div
			class="grid md:grid-cols-3 gap-10 items-start"
			use:reveal={{ stagger: true, staggerDelay: 160, duration: 500 }}
		>
			<div class="md:col-span-2 space-y-5 font-serif text-lg text-muted leading-relaxed">
				<!-- Photo: drop a 400×400 portrait at /static/piers.jpg. The figure self-hides
					 (onerror → display:none on its parent) until the file exists. -->
				<figure class="float-left mr-6 mb-3 md:mr-7 md:mb-2 w-32 md:w-40 shrink-0">
					<img
						src="/piers.jpg"
						alt="Piers Rollinson"
						width="160"
						height="160"
						class="block w-full aspect-square object-cover rounded-sm border border-rule-strong grayscale-[15%]"
						loading="lazy"
						onerror={(e) => {
							const fig = (e.currentTarget as HTMLElement).closest('figure');
							if (fig) fig.style.display = 'none';
						}}
					/>
				</figure>
				<p>
					I'm <strong class="font-sans font-semibold text-ink">Piers Rollinson</strong>. Fifteen
					years at DoorDash, Square, and Mudflap building systems that move millions of orders,
					payments, and drivers. The same thinking that lands 10 million orders correctly at
					DoorDash lands 100 client intakes correctly at a 12-person firm.
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
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">
						Previously
					</p>
					<p class="font-sans text-sm text-ink font-medium">DoorDash, Square, Mudflap</p>
				</div>
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">
						Focus
					</p>
					<p class="font-sans text-sm text-ink font-medium">AI for services firms</p>
				</div>
				<div class="rule-left-accent-sm">
					<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-1">
						Based in
					</p>
					<p class="font-sans text-sm text-ink font-medium">Henderson, NV</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 07: FAQ -->
<Section
	id="common-questions"
	background="white"
	padding="md"
	title="Common questions"
	centered={false}
>
	<div class="max-w-3xl" use:reveal={{ duration: 400 }}>
		<div class="flex justify-end mb-3">
			<button
				type="button"
				onclick={() => (faqAllOpen = !faqAllOpen)}
				class="inline-flex items-center min-h-[44px] px-3.5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase text-muted hover:text-accent transition-colors underline underline-offset-4 decoration-accent/60 hover:decoration-accent rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
				aria-expanded={faqAllOpen}
			>
				{faqAllOpen ? 'Collapse all' : 'Expand all'}
			</button>
		</div>
		<div class="border-t border-rule-strong">
			{#each [{ q: "What if I've already tried AI and it didn't stick?", a: 'Common — most owners have dabbled with ChatGPT or tried a tool their accountant mentioned, and not much changed. The difference here is specificity. You walk away with a written plan tied to specific workflows in your business, not a generic "try AI" suggestion. And if the honest answer is "you tried the right thing, it just needs better prompts," I\'ll say so.' }, { q: 'What if the honest answer is "don\'t use AI for that"?', a: "That's half the value. The action plan explicitly flags workflows where AI is the wrong tool — broken processes, human-judgement work, low-volume tasks. I'll also tell you if the honest answer is \"hire the person you were going to hire anyway.\" No pretending AI solves problems it doesn't." }, { q: 'What does this cost?', a: "$999 flat. Includes the 45-minute call, written action plan, and review call. If you don't find the Assessment valuable, I'll refund you — no conditions. There's no upsell during the Assessment and no obligation to hire me afterward." }, { q: 'What do I need to prepare?', a: "Nothing. You don't need to know AI — that's my job. Just show up ready to talk about how your business actually works day-to-day. I'll ask the questions. No homework, no intake forms." }, { q: 'Who will I be on the call with?', a: "Me. Every call, every action plan, every build. No junior consultants, no handoffs. If you hire me for the Build phase, I'm still the one doing the work." }, { q: 'Do you sell software?', a: "No. The action plan recommends existing tools — things like ChatGPT, Claude, Dext, Karbon — whatever fits your workflow. I don't resell software and I have no affiliate deals. The recommendations are genuinely neutral." }, { q: 'How long until I get the action plan?', a: 'Within 48 hours of the discovery call. The review call happens shortly after, at a time that works for you. Total calendar time from first call to final action plan: about one week.' }, { q: 'What happens after the Assessment?', a: "That's entirely up to you. Many owners implement on their own — the action plan is designed for that. If you want hands-on help, we can talk about the Build phase. Fixed-scope engagements typically run $3K–$15K depending on what we're building. Zero pressure either way." }] as faq, i}
				<details class="group border-b border-rule py-5" open={faqAllOpen || i === 0}>
					<summary
						class="flex items-center justify-between cursor-pointer list-none font-sans font-medium text-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						{faq.q}
						<svg
							class="w-5 h-5 text-ink/40 transition-transform duration-200 group-open:rotate-180 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2"
							><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg
						>
					</summary>
					<p class="mt-3 font-serif text-muted leading-relaxed">
						{faq.a}
					</p>
				</details>
			{/each}
		</div>
	</div>
</Section>

<!-- Dark CTA footer -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="Book your Assessment">
	<div
		class="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-24"
		use:reveal={{ duration: 500 }}
	>
		<!-- What comes next -->
		<div class="grid sm:grid-cols-2 gap-5 mb-14">
			<div class="p-5 rounded-lg border border-paper/10 bg-paper/[0.04]">
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-2"
				>
					After Talk + Plan
				</p>
				<h3 class="font-sans font-medium text-paper mb-1.5">Implement on your own</h3>
				<p class="font-serif text-sm text-paper/75 leading-relaxed">
					The action plan includes specific tool recommendations and a quick-start sequence. Many
					owners take it and run. That's the whole point.
				</p>
			</div>
			<div class="p-5 rounded-lg border border-paper/10 bg-paper/[0.04]">
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-2"
				>
					Or add the Build phase
				</p>
				<h3 class="font-sans font-medium text-paper mb-1.5">I embed and build it</h3>
				<p class="font-serif text-sm text-paper/75 leading-relaxed">
					I build the systems, train your team, and hand off working infrastructure. Fixed scope.
					You keep what I build.
				</p>
			</div>
		</div>

		<!-- Primary CTA -->
		<div class="text-center">
			<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-4">
				Ready when you are
			</p>
			<h2 class="font-sans font-semibold text-3xl md:text-4xl text-paper mb-3 tracking-[-0.025em]">
				Stop bleeding. Start this week.
			</h2>
			<p class="text-paper/80 mb-2">$999 flat. 45-minute call. Written action plan in 48 hours.</p>
			<p class="text-sm text-paper/70 mb-10">
				If you don't find the Assessment valuable, I'll refund you. No questions asked.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href={getAssessmentCallUrl()} size="lg">Book the $999 assessment</Button>
				<a
					href="mailto:piers@domeworks.tech?subject=AI%20Tools%20Assessment%20question"
					class="text-sm text-paper/80 hover:text-accent-light transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
				>
					Or email a question first
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Sticky mobile CTA -->
{#if showStickyCta}
	<div
		class="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-paper/10 px-4 py-3 flex items-center justify-between gap-3"
		role="complementary"
		aria-label="Book Assessment"
	>
		<p class="text-sm text-paper/70 truncate font-sans">45-min AI assessment</p>
		<Button href={getAssessmentCallUrl()} size="sm">Book it</Button>
	</div>
{/if}
