<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>DomeWorks — AI Infrastructure Engineering for Teams</title>
  <meta name="description" content="AI engineering consultancy that builds developer workflow automation, agent infrastructure, and shared context systems for engineering teams. Your team bought AI tools — I make them work." />
  <link rel="canonical" href="https://domeworks.tech/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/" />
  <meta property="og:title" content="DomeWorks — AI Infrastructure Engineering for Teams" />
  <meta property="og:description" content="AI engineering consultancy that builds developer workflow automation and agent infrastructure for engineering teams. Your team bought AI tools — I make them work." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="DomeWorks — AI Infrastructure Engineering for Teams" />
  <meta name="twitter:description" content="Your team bought AI tools. A few engineers use them. The team isn't shipping faster." />
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
        "description": "AI engineering consultancy specializing in developer workflow automation, agent infrastructure, and shared context systems for engineering teams.",
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why not just assign one of our engineers to figure out AI adoption?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "They'd spend 3-6 months learning from scratch while pulled off product work. DomeWorks compresses that to 4-8 weeks with patterns already proven across multiple teams. Your best engineer stays on the product."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between the AI Scan and the Assessment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Scan shows what's happening — hard data on spend, adoption, and waste. The Assessment explains why and designs what to build. Many clients start with the Scan and proceed to the Assessment once they see the data."
            }
          },
          {
            "@type": "Question",
            "name": "What happens when the DomeWorks engagement ends?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your team owns everything. DomeWorks builds systems designed to be maintained and extended without ongoing dependency. The AI landscape moves fast — there's always a next phase to build, but you should be choosing it, not depending on a consultant."
            }
          },
          {
            "@type": "Question",
            "name": "How is DomeWorks different from other AI consultants?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most AI consultants advise. DomeWorks embeds with your team and builds the systems. The deliverable is working infrastructure — shared context, reliable workflows, configured tools — not a strategy deck."
            }
          },
          {
            "@type": "Question",
            "name": "What does 'embed with the team' actually mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DomeWorks joins your standups, pairs with your engineers, sits in on planning, writes code, builds systems, and ships alongside your team. 2-3 days a week, on-site or remote."
            }
          },
          {
            "@type": "Question",
            "name": "Why hire a solo AI consultancy instead of a larger firm?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You get a senior hands-on builder — not a partner who sells and a junior who delivers. Every hour you pay for is spent by someone with a decade of engineering leadership at DoorDash and Square. No bench, no overhead, no theater."
            }
          }
        ]
      }
    ]
  })}</script>`}
</svelte:head>

<!-- Skip to content -->
<a href="#how-it-works" class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
  Skip to content
</a>

<!-- Hero Section -->
<section class="relative hero-section bg-ink overflow-hidden" aria-label="Hero">
  <!-- Architectural grid background -->
  <div class="absolute inset-0 hero-grid" aria-hidden="true" role="presentation"></div>
  <!-- Warm ambient glow — bottom-left copper, top-right teal -->
  <div class="absolute inset-0 hero-glow" aria-hidden="true" role="presentation"></div>
  <!-- Grain texture -->
  <div class="absolute inset-0 texture-grain" aria-hidden="true" role="presentation"></div>
  <!-- Horizontal architectural rules -->
  <div class="absolute inset-0 pointer-events-none hero-rules" aria-hidden="true" role="presentation"></div>

  <!-- Monogram as architectural column — anchored to right edge, structurally integrated -->
  <div class="absolute inset-0 pointer-events-none hero-monogram-container" aria-hidden="true" role="presentation">
    <span class="hero-monogram font-serif select-none">D</span>
  </div>

  <!-- Vertical accent line — copper rule that runs the height of the hero -->
  <div class="absolute hero-accent-line" aria-hidden="true" role="presentation"></div>

  <div class="relative w-full max-w-7xl mx-auto px-6 lg:px-8 hero-content-pad flex flex-col justify-between min-h-[inherit]">
    <!-- Top zone: Eyebrow -->
    <div class="hero-eyebrow-row">
      <span class="hero-eyebrow-text">AI Infrastructure Engineering</span>
      <div class="flex-1 h-px bg-warm-white/8 ml-6" aria-hidden="true" role="presentation"></div>
      <span class="hero-eyebrow-index">San Francisco</span>
    </div>

    <!-- Middle zone: Headline — editorial scale, staggered lines -->
    <div class="hero-middle">
      <h1 class="hero-headline font-serif font-normal text-warm-white">
        <span class="hero-line hero-line-1">Your team</span>
        <span class="hero-line hero-line-2">bought AI tools<span class="text-copper">.</span></span>
        <span class="hero-line hero-line-3"><em class="hero-headline-em">Nobody built</em></span>
        <span class="hero-line hero-line-4 text-warm-white/70">the systems<span class="text-copper/70">.</span></span>
      </h1>

      <!-- Subtext — positioned as an editorial aside, offset from the headline -->
      <div class="hero-aside">
        <div class="hero-aside-rule" aria-hidden="true" role="presentation"></div>
        <p class="hero-body-text text-warm-white/85 leading-relaxed">
          The problem isn't the tools. It's that nobody built the systems connecting them to how your team actually works.
        </p>
        <p class="mt-3 text-sm text-warm-white/75 leading-relaxed hidden sm:block">
          Developer workflow automation, agent infrastructure, and shared context systems for engineering teams.
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

    <!-- Bottom zone: Stat strip — editorial data bar -->
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
          <span class="hero-stat-label">AI Scan turnaround</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
        <div class="hero-stat-cell">
          <span class="hero-stat-value font-serif">4–8wk</span>
          <span class="hero-stat-label">Time to team adoption</span>
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
          <span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">Scan delivery</span>
        </div>
        <div class="hero-stat-divider" aria-hidden="true" role="presentation"></div>
        <div class="hero-stat-cell-mobile">
          <span class="text-2xl font-serif text-warm-white/95">4–8wk</span>
          <span class="text-xs text-warm-white/70 mt-1 tracking-wider uppercase leading-tight">To adoption</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- The Problem -->
<Section background="muted" padding="lg" eyebrow="01" title="Why AI tools fail at the team level">
  <div class="max-w-2xl mx-auto space-y-6" use:reveal>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      Your engineers have AI tools. A few power users are productive with them. But at the team level, nothing has changed.
    </p>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      Every engineer is on their own — prompting from scratch, getting inconsistent results, reinventing the wheel. There's no shared context about your codebase feeding into AI tools. No standard workflows. No way to make AI-assisted work reliable and reviewable.
    </p>
    <div class="grid sm:grid-cols-2 gap-4 mt-8">
      <div class="p-5 bg-warm-white rounded-xl border border-charcoal/10">
        <p class="text-3xl font-normal font-serif text-charcoal">95%</p>
        <p class="text-sm text-charcoal/60 mt-1">of AI pilots fail to deliver measurable financial returns <span class="text-charcoal/40">(Rand, 2024)</span></p>
      </div>
      <div class="p-5 bg-warm-white rounded-xl border border-charcoal/10">
        <p class="text-3xl font-normal font-serif text-charcoal">42%</p>
        <p class="text-sm text-charcoal/60 mt-1">of companies scrapped most of their AI initiatives last year <span class="text-charcoal/40">(S&P Global, 2024)</span></p>
      </div>
    </div>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      Not because the tools are bad — because nobody built the connective tissue between the tools and the work.
    </p>
  </div>
</Section>

<!-- How It Works -->
<Section id="how-it-works" background="white" padding="lg" eyebrow="02" title="How it works">
  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
    <a href="/scan/" class="group p-8 bg-warm-white rounded-2xl border border-charcoal/10 hover:border-primary card-lift flex flex-col">
      <span class="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4 w-fit">
        Start here
      </span>
      <h3 class="text-xl font-medium text-charcoal mb-2">AI Scan</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">$2,500–$3,500</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        In 48 hours, I map your AI spend, adoption patterns, and wasted seats. You get a clear picture of what's working and what isn't — plus quick wins your team can act on this week.
      </p>
      <p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
    </a>

    <a href="/assessment/" class="group p-8 bg-warm-white rounded-2xl border-2 border-primary flex flex-col relative">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
        Deep dive
      </span>
      <h3 class="text-xl font-medium text-charcoal mb-2">Assessment</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">$10,000–$15,000</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        The deeper engagement. I interview your stakeholders, assess what's missing between "engineers have tools" and "the team ships faster," and design a build plan. 1-2 weeks.
      </p>
      <p class="mt-4 text-sm text-primary font-medium group-hover:underline">Learn more &rarr;</p>
    </a>

    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10 border-dashed flex flex-col opacity-90">
      <h3 class="text-xl font-medium text-charcoal mb-2">Build</h3>
      <p class="text-2xl font-normal font-serif text-charcoal mb-4">4–12 weeks</p>
      <p class="text-charcoal/60 text-sm flex-grow">
        I embed with your team 2-3 days a week and build the systems. Shared context layers, reliable workflows, developer tooling, team training. Not a handoff — I'm in the work with you.
      </p>
      <p class="mt-4 text-sm text-charcoal/40">Scoped from assessment findings</p>
    </div>
  </div>
</Section>

<!-- Who This Is For -->
<Section background="muted" padding="lg" eyebrow="03" title="Who this is for">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 md:p-12 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-6">
        You're a <strong class="text-charcoal">VP of Engineering, Head of Engineering, or CTO</strong> at a mid-market SaaS company (50-500 people) or a funded startup. Your engineers have AI tools but the team isn't shipping faster.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed mb-6">
        You've probably thought about assigning a senior engineer to figure this out. But they'd be learning from scratch, and you'd lose their output on product work for months.
      </p>
      <p class="text-lg text-charcoal leading-relaxed font-medium border-l-2 border-copper pl-6">
        You need someone who's already done this — who knows what works and what doesn't — so your team gets the systems without the trial-and-error tax.
      </p>
    </div>
  </div>
</Section>

<!-- What I Build -->
<Section background="white" padding="lg" eyebrow="04" title="What AI infrastructure engineering looks like">
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 100 }}>
    {#each [
      { title: 'Shared context layers', desc: 'CLAUDE.md, conventions, and codebase knowledge fed to AI tools so every engineer gets relevant, consistent output.' },
      { title: 'Agent workflows', desc: 'Reliable, reviewable AI-assisted workflows for code review, PR creation, and testing — so your team can ship AI-assisted code with the same confidence as hand-written code.' },
      { title: 'CI/CD integration', desc: 'AI tools wired into your deployment pipeline — so AI-generated code gets the same automated checks as human code before it hits production.' },
      { title: 'Team conventions', desc: 'Working agreements, review standards, and quality gates — so your leads can trust AI-assisted PRs without reviewing every line twice.' },
      { title: 'Developer tooling', desc: 'Custom tools that fit how your team ships — not how a vendor imagines you should.' },
      { title: 'Adoption systems', desc: 'Infrastructure that makes AI useful by default, not by individual effort or motivation.' }
    ] as item}
      <div class="p-6 bg-stone rounded-xl border border-charcoal/10">
        <h3 class="font-medium text-charcoal mb-2">{item.title}</h3>
        <p class="text-sm text-charcoal/60">{item.desc}</p>
      </div>
    {/each}
  </div>
</Section>

<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
  <div class="max-w-2xl mx-auto divide-y divide-charcoal/10" use:reveal>
    {#each [
      {
        q: "Why not just assign one of our engineers to figure this out?",
        a: "They'd spend 3-6 months learning from scratch while pulled off product work. I compress that to 4-8 weeks with patterns already proven across multiple teams. Your best engineer stays on the product."
      },
      {
        q: "What's the difference between the Scan and the Assessment?",
        a: "The Scan shows what's happening — hard data on spend, adoption, and waste. The Assessment explains why and designs what to build. Many clients start with the Scan and proceed to the Assessment once they see the data."
      },
      {
        q: "What happens when the engagement ends?",
        a: "Your team owns everything. I build systems designed to be maintained and extended without me. The AI landscape moves fast — there's always a next phase to build, but you should be choosing it, not depending on me."
      },
      {
        q: "How is this different from other AI consultants?",
        a: "Most AI consultants advise. I embed with your team and build the systems. The deliverable is working infrastructure — shared context, reliable workflows, configured tools — not a strategy deck."
      },
      {
        q: "What does 'embed with the team' actually mean?",
        a: "I join your standups. I pair with your engineers. I sit in on planning. I write code, build systems, and ship alongside your team. 2-3 days a week, on-site or remote."
      },
      {
        q: "Why a solo consultancy instead of a larger AI consulting firm?",
        a: "You get a senior hands-on builder — not a partner who sells and a junior who delivers. Every hour you pay for is spent by someone with a decade of engineering leadership at DoorDash and Square. No bench, no overhead, no theater. The firms with 10-50 people charge more and staff you with people learning on the job."
      }
    ] as item}
      <details class="group py-6">
        <summary class="flex items-center justify-between cursor-pointer list-none py-1 min-h-[44px]">
          <span class="font-medium text-charcoal pr-4">{item.q}</span>
          <svg class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p class="mt-4 text-charcoal/70 leading-[1.65]">{item.a}</p>
      </details>
    {/each}
  </div>
</Section>

<!-- Bottom CTA -->
<Section background="white" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Your team has the tools<span class="text-primary">.</span> Let's make them work<span class="text-primary">.</span>
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call, no obligation. I'll tell you whether this is something I can help with.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
