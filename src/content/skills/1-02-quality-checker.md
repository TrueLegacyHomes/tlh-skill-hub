---
name: "Quality Checker"
skillId: "1.02"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "Validates any skill, process, list, document, taxonomy, or deliverable for completeness, consistency, accuracy, and MECE compliance."
version: "1.0"
last_updated: "2025-02-27"
recommendedFor: ["improve"]
claudePath: "~/.claude/skills/1.xx-foundation/1.02-quality-checker/SKILL.md"
---

# 1.02 Quality Checker

The Quality Checker is TLH's universal validation skill. Its job is to take anything that's been created -- a skill, a process, a list, a document, a taxonomy, a spec -- and systematically check whether it's complete, consistent, accurate, and well-structured.

Think of it as the inspector on a job site. The builder does their work, then the inspector walks through with a checklist. Nothing ships without passing inspection.

## When to Use This Skill

- After creating or modifying any skill in the TLH taxonomy
- When auditing a list, framework, or taxonomy for MECE compliance
- When reviewing a document, spec, or deliverable before handoff
- When the user asks "is this right?", "what am I missing?", or "does this hold up?"
- As the final step in any builder skill's workflow (2.xx Blueprints should call this before declaring done)

## Core Validation Framework

Every audit follows the same five-check structure. Not every check applies to every input -- use judgment about which checks matter for the thing being validated.

### Check 1: Completeness

Ask: "Is anything missing that should be here?"

- Are all required sections/fields present?
- Are there gaps in coverage?
- Would someone trying to USE this artifact find themselves stuck because something was left out?
- Are edge cases addressed?

**How to assess:** Mentally walk through someone actually using this thing. At what point would they hit a wall because something's undefined?

**Output format:**
- List what's present and complete
- List what's missing or incomplete
- Rate: Complete / Mostly Complete / Significant Gaps

### Check 2: Consistency

Ask: "Does everything agree with everything else?"

