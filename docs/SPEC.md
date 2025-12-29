# Dome Works Website Spec (Premium Positioning, Email-First)

## 1) Objective

Build a premium, credible marketing site for **Dome Works** that:

- Converts **Las Vegas Valley SMBs** (Las Vegas + Henderson) who are not technical and don’t know where to start.
- Establishes credibility for **enterprise consulting** (AI infrastructure/governance/enablement).
- Filters out low-budget “cheap automation” buyers.

**Primary CTA:** Email (mailto)
**Target budget:** $5–15k (first project), with clear filtering language.

---

## 2) Premium positioning (must be explicit)

### Definition (use in copy)

**Premium automation means:**

1. Understanding your specific bottlenecks
2. Integrating with your tools (Google Workspace, Slack, Microsoft, HubSpot)
3. Shipping systems that run unattended with monitoring, alerts, exception handling, and rollback

### Fit statement (use on Home + Services)

“We’re a good fit when reliability, clarity, and maintainability matter more than the lowest bid.”

### Budget filter (required)

- Publish pricing ranges. Use:
  - **Audit:** $3,500–$7,500 (credited toward Sprint if you proceed)
  - **Automation Sprint:** $9,500–$24,000 typical
  - **Ongoing Ops:** $2,000–$6,000/month

**Copy requirement:** Include one explicit line to deter low-budget leads:
“If budget is under $5k, we’re likely not a fit.”

---

## 3) Sitemap (MVP)

1. Home
2. Services (SMB packages)
3. Enterprise Consulting
4. Process
5. Examples (Illustrative examples)
6. Security & Data Handling
7. About
8. Contact

**Header nav:** Services, Enterprise, Process, Examples, Security, About, Contact
**Sticky header:** Yes
**Header CTA:** “Email us”

---

## 4) Design system (premium cues)

### Visual direction

- Minimal, high-contrast, high whitespace, restrained accent color.
- Avoid “AI hype” visuals (robots, neon gradients, busy stock photos).
- Use **artifact previews** as credibility visuals (simple screenshots/mockups of templates): workflow map, acceptance criteria, runbook.

### Components (build once, reuse)

- Primary/secondary buttons
- Callout panel
- Two-lane selector cards
- Service cards (pricing)
- Stepper/timeline (delivery lifecycle)
- Example cards
- Trust checklist grid
- FAQ accordion
- CTA band
- “Fit / Not for” panel

### Responsive rules

- Mobile: single-column; CTAs above the fold; tap targets ≥44px.
- Examples grid: 1 col mobile / 2 tablet / 3 desktop.

### Accessibility

- Semantic headings (one H1 per page)
- Focus states, contrast compliant

---

## 5) CTA mechanics (email-first)

All primary CTAs open prefilled email via `mailto:`.

### SMB mailto template (required)

- **Subject:** `Automation Sprint — [workflow name]`
- **Body:**
  - Business type + team size:
  - Workflow (start → end):
  - Bottlenecks (top 3):
  - Tools (Google/Slack/Microsoft/HubSpot + others):
  - Volume per week:
  - Success definition:
  - Budget band (target $5–15k):
  - Decision maker involved? (Yes/No)
  - Timing constraints:

### Enterprise mailto template (required)

- **Subject:** `AI Consulting — scope discussion`
- **Body:**
  - Goals:
  - Constraints (security/compliance):
  - Stakeholders (dev/IT/security):
  - Current stack:
  - Desired engagement model:
  - Timeline:
  - NDA required?:

**Implementation note:** Provide the designer the final email address; designer encodes subject/body.

---

## 6) Page specs (sections, content, acceptance criteria)

## 6.1 HOME (premium + routing)

### Section order (desktop + mobile)

1. **Hero (premium promise + locality + tools + budget anchor)**
2. **Two-lane selector**
3. **Non-technical reassurance block**
4. **What we do (service buckets)**
5. **“Real automation means…” (3 columns + artifacts)**
6. **How we work (stepper + artifacts per step)**
7. **Illustrative examples teaser**
8. **Trust without logos (controls checklist)**
9. **FAQ (8–12 items MVP)**
10. **Final CTA band (email + budget filter)**

### Hero (copy must be used verbatim)

- **H1:** Real automation for Las Vegas Valley businesses—built for your bottlenecks and your tools.
- **Subhead:** We identify the manual choke points, integrate with Google Workspace, Slack, Microsoft, and HubSpot, and ship workflows that run unattended with monitoring, alerts, and clean handoff.
- **Budget line (required):** Typical first build: $9,500–$24,000. Audit: $3,500–$7,500.
- **Primary CTA:** Email us your workflow (SMB mailto)
- **Secondary link:** See illustrative examples (scroll)

**Acceptance criteria:** H1 + CTA visible above fold on mobile.

### Two-lane selector

- Card A: I’m a local business (Las Vegas / Henderson) → Services
- Card B: I need an AI consultant → Enterprise Consulting
  Microcopy: “Not sure? Start with the AI Workflow Audit.”

### Non-technical reassurance block (callout)

Heading: You don’t need to be technical to get real automation
Body: If you can describe what happens today—where work gets stuck, repeated, or missed—we can turn it into a working system.
3 bullets (mini steps): identify bottleneck; map tools; ship unattended system (with controls).
CTA: Email what’s slowing you down.

### What we do (5 buckets)

