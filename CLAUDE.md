# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (hot reload, with wrangler platformProxy bindings)
pnpm build            # Production build (.svelte-kit/cloudflare/_worker.js)
pnpm preview          # Preview production build on port 4173
pnpm check            # TypeScript/Svelte type checking
pnpm lint             # Prettier + ESLint check
pnpm format           # Auto-format with Prettier
pnpm test             # Run vitest + Playwright E2E tests
pnpm deploy           # wrangler deploy (Cloudflare)
```

## Architecture

**SvelteKit on Cloudflare** — every page prerenders to static HTML; dynamic endpoints (e.g. `/api/quiz`) run as Pages Functions on the Worker runtime.

- **Svelte 5** with runes (`$props()`, `{@render children()}`)
- **Tailwind CSS 4** via Vite plugin (`@tailwindcss/vite`)
- **mdsvex** for Markdown (`.md`) routes (currently used by `/api/reports/[id].md`)
- **`@sveltejs/adapter-cloudflare`** — output goes to `.svelte-kit/cloudflare/`
- **D1** (`QUIZ_SUBMISSIONS`), **R2** (`REPORTS_BUCKET`), and **Send Email** (`SEB`) bindings declared in `wrangler.jsonc`; surfaced to `vite dev` via `platformProxy`

### Key Patterns

**Svelte 5 syntax** - Uses runes, not legacy syntax:

```svelte
let {children} = $props()
{@render children()}
```

**Tailwind 4** - CSS import style, not PostCSS config:

```css
@import 'tailwindcss';
```

### Project Structure

- `src/routes/` - Pages and layouts (prerendered) + `src/routes/api/` Pages Functions
- `src/lib/components/` - Shared components (Header, Footer, SEO, etc.)
- `src/lib/utils/` - Utilities
- `static/` - Static assets (images, favicon, sitemap.xml, robots.txt, llms.txt)
- `tests/` - Playwright E2E tests
- `migrations/` - D1 migrations for the quiz submissions database

## Configuration Notes

- Node 22+ required (managed by mise)
- ESLint 9 flat config format
- All page routes prerendered with trailing slashes (`/page/` not `/page`)
- Dev server: `https://domeworks.localhost:1355` (via portless, see global CLAUDE.md)
- Edge redirects live in `_redirects` at the repo root (picked up by adapter-cloudflare)
- Production secrets via `pnpm wrangler secret put <NAME>`; local `.dev.vars` is git-ignored

## Component Patterns

- `Section.svelte` — reusable section wrapper with `background`, `padding`, `eyebrow`, `title` props
- `Button.svelte` — variants: primary/secondary/ghost, sizes: sm/md/lg
- `reveal.ts` action — scroll reveal animation via IntersectionObserver
- `JourneyBar.svelte` — service page navigation breadcrumb
