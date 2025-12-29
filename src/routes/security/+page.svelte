<script lang="ts">
  import Section from '$lib/components/layout/Section.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { generateSmbMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>Security & Data Handling — Dome Works</title>
  <meta name="description" content="How we handle security, data, and access in automation projects." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        Security & data handling
      </h1>
      <p class="mt-6 text-xl text-slate-600">
        How we approach access, secrets, logging, and data when building automation.
      </p>
    </div>
  </div>
</section>

<!-- Sections -->
<Section background="muted" padding="lg">
  <div class="max-w-3xl mx-auto space-y-12">
    <!-- Least Privilege -->
    <div>
      <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">01</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900 mb-4">
        Least privilege + access inventory
      </h2>
      <p class="text-slate-600 mb-4">
        We request only the permissions required for the specific automation. No admin access unless absolutely necessary.
      </p>
      <ul class="space-y-2">
        {#each ['Document every permission requested and why', 'Provide revocation instructions at handoff', 'Use service accounts where possible', 'Audit access before project close'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Secrets Management -->
    <div>
      <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">02</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900 mb-4">
        Secrets management
      </h2>
      <p class="text-slate-600 mb-4">
        API keys, tokens, and credentials are never stored in code or shared via email.
      </p>
      <ul class="space-y-2">
        {#each ['Environment variables or secret managers only', 'Rotate credentials at project close', 'No hardcoded secrets in automation code', 'Encrypted storage for sensitive config'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Logging & Alerting -->
    <div>
      <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">03</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900 mb-4">
        Logging + alerting
      </h2>
      <p class="text-slate-600 mb-4">
        Every automation includes observability so you know what's happening.
      </p>
      <ul class="space-y-2">
        {#each ['Execution logs with timestamps', 'Error alerting to Slack/email', 'Exception queues for manual review', 'Audit trail for compliance needs'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Data Retention -->
    <div>
      <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">04</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900 mb-4">
        Data retention minimization
      </h2>
      <p class="text-slate-600 mb-4">
        We don't store data we don't need. Automations process data in transit where possible.
      </p>
      <ul class="space-y-2">
        {#each ["Process, don't persist unnecessarily", 'Clear retention policies for logs', 'No copies of production data', 'GDPR/CCPA considerations as needed'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- NDA & Compliance -->
    <div>
      <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">05</p>
      <h2 class="font-serif text-2xl font-semibold text-slate-900 mb-4">
        NDA + compliance support
      </h2>
      <p class="text-slate-600 mb-4">
        We sign NDAs and work within your compliance requirements.
      </p>
      <ul class="space-y-2">
        {#each ['NDA available upon request', 'SOC 2 alignment practices (not certified)', 'Can work with your legal/security team', 'Document controls for audit purposes'] as item}
          <li class="flex items-start gap-3 text-sm text-slate-600">
            <svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</Section>

<!-- Definitions -->
<Section background="white" padding="md">
  <div class="max-w-3xl mx-auto">
    <h3 class="font-semibold text-slate-900 mb-4">Definitions</h3>
    <dl class="space-y-3 text-sm text-slate-600">
      <div>
        <dt class="font-medium text-slate-700 inline">PII:</dt>
        <dd class="inline"> Personally Identifiable Information (names, emails, addresses, etc.)</dd>
      </div>
      <div>
        <dt class="font-medium text-slate-700 inline">PHI:</dt>
        <dd class="inline"> Protected Health Information (medical records, health data)</dd>
      </div>
      <div>
        <dt class="font-medium text-slate-700 inline">SOC 2:</dt>
        <dd class="inline"> System and Organization Controls 2 (security/availability/confidentiality framework)</dd>
      </div>
    </dl>
  </div>
</Section>

<!-- CTA -->
<section class="bg-slate-900 text-white py-20">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl font-semibold mb-4">
      Questions about security?
    </h2>
    <p class="text-slate-400 mb-8">
      We're happy to discuss your specific requirements.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us
    </Button>
  </div>
</section>
