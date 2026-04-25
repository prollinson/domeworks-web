<script lang="ts">
	import AssessmentPage from '$lib/components/smb/AssessmentPage.svelte';
	import { defaultCampaign } from '$lib/data/smb-campaigns';
</script>

<svelte:head>
	<title>{defaultCampaign.title}</title>
	<meta name="description" content={defaultCampaign.description} />
	<link rel="canonical" href={defaultCampaign.canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DomeWorks" />
	<meta property="og:url" content={defaultCampaign.canonical} />
	<meta property="og:title" content={defaultCampaign.title} />
	<meta
		property="og:description"
		content="A structured assessment of where AI tools fit in your business, and where they shouldn't go. Not a sales pitch."
	/>
	<meta property="og:image" content="https://domeworks.tech/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={defaultCampaign.title} />
	<meta
		name="twitter:description"
		content="A structured assessment of where AI tools fit in your business, and where they shouldn't go. Not a sales pitch."
	/>
	<meta name="twitter:image" content="https://domeworks.tech/og-image.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'AI Tools Assessment',
		provider: { '@type': 'Organization', name: 'DomeWorks' },
		description:
			"45-minute assessment of where AI tools fit in a services business and where they shouldn't. Discovery call, written action plan, review call. Talk, Plan, Build.",
		offers: {
			'@type': 'Offer',
			price: '999',
			priceCurrency: 'USD',
			description: '45-minute AI Tools Assessment for services businesses with 10–50 people'
		}
	})}</script>`}
</svelte:head>

<AssessmentPage campaign={defaultCampaign} />
