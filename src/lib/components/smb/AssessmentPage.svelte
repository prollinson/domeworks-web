<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getAssessmentCallUrl } from '$lib/utils/mailto';
	import { fade } from 'svelte/transition';
	import { untrack } from 'svelte';
	import type { Campaign, Vertical } from '$lib/data/smb-campaigns';

	let { campaign }: { campaign: Campaign } = $props();

	const ctaUrl = $derived(campaign.ctaUrl ?? getAssessmentCallUrl());

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

	const basePatterns: Record<Vertical, Pattern> = {
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
					title: 'Staying current costs a day',
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
		},
		insurance: {
			label: 'Insurance / brokers',
			lead: 'Independent agencies lose the week to the coordination layer — quotes, endorsements, renewals, and claims chase.',
			leadsWithSpeed: true,
			cards: [
				{
					title: 'Quote turnaround',
					body: 'Carrier portals, form re-entry across appetites, manual comparisons. Hours between quote request and bind — and the fastest agent usually wins.'
				},
				{
					title: 'Renewal outreach and re-shopping',
					body: '60–90 days before each renewal: pull loss runs, re-quote, format the comparison. Same motion every week, every month.'
				},
				{
					title: 'Policy correspondence',
					body: 'Binder letters, endorsement confirmations, certificates of insurance. Templated but still drafted by hand.'
				},
				{
					title: 'Claims chase and status updates',
					body: 'Adjuster coordination, document chasing, client updates. Everyone waiting on someone; you are the one tracking it.'
				}
			]
		},
		mortgage: {
			label: 'Mortgage broker / lending',
			lead: 'Brokers lose the week to document chasing, lender-portal re-keying, the compliance trail, and pipeline follow-up.',
			cards: [
				{
					title: 'Client document collection',
					body: 'Payslips, tax returns, trust docs, bank statements. Multiple touches to get the full pack. Files stall here more than anywhere else.'
				},
				{
					title: 'Lender submission prep',
					body: 'Different portal, different format, same data re-keyed. Painful the first time, painful the tenth — especially with 2–3 lenders in parallel.'
				},
				{
					title: 'Compliance and best-interests trail',
					body: 'Why this lender, why this product, what you discussed. Documented in five places, audited from none.'
				},
				{
					title: 'Pipeline chase — conditional to settlement',
					body: 'Valuations, conditions, solicitors, clients. Everyone is waiting on someone; you are the only one tracking what is actually stuck.'
				}
			]
		}
	};

	// Apply per-campaign patternOverride on top of the base pattern for its vertical.
	const patterns = $derived.by(() => {
		const v = campaign.vertical ?? 'generic';
		const override = campaign.patternOverride;
		if (!override) return basePatterns;
		const base = basePatterns[v];
		return {
			...basePatterns,
			[v]: {
				label: override.label ?? base.label,
				lead: override.lead ?? base.lead,
				leadsWithSpeed: override.leadsWithSpeed ?? base.leadsWithSpeed,
				cards: override.cards ?? base.cards
			}
		};
	});

	// Seed from prop once; user interactions with the dropdown override it afterward.
	let selectedType = $state<Vertical>(untrack(() => campaign.vertical ?? 'generic'));

	// Lock the vertical picker on any campaign that's already committed to a
	// non-generic audience. Explicit override on the campaign wins.
	const lockVertical = $derived(
		campaign.lockVertical ?? (campaign.vertical != null && campaign.vertical !== 'generic')
	);
	const currentPattern = $derived(patterns[selectedType]);
	const patternEntries = $derived(
		Object.entries(patterns) as Array<[Vertical, Pattern]>
	);

	let faqAllOpen = $state(false);

	// Custom business-type dropdown (listbox pattern).
	let dropdownOpen = $state(false);
	let activeIndex = $state(0);
	let triggerEl: HTMLButtonElement | null = $state(null);
	let panelEl: HTMLDivElement | null = $state(null);

	function openDropdown() {
		activeIndex = patternEntries.findIndex(([k]) => k === selectedType);
		if (activeIndex < 0) activeIndex = 0;
		dropdownOpen = true;
		queueMicrotask(() => panelEl?.focus());
	}

	function closeDropdown(returnFocus = true) {
		dropdownOpen = false;
		if (returnFocus) queueMicrotask(() => triggerEl?.focus());
	}

	function selectOption(key: Vertical) {
		selectedType = key;
		closeDropdown();
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openDropdown();
		}
	}

	function handlePanelKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeDropdown();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % patternEntries.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + patternEntries.length) % patternEntries.length;
		} else if (e.key === 'Home') {
			e.preventDefault();
			activeIndex = 0;
		} else if (e.key === 'End') {
			e.preventDefault();
			activeIndex = patternEntries.length - 1;
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			selectOption(patternEntries[activeIndex][0]);
		} else if (e.key === 'Tab') {
			closeDropdown(false);
		}
	}

	function handleDocumentClick(e: MouseEvent) {
		if (!dropdownOpen) return;
		const target = e.target as Node;
		if (triggerEl?.contains(target) || panelEl?.contains(target)) return;
		dropdownOpen = false;
	}

	$effect(() => {
		if (!dropdownOpen) return;
		document.addEventListener('mousedown', handleDocumentClick);
		return () => document.removeEventListener('mousedown', handleDocumentClick);
	});

	// Hero copy — campaign overrides with sensible defaults.
	const heroEyebrow = $derived(campaign.heroEyebrow ?? 'AI Tools Assessment');
	const heroMeta = $derived(campaign.heroMeta ?? 'Services businesses · 10–50 people');
	const heroHeadline = $derived(
		campaign.heroHeadline ?? "AI you'll actually use. A day a week back within 30 days."
	);
	const heroSubhead = $derived(
		campaign.heroSubhead ??
			'A 45-minute call. An action plan <strong class="text-accent-light font-medium font-serif">you can start this week</strong>. What to install, what to skip.'
	);
	const heroKicker = $derived(
		campaign.heroKicker ?? "Ex-DoorDash, Square, Mudflap. I'll handle the AI — you handle your business."
	);
