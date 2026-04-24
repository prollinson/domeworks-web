# Option B: SMB Landing Page + Light Homepage Updates

**Date:** 2026-04-06
**Context:** Strategy revised 2026-04-05. DomeWorks primary play is now SMB professional services (accounting firms first, expanding). Engineering positioning stays active for job search and existing pages. Discovery sprint outreach begins April 7.

---

## Scope

Two workstreams:

1. **New page: `/ai-audit/`** — standalone landing page for SMB outreach
2. **Light-touch homepage updates** — soften engineering-only language

### What we're NOT doing

- Not touching `/scan/`, `/context-build/`, `/orchestration-build/`, `/fractional/`, `/about/`, `/contact/`
- Not adding the audit to the homepage service ladder or nav
- Not rewriting the AI Stack section examples
- Not changing the Block/Square proof point

---

## Workstream 1: `/ai-audit/` Page

### Audience

Professional services firm owners and managing partners (accounting, law, real estate, insurance, consulting) in Henderson/Las Vegas. Non-technical. Arrived via cold outreach (LinkedIn DM or email). They want to know: what is this, what do I get, what does it cost, who is this guy.

### Page structure

Six sections, top to bottom. The page reads like a letter, not a marketing site.

#### 1. Hero

- **Headline:** Speaks to professional services broadly. Pain-first, not solution-first. Something in the vein of: "Your firm runs on manual workflows that AI can handle."
- **Subtext:** One sentence on what the audit is — a structured assessment of where AI tools can recover time.
- **CTA:** Book the discovery call (single primary button, links to scheduling page).
- **No animations, no scroll effects.** Static hero, loads fast.

#### 2. The problem (their language)

3-4 universal pain points professional services firms recognize:

- **Client intake & onboarding** — back-and-forth emails, missing documents, manual tracking
- **Correspondence & document drafting** — engagement letters, notices, update emails drafted from scratch or stale templates
- **Meeting prep & follow-up** — reviewing prior work before calls, summarizing notes, tracking action items
- **Research & staying current** — regulatory changes, jurisdiction-specific rules, industry updates

Each pain point gets 1-2 sentences max. No jargon. Written in language the firm owner uses, not consultant language.

Optional: a brief "For accounting firms, this looks like..." callout with 1-2 accounting-specific examples (transaction categorization, IRS notice responses). Keeps the page relevant to the April 7 outreach without narrowing the audience.

#### 3. What you get

The four deliverables, plainly stated:

1. **45-minute discovery call** — Piers asks about their workflow, where time gets stuck, what they've tried. No pitch.
2. **AI analysis** — Maps their workflow against existing AI tools, identifies where time can be recovered.
3. **Written report** — Top 3-7 AI opportunities, prioritized by impact and ease, with specific tool recommendations and a quick-start plan.
4. **Review call** — Walk through the report together, answer questions, decide what to act on.

Total time from their side: ~90 minutes across two calls plus reading the report.

#### 4. The math

The money shot. One block, high visual weight:

- "Most firms recover 5-7 hours/week per professional."
- "At $150-300/hour billing rates, that's $750-2,100/week in recovered capacity."
- "The tools cost $30-80/month. Payback is measured in days."

#### 5. About Piers

Short bio, reframed for this audience:

- 15 years building systems that replace manual coordination — now applying that to professional services
- Henderson, NV local
- Engineering leadership at DoorDash, Square, Mudflap (mentioned for credibility, not dwelt on)
- Not a software salesman — builds working systems, not strategy decks

Do NOT mention AICPA on the page (save for personalized outreach). Do NOT mention Patina.

#### 6. The offer + CTA

- Free for the first 5 firms (in the Henderson/Las Vegas area). Normally $999.
- Guarantee: implement the recommendations and save 5+ hours/week, or full refund on paid audits.
- Single CTA: book the discovery call.

### Design approach

- Same visual system as the rest of the site: warm-neutral palette, serif headlines, copper accents
- Simpler layout than the homepage — no scroll animations, no stack visualizations, no staggered reveal
- The page should feel like a well-designed letter: clear hierarchy, generous whitespace, easy to scan
- Mobile-first — outreach recipients will open this on their phone from LinkedIn

### Route setup

- Path: `/ai-audit/`
- File: `src/routes/ai-audit/+page.svelte`
- Static prerendered (same as all other routes)
- Own meta tags, OG image can reuse the existing one for now
- Page title: "AI Audit for Professional Services | DomeWorks"

---

## Workstream 2: Homepage Light-Touch Updates

### Changes

#### "Who this is for" section (01)

Current first bullet:

> You're a VP of Engineering, Head of Engineering, or CTO at a mid-market SaaS company (50–500 people) or a funded startup

Updated to something like:

> You're a technical leader or firm owner whose team has AI tools but still coordinates through meetings, status updates, and manual handoffs

Keep the remaining three bullets — they're universal enough. Keep the closing quote.

#### Hero subtext (secondary paragraph)

Current:

> 10+ years of engineering leadership at DoorDash, Square, and Mudflap. The biggest bottleneck was never the engineering — it was the coordination. That layer can now be built as infrastructure.

Updated:

> 10+ years leading teams at DoorDash, Square, and Mudflap. The biggest bottleneck was never the work — it was the coordination. That layer can now be built as infrastructure.

Two words changed: "engineering leadership" → "leading teams", "the engineering" → "the work".

#### Meta/OG tags

- Title: keep "Intelligence Infrastructure Engineering" (it's accurate and differentiating)
- Description: change "Your engineering team runs on..." → "Your team runs on..."
- Same change in OG and Twitter meta tags

#### JSON-LD

- Update Organization description: drop "for engineering teams" → "for teams"

### What stays untouched on homepage

- Hero headline ("Your team bought AI tools...")
- Stat bar (10+ years, 48hr, 4 layers)
- AI Stack section (all examples, Before/After table)
- Service ladder cards (Scan, Context Build, Orchestration Build, Fractional)
- Bottom CTA
- All animations and motion

---

## Implementation notes

- The `/ai-audit/` page is a new file — no existing file to modify
- Homepage changes are small text edits in `src/routes/+page.svelte`
- No new components needed — reuse `Section.svelte`, `Button.svelte`, existing layout patterns
- No new dependencies
