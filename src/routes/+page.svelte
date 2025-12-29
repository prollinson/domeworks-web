<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { generateSmbMailto, generateEnterpriseMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Dome Works — Real Automation for Las Vegas Valley Businesses</title>
  <meta name="description" content="We identify your bottlenecks, integrate with your tools, and ship workflows that run unattended with monitoring, alerts, and clean handoff." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
  <!-- Subtle grid background - craft signal -->
  <div class="absolute inset-0 grid-overlay opacity-50"></div>

  <div class="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Text Content -->
      <div class="max-w-xl">
        <!-- Eyebrow -->
        <p class="text-sm font-medium tracking-widest text-primary uppercase mb-6">
          Las Vegas Valley
        </p>

        <!-- Headline - using serif for distinction -->
        <h1 class="font-serif text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold text-slate-900 leading-[1.1] tracking-tight">
          Real automation for your bottlenecks<span class="text-primary">.</span>
          <br class="hidden md:block" />
          Built for your tools<span class="text-primary">.</span>
        </h1>

        <!-- Subhead -->
        <p class="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed">
          We identify the manual choke points, integrate with Google Workspace, Slack, Microsoft, and HubSpot, and ship workflows that run unattended with monitoring, alerts, and clean handoff.
        </p>

        <!-- Budget anchor - premium positioning -->
        <div class="mt-8 flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-500">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Audit: $3,500–$7,500</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Sprint: $9,500–$24,000</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="mt-10 flex flex-col sm:flex-row gap-4">
          <Button href={generateSmbMailto()} size="lg">
            Email us your workflow
          </Button>
          <Button href="#examples" variant="secondary" size="lg">
            See examples
          </Button>
        </div>
      </div>

      <!-- Hero Illustration -->
      <div class="hidden lg:flex items-center justify-center">
        <div class="relative w-full max-w-md">
          <!-- Abstract workflow illustration -->
          <svg viewBox="0 0 400 400" class="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Background glow -->
            <circle cx="200" cy="200" r="160" class="fill-primary/5" />
            <circle cx="200" cy="200" r="120" class="fill-primary/5" />

            <!-- Connection lines -->
            <path d="M120 140 L200 200" class="stroke-slate-200" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M280 140 L200 200" class="stroke-slate-200" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M200 200 L120 260" class="stroke-primary/40" stroke-width="2" />
            <path d="M200 200 L280 260" class="stroke-primary/40" stroke-width="2" />
            <path d="M200 200 L200 300" class="stroke-primary" stroke-width="2" />

            <!-- Animated flow dots -->
            <circle r="4" class="fill-primary">
              <animateMotion dur="2s" repeatCount="indefinite" path="M200 200 L200 300" />
            </circle>
            <circle r="3" class="fill-primary/60">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M200 200 L120 260" />
            </circle>
            <circle r="3" class="fill-primary/60">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M200 200 L280 260" begin="0.5s" />
            </circle>

            <!-- Input nodes (top) -->
            <g class="drop-shadow-sm">
              <rect x="90" y="110" width="60" height="60" rx="12" class="fill-white stroke-slate-200" stroke-width="1.5" />
              <path d="M108 140 L132 140 M120 128 L120 152" class="stroke-slate-400" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="drop-shadow-sm">
              <rect x="250" y="110" width="60" height="60" rx="12" class="fill-white stroke-slate-200" stroke-width="1.5" />
              <circle cx="280" cy="140" r="12" class="stroke-slate-400 fill-none" stroke-width="2" />
              <circle cx="280" cy="140" r="4" class="fill-slate-400" />
            </g>

            <!-- Center processing node -->
            <g class="drop-shadow-md">
              <circle cx="200" cy="200" r="36" class="fill-primary" />
              <path d="M185 200 L195 210 L215 190" class="stroke-white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </g>

            <!-- Output nodes (bottom) -->
            <g class="drop-shadow-sm">
              <rect x="90" y="230" width="60" height="60" rx="12" class="fill-white stroke-primary/30" stroke-width="1.5" />
              <path d="M108 260 L132 260 M108 250 L124 250 M108 270 L128 270" class="stroke-primary/60" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="drop-shadow-sm">
              <rect x="250" y="230" width="60" height="60" rx="12" class="fill-white stroke-primary/30" stroke-width="1.5" />
              <path d="M268 252 L280 264 L292 252 M268 268 L280 256 L292 268" class="stroke-primary/60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g class="drop-shadow-sm">
              <rect x="170" y="300" width="60" height="60" rx="12" class="fill-primary/10 stroke-primary" stroke-width="1.5" />
              <path d="M188 330 L200 342 L212 318" class="stroke-primary" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>

            <!-- Decorative elements -->
            <circle cx="340" cy="120" r="8" class="fill-primary/20" />
            <circle cx="60" cy="200" r="6" class="fill-slate-200" />
            <circle cx="340" cy="280" r="10" class="fill-primary/10" />
            <circle cx="80" cy="320" r="5" class="fill-primary/30" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Two-Lane Selector -->
<Section background="muted" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">01</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900">
      Where do you need help?
    </h2>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    <!-- SMB Lane -->
    <a
      href="/services/"
      class="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div class="flex items-start justify-between mb-4">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </span>
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-slate-900 mb-2">
        I'm a local business
      </h3>
      <p class="text-slate-600">
        Las Vegas or Henderson. Looking to automate workflows and save time on repetitive work.
      </p>
    </a>

    <!-- Enterprise Lane -->
    <a
      href="/enterprise/"
      class="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div class="flex items-start justify-between mb-4">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </span>
        <svg class="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-slate-900 mb-2">
        I need an AI consultant
      </h3>
      <p class="text-slate-600">
        Infrastructure, governance, evaluation frameworks, and operating model design.
      </p>
    </a>
  </div>

  <p class="text-center text-sm text-slate-500 mt-8">
    Not sure? <a href="/services/" class="text-primary hover:underline">Start with the AI Workflow Audit</a>.
  </p>
</Section>

<!-- Non-technical Reassurance -->
<Section background="white" padding="lg">
  <div class="max-w-3xl mx-auto">
    <div class="p-8 md:p-12 bg-primary/5 rounded-2xl border border-primary/10">
      <p class="text-sm font-medium tracking-widest text-primary uppercase mb-4">02</p>
      <h2 class="font-serif text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
        You don't need to be technical to get real automation
      </h2>
      <p class="text-lg text-slate-600 mb-8 leading-relaxed">
        If you can describe what happens today—where work gets stuck, repeated, or missed—we can turn it into a working system.
      </p>

      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">1</span>
          <div>
            <p class="font-medium text-slate-900">Identify the bottleneck</p>
            <p class="text-sm text-slate-600">Where does work pile up or get dropped?</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">2</span>
          <div>
            <p class="font-medium text-slate-900">Map your tools</p>
            <p class="text-sm text-slate-600">What systems are already in place?</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">3</span>
          <div>
            <p class="font-medium text-slate-900">Ship an unattended system</p>
            <p class="text-sm text-slate-600">With monitoring, alerts, and rollback.</p>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <Button href={generateSmbMailto()}>
          Email what's slowing you down
        </Button>
      </div>
    </div>
  </div>
</Section>

<!-- What We Do -->
<Section background="muted" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">03</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900">
      What we do
    </h2>
  </div>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {#each [
      { title: 'Workflow automation', desc: 'End-to-end processes that run without intervention.' },
      { title: 'Integrations', desc: 'Connect your tools so data flows automatically.' },
      { title: 'AI-assisted operations', desc: 'With human approvals where they matter.' },
      { title: 'Reporting + visibility', desc: "Know what's happening without asking." },
      { title: 'Governance + enablement', desc: 'Safe, auditable AI adoption for teams.' }
    ] as item}
      <div class="p-6 bg-white rounded-xl border border-slate-200">
        <h3 class="font-semibold text-slate-900 mb-2">{item.title}</h3>
        <p class="text-sm text-slate-600">{item.desc}</p>
      </div>
    {/each}
  </div>