</script>

<!-- Hero: merged with Orientation. Promise + meta live in the right aside on lg+;
	 stack under the CTAs on smaller breakpoints. Stat strip removed. -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="Hero" use:trackHeroExit>
	<a
		href="/"
		class="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 text-sm font-sans font-semibold tracking-tight text-paper/80 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
	>
		DomeWorks<span class="text-accent-light">.</span>
	</a>

	<div
		class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 md:pt-28 pb-16 md:pb-20 flex flex-col gap-10 md:gap-12 min-h-[clamp(80svh,88svh,100svh)]"
	>
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
		>
			<span class="text-accent-light">{heroEyebrow}</span>
			<span class="h-3 w-px bg-paper/25" aria-hidden="true"></span>
			<span class="text-paper/75 font-normal tracking-[0.08em]">{heroMeta}</span>
		</div>

		<!-- Two-column body: left = argument; right = promise + meta (lg+). Stacks on <lg. -->
		<div
			class="flex-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] gap-10 lg:gap-20 items-center"
		>
			<div class="max-w-3xl">
				<h1
					class="font-sans font-semibold text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em]"
				>
					{heroHeadline}
				</h1>
				<p
					class="mt-6 font-serif text-xl md:text-2xl leading-[1.55] text-paper/80 max-w-2xl font-normal"
				>
					{@html heroSubhead}
				</p>
				<p class="mt-4 text-sm text-paper/75 max-w-2xl">
					{heroKicker}
				</p>
				<div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
					<Button href={ctaUrl} size="lg">Book the assessment</Button>
					<a
						href="/smb/quiz/"
						class="text-sm text-paper/85 underline underline-offset-4 hover:text-accent-light transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
					>
						Not ready? Take the 2-min quiz first →
					</a>
				</div>

				<!-- Tablet-only meta row: restores trust signals where the vertical aside is hidden (md↔lg). -->
				<div
					class="hidden md:flex lg:hidden flex-wrap items-baseline gap-x-8 gap-y-3 mt-8 pt-6 border-t border-paper/10"
					aria-label="Assessment details"
				>
					<div class="flex items-baseline gap-2">
						<span
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light"
							>45 min</span
						>
						<span class="text-sm text-paper/75">your time</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light"
							>$999</span
						>
						<span class="text-sm text-paper/75">flat fee</span>
					</div>
					<div class="flex items-baseline gap-2">
						<span
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light"
							>48 hours</span
						>
						<span class="text-sm text-paper/75">plan delivered</span>
					</div>
				</div>
			</div>

			<!-- Right aside: promise (three outcomes) + meta. On <lg this becomes a stacked block
				 with a top border so it reads as a distinct deliverable summary. -->
			<aside
				class="lg:border-l lg:border-paper/15 lg:pl-10 border-t border-paper/10 pt-10 lg:pt-0 lg:border-t-0 md:hidden lg:block"
				aria-label="What you walk away with"
			>
				<p
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-5"
				>
					You walk away with
				</p>
				<ul
					class="space-y-3.5 font-serif text-base md:text-[1.0625rem] leading-[1.45] text-paper/90"
				>
					<li class="flex gap-3">
						<span class="text-paper/40 flex-shrink-0 select-none" aria-hidden="true">—</span>
						<span>Where hours, leads, and revenue are leaking</span>
					</li>
					<li class="flex gap-3">
						<span class="text-paper/40 flex-shrink-0 select-none" aria-hidden="true">—</span>
						<span>The 3–7 AI tools worth installing this week</span>
					</li>
					<li class="flex gap-3">
						<span class="text-paper/40 flex-shrink-0 select-none" aria-hidden="true">—</span>
						<span
							>An explicit list of what <em class="not-italic text-paper">not</em> to automate</span
						>
					</li>
				</ul>
				<dl class="mt-8 pt-6 border-t border-paper/15 grid grid-cols-3 gap-4 text-sm">
					<div>
						<dt
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light mb-1"
						>
							Time
						</dt>
						<dd class="text-paper/85">45 min</dd>
					</div>
					<div>
						<dt
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light mb-1"
						>
							Flat fee
						</dt>
						<dd class="text-paper/85">$999</dd>
					</div>
					<div>
						<dt
							class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-light mb-1"
						>
							Plan in
						</dt>
						<dd class="text-paper/85">48 hours</dd>
					</div>
				</dl>
			</aside>
		</div>
	</div>
