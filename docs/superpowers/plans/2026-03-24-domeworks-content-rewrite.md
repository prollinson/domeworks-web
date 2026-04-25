# DomeWorks Content Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write all website copy for 4 DomeWorks pages as markdown files in piers-os, ready for a developer to implement into SvelteKit.

**Architecture:** Content lives in `resources/domeworks/content/website/` as markdown files — one per page. Each file contains the full page copy with section headers matching the spec's IA. Voice is first-person Piers. All copy derived from existing source docs (brand identity, business plan, persona, launch strategy).

**Source docs (read these before writing any content):**

- Spec: `/Users/piers/projects/domeworks-web/docs/superpowers/specs/2026-03-24-domeworks-content-rewrite-design.md`
- Brand identity + voice: `/Users/piers/piers-os/resources/domeworks/brand/brand-identity.md`
- Buyer persona: `/Users/piers/piers-os/resources/domeworks/product/persona.md`
- Business plan: `/Users/piers/piers-os/resources/domeworks/business/business-plan.md`
- Launch strategy: `/Users/piers/piers-os/resources/domeworks/growth/launch-strategy.md`

**Voice rules (from spec + brand identity):**

- First person ("I", not "we" or "DomeWorks"). **Warning:** brand-identity.md uses "we" in its examples — ignore that. The spec overrides to "I" for solo practitioner positioning.
- 65% casual, 70% confident, 75% matter-of-fact
- Contractions. Short sentences. No jargon, no exclamation marks, no "passionate about"
- Let results carry weight. Earned confidence, not posturing.

**Out of scope:** Visual design, components, layout, blog, case studies, SEO/meta tags, analytics. Write content only. Page removal from the SvelteKit site is deferred to the design/implementation pass.

**Task ordering:** Tasks 1-4 are independent (can run in parallel). Task 5 depends on Tasks 1-4 completing first.

- The buyer is a VP Eng — respect their intelligence

---

## File Structure

```
resources/domeworks/content/website/
├── homepage.md          # Main landing page copy
├── assessment.md        # Assessment entry-point product page
├── about.md             # Piers's background and how he works
└── contact.md           # Booking and email contact
```

All files created in `/Users/piers/piers-os/resources/domeworks/content/website/`.

---

### Task 1: Homepage Content

**Files:**

- Create: `resources/domeworks/content/website/homepage.md`

**Reference:** Spec § "1. Homepage (`/`)" + brand identity §1.1 Brand Story + business plan §2 The Problem + persona Jordan's pain points

- [ ] **Step 1: Read source docs**

Read all 5 source docs listed above. Pay special attention to:

- Brand identity §1.1 Brand Story — the problem/transformation/resolution narrative
- Brand identity §1.3 Voice and Tone Matrix — yes/no copy examples
- Business plan §2 The Problem — symptoms list
- Business plan §3 Service Offering — both service lines
- Persona doc — Jordan's pain points and situation

- [ ] **Step 2: Write homepage content**

Create `resources/domeworks/content/website/homepage.md` with these sections in order:

1. **Hero** — One-line positioning + one-line proof (DoorDash, Square, 10+ years). CTA: Book a call.
2. **The Problem** — 3-4 sentences on the AI adoption gap. Use Jordan's pain language.
3. **What I Do** — Two service lines: Strategy + Implementation (4-12 weeks embedded) and Fractional AI Leadership (ongoing retainer). Brief descriptions.
4. **How It Works** — Assessment → Roadmap → Implementation. One sentence each. Link assessment to `/assessment/`.
5. **Who This Is For** — Short qualifier: VP Eng / Head of Eng, mid-market (50-500), past experimentation phase, needs implementation not decks.
6. **CTA** — Book a call. Links to `/contact/`.

Voice check before saving: Can you read every sentence aloud without cringing? No corporate speak? No "leverage" or "transform" or "unlock"?

- [ ] **Step 3: Commit**

```bash
git add resources/domeworks/content/website/homepage.md
git commit -m "Add homepage content for DomeWorks website rewrite"
```

---

### Task 2: Assessment Page Content

**Files:**

- Create: `resources/domeworks/content/website/assessment.md`