- Workflow automation
- Integrations
- AI-assisted operations (with approvals)
- Reporting + visibility
- Governance + enablement

### “Real automation means…” (3 columns)

Each column includes an “Artifacts” line:

1. Bottlenecks (workflow map, baseline, acceptance criteria)
2. Integrations (permissions map, integration inventory)
3. Works while you sleep (monitoring, alerts, rollback, exception queue)

### How we work (stepper, 7 steps)

Discovery → Design → Build → Verify → Deploy → Handoff → Measure
Each step includes 2–4 artifact chips.

### Examples teaser (3–6 cards)

All cards labeled “Illustrative example” with:

- Title
- Tools
- Time-to-ship
- Caveat

Include these three:

- HubSpot lead intake → routing → follow-up
- Slack request intake → triage → assignment
- Weekly reporting autopilot

CTA: View all examples.

### Trust checklist

Checklist items (must be present):

- Least privilege + permission mapping
- Secrets management
- Observability (logs/alerts)
- Human-in-the-loop
- Rollback plans
- Ownership + documentation + automation inventory

### FAQ (MVP 8–12)

Must include:

- Non-technical starting point
- Pricing filter (“under $5k not a fit”)
- Timeline
- Tool compatibility
- Ownership
- AI quality controls (approvals, test sets)
- Maintenance/support
- Access requirements

### Final CTA band

Heading: Bring one workflow. We’ll tell you what it takes and what “done” looks like.
CTA: Email us your workflow
Microcopy bullets (required): workflow start→end, bottlenecks, tools, volume, budget ($5–15k).
Include filter line: “If budget is under $5k, we’re likely not a fit.”

---

## 6.2 SERVICES (SMB packages, premium filter)

### Above fold

- **H1:** SMB packages (built to ship): Audit → Sprint → Ops.
- **Subhead:** We don’t compete on lowest price. We compete on shipping a system you can trust.
- **Pricing anchor:** Typical first project $9,500–$24,000.

### Packages (3 cards)

1. **AI Workflow Audit**

- 5–10 business days
- $3,500–$7,500 (credited toward Sprint)
- Deliverables list

2. **Automation Sprint**

- 2–6 weeks
- $9,500–$24,000 typical
- Deliverables list

3. **Automation Ops**

- $2,000–$6,000/month
- What’s included list

Add **Best for / Not for** toggle under each card (required).

### “Included every time” box (required)

- Workflow map
- Acceptance criteria
- Exception handling
- Monitoring/alerts (critical flows)
- Rollout + rollback plan
- Runbook + documentation + automation inventory
- Ownership handoff + admin walkthrough

### Add-ons

List 8–12.

### “What we need from you”

Checklist.

CTA: Email to start (SMB mailto).

---

## 6.3 ENTERPRISE CONSULTING (vendor credibility)

### Above fold

- H1: AI consulting + infrastructure enablement (governance, evaluation, operating model)
- CTA: Email to discuss scope (Enterprise mailto)

### Engagement models (4 cards)

- Assessment & roadmap
- Architecture & governance setup
- Build support with internal dev teams
- Training + operating model

### “AI infrastructure means…” (required bullets)

- Data access patterns + permissions
- Logging/auditing
- Model selection + cost controls
- Evaluation (test sets, scorecards)
- Prompt/version control + change logs
- RAG (Retrieval-Augmented Generation) when appropriate
- Secure connectors/integrations
- Monitoring + runbooks

### Deliverables (required list)

Diagrams, runbooks, policies, backlog, decision log, comms cadence.

---

## 6.4 PROCESS

Discovery → Design → Build → Deploy → Measure
Each phase must show:

- Goal
- Activities
- Artifacts
  Add sidebar: Governance + operational readiness (least privilege, approvals, auditability, rollback, handoff).

---

## 6.5 EXAMPLES

Grid of 10–14 cards, each labeled “Illustrative example.”
Fields required: Trigger, workflow, tools, time-to-ship, expected impact (non-guaranteed), caveats.
Optional later: filters by function.

---

## 6.6 SECURITY & DATA HANDLING

Sections required:

- Least privilege + access inventory
- Secrets management
- Logging/alerting
- Data retention minimization
- Access revocation
- NDA support
- SOC 2 (System and Organization Controls 2) alignment language (no certification claim)
  Define acronyms: PII, PHI, SOC 2.

---

## 6.7 ABOUT

- Principles (clarity, scope control, reliability, maintainability)
- Founder credibility: link to LinkedIn (no fabricated claims)
- Working style: written-first, artifacts-first

---

## 6.8 CONTACT

Two-lane toggle (SMB / Enterprise).
Show the mailto templates in copy/paste boxes.
Add note: “If you’re price shopping, we won’t be the best fit.”

---

## 7) Deliverables for the designer

1. Figma file with:

- Styles (type/color/spacing)
- Component library (listed above)
- Desktop + mobile frames for all 8 pages

2. Exported assets (SVG icons, any backgrounds)
3. Handoff notes: which copy is locked vs editable, and mailto link targets.

---

## 8) Acceptance criteria (definition of done)

- Premium cues present: pricing anchors, “not lowest bid” language, fit/not-for, artifact previews.
- Two-lane routing on Home is unmissable.
- Email CTAs work and are lane-specific.
- No hype language; examples labeled “Illustrative example.”
- Mobile usability: hero + CTA above fold; nav usable; forms/templates readable.