</section>

<!-- 01: Where the time goes -->
<Section
	id="where-time-goes"
	background="white"
	padding="md"
	eyebrow="01"
	title="Where the time goes"
	centered={false}
>
	<div>
		{#if !lockVertical}
			<div class="max-w-3xl mb-10" use:reveal={{ duration: 400 }}>
				<p class="font-serif text-lg text-muted leading-relaxed">
					Every services business leaks hours, leads, and revenue in the same few places. Pick yours
					to see where it's probably hiding.
				</p>
			</div>

			<!-- Editorial inline dropdown: reads like a published author byline, not a form control.
				 Sticky at md+ (keeps selector in view while cards scroll); inline on mobile to avoid
				 stacking with the bottom-fixed CTA bar. -->
			<div
				class="md:sticky md:top-0 z-20 bg-paper -mx-6 lg:-mx-8 px-6 lg:px-8 py-5 mb-10 border-b border-rule md:shadow-[0_1px_0_0_var(--color-rule)]"
			>
				<div class="max-w-3xl mx-auto flex flex-wrap items-baseline gap-x-3 gap-y-2">
					<span
						id="biz-type-label"
						class="hidden sm:inline font-serif text-base md:text-lg text-muted">Show me leaks for</span
					>
					<div class="relative inline-block">
						<button
							bind:this={triggerEl}
							type="button"
							onclick={() => (dropdownOpen ? closeDropdown(false) : openDropdown())}
							onkeydown={handleTriggerKeydown}
							aria-haspopup="listbox"
							aria-expanded={dropdownOpen}
							aria-labelledby="biz-type-label"
							class="group flex items-center gap-2 bg-transparent border-0 border-b-2 border-accent text-ink font-sans font-semibold text-xl md:text-2xl leading-tight tracking-tight py-1 pr-1 cursor-pointer hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm transition-colors"
						>
							<span>{currentPattern.label}</span>
							<svg
								class="w-5 h-5 text-accent transition-transform duration-200 {dropdownOpen
									? 'rotate-180'
									: ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if dropdownOpen}
							<div
								bind:this={panelEl}
								role="listbox"
								tabindex="-1"
								aria-labelledby="biz-type-label"
								aria-activedescendant={`biz-type-opt-${patternEntries[activeIndex]?.[0]}`}
								onkeydown={handlePanelKeydown}
								transition:fade={{ duration: 120 }}
								class="absolute left-0 top-full mt-2 z-40 min-w-[260px] max-h-[min(60vh,24rem)] overflow-y-auto rounded-md border border-rule-strong bg-paper py-2 shadow-lg shadow-ink/10 focus:outline-none"
							>
								{#each patternEntries as [key, p], i (key)}
									{@const isSelected = key === selectedType}
									{@const isActive = i === activeIndex}
									<button
										id={`biz-type-opt-${key}`}
										type="button"
										role="option"
										aria-selected={isSelected}
										tabindex="-1"
										onclick={() => selectOption(key)}
										onmousemove={() => (activeIndex = i)}
										class="w-full flex items-center gap-3 px-4 py-2.5 text-left font-sans text-base cursor-pointer transition-colors {isActive
											? 'bg-accent/10 text-accent'
											: 'text-ink'} {isSelected ? 'font-semibold' : 'font-normal'}"
									>
										<svg
											class="w-4 h-4 flex-shrink-0 text-accent transition-opacity {isSelected
												? 'opacity-100'
												: 'opacity-0'}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											stroke-width="3"
											aria-hidden="true"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
										</svg>
										<span>{p.label}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<div class="max-w-3xl mb-6" use:reveal={{ duration: 400 }}>
			<p
				class="font-serif text-muted leading-relaxed {lockVertical ? 'text-lg' : 'text-sm'}"
			>{currentPattern.lead}</p>
		</div>

		<!-- Speed-to-lead callout: locked above cards. Intensity increases when the
			selected vertical leadsWithSpeed. -->
		<div
			class="max-w-5xl mb-6 p-6 rounded-lg border-l-2 {currentPattern.leadsWithSpeed
				? 'bg-accent/[0.18] border-accent'
				: 'bg-accent/[0.06] border-accent/60'}"
		>
			<div class="flex flex-col md:flex-row items-baseline gap-2 md:gap-5">
				<span
					class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase flex-shrink-0"
					>The #1 pattern</span
				>
				<div class="flex-1">
					<h3 class="font-sans font-medium text-xl md:text-2xl text-ink mb-2 tracking-tight">
						Speed-to-lead: inbound response latency
					</h3>
					<p class="font-serif text-muted leading-relaxed">
						Prospect sends an inquiry at 9pm. You see it at 8am. By then they've already called two
						competitors. Cutting that lag from hours to minutes is often worth more than everything
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
					<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">{card.title}</h3>
					<p class="font-serif text-sm text-muted leading-relaxed">{card.body}</p>
				</div>
			{/each}
		</div>
	</div>
