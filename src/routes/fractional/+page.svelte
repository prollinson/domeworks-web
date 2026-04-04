<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks</title>
  <meta name="description" content="1–2 days/week ongoing retainer. I act as your part-time Head of AI, maintaining and evolving your context system and agent coordination as your org changes." />
  <link rel="canonical" href="https://domeworks.tech/fractional/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/fractional/" />
  <meta property="og:title" content="Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks" />
  <meta property="og:description" content="1–2 days/week ongoing retainer. Maintain and evolve your context system and agent coordination as your org changes." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Fractional AI Leadership: Ongoing AI Infrastructure | DomeWorks" />
  <meta name="twitter:description" content="1–2 days/week ongoing retainer. Maintain and evolve your AI infrastructure as your org changes." />
  <meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fractional AI Leadership",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "Ongoing monthly retainer: part-time Head of AI, 1–2 days per week. Maintains and evolves context system and agent coordination as the organization changes.",
    "dateModified": "2026-04"
  })}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-xs font-medium tracking-widest text-copper uppercase mb-6">
        Fractional AI Leadership
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        Intelligence infrastructure compounds when someone owns it<span class="text-copper">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        An ongoing retainer where I act as your part-time Head of AI, 1–2 days a week. I maintain and evolve the context system and agent coordination, close feedback loops, and adapt the infrastructure as your org changes.
      </p>
      <div class="mt-8">
        <Button href={getBookCallUrl()} size="lg">
          Book a call
        </Button>
      </div>
    </div>
  </div>
</section>

<!-- What This Is -->
<Section background="muted" padding="lg" eyebrow="01" title="What this is">
  <div class="max-w-2xl mx-auto space-y-6" use:reveal>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      After a Context Build or Orchestration Build, the infrastructure is live. The question is who owns it. Without ownership, systems drift: agents lose calibration, context goes stale, the infrastructure stops reflecting how the team actually works.
    </p>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      1–2 days a week, I'm embedded enough to catch drift before it compounds. I'm not managing your engineers or running your AI strategy meetings. I'm maintaining running systems and building the next layer when the org is ready for it.
    </p>
    <div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
      <p class="text-sm text-charcoal/70 leading-relaxed">
        This is not a starter engagement. The system needs to exist before it can be owned. If you're earlier in the journey, start with the <a href="/scan/" class="text-primary hover:underline">AI Scan</a> or <a href="/context-build/" class="text-primary hover:underline">Context Build</a>.
      </p>
    </div>
  </div>
</Section>

<!-- What I Do -->
<Section background="white" padding="lg" eyebrow="02" title="What I do">
  <div class="max-w-2xl mx-auto space-y-8" use:reveal>
    {#each [
      { title: 'Maintain and evolve the context system', desc: 'As your org changes — new teams, new workflows, new tooling — the context system needs to keep up. I update the world model and make sure AI interactions stay grounded in how the team actually works.' },
      { title: 'Tune agent coordination', desc: 'Close feedback loops, improve quality gate accuracy, fix routing logic. The system gets smarter over time instead of slowly drifting from what it was designed to do.' },
      { title: 'Identify the next layer to build', desc: 'As the infrastructure matures, there are always new systems worth building. I track what your team is still doing manually that intelligence infrastructure could replace, and scope the next engagement when the org is ready.' },
      { title: 'Act as your internal AI expert', desc: "I can advise your team, review AI system design decisions, and help your engineers understand and own what we built together. The goal is always a team that doesn't need me — I'm there to keep the compounding going while that capability builds." }
    ] as item}
      <div class="flex items-start gap-6">
        <span class="flex-shrink-0 w-2 h-2 rounded-full bg-copper mt-3"></span>
        <div>
          <h3 class="font-medium text-charcoal mb-1">{item.title}</h3>
          <p class="text-charcoal/70">{item.desc}</p>
        </div>
      </div>
    {/each}
  </div>
</Section>

<!-- Who It's For -->
<Section background="muted" padding="lg" eyebrow="03" title="Who this is for">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-6">
        Teams that have completed a <a href="/context-build/" class="text-primary hover:underline">Context Build</a> or <a href="/orchestration-build/" class="text-primary hover:underline">Orchestration Build</a> — or have equivalent infrastructure in place — and want the system to keep getting smarter as the org changes.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        If you're still figuring out your AI tooling or haven't built a context system yet, this isn't the right entry point. Start with the <a href="/scan/" class="text-primary hover:underline">AI Scan</a>.
      </p>
    </div>
  </div>
</Section>

<!-- Investment -->
<Section background="white" padding="lg" eyebrow="04" title="Investment">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
          <span class="text-charcoal font-medium">Commitment</span>
          <span class="text-charcoal">1–2 days/week</span>
        </div>
        <div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
          <span class="text-charcoal font-medium">Typical duration</span>
          <span class="text-charcoal">6+ months</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-charcoal font-medium">Pricing</span>
          <span class="text-charcoal">Monthly retainer, discussed on call</span>
        </div>
      </div>
    </div>
    <p class="text-center text-charcoal/50 text-sm mt-4">
      Rate depends on scope and what infrastructure is already in place.
    </p>
  </div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Want to keep the infrastructure compounding<span class="text-primary">?</span>
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call to discuss what's in place and whether fractional makes sense for where your team is.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
