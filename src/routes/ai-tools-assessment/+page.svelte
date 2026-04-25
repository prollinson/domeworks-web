<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/smb/', { replaceState: true });
	});
</script>

<svelte:head>
	<title>Redirecting to AI Tools Assessment | DomeWorks</title>
	<meta name="robots" content="noindex" />
	<link rel="canonical" href="https://domeworks.tech/smb/" />
	<meta http-equiv="refresh" content="0; url=/smb/" />
</svelte:head>

<main class="min-h-[60vh] flex items-center justify-center px-6">
	<div class="text-center max-w-md">
		<p class="text-sm tracking-widest uppercase text-subtle mb-3">Moved</p>
		<h1 class="font-serif text-3xl text-ink mb-4">
			This page is now at /smb/.
		</h1>
		<p class="text-muted leading-relaxed">
			If you aren't redirected automatically,
			<a href="/smb/" class="text-accent underline">click here to continue</a>.
		</p>
	</div>
</main>
