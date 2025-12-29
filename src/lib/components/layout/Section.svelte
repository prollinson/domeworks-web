<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    id = undefined,
    background = 'white',
    padding = 'lg',
    numbered = undefined,
    children
  }: {
    id?: string
    background?: 'white' | 'muted' | 'dark'
    padding?: 'sm' | 'md' | 'lg' | 'xl'
    numbered?: string
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
</script>

<section
  {id}
  class="{bgClasses[background]} {paddingClasses[padding]} relative"
>
  <div class="max-w-6xl mx-auto px-6 lg:px-8">
    {#if numbered}
      <span class="text-xs font-medium tracking-widest text-slate-400 uppercase mb-8 block">
        {numbered}
      </span>
    {/if}
    {@render children()}
  </div>
</section>
