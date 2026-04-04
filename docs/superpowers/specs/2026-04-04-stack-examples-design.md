# Concrete Examples for the AI Stack

**Date:** 2026-04-04
**Branch:** hero-redesign
**Trigger:** Framework section feels abstract — add examples to make the two middle layers tangible for VP Eng buyers

## Context

The AI Stack section on the homepage (Section 03) shows four layers. The two DomeWorks-built layers (Agent Coordination, Context System) each have a one-line tagline but no concrete examples. A VP Eng scanning the page can't picture what these layers actually do for their team. Adding brief examples inside the layer cards + a before/after table below makes the framework tangible without adding a new section.

## Changes

### 1. Agent Coordination Layer Card — Add Example Bullets

**File:** `src/routes/+page.svelte` (Agent Coordination layer, inside the primary-colored card)

Below the existing tagline ("Replaces the coordination work that hierarchy exists to perform."), add 3 short examples as a list:

- Route PR reviews to the right engineer based on code ownership and availability
- Triage incoming bugs without a morning standup
- Distribute sprint context across teams so nobody re-explains the architecture

**Style:** `text-white/60 text-sm`, compact, with bullet markers. Should feel like supporting evidence, not a new section. Use a `<ul>` with small spacing (`mt-3 space-y-1`).

### 2. Context System Layer Card — Add Example Bullets

**File:** `src/routes/+page.svelte` (Context System layer, inside the copper-colored card)

Below the existing tagline ("Builds the world model so AI doesn't start from zero every time."), add 3 short examples:

- Feed your coding standards, architectural decisions, and team conventions into every AI interaction
- Keep your ticketing system, docs, and codebase connected so AI knows what's already been decided
- Give new engineers' AI tools the same context a senior engineer carries in their head

**Style:** Same as Agent Coordination — `text-white/60 text-sm`, `mt-3 space-y-1`.

### 3. Before/After Table — Below Stack Visual

**File:** `src/routes/+page.svelte` (after the stack visual `<div class="relative mb-16">`, before the pull quote `<div class="max-w-2xl mx-auto">`)

Add a compact before/after comparison. Use a 2-column grid with subtle styling:

| Before | After |
|--------|-------|
| Engineers re-explain architecture to every AI prompt | Context system feeds it automatically |
| Managers relay context between teams in meetings | Agent coordination routes it in real time |
| Status updates exist because information doesn't flow | Information flows through infrastructure, not people |
| AI tools help individuals but don't coordinate work | Multi-agent workflows coordinate across the team |

**Style:** Use the existing card aesthetic — `bg-stone rounded-xl border border-charcoal/10 p-6`. Two columns: "Before" header in `text-charcoal/50` with regular rows, "After" header in `text-primary` with rows that feel like the improvement. The table should use `use:reveal` for scroll animation consistent with the rest of the section.

## What Does NOT Change

- Stack layer layout, colors, sizing
- The stack-build scroll animation (layers still build bottom-to-top)
- The pull quote below the stack
- Any other page

## Success Criteria

- A VP Eng scanning the stack section can picture what each layer does for their team in concrete terms
- The examples feel like real engineering workflows, not marketing abstractions
- The before/after creates an immediate "yes, that's us" recognition for the buyer
- Examples are generic enough to swap for real case study examples later
