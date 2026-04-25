<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		attribution = undefined,
		children
	}: {
		attribution?: string;
		children: Snippet;
	} = $props();
</script>

<section class="bg-paper border-t border-b border-rule py-16 md:py-24">
	<div class="max-w-4xl mx-auto px-6 lg:px-8">
		<blockquote
			class="font-serif text-ink leading-[1.18] tracking-[-0.015em]"
			style="font-size: clamp(1.625rem, 3.6vw, 2.625rem);"
		>
			{@render children()}
		</blockquote>
		{#if attribution}
			<p class="mt-6 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-subtle">
				{attribution}
			</p>
		{/if}
	</div>
</section>
