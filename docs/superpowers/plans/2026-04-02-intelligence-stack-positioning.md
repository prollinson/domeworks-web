# Intelligence Stack Positioning Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the entire DomeWorks site to reflect the new "Intelligence Infrastructure" positioning — replacing the "AI infrastructure engineering" framing with the Intelligence Stack framework, renaming services, restructuring routes, and rewriting copy across all pages.

**Architecture:** This is primarily a content/copy update using existing Svelte components (Section, Container, Button). Routes change: `/assessment/` becomes `/context-build/`, new `/orchestration-build/` page added, `/quick-build/` removed. Navigation, footer, layout meta all update. Copy source for each page lives in `~/piers-os/resources/domeworks/content/website/` and `~/piers-os/resources/domeworks/business/pricing-strategy.md`.

**Tech Stack:** SvelteKit 5 (runes), Tailwind 4, static adapter, existing component library (Section, Container, Button, reveal action)

---

## Change Summary

| What | Current | New |
|------|---------|-----|
| Core positioning | "AI infrastructure engineering" — tools → team shipping | "Intelligence Infrastructure Engineering" — replacing coordination overhead with infrastructure |
| Key framework | "connective tissue" / 6 focus areas | Intelligence Stack (4 layers: Surface, Orchestration, Context, Edge) |
| Service: Assessment | `/assessment/` — $10-15K, 2-week engagement | `/context-build/` — $10-15K, Context Layer build (Level 1→2) |
| Service: Build | Described on homepage, no dedicated page | `/orchestration-build/` — $2.5-3.5K/day, Orchestration Layer (Level 2→3) |
| Service: Fractional | Not on site | Mentioned on homepage under "What I Build" |
| Service: Workshop | Empty `/workshop/` route | Stays empty for now (content doc says `needs update`) |
| Route: quick-build | Empty `/quick-build/` route | Remove (moved to Patina per 2026-04-01 decision) |
| Navigation | AI Scan, Assessment, About, Contact | AI Scan, Context Build, About, Contact |
| Layout schema | ProfessionalService, Las Vegas Valley, domeworks.tech | Update to intelligence infrastructure, US-based, domeworks.ai |
| Footer tagline | "AI infrastructure engineering for teams that ship" | "Intelligence infrastructure that replaces coordination overhead" |
| Email | piers@domeworks.tech / hello@domeworks.tech | piers@domeworks.ai |
| Homepage hero | "Your team bought AI tools. Nobody built the systems." | "Your engineering team runs on meetings, status updates, and managers routing information between teams. That coordination layer can now be built as infrastructure." |
| About page | Mentions DoorDash, Square | Add Mudflap; reframe to coordination overhead thesis |
| Proof point | 95% AI pilots fail (Rand), 42% scrapped (S&P) | Block's "company world model" + existing stats |

---

## Copy Source Documents

Each task references its content source. The implementing agent MUST read the source doc and use it as the authoritative copy. Do not invent copy — translate the source doc into the existing Svelte component patterns.

| Page | Source Doc |
|------|-----------|
| Homepage | `~/piers-os/resources/domeworks/content/website/homepage.md` |
| About | `~/piers-os/resources/domeworks/content/website/about.md` |
| Contact | `~/piers-os/resources/domeworks/content/website/contact.md` |
| Context Build | `~/piers-os/resources/domeworks/content/website/assessment.md` + `~/piers-os/resources/domeworks/business/pricing-strategy.md` (Context Build section) |
| Orchestration Build | `~/piers-os/resources/domeworks/business/pricing-strategy.md` (Orchestration Build section) |
| Scan | No new content doc — update framing to "Intelligence Maturity diagnosis" per homepage.md |

---

## File Structure

### Modified Files
- `src/routes/+layout.svelte` — JSON-LD schema, email, description
- `src/routes/+page.svelte` — Full homepage rewrite
- `src/routes/scan/+page.svelte` — Reframe to Intelligence Maturity language
- `src/routes/about/+page.svelte` — Add Mudflap, update framing
- `src/routes/contact/+page.svelte` — Update email address
- `src/lib/components/layout/Header.svelte` — Update nav links
- `src/lib/components/layout/Footer.svelte` — Update tagline, description, email

### Created Files
- `src/routes/context-build/+page.svelte` — New service page (replaces Assessment)

### Deleted Files
- `src/routes/assessment/+page.svelte` — Replaced by context-build
- `src/routes/quick-build/` — Remove empty directory (moved to Patina)

