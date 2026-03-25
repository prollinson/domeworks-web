# DomeWorks Website Content Rewrite

## Summary

Strip the DomeWorks website from 8 pages to 4 and rewrite all copy. The current site targets Las Vegas SMBs with automation service packaging. The rewrite targets mid-market VP Engineering buyers with AI implementation consulting, matching the business plan, brand identity, and persona docs in piers-os.

Content and information architecture only. No design work — that follows separately.

## Context

**Source docs (piers-os/resources/domeworks/):**
- `brand/brand-identity.md` — Voice, tone, personality, brand story
- `product/persona.md` — Primary buyer: Jordan (VP Eng, 50-500 person company)
- `business/business-plan.md` — Service lines, pricing, engagement model
- `growth/launch-strategy.md` — Site purpose: credibility check, not conversion engine

**Current site state:**
- 8 pages: Home, Services, Enterprise, Process, Examples, Security, About, Contact
- Positioned as Las Vegas SMB automation shop
- Two-lane split (Local Business vs Enterprise)
- Budget anchors $3,500-$24,000 for packaged automation work
- Company voice ("DomeWorks does X")

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page count | 4 (Home, Assessment, About, Contact) | Launch strategy says minimal credibility site. 8 pages is over-built for the job. |
| Target audience | Single buyer: VP Eng / Head of Eng at mid-market SaaS | Business plan primary persona. Drop SMB/enterprise split. |
| Voice | First person (Piers) | Solo practitioner credibility. "I embed within your team" not "DomeWorks embeds." |
| Tone | 65% casual, 70% confident, 75% matter-of-fact | From brand identity voice matrix. |
| Service lines | Both: Strategy + Implementation, Fractional AI Leadership | Business plan defines both. Assessment is the entry point. |
| Pricing | Visible on Assessment page ($5-8K). Service line pricing discussed in calls. | Assessment price qualifies leads. Full engagement pricing is scope-dependent. |
| Design | Not in scope | Content/IA only. Design follows separately. |

## Pages

### 1. Homepage (`/`)

**Job:** Someone Googles "DomeWorks" after seeing Piers's LinkedIn post or receiving a DM. This page answers: "What is this? Is this person credible? Should I talk to them?"

**Sections in order:**

#### Hero
- One-line positioning: what DomeWorks does
- One-line proof: Piers's background (DoorDash, Square, 10+ years eng leadership)
- CTA: Book a call

Voice example (from brand identity):
> "I help engineering teams operationalize AI."

Not:
> "Unlocking the transformative potential of artificial intelligence for enterprise teams."

#### The Problem
3-4 sentences describing the AI adoption gap. Drawn directly from the brand story and business plan problem statement:
- Companies are paying for AI tools (Copilot, Claude, ChatGPT)
- A few engineers use them; most don't
- No integration into actual workflows (sprint cycles, code reviews, deployments)
- The CEO keeps asking "what's our AI strategy?" and the VP Eng doesn't have a good answer

Speak to Jordan's pain points from persona doc:
- "We're spending $15K/month on AI tools but I can't quantify what we're getting"
- "My best engineers use AI constantly but the rest of the team barely touches it"

#### What I Do
Two service lines from the business plan. Brief descriptions, not full specs.

**Strategy + Implementation:**
- 4-12 week embedded engagement
- Assess AI maturity, build roadmap, implement first phase
- Embed within the team — standups, pairing, planning sessions
- Engagement designed to end: capability transfer, not dependency

**Fractional AI Leadership:**
- Ongoing part-time role (1-2 days/week)
- Strategic direction + continuity
- For teams that need sustained AI leadership but can't justify a full-time hire yet

#### How It Works
The 3-phase flow from the business plan. One sentence each.

1. **Assessment** — Interview stakeholders, audit AI usage and spend, map workflows, identify highest-leverage integration points.
2. **Roadmap** — Design an AI integration plan specific to the team's workflows, culture, and tools. Define quick wins and strategic bets with success metrics.
3. **Implementation** — Embed within the team to build it. Set up tooling, train team members, run retros, iterate.

#### Who This Is For
Short qualifier paragraph. Filters out wrong-fit visitors.

- VP Engineering, Head of Engineering, or CTO
- Mid-market company (50-500 people) or funded startup
- Already paying for AI tools but stuck in the experimentation phase
- Needs implementation, not another strategy deck

#### CTA
Book a call. Repeat the primary CTA.

---

### 2. Assessment (`/assessment/`)

**Job:** The entry point product. Jordan is interested but not ready for a full engagement. This page explains what they get and what it costs.

**Sections in order:**

