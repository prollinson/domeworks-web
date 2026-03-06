import { fetchMarkdownPosts } from '$lib/utils';

export async function load() {
	const allPosts = await fetchMarkdownPosts();

	const sorted = allPosts.sort((a, b) => {
		return (
			new Date(/** @type {string} */ (b.meta.date)).getTime() -
			new Date(/** @type {string} */ (a.meta.date)).getTime()
		);
	});

	return {
		posts: sorted
	};
}
