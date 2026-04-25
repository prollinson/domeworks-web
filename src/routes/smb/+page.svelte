<script lang="ts">
	import AssessmentPage from '$lib/components/smb/AssessmentPage.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { defaultCampaign } from '$lib/data/smb-campaigns';

	const smbSchema = {
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
	};
</script>

<SEO
	title={defaultCampaign.title ?? 'AI Tools Assessment | DomeWorks'}
	description={defaultCampaign.description ??
		"A structured assessment of where AI tools fit in your business, and where they shouldn't go. Not a sales pitch."}
	canonical={defaultCampaign.canonical}
	schema={smbSchema}
/>

<AssessmentPage campaign={defaultCampaign} />
