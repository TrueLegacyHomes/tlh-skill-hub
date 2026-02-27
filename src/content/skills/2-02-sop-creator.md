---
name: "SOP Creator"
skillId: "2.02"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users document a business process as a structured Standard Operating Procedure that can be handed to engineering for automation or tooling."
version: "1.0"
last_updated: "2025-02-27"
recommendedFor: ["document"]
claudePath: "~/.claude/skills/2.xx-blueprints/2.02-sop-creator/SKILL.md"
---

# 2.02 SOP Creator

The SOP Creator captures how TLH actually does things. Every company has processes that live in people's heads -- "how we onboard a new estate sale client," "what happens when a home offer is accepted," "how we coordinate care placement." This skill turns that tribal knowledge into a clear, structured document.

Think of it as recording a recipe. Someone knows how to cook the dish from memory, but if they get hit by a bus, the recipe is gone. The SOP Creator sits down with the cook, watches them work, asks questions, and writes the recipe down so anyone can follow it.

The output feeds into 1.04 (Engineering Handoff Brief Creator) when the process needs tooling or automation, but SOPs are also valuable as standalone documents for training and consistency.

## When to Use This Skill

- When someone wants to document how a process works today
- When a new team member needs to learn a process and there's no documentation
- When a process varies depending on who does it and needs standardization
- When the user says "we do this manually" -- document it first, then consider automating with 2.06
- When creating training materials for any TLH workflow

## The Interview

Follow the standard 2.xx interview pattern. The SOP Creator goes heavy on C (Logic & Behavior) because the process IS the output -- every step, every decision point, every exception.

### 1. Orient (1-2 questions)

- "Which process do you want to document?" or "Walk me through what happens when [trigger event]."
- "Who does this today? Is it one person or does it involve multiple people?"

### 2. Scope (2-3 questions)

- "When does this process start -- what triggers it? And when is it 'done'?"
- "How often does this happen? Daily? Per client? Once a month?"
- "Are there different versions of this process for different situations?"

### 3. Detail (as needed)

Walk through the process step by step. For each step, capture:

**For C1 (Business Rules):** "At this step, are there any rules or conditions?"

**For C2 (User Flows):** "What happens next? And what happens if [something goes wrong / the customer says no / the data is missing]?"

This is the heart of the SOP Creator. Keep asking "then what?" until you've captured the entire flow, including:
- The happy path (everything goes right)
- Common exceptions (what usually goes wrong)
- Decision points (where the flow branches based on conditions)
- Handoff points (where responsibility passes to a different person)

### 4. Confirm & Deliver

Read back the documented process. Ask: "Did I capture this right? Is there anything I missed or got wrong?"

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Medium** -- frame why this process matters | Context helps engineering understand business value |
| B (Requirements & Scope) | **Medium** -- define what "well-documented" means | The SOP itself is the requirement |
| C (Logic & Behavior) | **Heavy** -- the process IS the output | C1 and C2 are the whole point of this skill |
| D (Impact & Dependencies) | **Medium** on D1, **Light** on D3 | Systems are important; data details less so |
| E (Handoff Metadata) | **Standard** | Always captured |

## Foundation Check

Before producing output, consult the TLH Foundation skills that are relevant to this work.

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

## Output Format

The SOP Creator produces a markdown file containing the full A-E spec with heavy emphasis on the process documentation. The C section includes:
- Business rules as IF/THEN statements
- Happy path with numbered steps (who does it, using what tool)
- Exception paths
- Decision points with branching logic

## Before You're Done: Quick Quality Check

1. **Completeness**: Could someone who's never done this process follow it step by step?
2. **Consistency**: Are role names, system names, and terminology consistent throughout?
3. **Clarity**: Are there any steps where you'd be stuck?
4. **Foundation alignment**: Did you use real TLH role names, system names, and terminology?
5. **Handoff readiness**: If this SOP needs tooling, could 1.04 process it without questions?

## What This Skill Does NOT Do

- It does not automate the process -- that's 2.06 Automation Planner
- It does not define the problem that led to needing this process -- that's 2.01 Problem Definer
- It does not build the tools used in the process -- that's 4.xx Toolkit skills
- It does not design templates used within the process -- that's 2.07 Template Creator
- It does not create the training program around the SOP -- it creates the reference document

## When Things Go Wrong

**The user's input is too vague:**
Ask one focused question: "Can you walk me through the last time you did this? Start from the very beginning."

**The skill realizes the user actually needs a different skill:**
"Based on what you're describing, this sounds more like you need 2.06 Automation Planner -- you already know the process, you want to automate it. Want me to switch?"

**The process is different depending on the service line:**
Create one SOP with clearly marked branches. Don't create separate SOPs unless the processes are fundamentally different.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. A-E output taxonomy, emphasis on C (process IS the output), interview flow, quality gate, Foundation Check. |

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** -- Takes this skill's output when the SOP needs tooling or automation.
- **2.06 Automation Planner** -- Natural next step after documenting a manual process.
- **2.07 Template Creator** -- If the SOP references templates or forms, 2.07 creates them.
- **1.06 People & Roles** -- Source of truth for who owns each step in the process.
- **1.09 Tools & Platforms Map** -- Source of truth for which systems are used.
- **1.02 Quality Checker** -- Validates the SOP output.
