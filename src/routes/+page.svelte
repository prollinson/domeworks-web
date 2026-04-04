<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>DomeWorks | Intelligence Infrastructure Engineering</title>
  <meta name="description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure. DomeWorks builds it." />
  <link rel="canonical" href="https://domeworks.ai/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.ai/" />
  <meta property="og:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
  <meta property="og:description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />
  <meta property="og:image" content="https://domeworks.ai/og-image.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DomeWorks | Intelligence Infrastructure Engineering" />
  <meta name="twitter:description" content="Your engineering team runs on meetings, status updates, and managers routing information. That coordination layer can now be built as intelligence infrastructure." />
  <meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

  <!-- JSON-LD: Organization + WebSite -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "DomeWorks",
        "url": "https://domeworks.ai",
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
          "email": "piers@domeworks.ai",
          "contactType": "sales"
        }
      },
      {
        "@type": "WebSite",
        "name": "DomeWorks",
        "url": "https://domeworks.ai"
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
    <!-- Top zone: Eyebrow -->
    <div class="hero-eyebrow-row">
      <span class="hero-eyebrow-text">Intelligence Infrastructure Engineering</span>
      <div class="flex-1 h-px bg-warm-white/8 ml-6" aria-hidden="true" role="presentation"></div>
      <span class="hero-eyebrow-index">San Francisco</span>
    </div>

    <!-- Middle zone: Headline, editorial scale, staggered lines -->
    <div class="hero-middle">
      <h1 class="hero-headline font-serif font-normal text-warm-white">
        <span class="hero-line hero-line-1">Coordination</span>
        <span class="hero-line hero-line-2">is overhead<span class="text-copper">.</span></span>
        <span class="hero-line hero-line-3"><em class="hero-headline-em">Build it as</em></span>
        <span class="hero-line hero-line-4 text-warm-white/70">infrastructure<span class="text-copper/70">.</span></span>
      </h1>

      <!-- Subtext positioned as an editorial aside, offset from the headline -->
      <div class="hero-aside">
        <div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
        <p class="hero-body-text text-warm-white/85 leading-relaxed">
          I spent 10+ years leading engineering teams at DoorDash, Square, and Mudflap. The biggest bottleneck was never the engineering. It was the coordination. That layer can now be built as intelligence infrastructure.
        </p>
        <p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
          Most companies bought AI tools and watched adoption flatline. The companies getting real leverage are replacing the coordination layer itself with intelligence infrastructure. DomeWorks builds that infrastructure.
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

<!-- The Problem -->
<Section background="muted" padding="lg" eyebrow="01" title="The problem isn't the tools">
  <div class="max-w-2xl mx-auto space-y-6" use:reveal>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      Your team has AI tools. But your organization still coordinates the same way it always has: through hierarchy, meetings, and people relaying information.
    </p>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      Engineers re-explain their architecture to every AI prompt. Managers spend their days aggregating context from three teams so a fourth team can act on it. Status meetings exist because information doesn't flow without human relay chains. The tools work fine individually. What's missing is the intelligence infrastructure that replaces the coordination overhead.
    </p>
    <div class="p-6 bg-warm-white rounded-xl border border-charcoal/10 mt-8">
      <p class="text-charcoal/70 leading-relaxed">
        <strong class="text-charcoal">Block</strong> (the company behind Square and Cash App) recently published how they're rebuilding their entire organization this way, replacing middle management's coordination function with what they call a <em>"company world model."</em> They have the engineering capacity to build it internally. Most companies don't.
      </p>
      <p class="text-sm text-charcoal/50 mt-3">That's where DomeWorks comes in.</p>
    </div>
  </div>
</Section>

<!-- Who This Is For -->
<Section background="white" padding="lg" eyebrow="02" title="Who this is for">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 md:p-12 bg-stone rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-6">
        You're a <strong class="text-charcoal">VP of Engineering, Head of Engineering, or CTO</strong> at a mid-market SaaS company (50-500 people) or a funded startup. Your engineers have AI tools but your organization still runs on human coordination: meetings, status updates, managers routing information between teams.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed mb-6">
        You've probably thought about assigning a senior engineer to figure this out. But building intelligence infrastructure that replaces coordination overhead isn't a side project. It's infrastructure engineering: context pipelines, agent orchestration, quality gates, observability. You need someone who's already built this, who knows what works and what doesn't, so your team gets the infrastructure without the trial-and-error tax.
      </p>
      <p class="text-lg text-charcoal leading-relaxed font-medium border-l-2 border-copper pl-6">
        You don't need another tool or a strategy deck. You need someone who can build the missing layers of your AI stack.
      </p>
    </div>
  </div>
</Section>

<!-- The AI Stack -->
<Section background="white" padding="lg" eyebrow="03" title="The AI stack">
  <div class="max-w-4xl mx-auto" use:reveal>
    <p class="text-lg text-charcoal/70 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
      Every organization running on AI needs four layers. Most have the top and bottom. The middle two are where AI actually coordinates work instead of just helping individuals.
    </p>

    <!-- AI Stack visual diagram -->
    <div class="space-y-2 mb-12">
      <div class="rounded-t-2xl border border-charcoal/10 bg-warm-white p-5 md:p-6">
        <div class="flex items-baseline gap-3">
          <span class="text-xs font-medium tracking-widest text-warm-gray uppercase shrink-0">Surface</span>
          <span class="text-charcoal/60 text-sm">Where humans decide and act</span>
        </div>
      </div>
      <div class="border-2 border-primary bg-primary/5 p-5 md:p-6 relative">
        <span class="absolute -left-px top-1/2 -translate-y-1/2 -translate-x-full text-[10px] font-medium tracking-widest text-primary uppercase hidden md:block" style="writing-mode: vertical-lr; transform: rotate(180deg) translateX(100%) translateY(-50%);">DomeWorks builds</span>
        <div class="flex items-baseline gap-3">
          <span class="text-xs font-medium tracking-widest text-primary uppercase shrink-0">Agent Coordination</span>
          <span class="text-charcoal/60 text-sm">Routes work, validates output, closes feedback loops</span>
        </div>
      </div>
      <div class="border-2 border-copper bg-copper/5 p-5 md:p-6">
        <div class="flex items-baseline gap-3">
          <span class="text-xs font-medium tracking-widest text-copper uppercase shrink-0">Context System</span>
          <span class="text-charcoal/60 text-sm">Domain knowledge, team conventions, project state — fed into every AI interaction</span>
        </div>
      </div>
      <div class="rounded-b-2xl border border-charcoal/10 bg-warm-white p-5 md:p-6">
        <div class="flex items-baseline gap-3">
          <span class="text-xs font-medium tracking-widest text-warm-gray uppercase shrink-0">Edge</span>
          <span class="text-charcoal/60 text-sm">Tools, APIs, repos, CI/CD</span>
        </div>
      </div>
    </div>

    <!-- Layer descriptions -->
    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <div class="space-y-4">
        <h3 class="font-medium text-charcoal flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-copper"></span>
          The context system
        </h3>
        <p class="text-charcoal/70 leading-relaxed">
          Builds your organization's world model: domain knowledge, team conventions, codebase patterns, and project state in machine-readable form. With it, every AI interaction has full organizational context. Without it, every prompt starts from zero.
        </p>
      </div>
      <div class="space-y-4">
        <h3 class="font-medium text-charcoal flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
          Agent coordination
        </h3>
        <p class="text-charcoal/70 leading-relaxed">
          Replaces the coordination work that hierarchy exists to perform. Multi-agent systems that route tasks, validate output, and handle failures — so your team reviews and decides instead of relaying and coordinating.
        </p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto space-y-6">
      <p class="text-lg text-charcoal/70 leading-relaxed border-l-2 border-copper pl-6">
        I embed with your team 2–3 days a week and build both layers. Most consultancies hand you a strategy deck. I stay until the context system and agent coordination are running and your team can maintain them without me.
      </p>
    </div>
  </div>
</Section>

<!-- How It Works -->
<Section id="how-it-works" background="muted" padding="lg" eyebrow="04" title="How it works">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
    <a href="/scan/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-primary card-lift flex flex-col">
      <span class="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4 w-fit">
        Start here
      </span>
      <h3 class="text-xl font-medium text-charcoal mb-2">AI Scan</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">$2,500–$3,500</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        In 48 hours, I diagnose your Intelligence Maturity level: where you are on the path from "bought tools" to "AI coordinates our work." You get a clear picture of what's missing and quick wins your team can act on this week.
      </p>
      <p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
    </a>

    <a href="/context-build/" class="group p-8 bg-warm-white rounded-2xl border-2 border-primary flex flex-col relative">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
        Deep dive
      </span>
      <h3 class="text-xl font-medium text-charcoal mb-2">Context Build</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">$10,000–$15,000+</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        I map your organization's world model gaps, design the Context Layer, and build the infrastructure that feeds your domain knowledge into every AI interaction. Your team goes from "every prompt starts from zero" to "AI knows our business."
      </p>
      <p class="mt-4 text-sm text-charcoal/50">1-2 week assessment + 4-week build</p>
    </a>

    <a href="/orchestration-build/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-primary card-lift flex flex-col">
      <h3 class="text-xl font-medium text-charcoal mb-2">Orchestration Build</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">4–12 weeks</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        I build the agent coordination layer: multi-agent workflows, quality gates, output routing. Your team goes from "AI helps individuals" to "AI coordinates our work."
      </p>
      <p class="mt-4 text-sm text-charcoal/50">Day rate, scoped from assessment</p>
    </a>

    <a href="/fractional/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-copper card-lift flex flex-col">
      <span class="inline-block px-3 py-1 text-xs font-medium text-copper bg-copper/10 rounded-full mb-4 w-fit">
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
