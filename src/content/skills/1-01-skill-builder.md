---
name: "Skill Builder"
skillId: "1.01"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "Creates, improves, and tests all skills in the TLH Skill Taxonomy (1.xx-4.xx)."
version: "1.3"
last_updated: "2026-03-14"
recommendedFor: ["improve"]
githubPath: "1.xx-foundation/1.01-skill-builder/SKILL.md"
---

# 1.01 Skill Builder

The Skill Builder is TLH's master tool for creating and improving every skill in the taxonomy. Think of it as the construction crew that builds every other tool in the shop. Without this skill, nothing else gets made.

It works for everyone -- whether you're Pdub defining a new company knowledge skill, a project manager capturing a process, or an engineer building a technical toolkit skill. The Skill Builder adapts its approach based on what's being built and who's building it.

## When to Use This Skill

- Creating any new skill in the TLH taxonomy (1.xx through 4.xx)
- Improving or rewriting an existing skill that isn't performing well
- Turning a workflow you just completed into a reusable skill
- Adding a skill to the taxonomy that doesn't exist yet
- Rebuilding all skills from scratch (batch mode)

## Before You Start: Know What You're Building

Every TLH skill lives in the taxonomy. Before writing a single line, confirm these three things:

### 1. Taxonomy Placement

Which series does this skill belong to?

| Series | Type | Audience | Style |
|--------|------|----------|-------|
| 1.xx Foundation | NOUN -- knowledge you reference | Everyone | Defines what things ARE |
| 2.xx Blueprints | VERB -- specs you create | Non-technical users | Guides users to define WHAT they need |
| 3.xx Engineering Standards | NOUN -- rules you follow | Engineering team | Defines HOW engineering works |
| 4.xx Engineering Toolkit | TOOL -- actions you take | Engineering team | Executes specific engineering tasks |

The series determines the skill's voice, complexity level, and output format. A 2.xx Blueprint skill should feel like a friendly interview. A 4.xx Toolkit skill can assume engineering fluency.

### 2. Dependencies

What other skills does this one need to exist first? Check the taxonomy dependency map. If your skill depends on 1.05 (Company Profile) but 1.05 hasn't been built yet, either build 1.05 first or note the dependency as "pending -- use placeholder until built."

Common dependency patterns:
- Nearly every skill depends on at least one 1.xx Foundation skill
- 2.xx Blueprint skills often depend on 1.05 (Company Profile) and 1.06 (People & Roles)
- 4.xx Toolkit skills depend on 3.xx Engineering Standards
- Nothing should create circular dependencies (A needs B, B needs A)

### 3. Scope Boundaries

What does this skill do, and equally important, what does it NOT do? Check adjacent skills in the taxonomy to avoid overlap. If you're building 2.04 (System Change Request), make sure it doesn't accidentally do what 4.08 (System Configurator) does -- 2.04 defines the change, 4.08 executes it.

## The Build Process

### Step 1: Capture Intent