</Section>

<!-- Real Automation Means -->
<Section background="white" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">04</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900">
      Real automation means…
    </h2>
  </div>

  <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h3 class="font-semibold text-slate-900 mb-3">Understanding your bottlenecks</h3>
      <p class="text-sm text-slate-600 mb-4">Not guessing. Mapping what actually slows you down.</p>
      <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">
        Artifacts: workflow map, baseline, acceptance criteria
      </p>
    </div>

    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="font-semibold text-slate-900 mb-3">Integrating with your tools</h3>
      <p class="text-sm text-slate-600 mb-4">Google, Slack, Microsoft, HubSpot—and the rest.</p>
      <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">
        Artifacts: permissions map, integration inventory
      </p>
    </div>

    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
      <h3 class="font-semibold text-slate-900 mb-3">Works while you sleep</h3>
      <p class="text-sm text-slate-600 mb-4">Monitoring, alerts, rollback, exception handling.</p>
      <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">
        Artifacts: runbook, alert config, exception queue
      </p>
    </div>
  </div>
</Section>

<!-- How We Work -->
<Section background="muted" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">05</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900">
      How we work
    </h2>
  </div>

  <div class="max-w-3xl mx-auto">
    <div class="space-y-0">
      {#each [
        { step: '01', title: 'Discovery', desc: 'Understand your workflow, bottlenecks, and success criteria.' },
        { step: '02', title: 'Design', desc: 'Map the automation, define integrations, set acceptance criteria.' },
        { step: '03', title: 'Build', desc: 'Implement with proper error handling and monitoring.' },
        { step: '04', title: 'Verify', desc: 'Test against real scenarios, validate with your team.' },
        { step: '05', title: 'Deploy', desc: 'Roll out with a clear rollback plan.' },
        { step: '06', title: 'Handoff', desc: 'Documentation, admin walkthrough, ownership transfer.' },
        { step: '07', title: 'Measure', desc: 'Track outcomes against your baseline.' }
      ] as item, i}
        <div class="flex gap-6 py-6 {i < 6 ? 'border-b border-slate-200' : ''}">
          <span class="flex-shrink-0 text-sm font-medium text-primary tracking-widest">{item.step}</span>
          <div>
            <h3 class="font-semibold text-slate-900 mb-1">{item.title}</h3>
            <p class="text-sm text-slate-600">{item.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Section>

<!-- Examples Teaser -->
<Section id="examples" background="white" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">06</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
      Illustrative examples
    </h2>
    <p class="text-slate-600 max-w-2xl mx-auto">
      These represent the types of workflows we build. Specific outcomes vary by business.
    </p>
  </div>

  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {#each [
      {
        title: 'HubSpot lead intake → routing → follow-up',
        tools: 'HubSpot, Slack, Gmail',
        time: '2–3 weeks'
      },
      {
        title: 'Slack request intake → triage → assignment',
        tools: 'Slack, Notion, Calendar',
        time: '1–2 weeks'
      },
      {
        title: 'Weekly reporting autopilot',
        tools: 'Google Sheets, Slack, Email',
        time: '1–2 weeks'
      }
    ] as example}
      <div class="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-sm transition-all">
        <span class="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-200 rounded mb-4">
          Illustrative example
        </span>
        <h3 class="font-semibold text-slate-900 mb-3">{example.title}</h3>
        <div class="space-y-2 text-sm text-slate-600">
          <p><span class="text-slate-500">Tools:</span> {example.tools}</p>
          <p><span class="text-slate-500">Typical:</span> {example.time}</p>
        </div>
      </div>
    {/each}
  </div>

  <div class="text-center mt-10">
    <Button href="/examples/" variant="secondary">
      View all examples
    </Button>
  </div>