</Section>

<!-- 02: What I won't tell you to automate (moved up — the honesty gate is the differentiator) -->
<Section
	background="muted"
	padding="md"
	eyebrow="02"
	title="What I won't tell you to automate"
	centered={false}
>
	<div class="max-w-5xl">
		<div class="mb-10 max-w-3xl" use:reveal={{ duration: 400 }}>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Half the value of this Assessment is the workflows I tell you to leave alone. Here's where
				I'll push back.
			</p>
		</div>

		<!-- Card kickers demoted to subtle (informational). Closing callout carries the accent emphasis. -->
		<div
			class="hairline-grid on-muted grid sm:grid-cols-2 lg:grid-cols-4"
			use:reveal={{ stagger: true, staggerDelay: 70, duration: 420 }}
		>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Cold outbound
				</p>
				<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
					Your sales motion
				</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Automated cold sequences destroy more trust than they generate. Your sales motion needs
					more human attention, not less.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Process first
				</p>
				<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">Broken processes</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					If clients are unhappy or staff is burned out, AI on top only speeds up the problem. Fix
					the process first.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Judgment call
				</p>
				<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">
					Human-judgement work
				</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					Client calls, review that requires context, anything where your reputation is on the line.
					These stay human. That's your edge.
				</p>
			</div>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Low volume
				</p>
				<h3 class="font-sans font-medium text-lg text-ink mb-2 tracking-tight">Low-volume tasks</h3>
				<p class="font-serif text-sm text-muted leading-relaxed">
					If the task happens twice a month, setup cost is higher than the time you'd save. Keep it
					manual.
				</p>
			</div>
		</div>

		<div class="mt-8 p-5 bg-accent/[0.1] border-l-2 border-accent/60 rounded-lg max-w-4xl">
			<p class="font-serif text-sm text-muted leading-relaxed">
				<strong class="font-sans font-semibold text-ink"
					>If the honest answer is "don't use AI here," I'll say so on the call.</strong
				> If the honest answer is "hire the person you were going to hire," I'll say so.
			</p>
		</div>
	</div>
