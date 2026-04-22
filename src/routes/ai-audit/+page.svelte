<svelte:head>
	<title>Redirecting to AI Tools Assessment | DomeWorks</title>
	<meta name="robots" content="noindex" />
	<link rel="canonical" href="https://domeworks.tech/ai-tools-assessment/" />
	<meta http-equiv="refresh" content="0; url=/ai-tools-assessment/" />
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/ai-tools-assessment/', { replaceState: true });
	});
</script>

<main class="min-h-[60vh] flex items-center justify-center px-6">
	<div class="text-center max-w-md">
		<p class="text-sm tracking-widest uppercase text-warm-gray mb-3">Moved</p>
		<h1 class="font-serif text-3xl text-charcoal mb-4">This page is now the AI Tools Assessment.</h1>
		<p class="text-charcoal/70 leading-relaxed">
			If you aren't redirected automatically,
			<a href="/ai-tools-assessment/" class="text-copper underline">click here to continue</a>.
		</p>
	</div>
</main>
