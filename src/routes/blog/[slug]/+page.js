import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../${params.slug}.md`);

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		error(404, `Post not found: ${params.slug}`);
	}
}
