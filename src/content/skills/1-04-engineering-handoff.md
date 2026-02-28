---
name: "Engineering Handoff Brief Creator"
skillId: "1.04"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "Packages any Blueprint spec (2.xx) into a structured engineering brief that the development team can act on immediately."
version: "1.0"
last_updated: "2025-02-27"
recommendedFor: ["build", "document"]
githubPath: "1.xx-foundation/1.04-engineering-handoff-brief-creator/SKILL.md"
---

# 1.04 Engineering Handoff Brief Creator

The Engineering Handoff Brief Creator is the bridge between the business side of TLH and the engineering team. When someone uses a 2.xx Blueprint skill to define what they need -- a new product plan, a system change, a report -- it produces a spec in business language. But engineers need something different: technical context, affected systems, acceptance criteria they can test against, and clear scope boundaries.

Think of this skill as a translator. The business team writes the "what" and "why." This skill packages it into the "what exactly needs to happen" that engineering can pick up and start building.

## When to Use This Skill

- After any 2.xx Blueprint skill has produced a completed spec
- When the user says "hand this off to engineering" or "this is ready for dev"
- When packaging a business request into an engineering-actionable brief
- When assessing whether a spec is ready for engineering handoff (readiness check mode)
- When the user has a completed spec from any source and needs it formatted for the dev team

## The Handoff Process

### Step 1: Ingest the Source Spec

Read the Blueprint spec (or whatever the user provides). Identify which 2.xx Blueprint produced it, if applicable -- this tells you what kind of work engineering will be doing.

If the spec came from a 2.xx Blueprint, it should already have the standard handoff sections (Problem Statement, Success Criteria, Requirements, Business Rules, Affected Systems, User Impact). If any are missing or thin, flag them before proceeding.

### Step 2: Assess Handoff Readiness

Before creating the brief, run a quick readiness check. This prevents wasting engineering time on incomplete specs.

**Must-have for handoff (Critical -- block if missing):**
- Problem statement is clear and specific (not "make it better")
- At least one measurable success criterion
- Requirements are prioritized (must-have vs. nice-to-have)
- Affected systems are identified

**Should-have for handoff (Major -- warn but don't block):**
- Business rules are specific enough to implement
- User impact is described
- Stakeholder/requester is identified
- Timeline or priority indication
- Data requirements identified
- Size estimate (t-shirt size so engineering can plan capacity)
- Related work linked

If the spec fails the must-have check, tell the user what's missing and offer to help fill in the gaps rather than producing an incomplete brief.

### Step 3: Enrich with Technical Context

This is where the Handoff Brief Creator adds value beyond just reformatting. Using Foundation skills, enrich the spec with engineering-relevant context:

**From 1.09 Tools & Platforms Map:**
- Which specific systems, databases, or platforms are affected?
- What integrations will be involved?
- Are there technical constraints the business side might not know about?

**From 1.06 People & Roles:**
- Who are the relevant engineering contacts for the affected systems?
- Who should review or approve the technical approach?

**From 3.xx Engineering Standards (if built):**
- Which engineering standards apply to this work?
- Are there architecture rules, code style requirements, or security considerations?

### Step 4: Produce the Engineering Brief

Assemble the final brief in the standard format.

## Engineering Brief Format

Every handoff brief follows this structure:

```markdown
# Engineering Brief: [Title]

**Brief ID:** [Auto-generated: BRIEF-YYYY-MM-DD-NNN]
**Source:** [2.XX Blueprint Name] or [Manual request]
**Requested by:** [Name/role of the person who created the spec]
**Date:** [YYYY-MM-DD]
**Priority:** [P0: Drop everything | P1: This sprint | P2: Next sprint | P3: Backlog]
**Size Estimate:** [Small: days | Medium: 1-2 weeks | Large: 3-6 weeks | XL: 6+ weeks]
**Related Work:** [Links to other briefs, specs, or initiatives]

## Problem Statement
## Success Criteria
## Requirements (Must-Have and Nice-to-Have)
## Business Rules
## Technical Context (Affected Systems, Integration Points, Data Requirements, Constraints)
## User Impact
## Scope Boundaries
## Open Questions
## Acceptance Checklist
```

## Readiness Check Mode

When the user asks "is this ready for engineering?" or "can I hand this off?", run the readiness assessment from Step 2 without producing the full brief. Give a clear verdict:

- **Ready** -- All must-haves present, should-haves mostly covered. Proceed to full brief.
- **Almost ready** -- Must-haves present but thin. List what needs strengthening.
- **Not ready** -- Missing must-haves. List what's missing and offer to help fill gaps.

## Foundation Check

Before producing output, consult the TLH Foundation skills that are relevant to this work.

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Visual design, layouts, branding | 1.07 Brand Look & Feel |
| Writing tone, terminology, voice | 1.08 Brand Tone & Language |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

**Special note for 1.04:** This skill is the heaviest Foundation consumer in the taxonomy. It needs 1.09 (to identify affected systems), 1.06 (to identify engineering contacts). When those Foundation skills exist, the briefs will be significantly richer. Until then, include placeholder sections and note: "This section will be enriched once [1.XX] is built."

## Output Format

The Engineering Handoff Brief Creator produces a markdown file:

```
engineering-brief-[slug].md
```

The brief is a self-contained document that engineering can act on without needing to reference the original Blueprint spec (though the source is linked for context).

## What This Skill Does NOT Do

- It does not build the thing described in the brief -- it packages the request for the team that will
- It does not make technical architecture decisions -- it presents the business need and lets engineering decide the approach
- It does not replace the 2.xx Blueprint skills -- those define WHAT is needed; this skill translates that into a format engineering can act on
- It does not assign work to specific engineers -- it identifies relevant teams/contacts but leaves assignment to engineering leadership
- It does not set timelines -- it notes the requested priority but doesn't commit to delivery dates

## When Things Go Wrong

**The source spec is too vague to create a useful brief:**
Don't produce a bad brief. Tell the user what's missing and offer to help fill in the gaps.

**The spec references systems or teams the Memory Manager doesn't know about:**
Flag it in the brief's Open Questions section.

**The user wants to hand off something that didn't come from a 2.xx Blueprint:**
That's fine -- the Handoff Brief Creator works with any input. Ask the user enough questions to fill in the brief format.

**Multiple specs need to be combined into one brief:**
Consolidate into a single brief, noting the sources, and deduplicate overlapping sections.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. Defined handoff brief format, readiness check mode, technical enrichment process. Aligned with 2.xx Blueprint handoff format sections. |
| 1.1 | 2026-02-26 | Added Data Requirements section, Size Estimate field, Related Work field. Updated readiness check. Aligned with revised 2.xx Blueprint A-E taxonomy. |

## Reference: Related Skills

- **2.01-2.07 Blueprint Skills** -- The primary source of input for this skill. Every Blueprint spec is designed to feed into the Handoff Brief Creator.
- **1.09 Tools & Platforms Map** -- Source of truth for systems, platforms, and integrations referenced in briefs.
- **1.06 People & Roles** -- Source of truth for engineering team contacts and ownership.
- **3.01-3.06 Engineering Standards** -- Referenced in the "Applicable Standards" section of every brief.
- **1.03 Memory Manager** -- Preserves handoff context across sessions.
