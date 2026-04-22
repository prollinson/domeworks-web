import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		})
	],

	kit: {
		// Cloudflare Pages. Pages prerender by default via src/routes/+layout.ts;
		// dynamic endpoints (e.g. /api/quiz) run as Pages Functions on the Worker runtime.
		adapter: adapter()
	}
};

export default config;
