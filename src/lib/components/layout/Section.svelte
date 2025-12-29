<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    id = undefined,
    background = 'white',
    padding = 'lg',
    eyebrow = undefined,
    title = undefined,
    description = undefined,
    centered = true,
    children
  }: {
    id?: string
    background?: 'white' | 'muted' | 'dark'
    padding?: 'sm' | 'md' | 'lg' | 'xl'
    eyebrow?: string
    title?: string
    description?: string
    centered?: boolean
    children: Snippet
  } = $props()

  const bgClasses = {
    white: 'bg-white',
    muted: 'bg-slate-50',
    dark: 'bg-slate-900 text-white'
  }

  const paddingClasses = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-20',
    lg: 'py-20 md:py-28',
    xl: 'py-28 md:py-36'
  }

  const eyebrowColor = $derived(background === 'dark' ? 'text-primary' : 'text-slate-500')
  const titleColor = $derived(background === 'dark' ? 'text-white' : 'text-slate-900')
  const descColor = $derived(background === 'dark' ? 'text-slate-400' : 'text-slate-600')
</script>

<section
  {id}
  class="{bgClasses[background]} {paddingClasses[padding]} relative"
>
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    {#if eyebrow || title}
      <div class="{centered ? 'text-center' : ''} mb-12">
        {#if eyebrow}
          <p class="text-sm font-medium tracking-widest {eyebrowColor} uppercase mb-4">
            {eyebrow}
          </p>
        {/if}
        {#if title}
          <h2 class="section-title font-serif font-semibold {titleColor}">
            {title}
          </h2>
        {/if}
        {#if description}
          <p class="mt-4 {descColor} max-w-2xl {centered ? 'mx-auto' : ''}">
            {description}
          </p>
        {/if}
      </div>
    {/if}
    {@render children()}
  </div>
</section>

<style>
  /* Fluid typography with clamp() for smooth scaling */
  .section-title {
    font-size: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);
    line-height: 1.2;
    text-wrap: balance;
  }
</style>
