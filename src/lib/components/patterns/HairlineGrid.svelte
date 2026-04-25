<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	let {
		cols = 3,
		onMuted = false,
		stagger = false,
		staggerDelay = 120,
		children
	}: {
		cols?: 1 | 2 | 3 | 4;
		onMuted?: boolean;
		stagger?: boolean;
		staggerDelay?: number;
		children: Snippet;
	} = $props();

	const colClass: Record<1 | 2 | 3 | 4, string> = {
		1: 'grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-2 lg:grid-cols-3',
		4: 'sm:grid-cols-2 lg:grid-cols-4'
	};
</script>

{#if stagger}
	<div
		class="hairline-grid grid {colClass[cols]} {onMuted ? 'on-muted' : ''}"
		use:reveal={{ stagger: true, staggerDelay }}
	>
		{@render children()}
	</div>
{:else}
	<div class="hairline-grid grid {colClass[cols]} {onMuted ? 'on-muted' : ''}">
		{@render children()}
	</div>
{/if}
