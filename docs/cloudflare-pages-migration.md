# Cloudflare Pages migration runbook

Branch: `seo-sitemap-llms` (not yet merged to `main`). Completed: SvelteKit adapter swap from `adapter-static` to `adapter-cloudflare`, plus a `/api/quiz` Pages Function that sends email via Cloudflare's Send Email binding with mailto fallback.

## What the code change does

| Before                                                    | After                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `@sveltejs/adapter-static` outputs plain HTML to `build/` | `@sveltejs/adapter-cloudflare` outputs to `.svelte-kit/cloudflare/` with `_worker.js` for dynamic endpoints                                 |
| Every page prerendered to HTML                            | Every page still prerendered (`src/routes/+layout.js` sets `prerender = true`), only `/api/quiz/+server.ts` runs dynamic                    |
| Quiz submit opens user's mail client via `mailto:`        | Quiz submit POSTs to `/api/quiz`; endpoint sends email via Cloudflare SEB binding; mailto still fires as graceful fallback on network error |
| `_redirects` lived in `static/` (no-op on S3+CloudFront)  | `_redirects` at repo root, picked up by Pages adapter, turned into real 301s at the edge                                                    |

## Dashboard steps (Piers to do)

### 1. Create the Pages project

- Cloudflare dashboard → Pages → Create project → Connect to Git → select `prollinson/domeworks-web`
- Select the feature branch first (`seo-sitemap-llms`) for the preview deploy; leave `main` for production later
- Framework preset: **SvelteKit** (should auto-detect)
- Build command: `pnpm run build`
- Build output directory: `.svelte-kit/cloudflare`
- Environment variable: `NODE_VERSION` = `22`
- Hit Save and Deploy. First build takes 2–3 minutes.

### 2. Enable Email Routing + verify destination

- Cloudflare dashboard → domain `domeworks.tech` → Email → Email Routing → Enable (if not already)
- Destination Addresses → Add `piers@domeworks.tech` → confirm via the verification email
- Routing rules: already handled if you receive mail here; no new rule needed

### 3. Attach Send Email binding to the Pages project

- Pages project → Settings → Functions → Bindings → Add Send Email binding
- Variable name: `SEB`
- Destination address (allowlist): `piers@domeworks.tech`
- Save. Trigger a redeploy so the binding takes effect.

### 4. Smoke test at the preview URL

- Visit `https://<project>.pages.dev/quiz/`
- Fill the quiz, hit submit
- Expected: inline "Received. Your Action Plan is on the way" message
- Check `piers@domeworks.tech` inbox for a message from `quiz@domeworks.tech` containing the answers
- If the message doesn't arrive, check Pages → Functions → real-time logs for the request to `/api/quiz`

### 5. Cut over the production domain

Only after smoke test passes:

- Pages project → Custom domains → Add `domeworks.tech`
- Cloudflare DNS: remove old records pointing at CloudFront (the `A` / `CNAME` that currently resolves to CloudFront); Pages adds its own records automatically when you set the custom domain
- Certificate provisions in ~30 seconds
- Verify `https://domeworks.tech` serves from Pages (check response headers: `cf-ray` present, no `via: cloudfront` header)

### 6. Retire the old deploy path

Once production traffic is flowing through Pages:

- Delete `.github/workflows/deploy.yml` (the S3 sync + CloudFront invalidation workflow is now dead code; the Pages git integration handles deploys)
- Optionally: keep the S3 bucket + CloudFront distro as backup for a week, then decommission

## Rollback plan

If anything goes wrong after DNS cutover:

- In Cloudflare DNS, remove the Pages `CNAME` records and re-point `domeworks.tech` at the CloudFront distribution (distro ID `E13LBFGQ2LFKSU`, per the old deploy workflow)
- The old S3 bucket still has the previous static build until you decommission
- Takes ~1 minute for DNS to re-propagate (Cloudflare-hosted DNS = fast)

## Open items after migration

- `/ai-audit/` → `/ai-tools-assessment/` 301 now happens at the edge via `_redirects`; the meta-refresh stub page becomes redundant but harmless (acts as a second-layer fallback)
- `pnpm-lock.yaml` vs `yarn.lock`: the old deploy workflow used yarn; the project uses pnpm. Resolved automatically once that workflow is deleted.
- Monitor Cloudflare Pages free-tier limits (500 builds/month, 100K requests/day on Functions free tier). Not close to either at current traffic.

## Files touched on this branch

- `svelte.config.js` — adapter swap
- `package.json` — `adapter-cloudflare` in, `adapter-static` out, `@cloudflare/workers-types` added
- `src/app.d.ts` — `App.Platform` with `SEB` binding type
- `src/routes/api/quiz/+server.ts` — new Pages Function endpoint
- `src/routes/quiz/+page.svelte` — fetch() submit with mailto fallback
- `_redirects` — moved from `static/` to repo root
