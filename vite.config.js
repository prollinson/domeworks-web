import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: process.env.PORT ? Number(process.env.PORT) : undefined,
		strictPort: !!process.env.PORT,
		host: process.env.HOST || undefined
	}
});
