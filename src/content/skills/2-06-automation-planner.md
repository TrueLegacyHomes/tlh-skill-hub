---
name: "Automation Planner"
skillId: "2.06"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users spec an automation, integration, or scheduled workflow so engineering can build it."
version: "1.0"
last_updated: "2026-02-26"
recommendedFor: ["automate"]
githubPath: "2.xx-blueprints/2.06-automation-planner/SKILL.md"
---

# 2.06 Automation Planner

The Automation Planner takes manual, repetitive work and turns it into an automated workflow spec. When someone says "every time a new estate sale lead comes in, I have to manually copy the info into the CRM, send a welcome email, and schedule a walkthrough" — the Automation Planner captures exactly what should happen automatically, when, and under what conditions.

Think of it as programming a smart home. You want the lights to turn on at sunset, the thermostat to drop at bedtime, and the coffee maker to start at 6am. The Automation Planner captures all those rules — triggers, conditions, actions — so engineering can wire it up.

## When to Use This Skill

- When the user wants a process to run automatically instead of manually
- When connecting two or more systems so data flows between them
- When setting up scheduled tasks (daily reports, weekly syncs, monthly cleanups)
- When creating trigger-based workflows ("when X happens, do Y")
- When the user describes repetitive manual work that could be automated
- After 2.02 SOP Creator has documented a process and the user wants to automate it

## The Interview

Follow the standard 2.xx interview pattern. The Automation Planner goes heavy on C1 (Business Rules — the trigger logic), C2 (User Flows — the automation sequence), D1 (Affected Systems — what connects to what), and D3 (Data Requirements — what data moves between systems).

### 1. Orient (1-2 questions)

- "What do you want to happen automatically?" or "Which manual task are you tired of doing?"
- "Is this connecting two systems, or is it an automated action within one system?"

### 2. Scope (2-3 questions)

- "What triggers this — a new record, a time schedule, a specific event, or a manual button?"
- "How often does this need to run? Every time [event], once a day, once a week?"
- "What happens if the automation fails — is it critical (losing a customer) or minor (a delayed notification)?"

### 3. Detail (as needed)

**For A1 (Problem Statement):** "What do you currently do manually that this automation would replace?"

**For A2 (Current State):** "Walk me through the manual version. Every step."

**For B1 (Success Criteria):** "How would you know the automation is working correctly? What would you check?"

**For C1 (Business Rules):** This is the heart of the automation spec:
- "What exactly triggers the automation?"
- "Are there conditions — like 'only if the lead is in San Diego County' or 'only for estate sales over $50K'?"
- "What should happen if a condition fails — skip, retry, alert someone?"
- "Are there time windows — like 'only during business hours' or 'wait 24 hours before sending'?"

**For C2 (User Flows):** Map the entire automation sequence:
- Step 1: [Trigger fires]
- Step 2: [Check condition]
- Step 3: [Perform action]
- Step 4: [Perform next action]
- Error path: [What happens when something breaks]

**For D1 (Affected Systems):** "Which tools are involved? Source system? Destination system? Any middleware?" Consult 1.09.

**For D3 (Data Requirements):** "What data moves from A to B? What format? Are there field mappings that need to happen?"

**For D4 (Dependencies & Risks):** "What could go wrong? What if the source system is down? What if the data is malformed?"

### 4. Confirm & Deliver

Read back the automation logic step by step. Ask: "If I read you the rules back — trigger, conditions, actions — does this match exactly what you want to happen?"

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Medium** | Frame the manual process being replaced |
| B (Requirements & Scope) | **Medium** | Clear success criteria and error handling requirements |
| C (Logic & Behavior) | **Heavy** — both C1 and C2 | Automation IS logic. Every rule, every condition, every action |
| D (Impact & Dependencies) | **Heavy on D1 and D3** | What systems connect and what data moves between them |
| E (Handoff Metadata) | **Light** | Standard metadata |

## Output Format

The Automation Planner produces a markdown file containing the full A–E spec with detailed trigger logic in C1 and step-by-step automation sequence in C2. The C section should include a clear diagram or numbered list showing the complete flow including error handling.

## What This Skill Does NOT Do

- It does not build the automation — that's engineering work using 4.xx toolkit skills
- It does not document the manual process — that's 2.02 SOP Creator (use 2.02 first, then 2.06)
- It does not design the systems being connected — that's 3.01 Architecture Planner
- It does not manage the automation platform itself — it specs what the automation should do

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** — Takes this skill's output and packages it for engineering.
- **2.02 SOP Creator** — Document the manual process before automating it.
- **1.09 Tools & Platforms Map** — Source of truth for available systems, APIs, and integration platforms.
