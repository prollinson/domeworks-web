<script lang="ts">
	import type { Snippet } from 'svelte';
	import Section from '$lib/components/layout/Section.svelte';

	let {
		index,
		title,
		id = undefined,
		background = 'white',
		padding = 'lg',
		description = undefined,
		children
	}: {
		index: string;
		title: string;
		id?: string;
		background?: 'white' | 'muted' | 'dark';
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		description?: string;
		children: Snippet;
	} = $props();
</script>

<Section
	{id}
	{background}
	{padding}
	eyebrow={index}
	{title}
	{description}
	centered={false}
>
	{@render children()}
</Section>
