<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>AI Scan — What Your AI Spend Is Actually Doing | DomeWorks</title>
  <meta name="description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround, $2,500-$3,500 fixed price." />
  <link rel="canonical" href="https://domeworks.ai/scan/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.ai/scan/" />
  <meta property="og:title" content="AI Scan — What Your AI Spend Is Actually Doing | DomeWorks" />
  <meta property="og:description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround, $2,500-$3,500 fixed price." />
  <meta property="og:image" content="https://domeworks.ai/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI Scan — What Your AI Spend Is Actually Doing | DomeWorks" />
  <meta name="twitter:description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround." />
  <meta name="twitter:image" content="https://domeworks.ai/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Scan",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "48-hour audit of your team's AI tool spend, adoption patterns, and wasted seats. Fixed price, clear deliverables.",
    "dateModified": "2026-03",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "2500",
      "highPrice": "3500",
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
        AI Scan
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        What you're spending on AI<span class="text-primary">.</span> What you're getting from it<span class="text-primary">.</span> In 48 hours<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        You're probably paying for more AI tooling than you realize. Some of it's being used well. Some of it's shelfware. The AI Scan maps it all — every tool, every seat, every dollar — and diagnoses your Intelligence Maturity level: where you are on the path from "bought tools" to "AI coordinates our work."
      </p>
      <div class="mt-8">
        <Button href={getBookCallUrl()} size="lg">
          Book a call
        </Button>
      </div>
    </div>
  </div>
</section>

<!-- What Happens -->
<Section background="muted" padding="lg" eyebrow="01" title="What happens">
  <div class="max-w-2xl mx-auto space-y-8" use:reveal>
    {#each [
      { step: '1', title: 'You give me access', desc: 'Admin credentials or exports from your AI tools (Cursor, Copilot, Claude, ChatGPT for Teams, etc.) plus a 15-minute walkthrough of your team structure.' },
      { step: '2', title: 'I survey the team', desc: 'A structured 5-minute async questionnaire goes to 5-10 engineers. Specific questions about what they use, how often, and where they hit friction.' },
      { step: '3', title: '48 hours later, you get the report', desc: 'Five concrete deliverables. No fluff, no recommendations-without-data. Just a clear picture of where you stand.' }
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
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" use:reveal={{ stagger: true, staggerDelay: 100 }}>
    {#each [
      { title: 'AI Spend Map', desc: 'Every AI tool your company pays for, what it costs, who has access, and who\'s actually using it. Most teams discover 20-40% of their AI seats are idle.' },
      { title: 'Adoption Heatmap', desc: 'Where AI usage is concentrated (usually 2-3 power users) and where it\'s absent (usually 70-80% of the team). The gap visualized.' },
      { title: 'Wasted Spend Report', desc: 'Licensed-but-idle seats, redundant subscriptions, misconfigured plans. Typically finds $2,000-$8,000/year in immediate savings.' },
      { title: '3 Quick Wins', desc: 'Specific actions your team can take this week. Not "consider an AI strategy" — things like "cancel these 12 idle seats" or "set up a team working agreement for AI-assisted code review."' },
      { title: 'Intelligence Maturity Score', desc: 'A 1-5 rating across five dimensions: tool coverage, adoption rate, workflow integration, spend efficiency, team capability. Shows where you are on the path from "bought tools" to "AI coordinates our work" — designed to be shareable with your CEO.' }
    ] as item}
      <div class="p-6 bg-stone rounded-xl border border-charcoal/10">
        <h3 class="font-medium text-charcoal mb-2">{item.title}</h3>
        <p class="text-sm text-charcoal/60">{item.desc}</p>
      </div>
    {/each}
  </div>
</Section>

<!-- What This Isn't -->
<Section background="muted" padding="lg" eyebrow="03" title="What this isn't">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-4">
        This isn't a strategy engagement. I won't interview your stakeholders, diagnose cultural blockers, or design an implementation plan. That's what the <a href="/context-build/" class="text-primary hover:underline">Context Build</a> does.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        The Scan shows you <strong class="text-charcoal">what's happening</strong>. If you want to understand <strong class="text-charcoal">why</strong> and design <strong class="text-charcoal">what to build</strong>, the <a href="/context-build/" class="text-primary hover:underline">Context Build</a> is the next step. But there's no obligation — plenty of teams take the Scan, implement the quick wins, and handle the rest internally.
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
            <td class="px-6 py-4 text-charcoal">5–20 people</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$2,500</td>
          </tr>
          <tr class="bg-stone">
            <td class="px-6 py-4 text-charcoal">20–80 people</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$3,000</td>
          </tr>
          <tr class="bg-warm-white">
            <td class="px-6 py-4 text-charcoal">80+ people</td>
            <td class="px-6 py-4 text-right text-charcoal font-medium">$3,500</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center text-charcoal/50 text-sm mt-4">
      Fixed price, no surprises. 48-hour turnaround.
    </p>
  </div>
</Section>

<!-- CTA -->
<Section background="muted" padding="lg">
  <div class="max-w-2xl mx-auto text-center" use:reveal>
    <h2 class="font-serif text-3xl font-normal text-charcoal mb-4">
      Find out what your AI spend is doing
    </h2>
    <p class="text-lg text-charcoal/70 mb-8">
      30-minute call, no obligation. I'll tell you whether a Scan makes sense for your team.
    </p>
    <Button href={getBookCallUrl()} size="lg">
      Book a call
    </Button>
  </div>
</Section>