**Reference:** Spec § "2. Assessment (`/assessment/`)" + business plan §3 Phase 1: Assessment

- [ ] **Step 1: Write assessment page content**

Create `resources/domeworks/content/website/assessment.md` with these sections:

1. **What It Is** — The Phase 1 assessment (Week 1-2). Four activities: stakeholder interviews, tool/spend audit, workflow mapping, blocker identification.
2. **What You Get** — Three deliverables: AI Maturity Assessment, Prioritized Opportunity Map, Quick Wins (2-3 immediate actions).
3. **What Happens Next** — Assessment feeds into roadmap and implementation. No obligation.
4. **Investment** — $5-8K depending on team size and scope. Direct, no games.
5. **CTA** — Book a call to discuss. Links to `/contact/`.

Keep it concrete. Jordan is evaluating whether to spend $5-8K — they need to see exactly what they get.

- [ ] **Step 2: Commit**

```bash
git add resources/domeworks/content/website/assessment.md
git commit -m "Add assessment page content for DomeWorks website rewrite"
```

---

### Task 3: About Page Content

**Files:**

- Create: `resources/domeworks/content/website/about.md`

**Reference:** Spec § "3. About (`/about/`)" + brand identity §1.1 Brand Story + §1.2 Brand Personality (Veteran Guide archetype)

- [ ] **Step 1: Write about page content**

Create `resources/domeworks/content/website/about.md` with these sections:

1. **Who I Am** — Piers's background in first person. 10+ years eng leadership, DoorDash, Square. The pattern: saw AI adoption fail the same way across companies. Built DomeWorks to fix it. Draw from Veteran Guide archetype: practitioner, not guru.
2. **Why DomeWorks Exists** — The core insight: AI adoption is a team capability problem, not a technology procurement problem. The gap doesn't close by buying another tool.
3. **How I Work** — Three principles: Embedded not advisory (standups, pairing, planning), Designed to end (capability transfer, not dependency), Artifacts over opinions (working workflows, not decks).
4. **CTA** — Book a call. Links to `/contact/`.

This is the trust page. Jordan is checking Piers out before booking a call. Tone: confident but not boastful. Specific but not exhaustive.

- [ ] **Step 2: Commit**

```bash
git add resources/domeworks/content/website/about.md
git commit -m "Add about page content for DomeWorks website rewrite"
```

---

### Task 4: Contact Page Content

**Files:**

- Create: `resources/domeworks/content/website/contact.md`

**Reference:** Spec § "4. Contact (`/contact/`)"

- [ ] **Step 1: Write contact page content**

Create `resources/domeworks/content/website/contact.md` with these sections:

1. **Book a Call** — Primary CTA. Note: scheduling embed (Calendly/cal.com) goes here in implementation. For now, placeholder text describing a 30-minute discovery call.
2. **Or Email** — Single email address for async contact. No templates, no lane splitting.
3. **What to Expect** — Brief note: 30-minute conversation. I'll ask about your team, your current AI usage, and where you're stuck. No pitch deck, no pressure.

This is the shortest page. Keep it minimal — the goal is zero friction to start a conversation.

- [ ] **Step 2: Commit**

```bash
git add resources/domeworks/content/website/contact.md
git commit -m "Add contact page content for DomeWorks website rewrite"
```

---

### Task 5: Update Resource Index

**Files:**

- Modify: `resources/domeworks/index.md`

- [ ] **Step 1: Update the content section in index.md**

Replace the placeholder line `(Planned: landing page copy, sales enablement)` under the Content heading with links to the 4 new content files:

```markdown
### Content — Website copy

- `ready` [[Homepage|content/website/homepage.md]] — Hero, problem statement, services, how it works, qualifier, CTA
- `ready` [[Assessment|content/website/assessment.md]] — Entry-point product: what it is, deliverables, pricing, next steps
- `ready` [[About|content/website/about.md]] — Piers's background, why DomeWorks exists, how he works
- `ready` [[Contact|content/website/contact.md]] — Book a call, email, what to expect
```

- [ ] **Step 2: Commit**

```bash
git add resources/domeworks/index.md
git commit -m "Update DomeWorks index with website content links"
```
