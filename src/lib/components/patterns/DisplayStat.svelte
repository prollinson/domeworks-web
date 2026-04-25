<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		value,
		unit,
		lede = undefined,
		children
	}: {
		value: string;
		unit: string;
		lede?: string;
		children: Snippet;
	} = $props();
</script>

<div class="max-w-3xl mx-auto">
	{#if lede}
		<p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-subtle mb-4">
			{lede}
		</p>
	{/if}
	<div class="flex items-baseline gap-4 mb-6">
		<span
			class="font-sans font-semibold text-ink leading-[0.95] tracking-[-0.03em]"
			style="font-size: clamp(3rem, 6vw, 5rem);"
		>
			{value}
		</span>
		<span class="font-sans text-muted text-lg">{unit}</span>
	</div>
	<div class="rule-left-accent font-serif text-muted text-lg leading-[1.65]">
		{@render children()}
	</div>
</div>
