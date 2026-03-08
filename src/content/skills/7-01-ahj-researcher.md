---
name: "AHJ Researcher"
skillId: "7.01"
series: "Departments"
status: "active"
audience: "Engineering Team"
oneLiner: "Three-layer operational intelligence for AHJ permit data: structured database fields, process workflow diagrams, and fee/checklist/threshold analysis tailored to TLH's Like-for-Like and Complete Renovation project types."
version: "1.1"
last_updated: "2026-03-08"
recommendedFor: ["research", "automate"]
githubPath: "7.xx-departments/7.01-ahj-researcher/SKILL.md"
---

## What It Does

AHJ Researcher is TLH's automated three-layer intelligence tool for Authority Having Jurisdiction permit data. It systematically visits municipal building department websites, answers a structured set of 150+ questions across 8 sections, writes every finding to the Supabase AHJ database with source URLs and confidence tags, and produces actionable outputs across three layers:

- **Layer 1 (Data):** Field-by-field values with source URLs and confidence scores across 12 database tables
- **Layer 2 (Process):** Mermaid workflow diagrams showing the AHJ's actual permit process with decision trees, department routing, and GAP nodes
- **Layer 3 (Operations):** Fee estimates, submittal checklists by project type, and scope thresholds tailored to TLH's Like-for-Like and Complete Renovation work

## How It Works

1. **Initialize** — look up or create the AHJ record in Supabase
2. **Locate sources** — find the official municipal building department website, fee schedule, and process flowcharts
3. **Research General Info & Contacts** — department name, address, hours, staff contacts
4. **Research Review Timeline (Stages 1–8)** — day counts per stage, per review track (standard, expedited, OTC)
5. **Research Submittal Requirements** — plan sets, required documents, tagged by project type (L4L vs Reno)
6. **Research Fee Schedule & Fee Math** — ICC valuation tiers, plan check %, surcharges, computed TLH estimates
7. **Research Municipal Requirements** — local code amendments, green building, fire sprinkler, checklists
8. **Research Scope Thresholds** — 12 categories of trigger points with L4L/Reno applicability
9. **Collect Critical Links** — permit portal, fee schedule, municipal code, process flowcharts
10. **Research Department Routing** — concurrent vs sequential reviews, utility agencies, turnaround times
11. **Generate Gap Report** — FOUND / VERIFY / GAPS + four new sections (fees, checklists, thresholds, workflow)
12. **Generate Mermaid Workflow Diagram** — color-coded process map with GAP nodes and phone questions
13. **Update Database** — write all findings, gap report, confidence score

## What You Get

- **Populated AHJ record** in Supabase with structured, sourced data across 12 tables
- **Gap report** stored in database — team knows exactly what to ask when they call
- **Fee estimates** — permit cost projections for L4L ($66K val) and Complete Reno ($82.5K val)
- **Submittal checklist** — side-by-side comparison of what's required for L4L vs Reno
- **Scope thresholds** — trigger points that determine when additional requirements kick in
- **Process workflow diagram** — Mermaid flowchart showing the permit path with verified data (green) and gaps (yellow)
- **Confidence score** — how complete is this AHJ's data (0–100)
- **Source attribution** — every data point linked to the URL where it was found

## The Three Layers

| Layer | What | Output |
|-------|------|--------|
| **1 — Data** | Field-by-field values | 12 Supabase tables, source URLs, confidence tags |
| **2 — Process** | Permit workflow | Mermaid diagram with decision trees, dept routing, GAP nodes |
| **3 — Operations** | TLH-specific analysis | Fee estimates, submittal checklists (L4L vs Reno), scope thresholds |

## The 8 Timeline Stages

| # | Stage | What It Captures |
|---|-------|-----------------|
| 1 | Submission → Fees Paid | Intake processing time |
| 2 | Fees Paid → Dept Routing | Routing timeline, historical review triggers |
| 3 | Dept Routing → First Review | Standard/expedited/OTC turnaround, 3rd party options |
| 4 | First Review → Corrections | TLH-controlled (3 days default) |
| 5 | Corrections → Second Review | Resubmittal review timeline |
| 6 | Second Review → B&S Approval | Approval process |
| 7 | B&S Approval → Additional Reviews | Utility/agency reviews (fire, water, sanitary) |
| 8 | Additional Reviews → Permits Issued | Post-approval processing time |

## Scope Threshold Categories (v1.1)

| Category | Example Trigger | Why It Matters |
|----------|----------------|---------------|
| Fire Sprinkler | 50% walls+roof replaced | NFPA 13D system required |
| Energy / Reach Code | Regulated systems touched | Title 24 calcs + HERS |
| Structural Review | Load-bearing wall altered | Structural calcs required |
| Planning / Design Review | 2-story in R1 zone | Discretionary review + public notice |
| OTC Boundary | Scope exceeds OTC list | Full plan check vs same-day permit |
| Coastal Review | Property in Coastal Zone | CDP from CCC may be required |
| Grading | Fill >50 cubic yards | Separate grading permit |
| And 5 more... | Seismic, historic, stormwater, CALGreen, electrification | |

## When to Use

- Researching a new AHJ before a deal
- Refreshing stale AHJ data (>6 months old)
- Running initial data population across all priority AHJs
- After hearing an AHJ changed their process
- When you need to know "what will it cost to permit in [city]?"
- Comparing permit requirements between L4L and Complete Reno scope

## Technical Details

- **Database:** Supabase (12 tables with `ahj_` prefix)
- **Data sources:** AHJ official municipal websites only (Phase 1)
- **Research questions:** 150+ across 8 sections (V2 question set)
- **Confidence levels:** online-verified, phone-verified, unverified-migrated, unverified-alternate, gap
- **Fee math:** ICC valuation table extraction, TLH standard $55/SF valuation
- **Workflow diagrams:** Mermaid syntax, exportable to Lucidchart
- **Scope:** ~20 AHJs in Southern California (San Diego, Orange, Los Angeles counties)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-06 | Initial version. 11-step workflow, V2 question set (5 sections), 9 Supabase tables. |
| 1.1 | 2026-03-08 | Layer 2 (Process) + Layer 3 (Operations). Fee math, scope thresholds, dept routing, project-type checklists, Mermaid diagrams. 12 Supabase tables, 8 research sections, 4 new gap report sections. |