</Section>

<!-- 03: How it works (formerly "What you walk away with" — renamed to distinguish from hero promise) -->
<Section background="white" padding="md" eyebrow="03" title="How it works" centered={false}>
	<div class="max-w-5xl">
		<div class="mb-10 max-w-3xl" use:reveal={{ duration: 400 }}>
			<p class="font-serif text-lg text-muted leading-relaxed">
				Three phases, fixed scope. A 45-minute <strong class="text-ink font-medium">Talk</strong>, a
				written <strong class="text-ink font-medium">Plan</strong> in 48 hours, and — optional — a
				hands-on <strong class="text-ink font-medium">Build</strong>.
			</p>
		</div>

		<!-- Phase eyebrows retain accent (they're the section's single emphasis — the three-beat spine). -->
		<div
			class="hairline-grid grid md:grid-cols-3"
			use:reveal={{ stagger: true, staggerDelay: 120, duration: 500, delay: 100 }}
		>
			<div class="cell flex flex-col">
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
				<h3 class="font-sans font-medium text-xl text-ink mb-3 tracking-tight">
					The discovery call
				</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					A 45-minute conversation about how your business actually runs. You talk. I take notes. No
					pitch.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45 minutes. One call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
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
				<h3 class="font-sans font-medium text-xl text-ink mb-3 tracking-tight">
					The written action plan
				</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					Delivered in 48 hours. The 3–7 tools worth installing, an explicit list of what <em
						>not</em
					> to automate, and financial impact in hours and dollars.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Your time: 45-minute review call.</p>
				</div>
			</div>

			<div class="cell flex flex-col">
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
				<h3 class="font-sans font-medium text-xl text-ink mb-3 tracking-tight">
					Hands-on implementation
				</h3>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					If you want implementation rather than a self-serve roadmap, I embed for a fixed-scope
					engagement. You keep what I build.
				</p>
				<div class="mt-auto pt-4 border-t border-rule">
					<p class="text-xs text-subtle">Priced separately. Zero obligation.</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 04: The math -->
<Section background="muted" padding="md" eyebrow="04" title="The math" centered={false}>
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
						in recovered capacity. Most teams land around
						<strong class="font-sans font-semibold text-ink">$600–$800 per person per week</strong>.
					</p>
					<p class="font-serif text-sm text-muted mt-4 pt-4 border-t border-rule">
						Tools cost $30–$80/month in aggregate. Most teams recoup the $999 within the first week
						of implementation.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-12 max-w-3xl" use:reveal={{ duration: 450, delay: 150 }}>
			<div class="rule-left-accent py-1">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-accent mb-1">
					30-day guarantee
				</p>
				<p class="font-serif text-xl text-ink leading-snug">
					Save 5+ hours/week within 30 days, or I refund the $999.
					<span class="text-subtle">No questions asked.</span>
				</p>
			</div>
		</div>
	</div>
