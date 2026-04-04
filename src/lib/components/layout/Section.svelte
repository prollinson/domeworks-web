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
		white: 'bg-warm-white',
		muted: 'bg-stone',
		dark: 'bg-ink text-white'
	};

	const paddingClasses = {
		sm: 'py-10 md:py-14',
		md: 'py-14 md:py-18',
		lg: 'py-16 md:py-24',
		xl: 'py-24 md:py-32'
	};

	const eyebrowColor = $derived(background === 'dark' ? 'text-primary' : 'text-warm-gray');
	const titleColor = $derived(background === 'dark' ? 'text-white' : 'text-charcoal');
	const descColor = $derived(background === 'dark' ? 'text-warm-gray' : 'text-charcoal/70');

	function ruleReveal(node: HTMLElement) {
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			node.style.transform = 'scaleX(1)';
			return { destroy() {} };
		}
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.style.transform = 'scaleX(1)';
						observer.unobserve(node);
					}
				});
			},
			{ threshold: 0.1 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
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
					<h2 class="section-title font-serif font-normal {titleColor}">
						{title}
					</h2>
					<div class="section-rule" aria-hidden="true" use:ruleReveal></div>
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

	/* Copper rule-draw accent: extends editorial motif from hero */
	.section-rule {
		width: 2.5rem;
		height: 2px;
		background: var(--color-copper);
		opacity: 0.6;
		margin-top: 1rem;
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms;
	}

	:global(.text-center) .section-rule {
		margin-left: auto;
		margin-right: auto;
		transform-origin: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.section-rule {
			transform: scaleX(1) !important;
			transition: none !important;
		}
	}
</style>
