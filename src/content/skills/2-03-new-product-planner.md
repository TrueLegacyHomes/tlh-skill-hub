---
name: "New Product Planner"
skillId: "2.03"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users plan a new product, service, or major feature from concept to structured spec."
version: "1.0"
last_updated: "2025-02-27"
---

# 2.03 New Product Planner

The New Product Planner takes a big idea -- "we should add aging-in-place renovations as a service" or "let's build a customer portal" -- and turns it into a comprehensive plan that covers everything from the business case to the technical requirements.

Think of it as the architect's blueprints for a new building. Before you break ground, you need to know: What are we building? Who is it for? How big is it? What does it connect to? What could go wrong? The New Product Planner answers all of these questions so that when engineering starts building, there are no surprises.

This is the most thorough Blueprint skill -- every section of the A-E taxonomy gets full treatment because new products involve the most risk and the most cross-functional impact.

## When to Use This Skill

- When planning an entirely new product, service, or major feature
- When expanding into a new market or service line
- When building something from scratch that doesn't exist at TLH today
- When the scope is large enough that multiple teams will be involved
- After 2.01 (Problem Definer) when the solution turns out to be "build something new"

## The Interview

Follow the standard 2.xx interview pattern. The New Product Planner goes heavy on everything -- there's no section to skip because new products touch every dimension.

### 1. Orient (1-2 questions)

- "What's the new product or service you're thinking about?"
- "What's driving this -- is it a customer need, a market opportunity, or something else?"

### 2. Scope (2-3 questions)

- "Who is this for -- existing TLH customers, a new customer segment, or both?"
- "Is this an extension of an existing service line, or something entirely new?"
- "What's the rough timeline you're thinking -- are we talking months or a year-plus?"

### 3. Detail (as needed)

Go deep on every A-E section. This is where the New Product Planner earns its keep.

**For A1:** "What problem does this new product solve that our existing services don't?"
**For A2:** "How do customers handle this need today?"
**For B1:** "How would you measure whether this product is successful?"
**For B2:** "What are the absolute minimum features this needs at launch?"
**For B3:** "What would you add in phase 2 if phase 1 goes well?"
**For C1:** "Are there pricing rules, eligibility criteria, geographic restrictions?"
**For C2:** "Walk me through the ideal customer experience from first contact to delivery."
**For D1:** "Will this need new tools, or can it run on what we already have?"
**For D2:** "Who on the team would run this? Do we need new hires?"
**For D3:** "What data does this product need?"
**For D4:** "What has to be true for this to work? What's the biggest risk?"

### 4. Confirm & Deliver

Walk through the full spec. For new products, this confirmation step is especially important -- the spec will drive significant investment.

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Heavy** | New products need a strong business case |
| B (Requirements & Scope) | **Heavy** -- all subsections | Must-haves define MVP, scope prevents creep |
| C (Logic & Behavior) | **Heavy** | Business rules and customer flows define the product |
| D (Impact & Dependencies) | **Heavy** | New products have cross-cutting impact |
| E (Handoff Metadata) | **Heavy** | Timeline and related work are critical |

## Foundation Check

Before producing output, consult the TLH Foundation skills.

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Visual design, layouts, branding | 1.07 Brand Look & Feel |
| Writing tone, terminology, voice | 1.08 Brand Tone & Language |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

For new product planning, 1.05 is critical (does this align with TLH's identity as a life transition service company?), and 1.09 matters for build-vs-buy decisions.

## Output Format

The New Product Planner produces a markdown file containing the full A-E spec with all sections substantive (not placeholders).

## Before You're Done: Quick Quality Check

1. **Completeness**: Are ALL A-E sections substantive? For a new product, no section should be "N/A."
2. **Consistency**: Are terms, product names, and descriptions consistent throughout?
3. **Clarity**: Could someone unfamiliar with TLH understand what this product is and why it matters?
4. **Foundation alignment**: Does this product align with TLH's identity?
5. **Handoff readiness**: Could 1.04 process this spec and produce a brief engineering could act on?

## What This Skill Does NOT Do

- It does not build the product -- it plans it
- It does not define individual features in detail -- use 2.04 for specific system changes
- It does not create the business financial model
- It does not replace market research -- it structures existing knowledge
- It does not create the SOP for delivering the new service -- that's 2.02 SOP Creator

## When Things Go Wrong

**The idea is too early-stage for a full plan:**
Suggest using 2.01 Problem Definer to sharpen the idea first.

**The scope is massive (6+ month initiative):**
Break it into phases: Phase 1 (MVP) and Phase 2 (expansion).

**The user wants financial projections:**
Capture revenue model and success criteria, but recommend working with the finance team on detailed financial modeling.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. A-E output taxonomy (all heavy), interview flow, quality gate, Foundation Check. |

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** -- Takes this skill's output and packages it for engineering.
- **2.01 Problem Definer** -- Often precedes 2.03. The Problem Definer identifies the need; the New Product Planner plans the solution.
- **2.02 SOP Creator** -- Follows 2.03. Once the product is planned, document the delivery process.
- **2.04 System Change Request** -- For individual system changes within the product.
- **1.05 Company Profile** -- Critical for ensuring alignment with TLH's mission.
- **1.02 Quality Checker** -- Validates the spec output.
