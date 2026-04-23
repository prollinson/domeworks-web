<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { reveal } from '$lib/actions/reveal'
  import { getBookCallUrl } from '$lib/utils/mailto'
  import JourneyBar from '$lib/components/ui/JourneyBar.svelte'
</script>

<svelte:head>
  <title>Context Build: Build Your Organization's Context System | DomeWorks</title>
  <meta name="description" content="A two-week engagement that diagnoses your AI readiness and designs the context system your AI tools need to work at the team level. $10,000-$15,000." />
  <link rel="canonical" href="https://domeworks.tech/context-build/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DomeWorks" />
  <meta property="og:url" content="https://domeworks.tech/context-build/" />
  <meta property="og:title" content="Context Build: Build Your Organization's Context System | DomeWorks" />
  <meta property="og:description" content="A two-week engagement that diagnoses your AI readiness and designs the context system your AI tools need to work at the team level." />
  <meta property="og:image" content="https://domeworks.tech/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Context Build: Build Your Organization's Context System | DomeWorks" />
  <meta name="twitter:description" content="Diagnose your AI readiness and design the context system your AI tools need to work at the team level." />
  <meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Context Build: AI Readiness Assessment & Context System Design",
    "provider": { "@type": "Organization", "name": "DomeWorks" },
    "description": "Two-week engagement: stakeholder interviews, AI readiness assessment, tool and spend audit, context system design, workflow mapping, blocker analysis, and a prioritized opportunity map.",
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
<section class="py-20 md:py-28 relative overflow-hidden" style="background: linear-gradient(135deg, #FAFAF7 65%, rgba(13,107,99,0.06));">
  <div class="absolute inset-0 grid-overlay opacity-50"></div>
  <!-- Architectural SVG: Pipeline diagram -->
  <div class="absolute right-0 bottom-0 w-64 md:w-96 opacity-[0.07] pointer-events-none" aria-hidden="true">
    <svg viewBox="0 0 200 160" fill="none">
      <rect x="10" y="10" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1"/>
      <rect x="10" y="55" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1"/>
      <rect x="10" y="100" width="50" height="30" rx="6" stroke="#0d6b63" stroke-width="1"/>
      <rect x="120" y="45" width="70" height="45" rx="8" stroke="#0d6b63" stroke-width="1.5"/>
      <line x1="60" y1="25" x2="120" y2="62" stroke="#0d6b63" stroke-width="0.8"/>
      <line x1="60" y1="70" x2="120" y2="67" stroke="#0d6b63" stroke-width="0.8"/>
      <line x1="60" y1="115" x2="120" y2="75" stroke="#0d6b63" stroke-width="0.8"/>
    </svg>
  </div>
  <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <JourneyBar current="context-build" />
      <h1 class="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.2] md:leading-[1.15]">
        Build the world model your AI tools need to be useful<span class="text-primary">.</span>
      </h1>
      <p class="mt-6 text-xl text-charcoal/70 leading-relaxed">
        A two-week engagement that designs the context system — the infrastructure that feeds your domain knowledge, team conventions, and codebase patterns into every AI interaction. The foundation for everything that comes after.
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
      { step: '1', title: 'Stakeholder interviews', desc: "I talk to your engineering leads, product managers, and ops people. Not a survey, but real conversations about how they're using AI, where they're hitting walls, and what would actually help. This is where the real blockers (and the real opportunities) surface." },
      { step: '2', title: 'Tool and spend audit', desc: "I map every AI tool, every seat, every subscription. Who's using what, how often, and whether it's doing anything useful. You're probably paying for more AI tooling than you realize." },
      { step: '3', title: 'Context system diagnosis', desc: "I evaluate what's in place, and what's missing, between your AI tools and how your team actually ships. Shared context, standard workflows, CI/CD integration, developer tooling. Most teams have none of this. That's why adoption stalls at the individual level." },
      { step: '4', title: 'Blocker identification', desc: "Adoption stalls for specific reasons, often structural, not motivational. I find out which blockers are in your way (missing systems, cultural resistance, knowledge silos, tooling gaps) and how severe they are." }
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
    <!-- AI Readiness Assessment — dark visual card with blueprint diagram -->
    <div class="p-8 bg-ink rounded-2xl relative overflow-hidden">
      <div class="absolute inset-0 texture-grain"></div>
      <div class="relative">
        <h3 class="text-lg font-medium text-white mb-1">AI Readiness Assessment</h3>
        <p class="text-xs text-warm-gray-light mb-6 leading-relaxed">
          How your tools, teams, and workflows map to the four-layer AI stack.
        </p>
        <!-- Blueprint SVG: sources → pipeline → surfaces -->
        <svg viewBox="0 0 220 160" class="w-full block" aria-label="Context system blueprint diagram showing sources flowing through a context pipeline to surfaces">
          <!-- Source nodes -->
          <rect x="8" y="8" width="60" height="28" rx="6" fill="rgba(13,107,99,0.15)" stroke="rgba(13,107,99,0.4)" stroke-width="1"/>
          <text x="38" y="26" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-weight="500">Codebase</text>
          <rect x="80" y="8" width="60" height="28" rx="6" fill="rgba(13,107,99,0.15)" stroke="rgba(13,107,99,0.4)" stroke-width="1"/>
          <text x="110" y="26" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-weight="500">Docs</text>
          <rect x="152" y="8" width="60" height="28" rx="6" fill="rgba(13,107,99,0.15)" stroke="rgba(13,107,99,0.4)" stroke-width="1"/>
          <text x="182" y="26" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-weight="500">Tickets</text>
          <!-- Arrows down -->
          <line x1="38" y1="36" x2="38" y2="58" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <line x1="110" y1="36" x2="110" y2="58" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <line x1="182" y1="36" x2="182" y2="58" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <!-- Context Pipeline -->
          <rect x="8" y="58" width="204" height="36" rx="8" fill="rgba(176,125,79,0.12)" stroke="rgba(176,125,79,0.4)" stroke-width="1.5"/>
          <text x="110" y="80" text-anchor="middle" fill="#B07D4F" font-size="9" font-weight="600" letter-spacing="0.08em">CONTEXT PIPELINE</text>
          <!-- Arrows down -->
          <line x1="38" y1="94" x2="38" y2="116" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <line x1="110" y1="94" x2="110" y2="116" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <line x1="182" y1="94" x2="182" y2="116" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <!-- Surface nodes -->
          <rect x="8" y="116" width="60" height="28" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="38" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8">IDE</text>
          <rect x="80" y="116" width="60" height="28" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="110" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8">CI/CD</text>
          <rect x="152" y="116" width="60" height="28" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="182" y="134" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8">Chat</text>
        </svg>
      </div>
    </div>

    <!-- Prioritized Opportunity Map — dark visual card with impact bars -->
    <div class="p-8 bg-ink rounded-2xl relative overflow-hidden">
      <div class="absolute inset-0 texture-grain"></div>
      <div class="relative">
        <h3 class="text-lg font-medium text-white mb-1">Prioritized Opportunity Map</h3>
        <p class="text-xs text-warm-gray-light mb-6 leading-relaxed">
          Ranked actions with effort, impact, and dependencies.
        </p>
        <!-- Opportunity items -->
        <div class="flex flex-col gap-4">
          {#each [
            { name: 'Shared context files', effort: '1 week', width: '92%', color: 'bg-primary', dot: 'bg-primary' },
            { name: 'PR review agent', effort: '2 weeks', width: '75%', color: 'bg-primary', dot: 'bg-primary' },
            { name: 'Onboarding automation', effort: '3 weeks', width: '55%', color: 'bg-copper', dot: 'bg-copper' },
            { name: 'Meeting summaries', effort: '4 weeks', width: '30%', color: 'bg-warm-gray', dot: 'bg-warm-gray' }
          ] as item}
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-1.5 h-1.5 rounded-full {item.dot} shrink-0"></span>
                <span class="text-[11px] text-warm-white/80">{item.name}</span>
                <span class="ml-auto text-[9px] text-warm-white/35 font-medium">{item.effort}</span>
              </div>
              <div class="h-[5px] bg-warm-white/[0.06] rounded-full overflow-hidden ml-3.5">
                <div class="h-full {item.color} rounded-full opacity-70" style="width: {item.width}"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Context System Blueprint — text card -->
    <div class="p-8 bg-stone rounded-2xl border border-charcoal/10">
      <h3 class="text-lg font-medium text-charcoal mb-3">Context System Blueprint</h3>
      <p class="text-sm text-charcoal/60">
        What domain knowledge needs to flow into AI interactions, and how. A design for the shared context, reliable workflows, and developer tooling that make AI useful beyond ad-hoc prompting.
      </p>
    </div>
  </div>
