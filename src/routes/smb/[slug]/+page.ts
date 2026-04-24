import { error } from '@sveltejs/kit';
import { getCampaign, getCampaignSlugs, resolveCampaign } from '$lib/data/smb-campaigns';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

/** Prerender every slug in the campaign registry as a static HTML page. */
export const entries: EntryGenerator = () => {
	return getCampaignSlugs().map((slug) => ({ slug }));
};

export const load: PageLoad = ({ params }) => {
	if (!getCampaign(params.slug)) {
		throw error(404, `Unknown campaign: ${params.slug}`);
	}
	return {
		campaign: resolveCampaign(params.slug)
	};
};
