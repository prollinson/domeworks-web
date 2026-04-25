<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import NumberedSection from '$lib/components/patterns/NumberedSection.svelte';
	import HairlineGrid from '$lib/components/patterns/HairlineGrid.svelte';
	import Eyebrow from '$lib/components/patterns/Eyebrow.svelte';
	import Callout from '$lib/components/patterns/Callout.svelte';
	import PullQuote from '$lib/components/patterns/PullQuote.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { getBookCallUrl } from '$lib/utils/mailto';

	function stackReveal(node: HTMLElement) {
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			node.classList.add('revealed');
			return { destroy() {} };
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.classList.add('revealed');
						observer.unobserve(node);
					}
				});
			},
			{ threshold: 0.2 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<svelte:head>
	<title>DomeWorks | Intelligence Infrastructure Engineering</title>
	<meta
		name="description"
		content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure. DomeWorks builds it."
	/>
	<link rel="canonical" href="https://domeworks.tech/" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content="https://domeworks.tech/" />
	<meta property="og:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
	<meta
		property="og:description"
		content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
	<meta
		name="twitter:description"
		content="Your team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure."
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
	href="#how-it-works"
	class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
>
	Skip to content
</a>

<!-- Hero Section -->
<section class="relative hero-section bg-ink overflow-hidden -mt-16 md:-mt-20" aria-label="Hero">
	<div
		class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 hero-content-pad flex flex-col justify-between min-h-[inherit]"
	>
		<!-- Top zone: spacer (eyebrow removed per council feedback) -->
		<div class="hero-eyebrow-row"></div>

		<!-- Middle zone: Headline, editorial scale, staggered lines -->
		<div class="hero-middle">
			<h1 class="hero-headline font-serif font-normal text-paper">
				<span class="hero-line hero-line-1">Your team bought</span>
				<span class="hero-line hero-line-2">AI tools<span class="text-accent-light">.</span></span>
				<span class="hero-line hero-line-3"><em class="hero-headline-em">Nobody built</em></span>
				<span class="hero-line hero-line-4 text-paper/70"
					>the systems between them<span class="text-accent-light/70">.</span></span
				>
			</h1>

			<!-- Subtext positioned as an editorial aside, offset from the headline -->
			<div class="hero-aside">
				<div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
				<p class="hero-body-text text-paper/85 leading-relaxed">
					I embed with your team and build working systems — not strategy decks. Every engagement is
					designed to end. You keep what I build.
				</p>
				<p class="mt-3 text-sm text-paper/75 leading-relaxed hidden sm:block">
					10+ years leading teams at DoorDash, Square, and Mudflap. The biggest bottleneck was never
					the work — it was the coordination. That layer can now be built as infrastructure.
				</p>
				<div class="mt-6 md:mt-8 flex items-center gap-6">
					<Button href={getBookCallUrl()} size="lg">Book a call</Button>
					<a
						href="#how-it-works"
						class="hero-cta-secondary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
						aria-label="Jump to how it works section"
					>
						How it works
						<span class="hero-cta-secondary-arrow" aria-hidden="true">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
						</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom zone: Stat strip, editorial data bar -->
		<div class="hero-stat-bar">
			<!-- Desktop stats -->
			<div class="hidden md:flex items-stretch">
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">10+</span>
					<span class="hero-stat-label">Years eng leadership</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">48hr</span>
					<span class="hero-stat-label">Intelligence Scan</span>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell">
					<span class="hero-stat-value font-serif">4 layers</span>
					<span class="hero-stat-label">AI stack</span>
				</div>
			</div>
			<!-- Mobile stats -->
			<div class="flex min-[360px]:flex md:hidden items-stretch">
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-paper/95">10+</span>
					<span class="text-xs text-paper/70 mt-1 tracking-wider uppercase leading-tight"
						>Years leading</span
					>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-paper/95">48hr</span>
					<span class="text-xs text-paper/70 mt-1 tracking-wider uppercase leading-tight"
						>Intel Scan</span
					>
				</div>
				<div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
				<div class="hero-stat-cell-mobile">
					<span class="text-2xl font-serif text-paper/95">4 layers</span>
					<span class="text-xs text-paper/70 mt-1 tracking-wider uppercase leading-tight"
						>AI stack</span
					>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Two tracks picker — above-the-fold split between Offer A and Offer B -->
<Section
	background="white"
	padding="md"
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
					<span class="text-sm font-medium text-ink">Leaders Assessment</span>
					<span class="text-accent text-lg group-hover:translate-x-1 transition-transform">→</span>
				</div>
				<p class="mt-3 text-xs text-subtle">
					Or start with the <span class="text-accent underline underline-offset-2">AI Scan</span>
				</p>
			</a>
		</HairlineGrid>
	</div>

	<div class="max-w-4xl mx-auto mt-8 text-center">
		<p class="text-sm text-subtle">
			Not sure which applies? The sections below go deeper on the leaders track. If you're
			owner-operator, the <a href="/smb/" class="text-accent underline underline-offset-2"
				>SMB Assessment page</a
			> is the better read.
		</p>
	</div>
</Section>

<!-- Who This Is For (Track B deep-dive starts here) -->
<NumberedSection index="01" background="muted" padding="lg" title="Who this is for">
	<div class="max-w-2xl mx-auto" use:reveal>
		<div class="p-8 md:p-12 bg-paper-alt rounded-2xl border border-rule">
			<ul class="space-y-5 text-lg text-muted leading-relaxed mb-6">
				<li class="flex items-start gap-4">
					<span
						class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1"
					>
						<span class="w-2 h-2 rounded-full bg-accent"></span>
					</span>
					<span
						>You're a <strong class="text-ink">VP, director, or senior leader</strong> — running a
						team of 50 to 500 inside a larger org, engineering or otherwise, with AI tooling already
						rolled out</span
					>
				</li>
				<li class="flex items-start gap-4">
					<span
						class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1"
					>
						<span class="w-2 h-2 rounded-full bg-accent"></span>
					</span>
					<span
						>Individual productivity is up. Team-level throughput is flat — because the handoffs
						between people haven't changed</span
					>
				</li>
				<li class="flex items-start gap-4">
					<span
						class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1"
					>
						<span class="w-2 h-2 rounded-full bg-accent"></span>
					</span>
					<span
						>You've thought about assigning a senior engineer to fix it — but building the
						infrastructure that replaces coordination overhead isn't a side project</span
					>
				</li>
				<li class="flex items-start gap-4">
					<span
						class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1"
					>
						<span class="w-2 h-2 rounded-full bg-accent"></span>
					</span>
					<span
						>You want someone who's already built this, so your team gets the result without the
						trial-and-error tax</span
					>
				</li>
			</ul>
			<p class="text-lg text-ink leading-relaxed font-medium border-l-2 border-accent pl-6">
				You don't need another tool or a strategy deck. You need someone who can build the missing
				layers of your AI stack.
			</p>
		</div>
	</div>
</NumberedSection>

<!-- The Problem -->
<NumberedSection index="02" background="white" padding="lg" title="The problem isn't the tools">
	<div class="max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-5 gap-10 md:gap-16 items-start">
			<!-- Left column: prose -->
			<div class="md:col-span-3 space-y-6">
				<p class="text-lg text-muted leading-relaxed">
					The tools work fine individually. They write code, answer questions, summarize documents.
					What breaks is everything between them.
				</p>
				<p class="text-lg text-muted leading-relaxed">
					Engineers re-explain the architecture to every AI prompt. Managers spend their days
					aggregating context from three teams so a fourth can act on it. Status meetings exist
					because information doesn't flow without human relay chains. That coordination layer — the
					thing managers and meetings used to be — is what now has to be built.
				</p>
			</div>
			<!-- Right column: Block proof point -->
			<div class="md:col-span-2">
				<div class="p-6 bg-paper rounded-xl border border-rule sticky top-24">
					<p class="text-muted leading-relaxed">
						<strong class="text-ink">Block</strong> (the company behind Square and Cash App)
						recently published how they're replacing coordination overhead with what they call a
						<em>"company world model."</em> It's the same architecture I've been building with engineering
						teams — the Context and Orchestration layers of the stack.
					</p>
					<p class="text-sm text-subtle mt-3">
						The pattern is showing up independently because the problem is structural, not novel.
					</p>
				</div>
			</div>
		</div>
	</div>
</NumberedSection>

<!-- The AI Stack -->
<NumberedSection index="03" background="white" padding="lg" title="The AI stack">
	<div class="max-w-5xl mx-auto" use:reveal>
		<p class="text-lg text-muted leading-relaxed text-center mb-16 max-w-2xl mx-auto">
			Here's the architecture that fixes it. Every organization running on AI needs four layers.
			Most have the top and bottom. The middle two are where coordination becomes infrastructure.
		</p>

		<!-- AI Stack visual: bold stacked layers -->
		<div class="relative mb-16">
			<!-- "DomeWorks builds" indicator on left -->
			<div
				class="absolute -left-2 md:left-0 top-0 bottom-0 hidden lg:flex flex-col items-center"
				style="width: 3rem;"
			>
				<div class="flex-1"></div>
				<div class="relative flex flex-col items-center" style="height: 50%;">
					<div
						class="w-px h-full bg-gradient-to-b from-accent via-accent-light to-accent opacity-40"
					></div>
					<span
						class="absolute top-1/2 -translate-y-1/2 -translate-x-2 text-[10px] font-semibold tracking-[0.2em] text-accent uppercase whitespace-nowrap"
						style="writing-mode: vertical-lr; transform: rotate(180deg) translateX(100%) translateY(-50%);"
						>DomeWorks builds</span
					>
				</div>
				<div class="flex-1"></div>
			</div>

			<div class="space-y-1 lg:pl-16 stack-build" use:stackReveal>
				<!-- Surface layer -->
				<div class="rounded-t-2xl bg-paper-alt border border-rule px-8 py-6 md:px-10 md:py-7">
					<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
						<span class="text-sm font-semibold tracking-[0.15em] text-subtle uppercase"
							>Surface</span
						>
						<span class="text-subtle text-sm md:text-base">Where humans decide and act</span>
					</div>
				</div>

				<!-- Agent Coordination layer -->
				<div class="bg-accent px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
					<div
						class="absolute inset-0 opacity-10"
						style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%); background-size: 20px 20px;"
					></div>
					<div class="relative">
						<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
							<span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase"
								>Agent Coordination</span
							>
							<span class="text-white/60 text-sm md:text-base"
								>Routes work, validates output, closes feedback loops</span
							>
						</div>
						<p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
							Replaces the coordination work that hierarchy exists to perform.
						</p>
						<ul class="mt-3 space-y-1 text-white/60 text-sm">
							<li>
								Route PR reviews to the right engineer based on code ownership and availability
							</li>
							<li>Triage incoming bugs without a morning standup</li>
							<li>Distribute sprint context across teams so nobody re-explains the architecture</li>
						</ul>
					</div>
				</div>

				<!-- Context System layer -->
				<div class="bg-accent-light px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
					<div
						class="absolute inset-0 opacity-8"
						style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.08) 75%); background-size: 20px 20px;"
					></div>
					<div class="relative">
						<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
							<span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase"
								>Context System</span
							>
							<span class="text-white/60 text-sm md:text-base"
								>Domain knowledge fed into every AI interaction</span
							>
						</div>
						<p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
							Builds the world model so AI doesn't start from zero every time.
						</p>
						<ul class="mt-3 space-y-1 text-white/60 text-sm">
							<li>
								Feed your coding standards, architectural decisions, and team conventions into every
								AI interaction
							</li>
							<li>
								Keep your ticketing system, docs, and codebase connected so AI knows what's already
								been decided
							</li>
							<li>
								Give new engineers' AI tools the same context a senior engineer carries in their
								head
							</li>
						</ul>
					</div>
				</div>

				<!-- Edge layer -->
				<div class="rounded-b-2xl bg-paper-alt border border-rule px-8 py-6 md:px-10 md:py-7">
					<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
						<span class="text-sm font-semibold tracking-[0.15em] text-subtle uppercase"
							>Edge</span
						>
						<span class="text-subtle text-sm md:text-base">Tools, APIs, repos, CI/CD</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Before/After comparison -->
		<div class="max-w-3xl mx-auto mb-16" use:reveal>
			<div class="bg-paper-alt rounded-xl border border-rule p-6 md:p-8">
				<div class="grid grid-cols-2 gap-6 md:gap-8">
					<div>
						<p class="text-xs font-semibold tracking-widest text-faint uppercase mb-4">
							Before
						</p>
						<ul class="space-y-3 text-sm text-subtle">
							<li>Engineers re-explain architecture to every AI prompt</li>
							<li>Managers relay context between teams in meetings</li>
							<li>Status updates exist because information doesn't flow</li>
							<li>AI tools help individuals but don't coordinate work</li>
						</ul>
					</div>
					<div>
						<p class="text-xs font-semibold tracking-widest text-accent uppercase mb-4">After</p>
						<ul class="space-y-3 text-sm text-ink">
							<li>Context system feeds it automatically</li>
							<li>Agent coordination routes it in real time</li>
							<li>Information flows through infrastructure, not people</li>
							<li>Multi-agent workflows coordinate across the team</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-2xl mx-auto">
			<p class="text-lg text-muted leading-relaxed border-l-2 border-accent pl-6">
				I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a
				strategy deck. I stay until the context system and agent coordination are running and your
				team can maintain them without me.
			</p>
		</div>
	</div>
