---
name: "AHJ Researcher"
skillId: "7.01"
series: "Departments"
status: "active"
audience: "Engineering Team"
oneLiner: "Researches AHJ municipal websites to populate the Supabase AHJ database with verified permit data, timeline stages, submittal requirements, and gap reports."
version: "1.0"
last_updated: "2026-03-06"
recommendedFor: ["research", "automate"]
githubPath: "7.xx-departments/7.01-ahj-researcher/SKILL.md"
---

## What It Does

AHJ Researcher automates the online research portion of AHJ (Authority Having Jurisdiction) permit data collection. It systematically visits municipal building department websites, answers a structured set of 100+ questions across 5 sections, writes every finding to the Supabase AHJ database with source URLs and confidence tags, and produces a gap report showing exactly what's still missing and what phone questions to ask.

## How It Works

1. **Initialize** — look up or create the AHJ record in Supabase
2. **Locate sources** — find the official municipal building department website
3. **Research General Info & Contacts** — department name, address, hours, staff contacts
4. **Research Review Timeline (Stages 1–8)** — day counts per stage, per review track (standard, expedited, OTC), 3rd party review options, scope definitions
5. **Research Submittal Requirements** — plan sets, sheet sizes, required documents and forms
6. **Research Municipal Requirements** — local code amendments, green building, fire sprinkler, checklists
7. **Collect Critical Links** — permit portal, fee schedule, municipal code, application forms
8. **Generate Gap Report** — FOUND (with source URLs) / VERIFY (migrated data) / GAPS (with suggested phone questions)
9. **Update Database** — write gap report, set confidence score, update timestamps

## What You Get

- **Populated AHJ record** in Supabase with structured, sourced data across 9 tables
- **Gap report** stored in database — team knows exactly what to ask when they call
- **Confidence score** — how complete is this AHJ's data (0–100)
- **Source attribution** — every data point linked to the URL where it was found

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

## When to Use

- Researching a new AHJ before a deal
- Refreshing stale AHJ data (>6 months old)
- Running initial data population across all priority AHJs
- After hearing an AHJ changed their process

## Technical Details

- **Database:** Supabase (9 tables with `ahj_` prefix)
- **Data sources:** AHJ official municipal websites only (Phase 1)
- **Confidence levels:** online-verified, phone-verified, unverified-migrated, unverified-alternate, gap
- **Scope:** ~20 AHJs in Southern California (San Diego, Orange, Los Angeles counties)
