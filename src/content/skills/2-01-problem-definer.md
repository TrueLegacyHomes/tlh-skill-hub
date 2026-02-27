---
name: "Problem Definer"
skillId: "2.01"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users clearly define a business problem and produce a structured spec that engineering can act on."
version: "1.0"
last_updated: "2025-02-27"
---

# 2.01 Problem Definer

The Problem Definer is where most work at TLH starts. Someone has a pain point -- customers are complaining, a process is slow, money is being left on the table -- but they haven't yet defined exactly what needs to change. This skill walks them through turning a vague frustration into a clear, structured spec that engineering can actually build from.

Think of it as the intake form for the engineering team, except instead of filling out a form, you're having a conversation. The skill asks the right questions, organizes the answers into the A-E spec format, and delivers a document that's ready to hand off via 1.04 (Engineering Handoff Brief Creator).

## When to Use This Skill

- When someone describes a problem, pain point, or frustration they want solved
- When a user says "something isn't working right" or "we need to fix this"
- When someone has a vague improvement idea that needs to be sharpened into a real request
- When the user wants to request work from engineering but doesn't know how to structure the ask
- When another Blueprint skill (2.03-2.07) is too specific -- if the user isn't sure WHAT they need, start with the Problem Definer to figure it out

## The Interview

Follow the standard 2.xx interview pattern (Orient -> Scope -> Detail -> Confirm). The Problem Definer goes heavy on A (Problem & Context) and B1 (Success Criteria) because its primary job is making sure the problem is well-understood before anyone starts building.

### 1. Orient (1-2 questions)

Start with the big picture. Don't dive into details yet.

- "What's the problem you're running into?" or "What's not working the way it should?"
- "Who does this affect -- your team, your customers, or both?"

Let the user describe the problem in their own words. Listen for which TLH service line this touches (estate sales, home acquisitions, care placement) and whether it's an internal process issue or a customer-facing one.

### 2. Scope (2-3 questions)

Narrow down based on what you heard.

- "How often does this happen? Is this a daily annoyance or a once-in-a-while thing?"
- "Have you tried any workarounds? What happens now when this problem comes up?"
- "If we fixed this, what would 'good' look like? How would you know the problem is solved?"

### 3. Detail (as needed)

Fill in the A-E spec sections conversationally. Don't hand the user a template -- extract the answers through natural questions.

**For A1 (Problem Statement):** Synthesize what the user told you in Orient. Read it back: "So the core problem is [X], and it matters because [Y]. Is that right?"

**For A2 (Current State):** "Walk me through what happens today when [this situation] comes up."

**For B1 (Success Criteria):** "If we built the perfect solution, what would be different? Give me 2-3 things you'd be able to measure."

**For B2/B3 (Requirements):** "What absolutely has to be part of the fix? And what would be nice to have but not critical?"

**For B4 (Scope Boundaries):** "Is there anything that might seem related but you specifically do NOT want us to touch?"

**For C1 (Business Rules):** "Are there any rules or constraints? Like 'only if the sale is over $X' or 'this only applies to estate sales, not care placement.'"

**For C2 (User Flows):** Keep light for Problem Definer -- a brief description of the desired flow is enough.

**For D1 (Affected Systems):** "Do you know which tools or systems this involves?" If the user doesn't know, note it as an open question for engineering.

**For D2 (Affected People):** "Who would be affected by this change -- which team members, which customer types?"

**For D3 (Data Requirements):** Keep light unless the problem is clearly data-related.

**For D4 (Dependencies & Risks):** "Is there anything that has to happen first before we can fix this? Any risks I should flag?"

**For E1-E5 (Handoff Metadata):** "How urgent is this -- drop everything, do it soon, or when we get to it?" and capture the requester info.

### 4. Confirm & Deliver

Assemble the full spec. Show it to the user: "Here's what I've captured. Does this match what you're describing, or should I adjust anything?"

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Heavy** -- this is the core output | The whole point of this skill is nailing the problem statement |
| B1 (Success Criteria) | **Heavy** -- essential for knowing when it's solved | Without this, engineering doesn't know when to stop |
| B2-B4 (Requirements & Scope) | **Medium** -- capture what the user knows | User may not have full requirements yet |
| C (Logic & Behavior) | **Light** -- basic rules and flows | Deep logic mapping happens in more specific Blueprints |
| D (Impact & Dependencies) | **Medium** on D4 (risks), **Light** on D1/D3 | The user may not know which systems are involved |
| E (Handoff Metadata) | **Standard** -- always captured | Priority and requester are always needed |

## Foundation Check

Before producing output, consult the TLH Foundation skills that are relevant to this work.

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Visual design, layouts, branding | 1.07 Brand Look & Feel |
| Writing tone, terminology, voice | 1.08 Brand Tone & Language |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

## Output Format

The Problem Definer produces a markdown spec file containing the full A-E structure:

- **A. Problem & Context** (A1: Problem Statement, A2: Current State)
- **B. Requirements & Scope** (B1: Success Criteria, B2: Must-Haves, B3: Nice-to-Haves, B4: Scope Boundaries)
- **C. Logic & Behavior** (C1: Business Rules, C2: User Flows)
- **D. Impact & Dependencies** (D1: Affected Systems, D2: Affected People, D3: Data Requirements, D4: Dependencies & Risks)
- **E. Handoff Metadata** (E1: Priority, E2: Requested By, E3: Timeline, E4: Open Questions, E5: Related Work)

## Before You're Done: Quick Quality Check

Before delivering this spec, run a quick self-check:

1. **Completeness**: Are all A-E sections present? Would an engineer be able to start work from this spec alone?
2. **Consistency**: Are all terms, names, and references used the same way throughout?
3. **Clarity**: Read the spec as if you've never seen this project before. Does it make sense on its own?
4. **Foundation alignment**: Did you consult the Foundation skills? Does your output use real TLH-specific details?
5. **Handoff readiness**: Could 1.04 Engineering Handoff Brief Creator process this spec without coming back to ask questions?

## What This Skill Does NOT Do

- It does not build the solution -- it defines the problem
- It does not create SOPs -- that's 2.02 SOP Creator
- It does not plan new products -- that's 2.03 New Product Planner
- It does not make engineering decisions -- it captures the business need
- It does not replace specific Blueprints -- if the user knows they need a system change, use 2.04 directly

## When Things Go Wrong

**The user's input is too vague to produce a good output:**
Don't guess. Ask one focused clarifying question. If the user can't answer, offer two concrete options.

**The skill realizes the user actually needs a different skill:**
Tell the user directly and offer to switch.

**The user describes multiple problems at once:**
Split them into separate specs, starting with the more urgent one.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. A-E output taxonomy, emphasis guide (heavy on A, B1), interview flow, quality gate, Foundation Check. |

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** -- Takes this skill's output and packages it for engineering.
- **1.05 Company Profile** -- Source of truth for which TLH service line a problem belongs to.
- **1.09 Tools & Platforms Map** -- Source of truth for which systems are involved.
- **2.03 New Product Planner** -- If the "problem" turns out to be "we need a whole new product," redirect to 2.03.
- **2.04 System Change Request** -- If the problem is specifically about changing an existing system, redirect to 2.04.
- **1.02 Quality Checker** -- Validates the spec output.
