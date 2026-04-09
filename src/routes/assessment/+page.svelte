<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>AI Assessment — What's Blocking Your Team | DomeWorks</title>
  <meta name="description" content="A two-week deep dive into your team's AI adoption. Stakeholder interviews, infrastructure analysis, and a prioritized build plan. $10,000-$15,000." />
  <link rel="canonical" href="https://domeworks.tech/assessment/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/assessment/" />
  <meta property="og:title" content="AI Assessment — What's Blocking Your Team | DomeWorks" />
  <meta property="og:description" content="A two-week deep dive into your team's AI adoption. Stakeholder interviews, infrastructure analysis, and a prioritized build plan." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI Assessment — What's Blocking Your Team | DomeWorks" />
  <meta name="twitter:description" content="A two-week deep dive into your team's AI adoption. Stakeholder interviews and a prioritized build plan." />
  <meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Infrastructure Assessment",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "Two-week engagement: stakeholder interviews, tool and spend audit, workflow assessment, blocker identification, and a prioritized build plan.",
    "dateModified": "2026-03",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "10000",
      "highPrice": "15000",
      "priceCurrency": "USD"
    }
  })}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-xs font-medium tracking-widest text-primary uppercase mb-6">
        Assessment
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        Find out what's actually happening with AI on your team<span class="text-primary">.</span> Then fix it<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        A two-week engagement where I figure out what's actually happening with AI at your company — not what the dashboards say — and what's blocking it from working at the team level.
      </p>
      <div class="mt-8">
        <Button href={getBookCallUrl()} size="lg">
          Book a call
        </Button>
      </div>
    </div>
  </div>
</section>

<!-- Four Things Happen -->
<Section background="muted" padding="lg" eyebrow="01" title="Four things happen">
  <div class="max-w-2xl mx-auto space-y-8" use:reveal>
    {#each [
      { step: '1', title: 'Stakeholder interviews', desc: "I talk to your engineering leads, product managers, and ops people. Not a survey — real conversations about how they're using AI, where they're hitting walls, and what would actually help. This is where the real blockers — and the real opportunities — surface." },
      { step: '2', title: 'Tool and spend audit', desc: "I map every AI tool, every seat, every subscription. Who's using what, how often, and whether it's doing anything useful." },
      { step: '3', title: 'Workflow assessment', desc: "I evaluate what's in place — and what's missing — between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling." },
      { step: '4', title: 'Blocker identification', desc: "Adoption stalls for specific reasons — often structural, not motivational. I find out which blockers are in your way — missing systems, cultural resistance, knowledge silos, tooling gaps — and how severe they are." }
    ] as item}
      <div class="flex items-start gap-6">
        <span class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">
          {item.step}
        </span>
        <div>
          <h3 class="font-medium text-charcoal mb-1">{item.title}</h3>
          <p class="text-charcoal/70">{item.desc}</p>
        </div>
      </div>
    {/each}
  </div>
</Section>

<!-- What You Get -->
<Section background="white" padding="lg" eyebrow="02" title="What you get">
  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 150 }}>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">Where you stand</h3>
      <p class="text-sm text-charcoal/60">
        What tools are in use, what's working, what's not. The gap between "engineers have AI" and "AI is part of how the team ships." A detailed picture you can share with your leadership team.
      </p>
    </div>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">What to build, in what order</h3>
      <p class="text-sm text-charcoal/60">
        A ranked list of specific systems and changes for your team. Each one has estimated effort, expected impact, and dependencies. You'll know exactly what to do first and why.
      </p>
    </div>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">Quick wins</h3>
      <p class="text-sm text-charcoal/60">
        Two to three things your team can do immediately — before any further engagement. Changes that pay off in days, not months. The quick wins alone tend to pay for the assessment.
      </p>
    </div>
  </div>
</Section>

<!-- What Happens Next -->
<Section background="muted" padding="lg" eyebrow="03" title="What happens next">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-4">
        The assessment feeds into a design and build phase, but there's no obligation. You get the deliverables either way.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        Some teams take the assessment and build internally. That's fine. If you want to keep going, the assessment gives us a clear starting point — no re-discovery, no wasted time.
      </p>
    </div>
  </div>
</Section>

<!-- Pricing -->
<Section background="white" padding="lg" eyebrow="04" title="Investment">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="overflow-hidden rounded-2xl border border-charcoal/10">
      <table class="w-full">
        <thead>
          <tr class="bg-primary text-white">
            <th class="text-left px-6 py-4 text-sm font-medium">Team Size</th>
            <th class="text-right px-6 py-4 text-sm font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-warm-white">
            <td class="px-6 py-4 text-charcoal">5–20 people, 1-2 squads</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$10,000</td>
          </tr>
          <tr class="bg-stone">
            <td class="px-6 py-4 text-charcoal">20–80 people, 3-6 squads</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$12,500</td>
          </tr>
          <tr class="bg-warm-white">
            <td class="px-6 py-4 text-charcoal">80+ people, multi-department</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$15,000</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
      <p class="text-sm text-charcoal/80">
        <strong>Founding client rate:</strong> $7,000–$10,000 for the first 3-5 clients, in exchange for a case study and testimonial. Mention it on the call.
      </p>
    </div>
    <p class="text-center text-charcoal/50 text-sm mt-4">
      I'll give you an exact number after a 30-minute call. No hourly billing surprises, no change orders.
    </p>
  </div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Ready to find out what's blocking your team?
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call, no obligation. I'll tell you whether an Assessment is the right move — or if a Scan is enough.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
