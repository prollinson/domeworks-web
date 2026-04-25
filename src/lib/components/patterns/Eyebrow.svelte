<script lang="ts">
	type Tone = 'accent' | 'subtle' | 'accent-light';

	let {
		label,
		index = undefined,
		tone = 'subtle',
		as = 'p'
	}: {
		label: string;
		index?: string;
		tone?: Tone;
		as?: 'p' | 'span';
	} = $props();

	const toneClass: Record<Tone, string> = {
		accent: 'text-accent',
		subtle: 'text-subtle',
		'accent-light': 'text-accent-light'
	};

	const base = $derived(
		`text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ${toneClass[tone]}`
	);
</script>

{#if as === 'span'}
	<span class={base}>
		{#if index}
			<span>{index}</span>
			<span class="inline-block h-3 w-px bg-current/25 align-middle mx-2" aria-hidden="true"></span>
		{/if}
		{label}
	</span>
{:else}
	<p class="{base} flex items-center gap-2">
		{#if index}
			<span>{index}</span>
			<span class="h-3 w-px bg-current/25" aria-hidden="true"></span>
		{/if}
		<span>{label}</span>
	</p>
{/if}