#### What It Is
The Phase 1 assessment from the business plan (Week 1-2):
- Interview key stakeholders (engineering leads, product, ops)
- Audit current AI tool usage, spend, and adoption patterns
- Map existing workflows to identify highest-leverage AI integration points
- Identify blockers: cultural, technical, process, knowledge gaps

#### What You Get
Deliverables:
- **AI Maturity Assessment** — Where the team stands today: what's working, what's not, where the gaps are
- **Prioritized Opportunity Map** — Ranked list of AI integration opportunities with estimated effort and impact
- **Quick Wins** — 2-3 things the team can do immediately, before any further engagement

#### What Happens Next
Assessment feeds into the roadmap and implementation phases. No obligation, but designed to lead there. The assessment fee credits toward a full engagement.

#### Investment
$5-8K depending on team size and scope. Direct, no haggling language. From persona doc: "Will start with a paid assessment ($5-8K) to evaluate fit before a larger engagement."

#### CTA
Book a call to discuss whether an assessment makes sense for your team.

---

### 3. About (`/about/`)

**Job:** The "can I trust this person?" page. Jordan is checking Piers out before agreeing to a call.

**Sections in order:**

#### Who I Am
Piers's background in first person:
- 10+ years engineering leadership
- DoorDash, Square, and other recognizable companies
- The pattern: saw AI adoption fail the same way across multiple companies
- Built DomeWorks to fix this specific problem

From brand identity (Veteran Guide archetype):
> "Not a guru. Not a thought leader. A practitioner who has walked this specific terrain and knows where the footholds are and where the loose rock is."

#### Why DomeWorks Exists
The core insight from the brand story:
- AI adoption is a team capability problem, not a technology procurement problem
- The gap between "we have AI tools" and "AI is part of how we work" doesn't close by buying another tool
- It closes when someone who has done this before sits down with the team and rewires the process

#### How I Work
From brand identity and business plan:
- **Embedded, not advisory** — I attend standups, pair with engineers, sit in on planning. Not a consultant who shows up quarterly with a deck.
- **Designed to end** — The goal isn't dependency. The goal is a team that's better at their jobs than they were 8 weeks ago.
- **Artifacts over opinions** — Every engagement produces working workflows, not recommendation documents.

#### CTA
Book a call.

---

### 4. Contact (`/contact/`)

**Job:** Make it easy to start a conversation. No friction, no qualification forms.

**Sections:**

#### Book a Call
Primary CTA. Calendly or cal.com embed. 30-minute discovery call.

#### Or Email
For people who prefer async. Single email address, no pre-filled templates or lane splitting.

#### What to Expect
Brief note setting expectations for the call:
- 30-minute conversation
- I'll ask about your team, your current AI usage, and where you're stuck
- No pitch deck, no pressure

---

## Pages to Remove

These pages exist in the current site and will be deleted:

| Page | Reason |
|------|--------|
| `/services/` | Replaced by service line descriptions on homepage + assessment page |
| `/enterprise/` | Single audience — no enterprise lane |
| `/process/` | "How It Works" section on homepage covers this |
| `/examples/` | Automation examples (invoice processing, social media calendars) don't match the new positioning |
| `/security/` | Enterprise governance content doesn't match the new buyer. Security/NDA details handled in conversation. |

## Voice Guidelines

From brand identity voice matrix. Apply to all copy:

- **Casual/Formal:** 65% casual. Professional but human. First-person. Contractions. No corporate speak.
- **Confident/Humble:** 70% confident. Earned confidence from experience, never posturing.
- **Enthusiastic/Matter-of-fact:** 75% matter-of-fact. Let results carry the weight. No exclamation marks, no "passionate about."
- **Technical/Accessible:** 60% accessible. The buyer is a VP Eng — respect their intelligence, skip jargon.

**Yes:** "Your team has Copilot seats. Most of them aren't being used. Here's why."
**No:** "We're excited to help organizations unlock the transformative potential of AI."

## Content Sources

All copy should be derived from these source docs, not invented:

| Content | Source |
|---------|--------|
| Problem statement | `brand/brand-identity.md` §1.1 Brand Story |
| Service descriptions | `business/business-plan.md` §3 Service Offering |
| Assessment details | `business/business-plan.md` §3 Phase 1 |
| Buyer pain points | `product/persona.md` Jordan's pain points |
| Voice and tone | `brand/brand-identity.md` §1.3 Voice and Tone Matrix |
| Pricing signals | `product/persona.md` "How Jordan buys" |
| Background/credibility | `brand/brand-identity.md` §1.2 Veteran Guide archetype |

## Out of Scope

- Visual design, colors, typography, layout
- Components, animations, interactions
- Blog, case studies, pricing page
- SEO, meta tags, OG images
- Analytics, tracking
