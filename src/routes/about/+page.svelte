<script lang="ts">
  import Section from '$lib/components/layout/Section.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import { generateSmbMailto } from '$lib/utils/mailto'
</script>

<svelte:head>
  <title>About — Dome Works</title>
  <meta name="description" content="Premium automation for businesses that value reliability, clarity, and maintainability." />
</svelte:head>

<!-- Hero -->
<section class="bg-white py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    <div class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
        We build automation that works while you sleep
      </h1>
      <p class="mt-6 text-xl text-slate-600 leading-relaxed">
        Dome Works is a Las Vegas-based automation consultancy. We help businesses replace manual workflows with reliable, monitored systems.
      </p>
    </div>
  </div>
</section>

<!-- Principles -->
<Section background="muted" padding="lg">
  <div class="max-w-3xl mx-auto">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">01</p>
    <h2 class="font-serif text-3xl font-semibold text-slate-900 mb-8">
      Our principles
    </h2>

    <div class="space-y-8">
      <div class="flex gap-6">
        <span class="flex-shrink-0 text-sm font-medium text-primary tracking-widest">01</span>
        <div>
          <h3 class="font-semibold text-slate-900 mb-2">Clarity over cleverness</h3>
          <p class="text-slate-600">Simple solutions that your team can understand, maintain, and extend.</p>
        </div>
      </div>

      <div class="flex gap-6">
        <span class="flex-shrink-0 text-sm font-medium text-primary tracking-widest">02</span>
        <div>
          <h3 class="font-semibold text-slate-900 mb-2">Scope control</h3>
          <p class="text-slate-600">We define what "done" looks like before we start. No scope creep, no surprises.</p>
        </div>
      </div>

      <div class="flex gap-6">
        <span class="flex-shrink-0 text-sm font-medium text-primary tracking-widest">03</span>
        <div>
          <h3 class="font-semibold text-slate-900 mb-2">Reliability first</h3>
          <p class="text-slate-600">Monitoring, alerts, exception handling, and rollback plans. Not afterthoughts.</p>
        </div>
      </div>

      <div class="flex gap-6">
        <span class="flex-shrink-0 text-sm font-medium text-primary tracking-widest">04</span>
        <div>
          <h3 class="font-semibold text-slate-900 mb-2">Maintainability</h3>
          <p class="text-slate-600">Documentation, runbooks, and clean handoff. You own it when we're done.</p>
        </div>
      </div>
    </div>
  </div>
</Section>

<!-- Working Style -->
<Section background="white" padding="lg">
  <div class="max-w-3xl mx-auto">
    <p class="text-sm font-medium tracking-widest text-slate-500 uppercase mb-4">02</p>
    <h2 class="font-serif text-3xl font-semibold text-slate-900 mb-8">
      How we work
    </h2>

    <div class="space-y-6">
      <div class="p-6 bg-slate-50 rounded-xl">
        <h3 class="font-semibold text-slate-900 mb-2">Written-first</h3>
        <p class="text-slate-600">Clear written communication. Documented decisions. Async-friendly.</p>
      </div>

      <div class="p-6 bg-slate-50 rounded-xl">
        <h3 class="font-semibold text-slate-900 mb-2">Artifacts-first</h3>
        <p class="text-slate-600">Every engagement produces tangible deliverables: workflow maps, runbooks, documentation.</p>
      </div>

      <div class="p-6 bg-slate-50 rounded-xl">
        <h3 class="font-semibold text-slate-900 mb-2">Premium positioning</h3>
        <p class="text-slate-600">We're a good fit when reliability, clarity, and maintainability matter more than the lowest bid.</p>
      </div>
    </div>
  </div>
</Section>

<!-- CTA -->
<section class="bg-slate-900 text-white py-20">
  <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="font-serif text-3xl font-semibold mb-4">
      Ready to talk?
    </h2>
    <p class="text-slate-400 mb-8">
      Email us your workflow. We'll tell you what it takes.
    </p>
    <Button href={generateSmbMailto()} size="lg">
      Email us your workflow
    </Button>
  </div>
</section>