</Section>

<!-- Shape-break pull-quote: the thesis as editorial. Pivots from claim (math) to qualify (right fit).
	 Replaces the mid-page peach CTA band; conversions still run via hero, FAQ sidebar, and dark footer. -->
<section class="bg-paper border-y border-rule" aria-label="Thesis">
	<div class="max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-28" use:reveal={{ duration: 500 }}>
		<blockquote>
			<p
				class="font-serif text-[clamp(1.625rem,3.6vw,2.625rem)] leading-[1.18] text-ink tracking-[-0.015em]"
			>
				"I'll tell you where AI doesn't belong as clearly as where it does. No software reselling,
				no affiliate deals."
			</p>
			<footer class="mt-7 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-subtle">
				— The point of the Assessment
			</footer>
		</blockquote>
	</div>
</section>

<!-- 05: Right fit / Not a fit.
	 ✓ column gets copper kicker and slightly heavier body — reads inviting.
	 ✕ column gets subtle kicker and quieter body — reads as a quiet wall. -->
<Section
	background="white"
	padding="md"
	eyebrow="05"
	title="Is this the right fit?"
	centered={false}
>
	<div class="max-w-5xl">
		<div
			class="hairline-grid grid md:grid-cols-2"
			use:reveal={{ stagger: true, staggerDelay: 120, duration: 460 }}
		>
			<div class="cell">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-4">
					Right fit if you
				</p>
				<ul class="space-y-3 font-serif text-[0.9375rem] text-ink/85 leading-relaxed">
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
				<ul class="space-y-3 font-serif text-sm text-subtle leading-relaxed">
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans">✕</span>
						<span>Want a tool list without 45 minutes on how your business actually works.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans">✕</span>
						<span>Want software resold or managed. I don't do either.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans">✕</span>
						<span>Have a process broken at the client, vendor, or staffing level.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans">✕</span>
						<span>Want a "transformation" or a six-figure roadmap.</span>
					</li>
					<li class="flex gap-3">
						<span class="text-subtle flex-shrink-0 mt-0.5 font-sans">✕</span>
						<span
							>Have no core software or repeatable process yet. Start there, then come back.</span
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</Section>

<!-- Who's behind this -->
<Section background="muted" padding="md" title="Who's behind this" centered={false}>
	<div class="max-w-5xl">
		<div
			class="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 md:gap-16 items-start"
			use:reveal={{ stagger: true, staggerDelay: 160, duration: 500 }}
		>
			<div class="space-y-5 font-serif text-lg text-muted leading-relaxed">
				<p>
					I'm <strong class="font-sans font-semibold text-ink">Piers Rollinson</strong>. Fifteen
					years at DoorDash, Square, and Mudflap building systems that move millions of orders,
					payments, and drivers. The same thinking that lands 10 million orders correctly at
					DoorDash lands 100 client intakes correctly at a 12-person firm.
				</p>
				<p>
					I live in Henderson with my wife and three kids. I'm direct — no glossy pitch decks, no
					software to resell. Fixed scope. You keep what I build.
				</p>
			</div>
			<div>
				<!-- Portrait moved to sidebar: sits with the three meta rules so it reads as a single
					 "about" column rather than a floated inline element. Self-hides if file missing. -->
				<figure class="mb-7 max-w-[160px]">
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
	</div>
</Section>

<!-- Common questions -->
<Section
	id="common-questions"
	background="white"
	padding="md"
	title="Common questions"
	centered={false}
