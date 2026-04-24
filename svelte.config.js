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
		// platformProxy exposes wrangler.jsonc bindings (D1, send_email, secrets) to
		// `vite dev` so local dev matches prod without needing wrangler dev.
		adapter: adapter({
			platformProxy: {
				configPath: 'wrangler.jsonc',
				persist: true
			}
		}),
		prerender: {
			// The Piers portrait is rendered with an inline onerror that hides its
			// <figure> when the asset isn't present — intentional for now. Don't
			// fail the prerender crawl on the missing file.
			handleHttpError: ({ path, referrer, message }) => {
				if (path === '/piers.jpg') return;
				throw new Error(`${message} (${path}${referrer ? ` from ${referrer}` : ''})`);
			}
		}
	}
};

export default config;