### Deferred (not in this plan)
- `src/routes/orchestration-build/+page.svelte` — No content doc exists yet; homepage links to it but page can be created when copy is ready
- `src/routes/workshop/+page.svelte` — Content doc marked `needs update`

---

## Tasks

### Task 1: Update Layout Schema & Meta

**Files:**
- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Read the current layout file**

Read `src/routes/+layout.svelte` in full.

- [ ] **Step 2: Update the JSON-LD schema**

Replace the existing `jsonLd` object:

```javascript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'DomeWorks',
  description: 'Intelligence infrastructure engineering for engineering organizations. We build the Context and Orchestration layers that replace coordination overhead with AI-native systems.',
  url: 'https://domeworks.ai',
  areaServed: {
    '@type': 'Country',
    name: 'United States'
  },
  serviceType: ['Intelligence Infrastructure Engineering', 'AI Consulting', 'Context Layer Engineering', 'Orchestration Layer Engineering'],
  priceRange: '$2,500–$15,000+',
  email: 'piers@domeworks.ai'
}
```

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "refactor: update layout schema to intelligence infrastructure positioning"
```

---

### Task 2: Update Header Navigation

**Files:**
- Modify: `src/lib/components/layout/Header.svelte`

- [ ] **Step 1: Read the current Header**

Read `src/lib/components/layout/Header.svelte`.

- [ ] **Step 2: Update navLinks array**

Replace the `navLinks` const:

```typescript
const navLinks = [
  { href: '/scan/', label: 'AI Scan' },
  { href: '/context-build/', label: 'Context Build' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' }
]
```

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/layout/Header.svelte
git commit -m "refactor: update nav from Assessment to Context Build"
```

---

### Task 3: Update Footer

**Files:**
- Modify: `src/lib/components/layout/Footer.svelte`

- [ ] **Step 1: Read the current Footer**

Read `src/lib/components/layout/Footer.svelte` in full.

- [ ] **Step 2: Update brand description and email**

Find and replace these strings throughout the file:
- `"AI infrastructure engineering for teams that ship"` → `"Intelligence infrastructure that replaces coordination overhead"`
- `piers@domeworks.tech` → `piers@domeworks.ai`
- `hello@domeworks.tech` → `piers@domeworks.ai`
- Any reference to `domeworks.tech` → `domeworks.ai`
- `"Making AI work at the team level"` → `"Replacing coordination overhead with intelligence infrastructure"`
- Update the nav links: change `Assessment` link to point to `/context-build/` with label `Context Build`

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/layout/Footer.svelte
git commit -m "refactor: update footer to intelligence infrastructure positioning"
```

---

### Task 4: Rewrite Homepage

**Files:**
- Modify: `src/routes/+page.svelte`

**Copy source:** `~/piers-os/resources/domeworks/content/website/homepage.md`

This is the biggest task. The entire page content changes. The implementing agent must:

1. Read the current `+page.svelte` to understand the component structure, imports, and patterns used
2. Read the source doc `~/piers-os/resources/domeworks/content/website/homepage.md` for all copy
3. Rewrite the page preserving the existing component patterns (Section, Container, Button, reveal action) but with new content

- [ ] **Step 1: Read the current homepage and the source content doc**

Read both:
- `src/routes/+page.svelte` (full file)
- `~/piers-os/resources/domeworks/content/website/homepage.md`

- [ ] **Step 2: Rewrite the homepage**

Key structural changes from current → new:

**Hero section:**
- Old headline: "Your team bought AI tools. Nobody built the systems."
- New headline: from source doc Hero section — the coordination overhead → infrastructure pitch
- Old subheadline about tools/systems → New about 10+ years at DoorDash/Square/Mudflap, coordination as the bottleneck
- Old description about "developer workflow automation" → New about replacing coordination layer with intelligence infrastructure
- Stat bar: keep structure, update content (e.g., "Intelligence Stack" instead of generic)

**Section 01 (Problem):**
- Old: "Why AI tools fail at the team level" — tools/adoption framing
- New: From source doc "The Problem" — hierarchy, meetings, managers routing information, Block's company world model reference

**Section 02 (What I Build — THE INTELLIGENCE STACK):**
- This is NEW. Replace the old "How it works" 3-card layout.
- The Intelligence Stack diagram (4 layers: Surface, Orchestration, Context, Edge)
- Context Layer description
- Orchestration Layer description
- "I embed with your team 2-3 days a week for 4-12 weeks" paragraph
- Fractional AI Leadership subsection

**Section 03 (How It Works):**
- Old: Scan / Assessment / Build cards
- New: AI Scan / Context Build / Orchestration Build cards with new descriptions and pricing from source doc

**Section 04 (Who This Is For):**
- Similar structure but reframed around "coordination overhead" instead of "tools not working"
- From source doc "Who This Is For" section

**Section 05 (FAQs):**
- Remove or update. The source doc doesn't include FAQs — remove the FAQ section and replace with the "Ready to talk?" CTA section from the source doc.

**Meta/SEO:**
- Update `<svelte:head>` title: `"DomeWorks — Intelligence Infrastructure Engineering"`
- Update meta description to match new positioning
- Update any JSON-LD on the page
- Update OG tags if present

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Visual verification**

Start dev server and check `https://domeworks.localhost:1355/` in browser. Verify:
- Hero renders with new headline
- Intelligence Stack section displays the 4-layer diagram
- Service cards show Scan / Context Build / Orchestration Build
- All internal links work
- Page scrolls smoothly with reveal animations

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: rewrite homepage to Intelligence Stack positioning"
```

---

### Task 5: Create Context Build Page (replaces Assessment)

**Files:**
- Create: `src/routes/context-build/+page.svelte`
- Delete: `src/routes/assessment/+page.svelte`

**Copy sources:**
- `~/piers-os/resources/domeworks/content/website/assessment.md` (base copy — mostly reusable)
- `~/piers-os/resources/domeworks/business/pricing-strategy.md` (Context Build section for framing)

- [ ] **Step 1: Read the current Assessment page and source docs**

Read:
- `src/routes/assessment/+page.svelte`
- `~/piers-os/resources/domeworks/content/website/assessment.md`
- `~/piers-os/resources/domeworks/business/pricing-strategy.md` (lines 130-165, Context Build section)

- [ ] **Step 2: Create the Context Build page**

Create `src/routes/context-build/+page.svelte` by adapting the Assessment page:

Key changes:
- Page title: "Context Build" not "Assessment"
- Hero headline: Reframe from "Find out what's actually happening with AI" to Context Layer framing — "Build the Context Layer your AI tools are missing"
- Hero subheadline: Intelligence Maturity Level 1→2 transition language
- The four-step process stays largely the same (stakeholder interviews, audit, workflow assessment, blocker identification) but reframed as "diagnosing Intelligence Maturity" and "designing the Context Layer"
- Deliverables reframed: "Intelligence Maturity Assessment + Context Layer Blueprint + Prioritized Opportunity Map" (from pricing doc)
- "What Happens Next" section: references Orchestration Build as the next phase
- Pricing section: same numbers ($10K-$15K tiered), add founding client rate ($7K-$10K)
- Meta title: "Context Build — Build Your Organization's Intelligence Layer | DomeWorks"
- Meta description: reflect Context Layer positioning

- [ ] **Step 3: Delete the old Assessment page**

```bash
rm src/routes/assessment/+page.svelte
rmdir src/routes/assessment/
```

- [ ] **Step 4: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds. `/context-build/` route exists, `/assessment/` is gone.

- [ ] **Step 5: Commit**

```bash
git add src/routes/context-build/+page.svelte
git rm src/routes/assessment/+page.svelte
git commit -m "feat: replace Assessment with Context Build page"
```

---

### Task 6: Update Scan Page

**Files:**
- Modify: `src/routes/scan/+page.svelte`

- [ ] **Step 1: Read the current Scan page**

Read `src/routes/scan/+page.svelte` in full.

- [ ] **Step 2: Update framing to Intelligence Maturity language**

Targeted edits (not a full rewrite):

1. **Hero headline** — keep as-is ("What you're spending on AI. What you're getting from it. In 48 hours.") but update subheadline to mention "Intelligence Maturity level"
2. **AI Readiness Score** deliverable → rename to "Intelligence Maturity Score" — keep the 5-dimension, 1-5 scale structure but reframe as "where you are on the path from 'bought tools' to 'AI coordinates our work'" (from homepage.md)
3. **"What this isn't" section** — update: "Scan shows WHAT'S HAPPENING. The Context Build shows WHY and designs WHAT TO BUILD." (was "Assessment")
4. **CTA / next steps** — any reference to "Assessment" → "Context Build", link to `/context-build/`
5. **Meta tags** — update if they reference "assessment"

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/routes/scan/+page.svelte
git commit -m "refactor: update Scan page with Intelligence Maturity framing"
```

---

### Task 7: Update About Page

**Files:**
- Modify: `src/routes/about/+page.svelte`

**Copy source:** `~/piers-os/resources/domeworks/content/website/about.md`

- [ ] **Step 1: Read the current About page and source doc**

Read both:
- `src/routes/about/+page.svelte`
- `~/piers-os/resources/domeworks/content/website/about.md`

- [ ] **Step 2: Apply targeted updates**

The About source doc is largely unchanged from what's on the site. Key differences:

1. **Hero/intro** — Add "Mudflap" to the company list: "DoorDash, Square, and Mudflap" (was "DoorDash and Square")
2. **"Why DomeWorks Exists"** — The source doc still uses "connective tissue" framing. Update to match the new positioning: replace "connective tissue" language with "intelligence infrastructure that replaces coordination overhead" where it appears. Keep the 80% stat.
3. **"How I Work"** — Three principles are identical. No change needed.
4. **Meta tags** — Update if they reference old framing

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/routes/about/+page.svelte
git commit -m "refactor: update About page with Mudflap and intelligence infrastructure framing"
```

---

### Task 8: Update Contact Page

**Files:**
- Modify: `src/routes/contact/+page.svelte`

**Copy source:** `~/piers-os/resources/domeworks/content/website/contact.md`

- [ ] **Step 1: Read the current Contact page**

Read `src/routes/contact/+page.svelte`.

- [ ] **Step 2: Update email and service references**

1. Change `piers@domeworks.tech` → `piers@domeworks.ai` (if present in the component)
2. Change any `mailto:` references
3. Update "AI Scan ($2,500) or a full Assessment ($10,000+)" → "AI Scan ($2,500) or a Context Build ($10,000+)"
4. Update link from `/assessment/` → `/context-build/`
5. Check `src/lib/utils/mailto.ts` for the email address and update there too

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/routes/contact/+page.svelte src/lib/utils/mailto.ts
git commit -m "refactor: update Contact page email and service references"
```

---

### Task 9: Remove Quick Build Route

**Files:**
- Delete: `src/routes/quick-build/` (empty directory)

- [ ] **Step 1: Remove the empty directory**

```bash
rmdir /Users/piers/Projects/domeworks-web/src/routes/quick-build/
```

If it contains files, check what's there and remove them.

- [ ] **Step 2: Search for any references to `/quick-build/`**

Grep the codebase for `quick-build` references and remove/update them.

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove quick-build route (moved to Patina)"
```

---

### Task 10: Global Search-and-Replace Sweep

**Files:**
- Any remaining files with old references

- [ ] **Step 1: Search for stale references**

Grep the entire `src/` directory for:
- `domeworks.tech` (should be `domeworks.ai`)
- `assessment` in href/link contexts (should be `context-build`)
- `"Assessment"` as a service name label (should be `"Context Build"`)
- `"AI infrastructure engineering"` (should be intelligence infrastructure)
- `hello@domeworks` (should be `piers@domeworks.ai`)

- [ ] **Step 2: Fix any remaining references**

Update each file found in the sweep.

- [ ] **Step 3: Verify build passes**

Run: `cd /Users/piers/Projects/domeworks-web && yarn build`
Expected: Build succeeds.

- [ ] **Step 4: Full visual check**

Navigate through all pages on `https://domeworks.localhost:1355/`:
- `/` — homepage with Intelligence Stack
- `/scan/` — Intelligence Maturity framing
- `/context-build/` — new service page
- `/about/` — updated bio
- `/contact/` — updated email
- Verify all nav links work
- Verify footer links work
- Verify no broken links (old `/assessment/` should 404, that's fine for now)

- [ ] **Step 5: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: sweep stale references to old positioning"
```

---

## Deferred Work (not in this plan)

These items need content before they can be implemented:

1. **Orchestration Build page** (`/orchestration-build/`) — Homepage links to it, but no content doc exists. Needs copy written first. The pricing strategy doc has pricing details but no page copy.
2. **Workshop page** (`/workshop/`) — Content doc marked `needs update`. Wait for updated copy.
3. **301 redirects** for `/assessment/` → `/context-build/` — SvelteKit static adapter doesn't natively support redirects. Consider a `+page.server.ts` with a redirect, or handle at the hosting layer (Cloudflare, Vercel, etc.).
4. **Intelligence Stack visual component** — The homepage source doc includes an ASCII diagram of the 4-layer stack. Consider building a proper SVG or styled component for this instead of rendering it as a code block.