</NumberedSection>

<!-- How It Works -->
<NumberedSection index="04" id="how-it-works" background="muted" padding="lg" title="How it works">
	<div
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
		use:reveal={{ stagger: true, staggerDelay: 150 }}
	>
		<a
			href="/leaders/scan/"
			class="group p-8 bg-paper rounded-2xl border border-rule hover:border-accent card-lift flex flex-col relative overflow-hidden"
		>
			<div class="absolute top-0 left-0 right-0 h-1 bg-accent/30"></div>
			<span
				class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full mb-4 w-fit"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
				Start here
			</span>
			<h3 class="text-xl font-medium text-ink mb-2">AI Scan</h3>
			<p class="text-2xl font-normal font-serif text-ink mb-4">$2,500–$3,500</p>
			<p class="text-subtle text-sm flex-grow">
				In 48 hours, I diagnose where you are on the path from "bought tools" to "AI coordinates our
				work." You get a clear picture of what's missing and quick wins your team can act on this
				week.
			</p>
			<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more &rarr;</p>
		</a>

		<a
			href="/leaders/context-build/"
			class="group p-8 rounded-2xl border-2 border-accent bg-accent/[0.03] flex flex-col relative overflow-hidden"
		>
			<div class="absolute top-0 left-0 right-0 h-1 bg-accent"></div>
			<span
				class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-accent rounded-full"
			>
				Deep dive
			</span>
			<h3 class="text-xl font-medium text-ink mb-2 mt-2">Context Build</h3>
			<p class="text-2xl font-normal font-serif text-ink mb-4">$10,000–$15,000+</p>
			<p class="text-subtle text-sm flex-grow">
				I map your organization's world model gaps, design the context system, and build the
				infrastructure that feeds your domain knowledge into every AI interaction. Your team goes
				from "every prompt starts from zero" to "AI knows our business."
			</p>
			<p class="mt-4 text-sm text-subtle">1-2 week assessment + 4-week build</p>
			<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more &rarr;</p>
		</a>

		<a
			href="/leaders/orchestration-build/"
			class="group p-8 bg-paper rounded-2xl border border-rule hover:border-accent card-lift flex flex-col relative overflow-hidden"
		>
			<div class="absolute top-0 left-0 right-0 h-1 bg-accent-light/30"></div>
			<h3 class="text-xl font-medium text-ink mb-2">Orchestration Build</h3>
			<p class="text-2xl font-normal font-serif text-ink mb-4">4–12 weeks</p>
			<p class="text-subtle text-sm flex-grow">
				I build the agent coordination layer: multi-agent workflows, quality gates, output routing.
				Your team goes from "AI helps individuals" to "AI coordinates our work."
			</p>
			<p class="mt-4 text-sm text-subtle">Day rate, scoped from assessment</p>
			<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more &rarr;</p>
		</a>

		<a
			href="/leaders/fractional/"
			class="group p-8 bg-paper rounded-2xl border border-rule hover:border-accent card-lift flex flex-col relative overflow-hidden"
		>
			<div class="absolute top-0 left-0 right-0 h-1 bg-accent-light/30"></div>
			<span
				class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-accent bg-accent-light/10 rounded-full mb-4 w-fit"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-accent-light"></span>
				What comes after
			</span>
			<h3 class="text-xl font-medium text-ink mb-2">Fractional AI Leadership</h3>
			<p class="text-2xl font-normal font-serif text-ink mb-4">Monthly retainer</p>
			<p class="text-subtle text-sm flex-grow">
				1–2 days/week. I maintain and evolve the context system and agent coordination, close
				feedback loops, and make sure the infrastructure compounds as your org changes.
			</p>
			<p class="mt-4 text-sm text-accent font-medium group-hover:underline">Learn more &rarr;</p>
		</a>
	</div>
</NumberedSection>

<!-- Bottom CTA -->
<Section background="muted" padding="lg">
	<div class="max-w-2xl mx-auto text-center" use:reveal>
		<h2 class="font-serif text-3xl font-normal text-ink mb-4">
			Ready to talk<span class="text-accent">?</span>
		</h2>
		<p class="text-lg text-muted mb-8">
			Tell me what your team has shipped with AI so far. I'll tell you where the coordination layer
			is most likely to break first — and whether a Scan is worth your 48 hours.
		</p>
		<Button href={getBookCallUrl()} size="lg">Book a call</Button>
	</div>
</Section>
