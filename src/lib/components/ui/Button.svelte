<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		size = 'md',
		href = undefined,
		onclick = undefined,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		onclick?: () => void;
		children: Snippet;
	} = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]';

	const variantClasses = {
		primary:
			'bg-accent text-white hover:bg-accent-hover focus:ring-accent/50 shadow-sm hover:shadow hover:-translate-y-px',
		secondary: 'bg-transparent text-ink border border-ink hover:bg-paper-alt focus:ring-ink/30',
		ghost: 'text-ink/70 hover:text-accent hover:bg-paper-alt focus:ring-ink/30'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`);
</script>

{#if href}
	<a {href} class={classes}>
		{@render children()}
	</a>
{:else}
	<button type="button" {onclick} class={classes}>
		{@render children()}
	</button>
{/if}
