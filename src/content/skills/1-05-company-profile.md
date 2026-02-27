---
name: "Company Profile"
skillId: "1.05"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "The single source of truth for what True Legacy Homes is, what it does, who it serves, and how it makes money."
version: "1.0"
last_updated: "2025-02-27"
recommendedFor: ["define", "reference"]
claudePath: "~/.claude/skills/1.xx-foundation/1.05-company-profile/SKILL.md"
---

# 1.05 Company Profile

This is the canonical reference for who True Legacy Homes is. Every skill in the taxonomy that needs to know anything about the company -- what we do, who we serve, how we make money -- pulls from here. If it's not in this file, it's not official.

Think of this as the company's identity card. When a Blueprint skill is writing a spec, it checks here to make sure it's using the right language and referencing the right services. When an engineering skill is building something, it checks here to understand the business context. One source of truth, used everywhere.

## When to Use This Skill

- When any skill needs company context to produce accurate, TLH-specific output
- When the user asks about the company's services, customers, market, or business model
- When writing content, specs, or documentation that references what TLH does
- When onboarding someone (human or AI) who needs to understand the business
- When validating whether output from another skill accurately represents TLH

## Company Overview

**True Legacy Homes** is a life transition service company headquartered in San Diego, California. TLH helps families -- primarily adult children managing transitions for aging parents -- navigate the complex, emotional process of downsizing, estate settlement, and care placement.

The tagline is **"Estate Sales With Dignity."**

TLH is not a home builder, not a real estate brokerage (yet), and not a moving company. TLH is the single point of coordination that handles the interconnected services families need when a parent is aging, downsizing, or has passed away -- so they don't have to juggle five different vendors during one of the hardest periods of their lives.

### What Makes TLH Different

**One-stop coordination.** When a family needs to place a parent in care, clear out a lifetime of belongings, and sell the house -- those aren't three separate problems. They're one transition. TLH handles the whole thing, or whichever pieces the family needs, under one roof.

### Recognition

- Named **2024 Top Estate Sale Seller in California** by EstateSales.net (highest number of estate sale listings statewide)
- 15+ years of experience in the life transition industry

## Services

### Current Service Lines (Active)

**1. Estate Sales**
Full-service estate sales that handle everything from appraisal and sorting to marketing, pricing, negotiation, and clean-out. TLH's curated process is designed to maximize attention on each sale while treating every item -- and every family -- with respect.

- Revenue model: Commission-based
- Key differentiator: Dignity-first approach, professional marketing, complete end-to-end management including post-sale clean-out

**2. Cash Home Offers (Buy -> Renovate -> Sell)**
TLH buys homes directly from families with a cash offer -- no commissions, no closing costs, guaranteed closing date. TLH then renovates the property and sells it.

- Revenue model: Margin on homes (buy-renovate-sell spread)
- Key differentiator: Speed and certainty -- families get a guaranteed offer without the stress of listing, staging, and waiting

**3. Care Placement**
Helping families find the right senior care community -- whether assisted living, memory care, or independent living.

- Revenue model: Commission-based
- Key differentiator: Integrated with estate and home services -- TLH understands the full picture of the transition

### Future Service Lines (Aspirational -- No Firm Timeline)

**4. Aging-in-Place Renovations** -- Home modifications for seniors who want to stay in their current home. Not yet active.

**5. Brokerage** -- Traditional real estate brokerage services. Not yet active.

**6. Renovation Services** -- Renovation services for client homes (not just TLH-purchased properties). Not yet active.

### How Services Connect

Services can be used individually or bundled depending on the family's situation. TLH's value increases when services bundle because the family gets one coordinator instead of managing multiple vendors.

## Customers

### Primary Customer Profile

**Adult children managing a life transition for an aging parent.**

- **Demographics:** Women aged 55+
- **Situation:** Their parent is aging, downsizing, moving into care, or has passed away
- **Need:** Someone to coordinate the logistical and emotional complexity of the transition
- **Pain point:** Juggling their own life, their parent's needs, and unfamiliar services during an emotionally charged time

### Secondary Customer

**The aging person themselves** -- seniors making their own decisions about downsizing or transitioning.

### Key Insight

The customer is usually NOT shopping for "an estate sale company" or "a cash home buyer" -- they're looking for help with a life transition that happens to involve those services.

## Market

### Geography

Currently operating in **Southern California**:
- San Diego County
- Orange County
- Los Angeles County

### Market Context

- Approximately 636,000 residents over age 60 in San Diego alone (~20% of the county's population)
- ~38% of all owner-occupied homes in San Diego are owned by Baby Boomers
- Large pipeline of homes likely to transition in the next 10-15 years

## Business Model

### Revenue Streams

| Service | Revenue Model | Notes |
|---------|--------------|-------|
| Estate Sales | Commission | Per-sale commission on items sold |
| Cash Home Offers | Margin on homes | Buy -> renovate -> sell spread |
| Care Placement | Commission | Referral/placement commission |

### Company Stage

**Growing** -- $1M-$5M revenue range, team of 10-30, consistent deal flow. Building momentum with the #1 estate sale seller recognition in California.

## Brand Identity

### Positioning

Life transition service company -- not just an estate sale company, not just a home buyer. TLH is the coordinated solution for families navigating aging-related transitions.

### Tagline

**"Estate Sales With Dignity"**

### Tone

Compassionate, professional, and reassuring. TLH is talking to people during some of the hardest moments of their lives. The tone should feel like a knowledgeable, trustworthy friend -- never salesy, never dismissive, never clinical.

## How Other Skills Should Use This Profile

| Skill needs to know... | Reference this section |
|------------------------|----------------------|
| What TLH does | Company Overview + Services |
| Who TLH serves | Customers |
| How TLH makes money | Business Model |
| Where TLH operates | Market -> Geography |
| How to talk about TLH | Brand Identity -> Tone |
| What services exist | Services -> Current Service Lines |
| What's coming in the future | Services -> Future Service Lines |

## Output Format

This skill does not produce a deliverable. It is reference material that other skills read and apply.

## What This Skill Does NOT Do

- It does not define team structure or roles -- that's 1.06 People & Roles
- It does not define brand visual identity -- that's 1.07 Brand Look & Feel
- It does not define brand voice in detail -- that's 1.08 Brand Tone & Language
- It does not list platforms or software -- that's 1.09 Tools & Platforms Map
- It does not produce marketing materials -- it informs the skills that do

## When Things Go Wrong

**A skill references a TLH service that doesn't exist in this profile:**
Flag it. Either the profile needs updating or the skill made something up.

**The profile information feels outdated:**
If the user mentions something that contradicts this profile, ask whether to update the Company Profile.

**A skill needs company context that this profile doesn't cover:**
Don't guess. Ask the user so the information can be added for future use.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. Fresh build from CEO interview. Defined: life transition service company positioning, three active service lines, three aspirational services, primary customer profile, SoCal geography, revenue model, brand identity basics. |

## Reference: Related Skills

- **1.06 People & Roles** -- Defines who works at TLH and what they do.
- **1.07 Brand Look & Feel** -- Visual identity for the brand described here.
- **1.08 Brand Tone & Language** -- Detailed voice and writing standards.
- **1.09 Tools & Platforms Map** -- The platforms and systems that support the services described here.
- **2.01-2.07 Blueprint Skills** -- All Blueprints consult this profile for company context.
- **1.04 Engineering Handoff Brief Creator** -- References company context when enriching specs.
