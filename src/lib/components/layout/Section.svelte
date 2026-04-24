<script lang="ts">
	import type { Snippet } from 'svelte';

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
		id?: string;
		background?: 'white' | 'muted' | 'dark';
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		eyebrow?: string;
		title?: string;
		description?: string;
		centered?: boolean;
		children: Snippet;
	} = $props();

	const bgClasses = {
		white: 'bg-paper',
		muted: 'bg-paper-alt',
		dark: 'bg-ink text-paper'
	};

	const paddingClasses = {
		sm: 'py-10 md:py-14',
		md: 'py-14 md:py-18',
		lg: 'py-16 md:py-20',
		xl: 'py-20 md:py-28'
	};

	const eyebrowColor = $derived(background === 'dark' ? 'text-accent-light' : 'text-subtle');
	const titleColor = $derived(background === 'dark' ? 'text-paper' : 'text-ink');
	const descColor = $derived(background === 'dark' ? 'text-paper/70' : 'text-ink/70');
</script>

<section {id} class="{bgClasses[background]} {paddingClasses[padding]} relative">
	<div class="max-w-6xl mx-auto px-6 lg:px-8">
		{#if eyebrow || title}
			<div class="{centered ? 'text-center' : ''} mb-12">
				{#if eyebrow}
					<p class="text-xs font-medium tracking-widest {eyebrowColor} uppercase mb-4">
						{eyebrow}
					</p>
				{/if}
				{#if title}
					<h2 class="section-title font-sans font-medium {titleColor}">
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
