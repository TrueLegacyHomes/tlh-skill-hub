---
name: "Report & Dashboard Planner"
skillId: "2.05"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Helps non-technical users spec a report, dashboard, or data view they need to make better business decisions."
version: "1.0"
last_updated: "2025-02-27"
---

# 2.05 Report & Dashboard Planner

The Report & Dashboard Planner helps TLH leaders and managers define what data they need to see and how they want to see it. Whether it's a CEO dashboard showing business health, a service-line report tracking estate sale performance, or a one-time analysis answering a specific question -- this skill captures the requirements.

Think of it as designing the instrument panel for a car. Before building the gauges, you need to know: What does the driver need to see? How often? In real-time or daily? What triggers an alert? The Report & Dashboard Planner answers these questions so engineering can build the right data views.

## When to Use This Skill

- When the user wants a new report, dashboard, or data view
- When the user can't see data they need to make decisions
- When tracking KPIs, metrics, or business performance
- When creating recurring reports (weekly, monthly, quarterly)
- When building executive dashboards or operational views
- When the user says "I want to know how [X] is performing"

## The Interview

Follow the standard 2.xx interview pattern. The Report & Dashboard Planner goes heavy on B1 (Success Criteria -- what questions should the report answer?), C1 (Business Rules -- how data is calculated), D1 (Affected Systems -- where the data lives), and D3 (Data Requirements -- what data is needed).

### 1. Orient (1-2 questions)

- "What do you want to be able to see that you can't see today?"
- "Is this for regular monitoring or a one-time analysis?"

### 2. Scope (2-3 questions)

- "Who will look at this -- just you, or will other team members use it too?"
- "How often do you need the data refreshed -- real-time, daily, weekly?"
- "Are you thinking a visual dashboard with charts, or a data export?"

### 3. Detail (as needed)

**For A1:** "What decisions are you trying to make that you can't make today because you don't have the data?"
**For B1:** "What are the top 3-5 questions this report should answer?"
**For B2:** "Which metrics are absolute must-haves?"
**For C1:** "How should the numbers be calculated? Does 'revenue' mean gross or net?"
**For D1:** "Where does this data live today? CRM? Accounting software? Spreadsheets?"
**For D3:** Capture what data fields are needed, where each field comes from, how fields should be calculated, data quality concerns, and freshness requirements.
**For D2:** "Who should have access? Should different roles see different data?"

### 4. Confirm & Deliver

Show the assembled spec with special attention to metric definitions (C1) -- ambiguous metrics lead to bad dashboards.

## Emphasis Guide

| Section | Emphasis | Why |
|---------|----------|-----|
| A (Problem & Context) | **Medium** | Context matters but keep it focused |
| B (Requirements & Scope) | **Heavy on B1** | The questions the report answers define its value |
| C (Logic & Behavior) | **Heavy on C1** | Metric calculations must be unambiguous |
| D (Impact & Dependencies) | **Heavy on D1 and D3** | Where data comes from determines feasibility |
| E (Handoff Metadata) | **Light** | Standard metadata |

## Foundation Check

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

For reporting specs, 1.09 (where data lives) is essential. 1.05 helps frame metrics against TLH's three service lines.

## Output Format

The Report & Dashboard Planner produces a markdown spec file containing the full A-E structure with a detailed metric definitions table in C1 and a data source mapping in D3.

## Before You're Done: Quick Quality Check

1. **Completeness**: Are all metrics defined with clear calculation logic? Are data sources identified?
2. **Consistency**: Are metric names and definitions consistent throughout?
3. **Clarity**: Could an engineer build this report without asking "how do you calculate X?"
4. **Foundation alignment**: Did you use actual system names from 1.09?
5. **Handoff readiness**: Could 1.04 process this without questions about data sources or calculations?

## What This Skill Does NOT Do

- It does not build the dashboard -- that's engineering work
- It does not create the data pipeline -- that's 4.xx toolkit territory
- It does not analyze the data -- it defines what data to show and how
- It does not set up alerts or monitoring -- though it can capture alerting requirements

## When Things Go Wrong

**The user doesn't know what metrics they need:**
Help them think outcome-first: "What decisions are you trying to make?"

**The data might not exist yet:**
Flag it: engineering may need to add data capture before the report can be built.

**The user wants something the data can't support:**
Be honest and note it as an open question for engineering.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. A-E output taxonomy, emphasis on B1/C1/D1/D3 (data-heavy), interview flow, quality gate, Foundation Check. |

## Reference: Related Skills

- **1.04 Engineering Handoff Brief Creator** -- Takes this skill's output and packages it for engineering.
- **1.09 Tools & Platforms Map** -- Source of truth for where data lives.
- **2.06 Automation Planner** -- If the report should be auto-generated, 2.06 plans the automation.
- **1.02 Quality Checker** -- Validates the spec output.