</Section>

<!-- What Happens Next -->
<Section background="muted" padding="lg" eyebrow="03" title="What happens next">
  <div class="max-w-2xl mx-auto" use:reveal>
    <div class="p-8 bg-warm-white rounded-2xl border border-charcoal/10">
      <p class="text-lg text-charcoal/70 leading-relaxed mb-4">
        The Context Build is designed to feed into an <a href="/orchestration-build/" class="text-primary hover:underline">Orchestration Build</a>, where we build the agent coordination layer the blueprint calls for. But there's no obligation. You get the deliverables either way.
      </p>
      <p class="text-lg text-charcoal/70 leading-relaxed">
        Some teams take the Context Build and build internally. That's fine. The quick wins alone tend to pay for the engagement. If you want to keep going, the Context Build gives us a clear starting point with no re-discovery and no wasted time.
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
    <p class="text-center text-charcoal/60 text-sm mt-4">
      I'll give you an exact number after a 30-minute call. No hourly billing surprises, no change orders.
    </p>
  </div>
</Section>

<!-- FAQ -->
<Section background="muted" padding="lg" eyebrow="05" title="Common questions">
  <div class="max-w-2xl mx-auto space-y-4" use:reveal>
    <details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        What access do you need?
        <svg class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">Stakeholder time (30-minute interviews with 3–5 people), plus tool admin access for the audit. I'll provide a specific list after the kickoff call.</p>
    </details>
    <details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        Do you sign NDAs?
        <svg class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">Yes, standard mutual NDA before any access is granted. I can use yours or provide mine.</p>
    </details>
    <details class="group p-6 bg-warm-white rounded-xl border border-charcoal/10">
      <summary class="flex items-center justify-between cursor-pointer list-none font-medium text-charcoal">
        What if we want to build internally after?
        <svg class="w-5 h-5 text-charcoal/60 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <p class="mt-4 text-charcoal/70 leading-relaxed">That's fine. The deliverables are designed to be actionable without me. Some teams take the Context Build and handle the rest internally — the quick wins alone tend to pay for the engagement.</p>
    </details>
  </div>
</Section>

<!-- Journey nudge -->
<div class="border-t border-charcoal/8 py-8">
  <div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
    <p class="text-sm text-charcoal/60">
      Next in the journey: <a href="/orchestration-build/" class="text-primary hover:underline font-medium">Orchestration Build &rarr;</a>
    </p>
  </div>
</div>
