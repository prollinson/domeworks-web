# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start dev server (hot reload)
yarn build            # Production build (static site)
yarn preview          # Preview production build on port 4173
yarn check            # TypeScript/Svelte type checking
yarn lint             # Prettier + ESLint check
yarn format           # Auto-format with Prettier
yarn test             # Run Playwright E2E tests (builds first)
```

## Architecture

**Static SvelteKit blog** using:
- **Svelte 5** with runes (`$props()`, `{@render children()}`)
- **Tailwind CSS 4** via Vite plugin (`@tailwindcss/vite`)
- **mdsvex** for Markdown content (`.md` files as routes)
- **Static adapter** with prerendering and trailing slashes

### Key Patterns

**Svelte 5 syntax** - Uses runes, not legacy syntax:
```svelte
let { children } = $props()
{@render children()}
```

**Tailwind 4** - CSS import style, not PostCSS config:
```css
@import 'tailwindcss';
```

**Markdown posts** - Place `.md` files in `src/routes/blog/` with frontmatter. Fetch with `fetchMarkdownPosts()` from `$lib/utils`.

### Project Structure

- `src/routes/` - Pages and layouts (prerendered)
- `src/lib/components/` - Shared components (Header, Footer)
- `src/lib/utils/` - Utilities (markdown fetching)
- `static/` - Static assets (images, favicon)
- `tests/` - Playwright E2E tests

## Configuration Notes

- Node 22+ required
- ESLint 9 flat config format
- All routes prerendered with trailing slashes (`/page/` not `/page`)
