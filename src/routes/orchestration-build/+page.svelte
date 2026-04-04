<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Orchestration Build: AI Coordination for Engineering Teams | DomeWorks</title>
  <meta name="description" content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Milestone-based, scoped from Context Build assessment." />
  <link rel="canonical" href="https://domeworks.ai/orchestration-build/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.ai/orchestration-build/" />
  <meta property="og:title" content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks" />
  <meta property="og:description" content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead." />
  <meta property="og:image" content="https://domeworks.ai/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Orchestration Build: AI Coordination for Engineering Teams | DomeWorks" />
  <meta name="twitter:description" content="Build the agent coordination layer: multi-agent workflows, quality gates, and output routing that replace human coordination overhead." />
  <meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Orchestration Build",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "Milestone-based engagement building the agent coordination layer: multi-agent workflows, quality gates, and output routing. Scoped from Context Build assessment.",
    "dateModified": "2026-04"
  })}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-warm-white py-20 md:py-28 relative overflow-hidden">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-xs font-medium tracking-widest text-primary uppercase mb-6">
        Orchestration Build
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        Your team goes from AI helping individuals to AI coordinating your work<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        The Orchestration Build takes the context system built during the Context Build and constructs agent coordination on top of it: multi-agent workflows, quality gates, and output routing that replace human coordination overhead. Scope and milestones are defined from the Context Build assessment.
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
      A milestone-based engagement, not a fixed process. The exact systems built depend on what the Context Build assessment revealed about your organization's coordination overhead.
    </p>
    <p class="text-lg text-charcoal/70 leading-relaxed">
      I embed with your team 2–3 days a week and build the agent coordination layer: the systems that route work, validate output, distribute context, and close feedback loops. Your team stops spending time coordinating what AI is doing and starts reviewing what it produces.
    </p>
    <div class="p-6 bg-warm-white rounded-xl border border-charcoal/10">
      <p class="text-sm text-charcoal/70 leading-relaxed">
        Common milestones: multi-agent task routing, quality gates replacing manual review, automated context distribution to AI tools, feedback loops that tune agent behavior over time. Which of these gets built first depends on your specific blockers.
      </p>
    </div>
  </div>
</Section>

<!-- Outcomes -->
<Section background="white" padding="lg" eyebrow="02" title="What changes">
  <div class="max-w-3xl mx-auto space-y-4" use:reveal={{ stagger: true, staggerDelay: 100 }}>
    {#each [
      { before: 'Status meetings to coordinate across teams', after: 'Agent coordination routes work and routes outputs automatically' },
      { before: 'Manual review of every AI-generated output', after: 'Quality gates validate before humans see it' },
      { before: 'Engineers prompting individually with no shared context', after: 'Coordinated agent workflows with full organizational context' },
      { before: 'Managers aggregating context from multiple teams', after: 'Systems that distribute context automatically' }
    ] as row}
      <div class="grid md:grid-cols-2 gap-4">
        <div class="p-5 bg-stone rounded-xl border border-charcoal/10">
          <p class="text-xs font-medium text-warm-gray uppercase tracking-widest mb-2">Before</p>
          <p class="text-charcoal/70">{row.before}</p>
        </div>
        <div class="p-5 bg-primary/5 rounded-xl border border-primary/20">
          <p class="text-xs font-medium text-primary uppercase tracking-widest mb-2">After</p>
          <p class="text-charcoal">{row.after}</p>
        </div>
      </div>
    {/each}
  </div>
</Section>

<!-- Prerequisites -->
<Section background="muted" padding="lg" eyebrow="03" title="What's required">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-4">
        A completed <a href="/context-build/" class="text-primary hover:underline">Context Build</a> (or equivalent assessment) is required. The context system is what agent coordination runs on. Without it, you're automating noise.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        Most Orchestration Builds follow directly from a Context Build — the assessment gives us the blueprint; this is where we build it. If you're starting from scratch, begin with the <a href="/context-build/" class="text-primary hover:underline">Context Build</a>.
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
          <span class="text-charcoal font-medium">Timeline</span>
          <span class="text-charcoal">4–12 weeks typical</span>
        </div>
        <div class="flex justify-between items-baseline border-b border-charcoal/10 pb-4">
          <span class="text-charcoal font-medium">Engagement model</span>
          <span class="text-charcoal">2–3 days/week, embedded</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-charcoal font-medium">Pricing</span>
          <span class="text-charcoal">Day rate, scoped on call</span>
        </div>
      </div>
    </div>
    <p class="text-center text-charcoal/50 text-sm mt-4">
      Exact scope and rate are defined after reviewing Context Build deliverables. Book a call to discuss.
    </p>
  </div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Ready to build the coordination layer<span class="text-primary">?</span>
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call, no obligation. If you've completed a Context Build, I'll walk through the assessment and outline the Orchestration Build scope.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
