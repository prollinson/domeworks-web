<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { generateEnterpriseMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Enterprise Consulting — Dome Works</title>
  <meta name="description" content="AI consulting, infrastructure enablement, governance, and operating model design." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-sm font-medium tracking-widest text-primary uppercase mb-6">
        Enterprise
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        Move AI from 'Science Project' to Production Infrastructure.
      </h1>
      <p class="mt-6 text-xl text-slate-600">
        We help teams cross the gap between a demo that works once and a system that works at scale—securely.
      </p>
      <div class="mt-8">
        <Button href={generateEnterpriseMailto()} size="lg">
          Email to discuss scope
        </Button>
      </div>
    </div>
  </div>
</section>

<!-- Engagement Models -->
<Section background="muted" padding="lg">
  <div class="text-center mb-12">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">01</p>
    <h2 class="font-serif text-3xl font-semibold text-slate-900">
      Engagement models
    </h2>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    {#each [
      { title: 'Readiness Assessment', desc: 'Map the gap between your data reality and your AI ambition.' },
      { title: 'Governance Framework', desc: 'Define who can use what model, with which data, and at what cost.' },
      { title: 'Embedded Build Support', desc: 'We join your sprint cycle to help your devs ship their first AI features.' },
      { title: 'The "AI Operating Model"', desc: 'Design the team structure and evaluation loops needed to sustain quality.' }
    ] as item}
      <div class="p-6 bg-white rounded-xl border border-slate-200">
        <h3 class="font-semibold text-slate-900 mb-2">{item.title}</h3>
        <p class="text-sm text-slate-600">{item.desc}</p>
      </div>
    {/each}
  </div>
</Section>

<!-- AI Infrastructure -->
<Section background="white" padding="lg">
  <div class="max-w-3xl mx-auto">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">02</p>
    <h2 class="font-serif text-3xl font-semibold text-slate-900 mb-8">
      Control means more than just a policy doc.
    </h2>

    <div class="grid sm:grid-cols-2 gap-4">
      {#each [
        'RBAC for data access (RAG pipelines)',
        'Full audit logging (Inputs/Outputs)',
        'Model router & cost controls',
        'Deterministic evaluation sets',
        'Prompt version control (Git-backed)',
        'PII/sensitive data filtering',
        'Private link/VPC integration',
        'Drift monitoring'
      ] as item}
        <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-sm text-slate-700">{item}</span>
        </div>
      {/each}
    </div>
  </div>
</Section>

<!-- CTA -->
<section class="bg-slate-900 text-white py-20">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl font-semibold mb-4">
      Let's discuss your AI goals
    </h2>
    <p class="text-slate-400 mb-8">
      We'll scope the engagement and outline deliverables.
    </p>
    <Button href={generateEnterpriseMailto()} size="lg">
      Email to discuss scope
    </Button>
  </div>
</section>