>
	<div class="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 lg:gap-12 items-start">
		<div use:reveal={{ duration: 400 }}>
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
				{#each [{ q: "What if I've already tried AI and it didn't stick?", a: 'Most owners have dabbled with ChatGPT or tried a tool their accountant mentioned, and not much changed. The difference here is specificity — a written plan tied to specific workflows in your business, not a generic "try AI" suggestion.' }, { q: 'What if the honest answer is "don\'t use AI for that"?', a: 'That\'s half the value. The action plan explicitly flags workflows where AI is the wrong tool — broken processes, human-judgement work, low-volume tasks. I\'ll also tell you if the honest answer is "hire the person you were going to hire anyway."' }, { q: 'What does this cost?', a: "$999 flat. Includes the 45-minute call, written action plan, and review call. If you don't find it valuable, I refund — no conditions. No upsell during the Assessment." }, { q: 'What do I need to prepare?', a: "Nothing. You don't need to know AI — that's my job. Just show up ready to talk about how your business actually works day to day." }, { q: 'Who will I be on the call with?', a: 'Me. Every call, every action plan, every build. No junior consultants, no handoffs.' }, { q: 'Do you sell software?', a: 'No. The action plan recommends existing tools — ChatGPT, Claude, Dext, Karbon — whatever fits. No reselling, no affiliate deals. Recommendations are genuinely neutral.' }, { q: 'How long until I get the action plan?', a: 'Within 48 hours of the discovery call. Review call follows shortly. Total calendar time from first call to final plan: about one week.' }, { q: 'What happens after the Assessment?', a: 'Up to you. Many owners implement on their own — the action plan is designed for that. If you want hands-on help, we can talk about the Build phase. Fixed-scope engagements typically run $3K–$15K. Zero pressure either way.' }] as faq, i (faq.q)}
					<details class="group border-b border-rule py-5" open={faqAllOpen}>
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

		<aside class="lg:sticky lg:top-8 lg:self-start" aria-label="Still have questions?">
			<div class="rule-left-accent">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase mb-2">
					Still have questions?
				</p>
				<p class="font-serif text-muted leading-relaxed mb-4">
					Ask me directly. I answer the same day.
				</p>
				<a
					href="mailto:piers@domeworks.tech?subject=AI%20Tools%20Assessment%20question"
					class="inline-flex items-baseline gap-2 text-sm font-sans font-medium text-ink underline underline-offset-4 decoration-accent hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
				>
					Email piers@domeworks.tech
					<span aria-hidden="true">→</span>
				</a>
			</div>
			<div class="mt-8 pt-8 border-t border-rule">
				<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-subtle uppercase mb-2">
					Ready to book?
				</p>
				<p class="font-serif text-sm text-muted leading-relaxed mb-4">
					$999 flat. Written plan in 48 hours. Refund if it doesn't pay.
				</p>
				<Button href={ctaUrl} size="md">Book the assessment</Button>
			</div>
		</aside>
	</div>
</Section>

<!-- Dark CTA footer: final close. Duplicate "What comes next" cards removed —
	 the Build phase is already covered in §03 How it works. -->
<section class="relative bg-ink text-paper overflow-hidden" aria-label="Book your Assessment">
	<div
		class="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-24 text-center"
		use:reveal={{ duration: 500 }}
	>
		<p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent-light uppercase mb-4">
			Ready when you are
		</p>
		<h2
			class="font-sans font-medium text-4xl md:text-[2.5rem] leading-tight text-paper mb-3 tracking-[-0.025em]"
		>
			Get your hours back. Starting this week.
		</h2>
		<p class="text-paper/80 mb-2">$999 flat. 45-minute call. Written action plan in 48 hours.</p>
		<p class="text-sm text-paper/70 mb-10">
			If you don't find the Assessment valuable, I'll refund you. No questions asked.
		</p>
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<Button href={ctaUrl} size="lg">Book the $999 assessment</Button>
			<a
				href="mailto:piers@domeworks.tech?subject=AI%20Tools%20Assessment%20question"
				class="text-sm text-paper/80 hover:text-accent-light transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
			>
				Or email a question first
			</a>
		</div>
	</div>
</section>

<!-- Sticky mobile CTA. With §01 filter now non-sticky on mobile, no overlap. -->
{#if showStickyCta}
	<div
		class="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-paper/10 px-4 py-3 flex items-center justify-between gap-3"
		role="complementary"
		aria-label="Book Assessment"
	>
		<p class="text-sm text-paper/70 truncate font-sans">45-min AI assessment</p>
		<Button href={ctaUrl} size="sm">Book it</Button>
	</div>
{/if}
