<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getAuditCallUrl } from '$lib/utils/mailto';

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
</script>

<svelte:head>
	<title>AI Audit for Professional Services | DomeWorks</title>
	<meta
		name="description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm. Free for the first 5 firms in Henderson/Las Vegas."
	/>
	<link rel="canonical" href="https://domeworks.tech/ai-audit/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/ai-audit/" />
	<meta property="og:title" content="AI Audit for Professional Services | DomeWorks" />
	<meta
		property="og:description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="AI Audit for Professional Services | DomeWorks" />
	<meta
		name="twitter:description"
		content="A structured assessment of where AI tools can recover 5-7 hours per week for your professional services firm."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Audit for Professional Services',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			'Structured assessment of where AI tools can recover time for professional services firms. Discovery call, AI analysis, written report with prioritized opportunities.',
		areaServed: {
			'@type': 'Place',
			name: 'Henderson / Las Vegas, Nevada'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			description: 'Free for the first 5 firms (normally $999)',
			eligibleRegion: {
				'@type': 'Place',
				name: 'Henderson / Las Vegas, Nevada'
			}
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
			<span class="hero-eyebrow-text">AI Audit</span>
			<span class="hero-eyebrow-index">Professional Services</span>
		</div>

		<!-- Middle zone: headline + aside -->
		<div class="hero-middle">
			<h1 class="hero-headline font-serif font-normal text-warm-white">
				<span class="hero-line hero-line-1">Your firm runs on</span>
				<span class="hero-line hero-line-2">manual workflows<span class="text-copper">.</span></span>
				<span class="hero-line hero-line-3"><em class="hero-headline-em">Most of them</em></span>
				<span class="hero-line hero-line-4 text-warm-white/70">don't have to<span class="text-copper/70">.</span></span>
			</h1>

			<div class="hero-aside">
				<div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
				<p class="hero-body-text text-warm-white/85 leading-relaxed">
					A structured assessment of where AI tools can recover real time in your practice — not a sales pitch, not a software demo.
				</p>
				<p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
					Built by someone who spent 15 years building systems at DoorDash, Square, and Mudflap — now applied to professional services.
				</p>
				<div class="mt-6 md:mt-8 flex items-center gap-6">
					<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
					<a
						href="#where-time-goes"
						class="hero-cta-secondary focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
						aria-label="Jump to where the time goes"
					>
						Learn more
						<span class="hero-cta-secondary-arrow" aria-hidden="true">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
							</svg>
						</span>
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

<!-- 01: Where the time goes — asymmetric editorial layout -->
<Section id="where-time-goes" background="white" padding="md" eyebrow="01" title="Where the time goes">
	<div use:reveal>
		<!-- Lead paragraph + accounting callout: two-column editorial -->
		<div class="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 mb-10">
			<div class="lg:col-span-3">
				<p class="text-lg text-charcoal/70 leading-relaxed">
					Every professional services firm has the same pattern: skilled people spending hours on work
					that follows rules, not judgment. The work gets done, but it costs more time than it should.
				</p>
			</div>
			<div class="lg:col-span-2 p-5 bg-copper/[0.06] rounded-xl border border-copper/15">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Especially for accounting firms</p>
				<p class="text-sm text-charcoal/70">
					Transaction categorization, bookkeeping review, and IRS notice responses — rule-based work that AI handles particularly well.
				</p>
			</div>
		</div>

		<!-- Problem cards: 2x2 grid with hover states -->
		<div class="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8 cursor-default">
				<h3 class="font-medium text-charcoal mb-2">Client intake & onboarding</h3>
				<p class="text-sm text-charcoal/70">
					Back-and-forth emails for missing documents, manual checklists, follow-ups that fall
					through the cracks. The same intake sequence repeated for every new client.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8 cursor-default">
				<h3 class="font-medium text-charcoal mb-2">Correspondence & drafting</h3>
				<p class="text-sm text-charcoal/70">
					Engagement letters, client updates, notice responses — drafted from scratch or from
					templates that haven't been updated in years. AI cuts drafting time by 70%+.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8 cursor-default">
				<h3 class="font-medium text-charcoal mb-2">Meeting prep & follow-up</h3>
				<p class="text-sm text-charcoal/70">
					Reviewing prior-year files before client calls, summarizing meeting notes, tracking action
					items. 30–60 minutes per meeting that AI handles in seconds.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8 cursor-default">
				<h3 class="font-medium text-charcoal mb-2">Research & staying current</h3>
				<p class="text-sm text-charcoal/70">
					Regulatory changes, jurisdiction-specific rules, industry updates. Hours of manual
					research that AI can surface in minutes.
				</p>
			</div>
		</div>
	</div>
</Section>

<!-- 02: What you get — numbered steps -->
<Section background="muted" padding="md" eyebrow="02" title="What you get">
	<div class="max-w-3xl mx-auto" use:reveal>
		<div class="space-y-6">
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">1</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">45-minute discovery call</h3>
					<p class="text-charcoal/70">
						I ask about your workflow — where time gets stuck, what you've tried, what you dread. No
						pitch, just questions.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">2</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">AI analysis of your situation</h3>
					<p class="text-charcoal/70">
						I map your workflow against existing AI tools and identify where real time can be
						recovered — not theoretical, specific to how your firm actually operates.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">3</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Written report</h3>
					<p class="text-charcoal/70">
						Your top 3–7 AI opportunities, prioritized by impact and ease. Specific tool
						recommendations, a quick-start plan, and a financial impact estimate. Not a slide deck —
						a document you can act on.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<span class="text-sm font-semibold text-primary">4</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Review call</h3>
					<p class="text-charcoal/70">
						Walk through the report together, answer questions, decide what to act on. Total time
						from your side: about 90 minutes across two calls.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 03: The math — full-width, larger treatment -->
<Section background="white" padding="md" eyebrow="03" title="The math">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-8 items-center">
			<div class="text-center md:text-left">
				<p class="text-5xl md:text-6xl font-serif text-charcoal leading-tight">
					5–7 hours<span class="text-copper">/</span><span class="text-charcoal/50">week</span>
				</p>
				<p class="text-charcoal/70 mt-2 text-lg">recovered per professional, on average</p>
			</div>
			<div class="space-y-5">
				<div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
					<p class="text-lg text-charcoal/70 leading-relaxed">
						At billing rates of $150–$300/hour, that's
						<strong class="text-charcoal">$750–$2,100 per week</strong> in recovered capacity — or the ability
						to take on more clients without adding headcount.
					</p>
					<div class="h-px bg-charcoal/10 my-5"></div>
					<p class="text-sm text-charcoal/50">
						The tools cost $30–$80/month in aggregate. Payback is measured in days.
					</p>
				</div>
				<div class="p-4 bg-primary/[0.04] rounded-lg border border-primary/15 flex items-start gap-3">
					<svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
					<p class="text-sm text-charcoal/70">
						<strong class="text-charcoal">Guarantee:</strong> implement the recommendations and save 5+ hours/week within 30 days, or full refund on paid audits. No questions asked.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 04: Who's behind this — with credential badges -->
<Section background="muted" padding="md" eyebrow="04" title="Who's behind this">
	<div class="max-w-4xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-3 gap-8 items-start">
			<div class="md:col-span-2 space-y-4 text-lg text-charcoal/70 leading-relaxed">
				<p>
					I'm <strong class="text-charcoal">Piers Rollinson</strong>, founder of DomeWorks. I've spent
					15 years building systems that replace manual coordination — first at DoorDash, Square, and
					Mudflap, now for professional services firms.
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
					<p class="text-sm text-charcoal font-medium">AI systems for professional services</p>
				</div>
				<div class="p-4 bg-warm-white rounded-lg border border-charcoal/8">
					<p class="text-xs font-semibold tracking-widest text-warm-gray uppercase mb-1">Based in</p>
					<p class="text-sm text-charcoal font-medium">Henderson, NV</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- 05: FAQ — objection handling -->
<Section background="muted" padding="md" eyebrow="05" title="Common questions">
	<div class="max-w-3xl mx-auto space-y-4" use:reveal>
		<details class="group p-5 bg-warm-white rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Is this actually free?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Yes. The first 5 firms get the full audit at no cost — same deliverable that normally costs $999. I'm building case studies and local relationships. There's no upsell during the audit, and no obligation to hire me afterward.
			</p>
		</details>

		<details class="group p-5 bg-warm-white rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What do I need to prepare?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Nothing. Just show up to the discovery call ready to talk about how your firm actually works day-to-day. I'll ask the right questions. No homework, no intake forms.
			</p>
		</details>

		<details class="group p-5 bg-warm-white rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				How long until I get the report?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				Within one week of the discovery call. The review call happens shortly after, at a time that works for you. Total calendar time from first call to final report: about two weeks.
			</p>
		</details>

		<details class="group p-5 bg-warm-white rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				Do you sell software?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				No. The report recommends existing tools — things like ChatGPT, Claude, Dext, Karbon — whatever fits your workflow. I don't resell software and I have no affiliate deals. The recommendations are genuinely neutral.
			</p>
		</details>

		<details class="group p-5 bg-warm-white rounded-xl border border-charcoal/8">
			<summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
				What happens after the audit?
				<svg class="w-5 h-5 text-charcoal/40 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</summary>
			<p class="mt-3 text-charcoal/70 leading-relaxed">
				That's entirely up to you. Many firms implement on their own — the report is designed for that. If you want hands-on help building the systems, we can talk about an implementation engagement. But there's zero pressure either way.
			</p>
		</details>
	</div>
</Section>

<!-- CTA: dark closing section — strong finish -->
<section class="relative bg-ink overflow-hidden" aria-label="Book your audit">
	<!-- Subtle grid echo from hero -->
	<div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
	<div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 60% at 50% 80%, rgba(176, 125, 79, 0.12), transparent 70%);" aria-hidden="true" role="presentation"></div>

	<div class="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-28" use:reveal>
		<!-- What comes next — merged into CTA -->
		<div class="grid sm:grid-cols-2 gap-5 mb-14">
			<div class="p-5 rounded-xl border border-warm-white/10 bg-warm-white/[0.04]">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Self-serve</p>
				<h3 class="font-medium text-warm-white mb-1.5">Implement on your own</h3>
				<p class="text-sm text-warm-white/60 leading-relaxed">
					The report includes specific tool recommendations and a quick-start plan.
					Many firms take this and run — that's the whole point.
				</p>
			</div>
			<div class="p-5 rounded-xl border border-warm-white/10 bg-warm-white/[0.04]">
				<p class="text-xs font-semibold tracking-widest text-copper uppercase mb-2">Done-with-you</p>
				<h3 class="font-medium text-warm-white mb-1.5">Implementation engagement</h3>
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
				Free for the first 5 firms
			</h2>
			<p class="text-warm-white/60 mb-10">Henderson / Las Vegas area. <span class="line-through text-warm-white/40">Normally $999</span></p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
				<a href="mailto:piers@domeworks.tech?subject=AI%20Audit%20question" class="text-sm text-warm-white/60 hover:text-copper transition-colors">
					Or email a question first
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Sticky mobile CTA -->
{#if showStickyCta}
<div class="fixed bottom-0 inset-x-0 z-50 md:hidden bg-ink/95 backdrop-blur-sm border-t border-warm-white/10 px-4 py-3 flex items-center justify-between gap-3" role="complementary" aria-label="Book audit">
	<p class="text-sm text-warm-white/70 truncate">3 free spots left</p>
	<Button href={getAuditCallUrl()} size="sm">Book call</Button>
</div>
{/if}