Start by understanding what the skill needs to accomplish. Ask these questions (or extract answers from the conversation if they've already been discussed):

**For any skill:**
- What should this skill help someone do?
- What would someone say when they need this skill? (trigger phrases)
- What does the skill produce as output?
- What information does it need to work? (inputs and dependencies)

**Additional questions by series:**

For **1.xx Foundation** skills:
- What organizational knowledge does this capture?
- Who is the source of truth for this information?
- How often does this information change?

For **2.xx Blueprint** skills:
- What spec or plan does this produce?
- Does the output need to feed into 1.04 (Engineering Handoff Brief Creator)?
- What would the non-technical user need to provide vs. what should the skill figure out?

For **3.xx Engineering Standards** skills:
- What rules or patterns does this codify?
- What happens when someone violates these standards?
- How does this connect to the existing tech stack (1.09)?

For **4.xx Engineering Toolkit** skills:
- What 3.xx standard does this implement?
- What does the engineering team currently do manually that this automates?
- What does "done" look like for this tool?

### Step 1.5: Consult Foundation Skills

Before writing, read the Foundation skills (1.05-1.09) that are relevant to what you're building. These are the single source of truth for TLH-specific context. Don't guess at company details, roles, brand standards, or processes -- pull from the Foundation.

Which Foundation skills to consult depends on what you're building:

| Building this... | Read these Foundation skills |
|-----------------|------------------------------|
| Any skill | 1.05 Company Profile (who we are, what we do) |
| Skills involving people/roles | 1.06 People & Roles |
| Skills with user-facing output | 1.07 Brand Look & Feel + 1.08 Brand Tone & Language |
| Skills touching software/platforms | 1.09 Tools & Platforms Map |

If a Foundation skill hasn't been built yet, note it as a pending dependency and move on -- but come back and update once it exists. The skill will work without it, but it won't have TLH-specific context baked in.

### Step 1.75: Design the Internal Taxonomy

Before writing the SKILL.md, design the skill's internal taxonomy. This is the organizational backbone -- it defines what the skill covers and how the content is structured.

**How to design the taxonomy:**

1. List everything the skill needs to cover (from Step 1 intent capture)
2. Group related items into 3-7 letter groups (A, B, C...)
3. Break each group into 2-4 numbered subcategories (A1, A2...)
4. MECE-check: Is there overlap between any two categories? Is anything missing?
5. Add an emphasis profile: which categories get heavy vs. light treatment
6. Ground it in TLH context: map categories to service lines, teams, or operations

Save the taxonomy as `references/taxonomy.md` following the standard structure defined in Step 2.

**For 2.xx Blueprint skills:** The output taxonomy is always the shared A-E standard. The skill-specific taxonomy covers *interview topics* -- what the skill asks about during the conversation.

The taxonomy file should be written BEFORE the SKILL.md because it informs the structure of the skill's core workflow section.

### Step 2: Write the SKILL.md

Every TLH skill follows this structure:

```
skill-name/
-- SKILL.md              (required -- the main instruction file)
-- references/           (required)
    -- taxonomy.md       (required -- the skill's internal taxonomy)
    -- [domain-specific references]
```

#### Writing Principles

**Explain the why, not just the what.** Instead of "ALWAYS include a problem statement," write "Start with the problem statement -- without it, the engineering team won't know what they're solving or how to prioritize the work." Claude is smart. When it understands the reasoning, it makes better judgment calls on edge cases.

**Write for the audience.** 1.xx and 2.xx skills should be readable by someone who's never written a line of code. 3.xx and 4.xx skills can assume engineering fluency. If you catch yourself using jargon in a 2.xx skill, rewrite it.

**Be pushy in the description.** Skills tend to under-trigger -- Claude won't use them even when they'd be helpful. The description field in the YAML frontmatter should cast a wide net. Include multiple trigger phrases, edge cases, and a nudge like "even if the user doesn't explicitly ask for [this thing], use this skill when [context clues]."

**Keep SKILL.md under 500 lines.** If you need more, put supporting content in `references/` files and point to them from the main SKILL.md with clear guidance on when to read them.

**Use progressive disclosure.** Don't dump everything upfront. Structure the skill so Claude reads the overview and workflow first, then dives into references only when needed for specific situations.

**Include examples.** Show what good output looks like. For Blueprint skills, include a sample of the completed spec. For Engineering skills, include before/after or pass/fail examples.

### Step 3: Validate with 1.02 Quality Checker

Before declaring the skill done, run it through 1.02 Quality Checker. The Quality Checker will assess:

- **Completeness**: Are all required sections present? Would someone using this skill hit a dead end?
- **Consistency**: Do terms, formatting, and cross-references stay uniform?
- **Accuracy**: Are dependencies correctly mapped? Does the description match what the skill actually does?
- **MECE Compliance**: Does the skill stay in its lane without overlapping adjacent skills?
- **Clarity**: Would the intended audience understand and be able to use this?
- **Taxonomy Alignment**: Does the skill ID, name, and scope match what the taxonomy says it should be?

The skill must receive a **PASS** or **PASS WITH NOTES** verdict before it's considered done. A **NEEDS REVISION** verdict means back to Step 2.

### Step 4: Test the Skill

After validation, test the skill with realistic scenarios:

1. Come up with 2-3 test prompts -- things a real user would actually say
2. Run each test prompt with the skill active
3. Review the outputs: Did the skill trigger? Did it produce the right format? Did it stay in scope?
4. If available, compare with-skill vs. without-skill results

For skills that produce files or structured output, check:
- Does the output match the defined format?
- For 2.xx skills: Could this output actually feed into 1.04?
- For 4.xx skills: Would an engineer be able to act on this?

### Step 5: Iterate

Based on test results and user feedback:

1. Identify what's not working
2. Revise the SKILL.md -- focus on generalizing from specific failures rather than adding narrow fixes
3. Re-run through 1.02 Quality Checker
4. Re-test
5. Repeat until the skill consistently produces good results

When improving, resist the urge to add rigid rules. If the skill keeps failing on something, try explaining the reasoning differently rather than adding another "ALWAYS" or "NEVER." The goal is a skill that handles edge cases intelligently, not one that follows a rigid script.

## Batch Build Mode

When rebuilding all skills from scratch (like the initial TLH taxonomy buildout), follow the build sequence:

**Phase 1 (Foundation):** 1.02 -> 1.01 -> 1.03 -> 1.04 -> 1.05 -> 1.06 -> 1.07 -> 1.08 -> 1.09
**Phase 2 (Blueprints):** 2.01 -> 2.02 -> 2.03 -> 2.04 -> 2.05 -> 2.06 -> 2.07
**Phase 3 (Engineering Standards):** 3.04 -> 3.03 -> 3.01 -> 3.05 -> 3.06 -> 3.02
**Phase 4 (Engineering Toolkit):** 4.01 -> 4.02 -> 4.03 -> 4.04 -> 4.05 -> 4.06 -> 4.07 -> 4.08 -> 4.09 -> 4.10 -> 4.11 -> 4.12

Each skill is validated by 1.02 before moving to the next. Dependencies must be built (or stubbed) before the skills that reference them.

## Improving an Existing Skill

When a skill isn't performing well:

1. **Diagnose first.** What specifically is going wrong? Is it not triggering? Triggering when it shouldn't? Producing the wrong output? Overlapping with another skill?

2. **Check the basics.** Read the current SKILL.md. Is the description wide enough to trigger? Are the instructions clear? Is the scope right?

3. **Look at actual usage.** If possible, review transcripts of the skill in action. Where does it go off track?

4. **Revise and test.** Make targeted changes, re-validate with 1.02, and re-test.

Common issues and fixes:

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Skill doesn't trigger | Description too narrow | Add more trigger phrases, broaden context clues |
| Skill triggers when it shouldn't | Description too broad or overlaps another skill | Tighten the description, add "does NOT" guidance |
| Output is wrong format | Output format section is missing or unclear | Add explicit output template with example |
| Skill ignores dependencies | Dependencies not referenced in the body | Add explicit instructions to consult dependency skills |
| Too rigid / misses edge cases | Too many ALWAYS/NEVER rules | Replace rules with reasoning -- explain why |

## Output Format

The Skill Builder produces a skill directory:

```
skill-name/
-- SKILL.md              (the skill itself -- YAML frontmatter + markdown body)
-- references/           (optional supporting documents)
    -- taxonomy.md       (taxonomy reference, if needed)
    -- [other refs]      (domain-specific supporting content)
```

The SKILL.md is the primary deliverable. It must include YAML frontmatter (name + description) and a markdown body following the structure defined in Step 2 above. The skill directory is ready for deployment once it passes 1.02 Quality Checker validation.

## What This Skill Does NOT Do

- It does not validate skills -- that's 1.02 Quality Checker
- It does not define company knowledge -- that's the 1.05-1.09 Foundation skills
- It does not create engineering handoff briefs -- that's 1.04
- It does not manage context between sessions -- that's 1.03 Memory Manager
- It does not execute the work a skill describes -- it builds the instructions, not the output

## Reference: TLH Skill Taxonomy

Quick reference -- all 36 skills:

**1.xx Foundation (9):** Skill Builder, Quality Checker, Memory Manager, Engineering Handoff Brief Creator, Company Profile, People & Roles, Brand Look & Feel, Brand Tone & Language, Tools & Platforms Map

**2.xx Blueprints (7):** Problem Definer, SOP Creator, New Product Planner, System Change Request, Report & Dashboard Planner, Automation Planner, Template Creator

**3.xx Engineering Standards (6):** Naming Conventions, Data Dictionary, Integration Standards, Testing Checklist, Error Handling Patterns, Security & Access Policy

**4.xx Engineering Toolkit (12):** Podio Builder, GlobiFlow Builder, Monday.com Builder, Google Workspace Builder, Zapier Builder, OpenPhone Builder, Email Builder, Reporting Builder, AI Prompt Builder, Document Builder, Training Content Builder, API Connector Builder

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. Rebuilt from skill-creator:skill-creator. Migrated taxonomy awareness, build process, improvement workflow. Added: Foundation Check table in template, built-in quality gate for 2.xx, handoff format for 2.xx, versioning YAML fields, "When Things Go Wrong" pattern, changelog section, series-specific standards, naming conventions and migration strategy, Foundation consultation mechanism with "how to consult" guidance, Foundation alignment in quality gate. |
| 1.2 | 2026-02-26 | Made references/taxonomy.md REQUIRED for all skills. Added Step 1.75: Design the Internal Taxonomy. Added taxonomy.md standard structure and design rules. |

## Reference: Related Skills

- **1.02 Quality Checker** -- Validates every skill this builder creates. Required PASS before a skill ships.
- **1.03 Memory Manager** -- Preserves skill context across sessions. Built skills should be compatible with memory patterns.
- **1.04 Engineering Handoff Brief Creator** -- Consumes output from 2.xx Blueprint skills. Blueprint specs must be formatted to feed into 1.04.
- **1.05-1.09 Foundation Skills** -- Source of truth for company-specific context. Every skill built by 1.01 includes a Foundation Check table pointing to the relevant Foundation skills.