- Do naming conventions stay consistent throughout?
- Are terms used the same way everywhere? (If "lead" means one thing in section 1 and another in section 4, that's a consistency failure)
- Do formatting patterns stay uniform?
- Are cross-references accurate? (If something says "see 1.04" does 1.04 actually exist and say what's expected?)

**How to assess:** Look for contradictions, inconsistent terminology, broken references, and style drift.

**Output format:**
- List consistency issues found
- Rate: Consistent / Minor Issues / Major Inconsistencies

### Check 3: Accuracy

Ask: "Is what's stated actually correct?"

- Are facts verifiable?
- Are dependencies correctly mapped?
- Are descriptions accurate to what the thing actually does?
- Are any claims made that can't be supported?

**How to assess:** Cross-reference against known sources of truth. For TLH skills, cross-reference against the Skill Taxonomy and any relevant Foundation skills (1.05-1.09).

**Output format:**
- List accuracy issues found
- Rate: Accurate / Minor Errors / Significant Errors

### Check 4: MECE Compliance

Ask: "Is this mutually exclusive and collectively exhaustive?"

This check only applies to lists, categories, taxonomies, frameworks, and any structure that divides something into parts.

**Mutually Exclusive (no overlaps):**
- Take each item and ask: "Could this reasonably belong in another category on this list?"
- If yes, the boundary between those categories is fuzzy -- flag it
- Look for items that share scope, audience, or function with other items

**Collectively Exhaustive (no gaps):**
- Ask: "Is there anything that SHOULD be on this list that isn't?"
- Think about edge cases, uncommon scenarios, and future needs
- Walk through real-world use cases and check if every scenario has a home

**How to assess:** For each pair of items, check for overlap. Then brainstorm what's missing by thinking about what users would actually need.

**Output format:**
- List ME violations (overlaps) with explanation
- List CE violations (gaps) with explanation
- Rate: MECE / Mostly MECE / Not MECE

### Check 5: Clarity & Usability

Ask: "Would the intended audience understand and be able to use this?"

- Is the language appropriate for the audience? (Non-technical users shouldn't need to Google terms)
- Are instructions actionable? (Can someone actually DO what's described?)
- Is the structure logical and easy to navigate?
- Are names descriptive enough that someone can guess what something does without reading the full description?

**How to assess:** Put yourself in the shoes of the intended user. For TLH skills aimed at non-technical users, imagine Pdub or a project manager reading this for the first time.

**Output format:**
- List clarity/usability issues
- Rate: Clear / Some Confusion / Needs Rewrite

## Audit Output Structure

Every audit produces a structured report. Keep it concise -- the value is in flagging issues, not in lengthy prose.

```
## Quality Audit: [Name of thing being audited]
**Audited by:** 1.02 Quality Checker
**Date:** [Date]
**Input type:** [Skill / Process / List / Document / Taxonomy / Spec]

### Summary
[1-2 sentence overall assessment]

### Scores
| Check | Rating | Issues |
|-------|--------|--------|
| Completeness | [Rating] | [Count] |
| Consistency | [Rating] | [Count] |
| Accuracy | [Rating] | [Count] |
| MECE | [Rating or N/A] | [Count] |
| Clarity | [Rating] | [Count] |

### Issues Found
[Numbered list of specific issues, grouped by check, with severity and actionable recommendations]

Severity levels:
- **Critical**: Blocks deployment or use. Must fix before shipping.
- **Major**: Won't block deployment but will cause problems in practice. Fix before next release.
- **Minor**: Cosmetic or low-impact. Fix when convenient.

### Verdict
[PASS / PASS WITH NOTES / NEEDS REVISION]
- PASS: No issues or only minor cosmetic issues
- PASS WITH NOTES: Functional but has issues worth addressing
- NEEDS REVISION: Has issues that should be fixed before this ships
```

## Skill-Specific Audit

When auditing a TLH skill (any skill in the 1.xx-4.xx taxonomy), run the standard five checks PLUS these additional checks:

### Taxonomy Alignment
- Does the skill ID match the taxonomy?
- Are all declared dependencies valid?
- Does the skill correctly reference its Foundation dependencies?
- Is the skill scoped correctly -- not too broad and not too narrow?

### Description Quality
- Does the SKILL.md description clearly state WHEN to trigger the skill?
- Does it include specific trigger phrases?
- Is the description "pushy" enough to ensure triggering?

### Trigger Phrase Collision Detection
- Compare this skill's trigger phrases against other skills in the same series AND adjacent series
- Flag any phrase that could reasonably trigger two different skills

### Dependency Chain Validation
- Walk the full dependency chain
- Check for circular dependencies
- Check for missing dependencies

### Foundation Integration Check
- Does the skill consult the relevant Foundation skills (1.05-1.09)?
- Does the skill use company-specific terminology that matches Foundation skills?

## Quick Audit Mode

When the user says "quick check" or "quick audit" or time is short, run an abbreviated version:

1. Scan for the single biggest completeness gap
2. Scan for the single biggest consistency issue
3. Do a 30-second MECE check (if applicable)
4. Give a one-paragraph verdict

This should take under 2 minutes and produce 3-5 sentences of feedback.

## Foundation Check

Before producing an audit, consult the TLH Foundation skills that are relevant to the thing being audited.

| If the thing being audited involves... | Consult |
|----------------------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Visual design, layouts, branding | 1.07 Brand Look & Feel |
| Writing tone, terminology, voice | 1.08 Brand Tone & Language |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

**How to consult:** Read the SKILL.md of each relevant Foundation skill. Use the details it contains to verify the audited artifact uses correct TLH-specific terminology, references real systems, and follows actual company patterns -- not generic ones.

## When Things Go Wrong

**The thing being audited references a skill that doesn't exist yet:**
Note it as a pending dependency. Rate the reference as a Minor issue -- the structure is correct even if the dependency isn't available yet.

**The audit finds so many issues the report would be overwhelming:**
Prioritize. List the top 5 Critical issues, summarize the rest by category with counts.

**The user disagrees with an audit finding:**
Don't argue. Acknowledge the disagreement, explain your reasoning once, and move on.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. Migrated from skill-creator quality checking patterns. Added five-check framework, skill-specific audit, MECE compliance, Standard Template Compliance checklist, Foundation Integration Check, trigger phrase collision detection, severity levels, spec output audit mode, meta-skill exception. |

## What This Skill Does NOT Do

- It does not FIX issues -- it identifies them. The user or another skill handles fixes.
- It does not create new content -- it evaluates existing content.
- It does not make subjective quality judgments about writing style or design choices (that's 1.08 Brand Tone & Language territory).
- It does not replace domain expertise -- if auditing a financial model, it checks structure and consistency, not whether the financial assumptions are sound.

## Reference: Related Skills

- **1.01 Skill Builder** -- Creates the skills this checker validates. Every skill goes through 1.01 then 1.02.
- **1.04 Engineering Handoff Brief Creator** -- Consumes the specs that 2.xx Blueprint skills produce.
- **1.05-1.09 Foundation Skills** -- Source of truth for company-specific context. Audits should verify that skills reference the right Foundation skills and use real TLH details.
