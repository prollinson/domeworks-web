<script lang="ts">
  type ServicePage = 'scan' | 'context-build' | 'orchestration-build' | 'fractional'

  let { current }: { current: ServicePage } = $props()

  const steps: { key: ServicePage; label: string; href: string }[] = [
    { key: 'scan', label: 'AI Scan', href: '/scan/' },
    { key: 'context-build', label: 'Context Build', href: '/context-build/' },
    { key: 'orchestration-build', label: 'Orchestration Build', href: '/orchestration-build/' },
    { key: 'fractional', label: 'Fractional', href: '/fractional/' }
  ]

  const currentIndex = $derived(steps.findIndex(s => s.key === current))

  function segmentColor(stepIndex: number): string {
    const isCurrent = stepIndex === currentIndex
    const isPast = stepIndex < currentIndex
    const usesCopper = stepIndex >= 2

    if (isCurrent) return usesCopper ? 'bg-copper' : 'bg-primary'
    if (isPast) return usesCopper ? 'bg-copper/30' : 'bg-primary/30'
    // Future
    const distance = stepIndex - currentIndex
    if (distance === 1) return usesCopper ? 'bg-copper/15' : 'bg-primary/15'
    return usesCopper ? 'bg-copper/8' : 'bg-primary/8'
  }

  function labelColor(stepIndex: number): string {
    if (stepIndex === currentIndex) return 'text-charcoal font-semibold'
    return 'text-charcoal/60 hover:text-charcoal'
  }
</script>

<nav class="mb-8" aria-label="Service journey">
  <div class="flex items-center gap-1.5 mb-3">
    {#each steps as step, i}
      <div class="flex-1 h-[3px] rounded-full {segmentColor(i)} transition-all duration-300 {i === currentIndex ? 'scale-y-[1.6] origin-center' : ''}"></div>
    {/each}
  </div>
  <div class="flex items-center gap-1 text-[11px] tracking-wide">
    {#each steps as step, i}
      <div class="flex-1">
        {#if step.key === current}
          <span class="{labelColor(i)}">{step.label}</span>
        {:else}
          <a href={step.href} class="{labelColor(i)} transition-colors">{step.label}</a>
        {/if}
      </div>
    {/each}
  </div>
</nav>
