<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'accent' | 'accent-strong' | 'rule-left' | 'rule-left-sm';

	let {
		variant,
		children
	}: {
		variant: Variant;
		children: Snippet;
	} = $props();

	const variantClass: Record<Variant, string> = {
		accent: 'bg-accent/6 rounded-lg p-6',
		'accent-strong': 'bg-accent/18 rounded-lg p-6',
		'rule-left': 'rule-left-accent',
		'rule-left-sm': 'rule-left-accent-sm'
	};
</script>

<div class={variantClass[variant]}>
	{@render children()}
</div>
