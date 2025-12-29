<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { generateSmbMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Services — Dome Works</title>
  <meta name="description" content="SMB automation packages: AI Workflow Audit, Automation Sprint, and Automation Ops." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-sm font-medium tracking-widest text-primary uppercase mb-6">
        SMB Packages
      </p>
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        From 'manual mess' to 'machine' in three steps.
      </h1>
      <p class="mt-6 text-xl text-slate-600">
        We don't sell hours. We sell completed, tested, reliable systems that run without you.
      </p>
      <p class="mt-4 text-slate-500">
        Typical first project: $9,500–$24,000
      </p>
    </div>
  </div>
</section>

<!-- Packages -->
<Section background="muted" padding="lg">
  <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    <!-- Audit -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
      <div class="mb-6">
        <span class="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
          Start here
        </span>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">AI Workflow Audit</h3>
        <p class="text-3xl font-semibold text-slate-900">$3,500–$7,500</p>
        <p class="text-sm text-slate-500 mt-1">Credited toward Sprint</p>
      </div>
      <p class="text-slate-600 mb-6">5–10 business days</p>
      <ul class="space-y-3 mb-8 flex-grow">
        {#each ['Map the exact "path of work"', 'Identify invisible costs & delays', 'Inventory your API-ready tools', 'Design the "To-Be" automated state', 'Calculate hard ROI estimates'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
      <Button href={generateSmbMailto({ workflowName: 'Workflow Audit' })} variant="secondary">
        Start with audit
      </Button>
    </div>

    <!-- Sprint -->
    <div class="bg-white rounded-2xl border-2 border-primary p-8 flex flex-col relative">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
        Most popular
      </span>
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Automation Sprint</h3>
        <p class="text-3xl font-semibold text-slate-900">$9,500–$24,000</p>
        <p class="text-sm text-slate-500 mt-1">Typical range</p>
      </div>
      <p class="text-slate-600 mb-6">2–6 weeks</p>
      <ul class="space-y-3 mb-8 flex-grow">
        {#each ['Everything in Audit', 'End-to-end build (Zapier/Make/Code)', 'Rigorous error handling & retries', 'Live alert configuration', 'Runbook creation (for your team)', 'Recorded admin walkthrough', '30-day warranty'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
      <Button href={generateSmbMailto({ workflowName: 'Automation Sprint' })}>
        Email us your workflow
      </Button>
    </div>

    <!-- Ops -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Automation Ops</h3>
        <p class="text-3xl font-semibold text-slate-900">$2,000–$6,000</p>
        <p class="text-sm text-slate-500 mt-1">per month</p>
      </div>
      <p class="text-slate-600 mb-6">Ongoing</p>
      <ul class="space-y-3 mb-8 flex-grow">
        {#each ['24/7 Monitoring of all workflows', 'We fix breaks before you notice', 'API version updates & maintenance', 'Priority Slack/Email support', 'Monthly "Work Saved" report'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
      <Button href={generateSmbMailto({ workflowName: 'Automation Ops' })} variant="secondary">
        Discuss Ops
      </Button>
    </div>
  </div>
</Section>

<!-- Included Every Time -->
<Section background="white" padding="lg">
  <div class="max-w-3xl mx-auto">
    <h2 class="font-serif text-2xl md:text-3xl font-semibold text-slate-900 mb-8 text-center">
      Included with every engagement
    </h2>
    <div class="grid sm:grid-cols-2 gap-4">
      {#each [
        'Workflow map',
        'Acceptance criteria',
        'Exception handling',
        'Monitoring + alerts',
        'Rollout + rollback plan',
        'Runbook + documentation',
        'Automation inventory',
        'Ownership handoff'
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
      Ready to start?
    </h2>
    <p class="text-slate-400 mb-8">
      Tell us about your workflow. We'll scope it and tell you what "done" looks like.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us your workflow
    </Button>
  </div>
</section>
