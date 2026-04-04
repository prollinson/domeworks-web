<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>DomeWorks | Intelligence Infrastructure Engineering</title>
  <meta name="description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure. DomeWorks builds it." />
  <link rel="canonical" href="https://domeworks.tech/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/" />
  <meta property="og:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
  <meta property="og:description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
  <meta name="twitter:description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />
  <meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

  <!-- JSON-LD: Organization + WebSite -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "DomeWorks",
        "url": "https://domeworks.tech",
        "foundingDate": "2025",
        "description": "Intelligence infrastructure engineering consultancy. Replaces coordination overhead with context pipelines, agent orchestration, and quality gates for engineering teams.",
        "founder": {
          "@type": "Person",
          "name": "Piers Rollinson",
          "jobTitle": "Founder",
          "sameAs": []
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "piers@domeworks.tech",
          "contactType": "sales"
        }
      },
      {
        "@type": "WebSite",
        "name": "DomeWorks",
        "url": "https://domeworks.tech"
      }
    ]
  })}</script>`}
</svelte:head>

<!-- Skip to content -->
<a href="#how-it-works" class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
  Skip to content
</a>

<!-- Hero Section -->
<section class="relative hero-section bg-ink overflow-hidden -mt-16 md:-mt-20" aria-label="Hero">
  <!-- Architectural grid background -->
  <div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
  <!-- Warm ambient glow: bottom-left copper, top-right teal -->
  <div class="absolute inset-0 hero-glow" aria-hidden="true" role="presentation"></div>
  <!-- Grain texture -->
  <div class="absolute inset-0 texture-grain" aria-hidden="true" role="presentation"></div>
  <!-- Horizontal architectural rules -->
  <div class="absolute inset-0 pointer-events-none hero-rules" aria-hidden="true" role="presentation"></div>

  <!-- Monogram as architectural column, anchored to right edge, structurally integrated -->
  <div class="absolute inset-0 pointer-events-none hero-monogram-container" aria-hidden="true" role="presentation">
    <span class="hero-monogram font-serif select-none">D</span>
  </div>

  <!-- Vertical accent line: copper rule that runs the height of the hero -->
  <div class="absolute hero-accent-line" aria-hidden="true" role="presentation"></div>

  <div class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 hero-content-pad flex flex-col justify-between min-h-[inherit]">
    <!-- Top zone: spacer (eyebrow removed per council feedback) -->
    <div class="hero-eyebrow-row"></div>

    <!-- Middle zone: Headline, editorial scale, staggered lines -->
    <div class="hero-middle">
      <h1 class="hero-headline font-serif font-normal text-warm-white">
        <span class="hero-line hero-line-1">Your team bought</span>
        <span class="hero-line hero-line-2">AI tools<span class="text-copper">.</span></span>
        <span class="hero-line hero-line-3"><em class="hero-headline-em">Nobody built</em></span>
        <span class="hero-line hero-line-4 text-warm-white/70">the systems between them<span class="text-copper/70">.</span></span>
      </h1>

      <!-- Subtext positioned as an editorial aside, offset from the headline -->
      <div class="hero-aside">
        <div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
        <p class="hero-body-text text-warm-white/85 leading-relaxed">
          I embed with your team and build working systems — not strategy decks. Every engagement is designed to end. You keep what I build.
        </p>
        <p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
          10+ years of engineering leadership at DoorDash, Square, and Mudflap. The biggest bottleneck was never the engineering — it was the coordination. That layer can now be built as infrastructure.
        </p>
        <div class="mt-6 md:mt-8 flex items-center gap-6">
          <Button href={getBookCallUrl()} size="lg">
            Book a call
          </Button>
          <a href="#how-it-works" class="hero-cta-secondary focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm" aria-label="Jump to how it works section">
            How it works
            <span class="hero-cta-secondary-arrow" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
          <span class="text-2xl font-serif text-warm-white/95">10+</span>
          <span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Years leading</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
        <div class="hero-stat-cell-mobile">
          <span class="text-2xl font-serif text-warm-white/95">48hr</span>
          <span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Intel Scan</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
        <div class="hero-stat-cell-mobile">
          <span class="text-2xl font-serif text-warm-white/95">4 layers</span>
          <span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">AI stack</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Who This Is For -->
<Section background="muted" padding="lg" eyebrow="01" title="Who this is for">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 md:p-12 bg-stone rounded-2xl border border-charcoal/10">
      <ul class="space-y-5 text-lg text-charcoal/70 leading-relaxed mb-6">
        <li class="flex items-start gap-4">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
          </span>
          <span>You're a <strong class="text-charcoal">VP of Engineering, Head of Engineering, or CTO</strong> at a mid-market SaaS company (50–500 people) or a funded startup</span>
        </li>
        <li class="flex items-start gap-4">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
          </span>
          <span>Your engineers have AI tools but your organization still runs on human coordination: meetings, status updates, managers routing information between teams</span>
        </li>
        <li class="flex items-start gap-4">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
          </span>
          <span>You've probably thought about assigning a senior engineer to figure this out — but building intelligence infrastructure that replaces coordination overhead isn't a side project</span>
        </li>
        <li class="flex items-start gap-4">
          <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
          </span>
          <span>You need someone who's already built this, who knows what works and what doesn't, so your team gets the infrastructure without the trial-and-error tax</span>
        </li>
      </ul>
      <p class="text-lg text-charcoal leading-relaxed font-medium border-l-2 border-copper pl-6">
        You don't need another tool or a strategy deck. You need someone who can build the missing layers of your AI stack.
      </p>
    </div>
  </div>
</Section>

<!-- The Problem -->
<Section background="white" padding="lg" eyebrow="02" title="The problem isn't the tools">
  <div class="max-w-5xl mx-auto" use:reveal>
    <div class="grid md:grid-cols-5 gap-10 md:gap-16 items-start">
      <!-- Left column: prose -->
      <div class="md:col-span-3 space-y-6">
        <p class="text-lg text-charcoal/70 leading-relaxed">
          Your team has AI tools. But your organization still coordinates the same way it always has: through hierarchy, meetings, and people relaying information.
        </p>
        <p class="text-lg text-charcoal/70 leading-relaxed">
          Engineers re-explain their architecture to every AI prompt. Managers spend their days aggregating context from three teams so a fourth team can act on it. Status meetings exist because information doesn't flow without human relay chains. The tools work fine individually. What's missing is the intelligence infrastructure that replaces the coordination overhead.
        </p>
      </div>
      <!-- Right column: Block proof point -->
      <div class="md:col-span-2">
        <div class="p-6 bg-warm-white rounded-xl border border-charcoal/10 sticky top-24">
          <p class="text-charcoal/70 leading-relaxed">
            <strong class="text-charcoal">Block</strong> (the company behind Square and Cash App) recently published how they're replacing coordination overhead with what they call a <em>"company world model."</em> It's the same architecture I've been building with engineering teams — the Context and Orchestration layers of the stack.
          </p>
          <p class="text-sm text-charcoal/60 mt-3">The pattern is showing up independently because the problem is structural, not novel.</p>
        </div>
      </div>
    </div>
  </div>
</Section>

<!-- The AI Stack -->
<Section background="white" padding="lg" eyebrow="03" title="The AI stack">
  <div class="max-w-5xl mx-auto" use:reveal>
    <p class="text-lg text-charcoal/70 leading-relaxed text-center mb-16 max-w-2xl mx-auto">
      Here's the architecture that fixes it. Every organization running on AI needs four layers. Most have the top and bottom. The middle two are where coordination becomes infrastructure.
    </p>

    <!-- AI Stack visual: bold stacked layers -->
    <div class="relative mb-16">
      <!-- "DomeWorks builds" indicator on left -->
      <div class="absolute -left-2 md:left-0 top-0 bottom-0 hidden lg:flex flex-col items-center" style="width: 3rem;">
        <div class="flex-1"></div>
        <div class="relative flex flex-col items-center" style="height: 50%;">
          <div class="w-px h-full bg-gradient-to-b from-primary via-copper to-primary opacity-40"></div>
          <span class="absolute top-1/2 -translate-y-1/2 -translate-x-2 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase whitespace-nowrap" style="writing-mode: vertical-lr; transform: rotate(180deg) translateX(100%) translateY(-50%);">DomeWorks builds</span>
        </div>
        <div class="flex-1"></div>
      </div>

      <div class="space-y-1 lg:pl-16">
        <!-- Surface layer -->
        <div class="rounded-t-2xl bg-stone border border-charcoal/8 px-8 py-6 md:px-10 md:py-7">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <span class="text-sm font-semibold tracking-[0.15em] text-warm-gray uppercase">Surface</span>
            <span class="text-charcoal/60 text-sm md:text-base">Where humans decide and act</span>
          </div>
        </div>

        <!-- Agent Coordination layer — primary highlight -->
        <div class="bg-primary px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
          <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%); background-size: 20px 20px;"></div>
          <div class="relative">
            <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
              <span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase">Agent Coordination</span>
              <span class="text-white/60 text-sm md:text-base">Routes work, validates output, closes feedback loops</span>
            </div>
            <p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
              Replaces the coordination work that hierarchy exists to perform.
            </p>
          </div>
        </div>

        <!-- Context System layer — copper highlight -->
        <div class="bg-copper px-8 py-8 md:px-10 md:py-10 relative overflow-hidden">
          <div class="absolute inset-0 opacity-8" style="background-image: linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.08) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.08) 75%); background-size: 20px 20px;"></div>
          <div class="relative">
            <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
              <span class="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase">Context System</span>
              <span class="text-white/60 text-sm md:text-base">Domain knowledge fed into every AI interaction</span>
            </div>
            <p class="text-white/90 text-lg md:text-xl font-serif leading-snug max-w-xl">
              Builds the world model so AI doesn't start from zero every time.
            </p>
          </div>
        </div>

        <!-- Edge layer -->
        <div class="rounded-b-2xl bg-stone border border-charcoal/8 px-8 py-6 md:px-10 md:py-7">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <span class="text-sm font-semibold tracking-[0.15em] text-warm-gray uppercase">Edge</span>
            <span class="text-charcoal/60 text-sm md:text-base">Tools, APIs, repos, CI/CD</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto">
      <p class="text-lg text-charcoal/70 leading-relaxed border-l-2 border-copper pl-6">
        I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a strategy deck. I stay until the context system and agent coordination are running and your team can maintain them without me.
      </p>
    </div>
  </div>
</Section>

<!-- How It Works -->
<Section id="how-it-works" background="muted" padding="lg" eyebrow="04" title="How it works">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
      <a href="/scan/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-primary card-lift flex flex-col relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-primary/30"></div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4 w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Start here
        </span>
        <h3 class="text-xl font-medium text-charcoal mb-2">AI Scan</h3>
        <p class="text-2xl font-normal font-serif text-charcoal mb-4">$2,500–$3,500</p>
        <p class="text-charcoal/60 text-sm flex-grow">
          In 48 hours, I diagnose where you are on the path from "bought tools" to "AI coordinates our work." You get a clear picture of what's missing and quick wins your team can act on this week.
        </p>
        <p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
      </a>

      <a href="/context-build/" class="group p-8 rounded-2xl border-2 border-primary bg-primary/[0.03] flex flex-col relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
          Deep dive
        </span>
        <h3 class="text-xl font-medium text-charcoal mb-2 mt-2">Context Build</h3>
        <p class="text-2xl font-normal font-serif text-charcoal mb-4">$10,000–$15,000+</p>
        <p class="text-charcoal/60 text-sm flex-grow">
          I map your organization's world model gaps, design the context system, and build the infrastructure that feeds your domain knowledge into every AI interaction. Your team goes from "every prompt starts from zero" to "AI knows our business."
        </p>
        <p class="mt-4 text-sm text-charcoal/60">1-2 week assessment + 4-week build</p>
        <p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
      </a>

      <a href="/orchestration-build/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-copper/30"></div>
        <h3 class="text-xl font-medium text-charcoal mb-2">Orchestration Build</h3>
        <p class="text-2xl font-normal font-serif text-charcoal mb-4">4–12 weeks</p>
        <p class="text-charcoal/60 text-sm flex-grow">
          I build the agent coordination layer: multi-agent workflows, quality gates, output routing. Your team goes from "AI helps individuals" to "AI coordinates our work."
        </p>
        <p class="mt-4 text-sm text-charcoal/60">Day rate, scoped from assessment</p>
        <p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>
      </a>

      <a href="/fractional/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-copper/30"></div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-copper bg-copper/10 rounded-full mb-4 w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-copper"></span>
          What comes after
        </span>
        <h3 class="text-xl font-medium text-charcoal mb-2">Fractional AI Leadership</h3>
        <p class="text-2xl font-normal font-serif text-charcoal mb-4">Monthly retainer</p>
        <p class="text-charcoal/60 text-sm flex-grow">
          1–2 days/week. I maintain and evolve the context system and agent coordination, close feedback loops, and make sure the infrastructure compounds as your org changes.
        </p>
        <p class="mt-4 text-sm text-copper font-medium group-hover:underline">Learn more &rarr;</p>
      </a>
    </div>
</Section>

<!-- Bottom CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Ready to talk<span class="text-primary">?</span>
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      If your organization is still running on hierarchy and you want to start building the intelligence infrastructure that replaces coordination overhead, let's figure out what's missing.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
