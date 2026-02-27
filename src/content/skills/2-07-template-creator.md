---
name: "Template Creator"
skillId: "2.07"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users spec a reusable template, form, or document structure for team-wide consistency."
version: "1.0"
last_updated: "2026-02-26"
recommendedFor: ["document"]
claudePath: "~/.claude/skills/2.xx-blueprints/2.07-template-creator/SKILL.md"
---

# 2.07 Template Creator

The Template Creator specs out reusable documents, forms, checklists, and structured formats that TLH team members use repeatedly. Instead of everyone creating their own version of a client intake form, estate sale proposal, or care placement referral letter, the Template Creator defines one standard version that everyone uses.

Think of it as creating the mold for a part in a factory. Once the mold is made, every part comes out identical. The Template Creator designs the mold — engineering (or the user) then produces parts from it.

This is the lightest Blueprint skill — templates are usually straightforward, so the spec focuses on the content structure and brand compliance rather than deep logic or system integration.

## When to Use This Skill

- When the user wants a standardized document, form, or checklist
- When different team members produce inconsistent versions of the same document
- When creating templates for client-facing materials (proposals, contracts, reports)
- When creating templates for internal use (meeting agendas, project briefs, status updates)
- When the user says "we need a standard way to [document X]"

## The Interview

Follow the standard 2.xx interview pattern. The Template Creator goes heavy on B1 (what makes the template successful) and C2 (the structure/layout of the template itself).

### 1. Orient (1-2 questions)

- "What template do you need? What's it for?"
- "Who will use this template — your team, customers, or both?"

### 2. Scope (2-3 questions)

- "Is this a one-page form, a multi-page document, or a simple checklist?"
- "Are there any existing versions of this we should start from, or is this brand new?"
- "Does this need to match TLH brand standards (colors, logos, fonts)?"

### 3. Detail (as needed)

**For A1 (Problem Statement):** "What goes wrong today without this template? Inconsistency? Missing information? Wasted time?"

**For B1 (Success Criteria):** "What makes a good version of this document? What information must always be included?"

**For B2 (Must-Haves):** "What sections or fields are required in every use of this template?"

**For C2 (User Flows):** "Walk me through filling out the template. What goes first? What's conditional?"

### 4. Confirm & Deliver

Show the template structure. If possible, include a sample filled-in version so the user can see how it looks in practice.

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Light** — brief context | Templates are usually straightforward |
| B (Requirements & Scope) | **Heavy on B1** | What must be in the template defines its value |
| C (Logic & Behavior) | **Heavy on C2** | The template structure IS the flow |
| D (Impact & Dependencies) | **Light** | Templates rarely have complex system dependencies |
| E (Handoff Metadata) | **Light** | Standard metadata |

## Output Format

The Template Creator produces a markdown file containing the full A–E spec PLUS a sample template layout showing what the finished template looks like when filled in.

## What This Skill Does NOT Do

- It does not build the template in the target system — that's engineering or a 4.xx skill
- It does not write the content that goes into the template — it defines the structure
- It does not create SOPs — that's 2.02. Templates are what people fill out; SOPs are what people follow
- It does not define brand standards — it consults 1.07 and 1.08 to apply existing standards

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** — Takes this skill's output when the template needs to be built into a system.
- **1.07 Brand Look & Feel** — Source of truth for visual standards templates should follow.
- **1.08 Brand Tone & Language** — Source of truth for language and tone in templates.
- **2.02 SOP Creator** — SOPs may reference templates.
