---
name: "System Change Request"
skillId: "2.04"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users spec a change to an existing system, tool, or platform."
version: "1.0"
last_updated: "2025-02-27"
---

# 2.04 System Change Request

The System Change Request captures what needs to change in an existing tool, platform, or system. This is the workhorse Blueprint -- most day-to-day engineering work is about modifying things that already exist rather than building from scratch.

Think of it as a renovation order. The house already exists, but you need to move a wall, add a bathroom, or rewire the electrical. The System Change Request documents exactly what needs to change, which walls are load-bearing (dependencies), and what the finished renovation should look like.

## When to Use This Skill

- When the user wants to modify how an existing system works
- When requesting a new feature in an existing tool or platform
- When a system integration needs to be created or changed
- When configuration changes require engineering involvement
- When the user says "the CRM should do X" or "why doesn't the website show Y?"
- When migrating from one tool to another

## The Interview

Follow the standard 2.xx interview pattern. The System Change Request goes heavy on D (Impact & Dependencies) because changes to existing systems have ripple effects, and on C1 (Business Rules) because the change logic needs to be precise.

### 1. Orient (1-2 questions)

- "Which system or tool needs to change?"
- "What should it do differently than it does today?"

### 2. Scope (2-3 questions)

- "Is this a small tweak or a significant change to how the tool works?"
- "Does this change affect just your team, or will other people or customers notice it too?"
- "Is there a deadline driving the timing?"

### 3. Detail (as needed)

**For A1:** "What's the specific limitation or problem with how the system works today?"
**For A2:** "Walk me through what happens right now."
**For B1:** "After the change, how will you know it's working correctly?"
**For B2/B3:** "What exactly needs to change? Minimum change vs. ideal change?"
**For B4:** "Is there anything about the system we should NOT change?"
**For C1:** "Are there specific rules for when or how this change applies?"
**For C2:** "After the change, what would the step-by-step experience look like?"
**For D1:** "Does this system connect to anything else?" Consult 1.09 for integration points.
**For D3:** "Does this change involve new data, moving data, or changing data flows?"
**For D4:** "What could go wrong if the change doesn't work as expected?"

### 4. Confirm & Deliver

Show the assembled spec. Pay special attention to D1 (affected systems) -- the user may not realize how many things connect.

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Medium** | Keep the problem statement clear but don't belabor it |
| B (Requirements & Scope) | **Medium** | Scope boundaries prevent creep |
| C (Logic & Behavior) | **Heavy on C1** | Business rules must be precise and implementable |
| D (Impact & Dependencies) | **Heavy** -- D1, D3, D4 especially | System changes have ripple effects |
| E (Handoff Metadata) | **Standard** | Always captured |

## Foundation Check

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

For system changes, 1.09 (Tools & Platforms Map) is essential -- it tells you what the system connects to.

## Output Format

The System Change Request produces a markdown spec file containing the full A-E structure with heavy emphasis on impact analysis.

## Before You're Done: Quick Quality Check

1. **Completeness**: Are D1 and D4 thorough -- all affected systems and risks identified?
2. **Consistency**: Are system names and field names consistent?
3. **Clarity**: Could an engineer who's never used this system understand what needs to change?
4. **Foundation alignment**: Did you consult 1.09 for integration points?
5. **Handoff readiness**: Could 1.04 produce an engineering brief from this without questions?

## What This Skill Does NOT Do

- It does not implement the change -- that's engineering work
- It does not plan new products -- that's 2.03 New Product Planner
- It does not document the process that uses the system -- that's 2.02 SOP Creator
- It does not automate a workflow -- that's 2.06 Automation Planner
- It does not define architecture decisions -- that's engineering territory

## When Things Go Wrong

**The user doesn't know which system needs to change:**
Help them narrow it down by describing what they're doing when they hit the problem.

**The change is actually multiple changes:**
Split them into individual requests.

**The change sounds too big for a system change request:**
Redirect to 2.03 New Product Planner.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. A-E output taxonomy, emphasis on D (impact) and C1 (business rules), interview flow, quality gate, Foundation Check. |

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** -- Takes this skill's output and packages it for engineering.
- **1.09 Tools & Platforms Map** -- Essential Foundation skill for system changes.
- **2.06 Automation Planner** -- If the system change enables automation, 2.06 plans it.
- **2.01 Problem Definer** -- Sometimes the user starts with 2.01 and discovers they need a system change.
- **1.02 Quality Checker** -- Validates the spec output.
