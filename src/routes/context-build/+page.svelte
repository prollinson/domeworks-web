<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Context Build - Build Your Organization's Intelligence Layer | DomeWorks</title>
  <meta name="description" content="A two-week engagement that diagnoses your Intelligence Maturity and designs the Context Layer your AI tools need to work at the team level. $10,000-$15,000." />
  <link rel="canonical" href="https://domeworks.ai/context-build/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.ai/context-build/" />
  <meta property="og:title" content="Context Build - Build Your Organization's Intelligence Layer | DomeWorks" />
  <meta property="og:description" content="A two-week engagement that diagnoses your Intelligence Maturity and designs the Context Layer your AI tools need to work at the team level." />
  <meta property="og:image" content="https://domeworks.ai/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Context Build - Build Your Organization's Intelligence Layer | DomeWorks" />
  <meta name="twitter:description" content="Diagnose your Intelligence Maturity and design the Context Layer your AI tools need to work at the team level." />
  <meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Context Build - Intelligence Maturity Assessment & Context Layer Design",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "Two-week engagement: stakeholder interviews, Intelligence Maturity assessment, tool and spend audit, Context Layer design, workflow mapping, blocker analysis, and a prioritized opportunity map.",
    "dateModified": "2026-04",
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
        Context Build
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        Build the world model your AI tools need to be useful<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        A two-week engagement that diagnoses your Intelligence Maturity and designs the Context Layer - the infrastructure that feeds domain knowledge, team conventions, and codebase patterns into every AI interaction. The transition from Level 1 (tool-first) to Level 2 (context-aware).
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
      { step: '1', title: 'Stakeholder interviews', desc: "I talk to your engineering leads, product managers, and ops people. Not a survey - real conversations about how they're using AI, where they're hitting walls, and what would actually help. This is where the real blockers - and the real opportunities - surface." },
      { step: '2', title: 'Tool and spend audit', desc: "I map every AI tool, every seat, every subscription. Who's using what, how often, and whether it's doing anything useful. You're probably paying for more AI tooling than you realize." },
      { step: '3', title: 'Context Layer diagnosis', desc: "I evaluate what's in place - and what's missing - between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling. Most teams have none of this. That's why adoption stalls at the individual level." },
      { step: '4', title: 'Blocker identification', desc: "Adoption stalls for specific reasons - often structural, not motivational. I find out which blockers are in your way - missing systems, cultural resistance, knowledge silos, tooling gaps - and how severe they are." }
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
      <h3 class="text-lg font-medium text-charcoal mb-3">Intelligence Maturity Assessment</h3>
      <p class="text-sm text-charcoal/60">
        What tools are in use, what's working, what's not. The gap between "engineers have AI" and "AI is part of how the team ships." A detailed picture you can share with your leadership team and use to justify next steps.
      </p>
    </div>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">Context Layer Blueprint</h3>
      <p class="text-sm text-charcoal/60">
        What domain knowledge needs to flow into AI interactions, and how. A design for the shared context layers, reliable workflows, and developer tooling that make AI useful beyond ad-hoc prompting.
      </p>
    </div>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">Prioritized Opportunity Map</h3>
      <p class="text-sm text-charcoal/60">
        A ranked list of specific systems and changes for your team. Each one has estimated effort, expected impact, and dependencies. You'll know exactly what to build first and why - plus two to three quick wins that pay off in days, not months.
      </p>
    </div>
  </div>
</Section>

<!-- What Happens Next -->
<Section background="muted" padding="lg" eyebrow="03" title="What happens next">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-4">
        The Context Build is designed to feed into an <a href="/orchestration-build/" class="text-primary hover:underline">Orchestration Build</a> - where we implement the systems the blueprint calls for. But there's no obligation. You get the deliverables either way.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        Some teams take the Context Build and build internally. That's fine. The quick wins alone tend to pay for the engagement. If you want to keep going, the Context Build gives us a clear starting point - no re-discovery, no wasted time.
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
      Ready to build the context layer your team needs?
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call, no obligation. I'll tell you whether a Context Build is the right move - or if a <a href="/scan/" class="text-primary hover:underline">Scan</a> is enough.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
