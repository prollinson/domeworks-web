<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getAuditCallUrl } from '$lib/utils/mailto';
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

<!-- Hero -->
<Section background="dark" padding="xl">
	<div class="max-w-3xl" use:reveal>
		<h1
			class="font-serif font-normal text-warm-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
		>
			Your firm runs on manual workflows<span class="text-copper">.</span>
			<br />
			<span class="text-warm-white/70">Most of them don't have to.</span>
		</h1>
		<p class="text-lg md:text-xl text-warm-white/80 leading-relaxed max-w-2xl mb-8">
			A structured assessment of where AI tools can recover real time in your practice — not a sales
			pitch, not a software demo.
		</p>
		<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
	</div>
</Section>

<!-- The problem -->
<Section background="white" padding="lg" eyebrow="01" title="Where the time goes">
	<div class="max-w-3xl mx-auto space-y-8" use:reveal>
		<p class="text-lg text-charcoal/70 leading-relaxed">
			Every professional services firm has the same pattern: skilled people spending hours on work
			that follows rules, not judgment. The work gets done, but it costs more time than it should.
		</p>

		<div class="grid sm:grid-cols-2 gap-6">
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Client intake & onboarding</h3>
				<p class="text-sm text-charcoal/60">
					Back-and-forth emails for missing documents, manual checklists, follow-ups that fall
					through the cracks. The same intake sequence repeated for every new client.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Correspondence & drafting</h3>
				<p class="text-sm text-charcoal/60">
					Engagement letters, client updates, notice responses — drafted from scratch or from
					templates that haven't been updated in years. AI cuts drafting time by 70%+.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Meeting prep & follow-up</h3>
				<p class="text-sm text-charcoal/60">
					Reviewing prior-year files before client calls, summarizing meeting notes, tracking action
					items. 30-60 minutes per meeting that AI handles in seconds.
				</p>
			</div>
			<div class="p-6 bg-stone rounded-xl border border-charcoal/8">
				<h3 class="font-medium text-charcoal mb-2">Research & staying current</h3>
				<p class="text-sm text-charcoal/60">
					Regulatory changes, jurisdiction-specific rules, industry updates. Hours of manual
					research that AI can surface in minutes.
				</p>
			</div>
		</div>

		<div class="p-5 bg-warm-white rounded-lg border border-charcoal/10">
			<p class="text-sm text-charcoal/60">
				<strong class="text-charcoal">For accounting firms</strong>, this also includes transaction
				categorization, bookkeeping review, and IRS notice responses — rule-based work that AI
				handles particularly well.
			</p>
		</div>
	</div>
</Section>

<!-- What you get -->
<Section background="muted" padding="lg" eyebrow="02" title="What you get">
	<div class="max-w-3xl mx-auto" use:reveal>
		<div class="space-y-6">
			<div class="flex gap-5">
				<div
					class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
				>
					<span class="text-sm font-semibold text-primary">1</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">45-minute discovery call</h3>
					<p class="text-charcoal/60">
						I ask about your workflow — where time gets stuck, what you've tried, what you dread. No
						pitch, just questions.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div
					class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
				>
					<span class="text-sm font-semibold text-primary">2</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">AI analysis of your situation</h3>
					<p class="text-charcoal/60">
						I map your workflow against existing AI tools and identify where real time can be
						recovered — not theoretical, specific to how your firm actually operates.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div
					class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
				>
					<span class="text-sm font-semibold text-primary">3</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Written report</h3>
					<p class="text-charcoal/60">
						Your top 3-7 AI opportunities, prioritized by impact and ease. Specific tool
						recommendations, a quick-start plan, and a financial impact estimate. Not a slide deck —
						a document you can act on.
					</p>
				</div>
			</div>
			<div class="flex gap-5">
				<div
					class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
				>
					<span class="text-sm font-semibold text-primary">4</span>
				</div>
				<div>
					<h3 class="font-medium text-charcoal mb-1">Review call</h3>
					<p class="text-charcoal/60">
						Walk through the report together, answer questions, decide what to act on. Total time
						from your side: about 90 minutes across two calls.
					</p>
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- The math -->
<Section background="white" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<div class="p-8 md:p-12 bg-stone rounded-2xl border border-charcoal/10">
			<p class="text-3xl md:text-4xl font-serif text-charcoal mb-2">
				5–7 hours<span class="text-copper">/</span>week
			</p>
			<p class="text-charcoal/60 mb-6">recovered per professional, on average</p>
			<div class="h-px bg-charcoal/10 mb-6"></div>
			<p class="text-lg text-charcoal/70 leading-relaxed">
				At billing rates of $150–$300/hour, that's
				<strong class="text-charcoal">$750–$2,100 per week</strong> in recovered capacity — or the ability
				to take on more clients without adding headcount.
			</p>
			<p class="text-sm text-charcoal/50 mt-4">
				The tools cost $30–$80/month in aggregate. Payback is measured in days.
			</p>
		</div>
	</div>
</Section>

<!-- About Piers -->
<Section background="muted" padding="lg" eyebrow="03" title="Who's behind this">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="space-y-4 text-lg text-charcoal/70 leading-relaxed">
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
	</div>
</Section>

<!-- The offer -->
<Section background="white" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<div class="p-8 md:p-12 rounded-2xl border-2 border-primary bg-primary/[0.03]">
			<p class="text-xs font-semibold tracking-widest text-primary uppercase mb-4">Limited</p>
			<h2 class="font-serif text-3xl font-normal text-charcoal mb-2">Free for the first 5 firms</h2>
			<p class="text-charcoal/60 mb-2">Henderson / Las Vegas area. Normally $999.</p>
			<p class="text-sm text-charcoal/50 mb-8">
				Guarantee: implement the recommendations and save 5+ hours/week, or full refund on paid
				audits.
			</p>
			<Button href={getAuditCallUrl()} size="lg">Book the discovery call</Button>
		</div>
	</div>
</Section>
