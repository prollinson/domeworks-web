<script lang="ts">
	import { page } from '$app/state';
	import { buildJsonLdScript } from '$lib/utils/json-ld';

	let {
		title,
		description,
		canonical = undefined,
		image = undefined,
		noIndex = false,
		schema = undefined
	}: {
		title: string;
		description: string;
		/* Absolute canonical URL. Defaults to siteUrl + current pathname. */
		canonical?: string;
		/* Override og:image / twitter:image. Defaults to the site og-image. */
		image?: string;
		/* If true, emits robots noindex/nofollow. Use for redirect stubs and campaign variants. */
		noIndex?: boolean;
		/* JSON-LD schema. Object or array (rendered as @graph siblings is up to caller). */
		schema?: Record<string, unknown> | unknown[];
	} = $props();

	const siteUrl = 'https://domeworks.tech';
	const siteName = 'DomeWorks';
	const defaultImage = `${siteUrl}/og-image.png`;

	let canonicalUrl = $derived(canonical ?? `${siteUrl}${page.url.pathname}`);
	let ogImage = $derived(image ?? defaultImage);
	let schemaScript = $derived(schema ? buildJsonLdScript(schema) : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	{#if noIndex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#if schema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html schemaScript}
	{/if}
</svelte:head>
