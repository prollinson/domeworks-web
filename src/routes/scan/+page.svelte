<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import JourneyBar from '$lib/components/ui/JourneyBar.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>AI Scan: What Your AI Spend Is Actually Doing | DomeWorks</title>
  <meta name="description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround, $2,500-$3,500 fixed price." />
  <link rel="canonical" href="https://domeworks.tech/scan/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/scan/" />
  <meta property="og:title" content="AI Scan: What Your AI Spend Is Actually Doing | DomeWorks" />
  <meta property="og:description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround, $2,500-$3,500 fixed price." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI Scan: What Your AI Spend Is Actually Doing | DomeWorks" />
  <meta name="twitter:description" content="Find out exactly what your AI spend is doing for your team. 48-hour turnaround." />
  <meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

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
<section class="py-20 md:py-28 relative overflow-hidden" style="background: linear-gradient(135deg, #FAFAF7 70%, rgba(13,107,99,0.04));">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <!-- Architectural SVG: Radar sweep -->
  <div class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none" aria-hidden="true">
    <svg viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" stroke="#0d6b63" stroke-width="1"/>
      <circle cx="100" cy="100" r="60" stroke="#0d6b63" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="30" stroke="#0d6b63" stroke-width="0.5"/>
      <line x1="100" y1="100" x2="170" y2="40" stroke="#0d6b63" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="3" fill="#0d6b63"/>
    </svg>
  </div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <JourneyBar current="scan" />
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        What you're spending on AI<span class="text-primary">.</span> What you're getting from it<span class="text-primary">.</span> In 48 hours<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        You're probably paying for more AI tooling than you realize. Some of it's being used well. Some of it's shelfware. The AI Scan maps it all (every tool, every seat, every dollar) and diagnoses your AI readiness score: where you are on the path from "bought tools" to "AI coordinates our work."
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
      { title: '3 Quick Wins', desc: 'Specific actions your team can take this week. Not "consider an AI strategy," but things like "cancel these 12 idle seats" or "set up a team working agreement for AI-assisted code review."' },
      { title: 'AI Readiness Score', desc: 'A 1-5 rating across five dimensions: tool coverage, adoption rate, workflow integration, spend efficiency, team capability. Shows where you are on the path from "bought tools" to "AI coordinates our work," designed to be shareable with your CEO.' }
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
        The Scan shows you <strong class="text-charcoal">what's happening</strong>. If you want to understand <strong class="text-charcoal">why</strong> and design <strong class="text-charcoal">what to build</strong>, the <a href="/context-build/" class="text-primary hover:underline">Context Build</a> is the next step. There's no obligation, though. Plenty of teams take the Scan, implement the quick wins, and handle the rest internally.
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
    <p class="text-center text-charcoal/60 text-sm mt-4">
      Fixed price, no surprises. 48-hour turnaround.
    </p>
  </div>
</Section>

<!-- FAQ -->
<Section background="white" padding="lg" eyebrow="05" title="Common questions">
  <div class="max-w-2xl mx-auto space-y-4" use:reveal>
    <details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        What access do you need?
        <svg class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">Admin credentials or exports from your AI tools (Cursor, Copilot, Claude, ChatGPT for Teams, etc.) plus a 15-minute walkthrough of your team structure.</p>
    </details>
    <details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        What if we're a remote team?
        <svg class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">Fully remote-friendly. The survey is async, the report is delivered digitally. No on-site requirement.</p>
    </details>
    <details class="group p-6 bg-stone rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        Is there any obligation after the Scan?
        <svg class="w-5 h-5 text-charcoal/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">No. Many teams take the quick wins and run. The Scan stands on its own — if you want to go further, the <a href="/context-build/" class="text-primary hover:underline">Context Build</a> is the next step, but there's no obligation.</p>
    </details>
  </div>
</Section>

<!-- Journey nudge -->
<div class="border-t border-charcoal/8 py-8">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
    <p class="text-sm text-charcoal/60">
      Next in the journey: <a href="/context-build/" class="text-primary hover:underline font-medium">Context Build &rarr;</a>
    </p>
  </div>
</div>
