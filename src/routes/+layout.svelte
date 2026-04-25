<script>
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { buildJsonLdScript } from '$lib/utils/json-ld';
	import '../tailwind.css';
	import { posthog } from '$lib/posthog';

	let { children } = $props();

	/* Chromeless landing pages: campaign landings under /smb/[slug]/. The /smb/
	   hub and /smb/quiz/ get the standard header (with its section-aware nav)
	   so visitors can navigate within the SMB section. */
	const isLanding = $derived.by(() => {
		const path = $page.url.pathname.replace(/\/$/, '');
		if (path === '/smb' || path === '/smb/quiz') return false;
		return path.startsWith('/smb/');
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'DomeWorks',
		description:
			'AI infrastructure engineering for engineering organizations. We build the context system and agent coordination that replace coordination overhead with AI-native systems.',
		url: 'https://domeworks.tech',
		areaServed: {
			'@type': 'Country',
			name: 'United States'
		},
		serviceType: [
			'AI Infrastructure Engineering',
			'AI Consulting',
			'Context System Engineering',
			'Agent Coordination Engineering'
		],
		priceRange: '$2,500–$15,000+',
		email: 'piers@domeworks.tech'
	};

	const jsonLdScript = buildJsonLdScript(jsonLd);

	// Enable View Transitions API for smooth page navigation
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Track page views with PostHog
	$effect(() => {
		if (typeof window !== 'undefined' && $page.url.pathname) {
			posthog.capture('$pageview', {
				$current_url: $page.url.href,
				path: $page.url.pathname
			});
		}
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>

{#if !isLanding}
	<Header />
{/if}

<main class={isLanding ? '' : 'pt-16 md:pt-20'}>
	{@render children()}
</main>

{#if !isLanding}
	<Footer />
{/if}
