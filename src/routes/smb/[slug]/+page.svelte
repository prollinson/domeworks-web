<script lang="ts">
	import AssessmentPage from '$lib/components/smb/AssessmentPage.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const campaign = $derived(data.campaign);

	const title = $derived(campaign.title ?? 'AI Tools Assessment | DomeWorks');
	const description = $derived(
		campaign.description ??
			"A 45-minute assessment of where AI tools fit in your services business — and the workflows where they'd do more harm than good."
	);
	const canonical = $derived(campaign.canonical ?? `https://domeworks.tech/smb/${campaign.slug}/`);
	const noIndex = $derived(campaign.noIndex ?? true);
</script>

<SEO {title} {description} {canonical} {noIndex} />

<AssessmentPage {campaign} />