</Section>

<!-- Trust Checklist -->
<Section background="muted" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">07</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
      Built with controls you can trust
    </h2>
  </div>

  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
    {#each [
      'Least privilege + permission mapping',
      'Secrets management',
      'Observability (logs + alerts)',
      'Human-in-the-loop approvals',
      'Rollback plans',
      'Ownership + documentation'
    ] as item}
      <div class="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200">
        <span class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="text-sm font-medium text-slate-700">{item}</span>
      </div>
    {/each}
  </div>
</Section>

<!-- FAQ -->
<Section background="white" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">08</p>
    <h2 class="font-serif text-3xl md:text-4xl font-semibold text-slate-900">
      Common questions
    </h2>
  </div>

  <div class="max-w-3xl mx-auto divide-y divide-slate-200">
    {#each [
      {
        q: "I'm not technical. Where do I even start?",
        a: "You start by describing what happens today. Where does work get stuck? What's repetitive? What falls through the cracks? We take it from there."
      },
      {
        q: "What's your typical budget range?",
        a: "Audits run $3,500–$7,500. Automation Sprints are typically $9,500–$24,000. If budget is under $5k, we're likely not a fit."
      },
      {
        q: "How long does a typical project take?",
        a: "Audits: 5–10 business days. Sprints: 2–6 weeks depending on complexity. We'll give you a specific timeline after scoping."
      },
      {
        q: "What tools do you work with?",
        a: "We specialize in Google Workspace, Slack, Microsoft 365, and HubSpot. But we work with most modern business tools."
      },
      {
        q: "Who owns the automation when you're done?",
        a: "You do. We hand off full documentation, runbooks, and admin access. You can maintain it yourself or engage us for Automation Ops."
      },
      {
        q: "How do you handle AI quality control?",
        a: "Human-in-the-loop approvals for anything critical. Test sets for validation. Monitoring and exception queues for edge cases."
      },
      {
        q: "What about ongoing support?",
        a: "Automation Ops packages run $2,000–$6,000/month and include monitoring, updates, and support. Or you can run it yourself."
      },
      {
        q: "What access do you need to our systems?",
        a: "Least privilege only. We document exactly what access we need, why, and how to revoke it when we're done."
      }
    ] as item, i}
      <details class="group py-6">
        <summary class="flex items-center justify-between cursor-pointer list-none">
          <span class="font-medium text-slate-900 pr-4">{item.q}</span>
          <svg class="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <p class="mt-4 text-slate-600 leading-relaxed">{item.a}</p>
      </details>
    {/each}
  </div>
</Section>

<!-- Final CTA -->
<section class="bg-slate-900 text-white py-20 md:py-28">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl md:text-4xl font-semibold mb-6">
      Bring one workflow. We'll tell you what it takes.
    </h2>
    <p class="text-lg text-slate-400 mb-4 max-w-2xl mx-auto">
      Tell us: workflow start→end, bottlenecks, tools, volume, and budget ($5–15k target).
    </p>
    <p class="text-sm text-slate-500 mb-10">
      If budget is under $5k, we're likely not a fit.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us your workflow
    </Button>
  </div>
</section>
