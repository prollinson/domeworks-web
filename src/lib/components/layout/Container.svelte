<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    size = 'lg',
    children
  }: {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    children: Snippet
  } = $props()

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }
</script>

<div class="{sizeClasses[size]} mx-auto px-6 lg:px-8">
  {@render children()}
</div>
