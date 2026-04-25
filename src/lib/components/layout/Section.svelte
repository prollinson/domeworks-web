<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id = undefined,
		background = 'white',
		padding = 'lg',
		hero = false,
		eyebrow = undefined,
		title = undefined,
		description = undefined,
		centered = true,
		children
	}: {
		id?: string;
		background?: 'white' | 'muted' | 'dark';
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		/* When true, the section bleeds under the fixed header (which goes
		   transparent on these pages). Pages with `hero` MUST be listed in
		   Header.svelte's pulled-hero check so the header text stays light. */
		hero?: boolean;
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

	/* Hero treatment: pull up under the fixed header (-mt) and add equivalent
	   top padding so visible content keeps the same vertical breathing room.
	   Header is h-16 md:h-20, so we add 4rem/5rem to the chosen padding's top. */
	const heroPaddingClasses = {
		sm: 'pt-26 md:pt-34 pb-10 md:pb-14',
		md: 'pt-30 md:pt-38 pb-14 md:pb-18',
		lg: 'pt-32 md:pt-40 pb-16 md:pb-20',
		xl: 'pt-36 md:pt-48 pb-20 md:pb-28'
	};

	const sectionClasses = $derived(
		hero
			? `${bgClasses[background]} ${heroPaddingClasses[padding]} -mt-16 md:-mt-20 overflow-hidden`
			: `${bgClasses[background]} ${paddingClasses[padding]}`
	);

	const eyebrowColor = $derived(background === 'dark' ? 'text-accent-light' : 'text-subtle');
	const titleColor = $derived(background === 'dark' ? 'text-paper' : 'text-ink');
	const descColor = $derived(background === 'dark' ? 'text-paper/70' : 'text-ink/70');
</script>

<section {id} class="{sectionClasses} relative">
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
