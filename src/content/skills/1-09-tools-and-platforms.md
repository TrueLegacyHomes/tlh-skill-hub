---
name: "Tools & Platforms Map"
skillId: "1.09"
series: "Foundation"
status: "draft"
audience: "Operations Team"
oneLiner: "The single source of truth for every tool, platform, and system TLH uses -- from the CRM to the code repo to the estate sale listing platform."
version: "1.0"
last_updated: "2025-02-27"
---

# 1.09 Tools & Platforms Map

This is TLH's master inventory of every tool, platform, and system the company uses. When a Blueprint skill needs to list affected systems, it pulls from here. When an engineering skill needs to know what database to target, it checks here. When someone asks "what do we use for email marketing?" -- the answer is here.

Think of it as the IT asset map meets the operations playbook. It doesn't just list tools -- it explains what each tool does, who uses it, and how it connects to other systems. One source of truth so every skill in the taxonomy references real platforms by their real names.

## When to Use This Skill

- When any skill needs to reference TLH's technology by name
- When building specs that include "Affected Systems" sections
- When the user asks what tool TLH uses for a specific function
- When evaluating whether a new tool overlaps with something TLH already has
- When engineering needs to understand the integration landscape
- When onboarding someone who needs to know the tech stack

## Tool Taxonomy

Every tool at TLH belongs to exactly one primary category. Tools may be tagged as "also used by" other categories, but they have one home. The taxonomy is organized into 7 groups and 17 subcategories.

### A. Service-Line Tools
*Tools that directly power a specific TLH service line.*

#### A1. Estate Sales Operations
Tools for managing estate sale listings, inventory, pricing, scheduling, marketing sales to buyers, and post-sale clean-out coordination.

#### A2. Home Acquisitions & Renovations
Tools for evaluating properties, managing cash offers, tracking renovation projects, managing contractors, and listing/selling renovated homes.

#### A3. Care Placement
Tools for matching seniors to care communities, tracking placement pipeline, managing community relationships, and client intake.

### B. Revenue & Customer Tools
*Tools that span multiple service lines -- acquiring and managing customers.*

#### B1. CRM & Lead Management
Lead capture, pipeline tracking, customer records, deal stages across all service lines.

#### B2. Marketing & Brand
Website, SEO, social media, email marketing, paid ads, content creation, reputation management.

#### B3. Sales & Business Development
Outbound prospecting, referral partner management, proposal/estimate tools.

### C. Operations & Workflow
*Tools that keep the business running day-to-day.*

#### C1. Scheduling & Project Management
Calendaring, task management, project tracking, team coordination.

#### C2. Communication
Email, phone/VoIP, SMS/texting, team messaging, video conferencing.

#### C3. Documents & Storage
File storage, document management, contracts, e-signatures, templates.

### D. Finance & Administration
*Money in, money out, compliance.*

#### D1. Accounting & Bookkeeping
#### D2. Payroll & HR
#### D3. Legal & Compliance

### E. Intelligence & Automation
*Tools that make the business smarter and faster.*

#### E1. AI & Assistants
#### E2. Automation & Integration
#### E3. Analytics & Reporting

### F. Engineering & Development
*Tools the engineering team uses to build and maintain TLH's technology.*

#### F1. Source Code & Version Control
#### F2. Development Environment
#### F3. CI/CD & Deployment
#### F4. Cloud & Hosting
#### F5. Monitoring & Observability
#### F6. Databases & Data

### G. Security & Access
*Protecting the business and controlling who can access what.*

#### G1. Identity & Access
#### G2. Security Tools

*Note: Tool tables within each subcategory are awaiting population with actual tools. The taxonomy structure is complete but the specific tool entries need to be filled in through team input.*

## Integration Map

*This section maps how key systems connect to each other. Populated once the tool tables above are filled in.*

## How Other Skills Should Use This Map

When any skill needs to reference TLH technology, it should:

1. Use the **exact tool name** from this map
2. Reference the **category** when describing scope
3. Check the **Integrations column** to understand downstream impact

| Skill needs to know... | Reference this section |
|------------------------|----------------------|
| What tool handles [function] | Find the relevant subcategory (A1-G2) |
| What systems a change affects | Tool tables + Integration Map |
| Who uses a specific tool | Primary Users column |
| How systems connect | Integration Map |
| Whether a new tool overlaps existing ones | Full taxonomy scan |

## Output Format

This skill does not produce a deliverable. It is reference material that other skills read and apply.

## What This Skill Does NOT Do

- It does not recommend or evaluate new tools -- it documents what TLH currently uses
- It does not define how tools should be configured -- that's operational documentation
- It does not store credentials, API keys, or access URLs
- It does not define engineering practices around these tools -- that's 3.xx Engineering Standards
- It does not track tool costs or contracts

## When Things Go Wrong

**A skill references a tool that isn't in this map:**
Ask whether it's a tool TLH uses that should be added, or an error.

**The user mentions a tool by an informal name:**
Check 1.03 Memory Manager's glossary for shorthand. If not found, ask for clarification.

**A tool listed here has been replaced or deprecated:**
Move the old tool to a "Deprecated" note and add the replacement. Update the changelog.

**The user asks about a tool category that's empty:**
Be transparent about the section not being populated yet.

## Foundation Check

This skill IS a Foundation skill -- it doesn't consult other Foundation skills for its own content. However, it should stay consistent with:

| Related Foundation Skill | Relationship |
|-------------------------|-------------|
| 1.05 Company Profile | Tools should support the services described in 1.05 |
| 1.06 People & Roles | "Primary Users" should reference roles defined in 1.06 |
| 1.03 Memory Manager | Informal tool names/shorthand should be in 1.03's glossary |

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Initial build. Defined 7-group, 17-subcategory tool taxonomy aligned to TLH service lines. Tool tables created as templates -- awaiting population with actual tools. Status: draft until tool tables are populated. |

## Reference: Related Skills

- **1.05 Company Profile** -- Defines the services these tools support.
- **1.06 People & Roles** -- Defines who uses these tools.
- **1.03 Memory Manager** -- Tracks informal names and shorthand for tools.
- **2.04 System Change Request** -- Blueprint for requesting changes to systems listed here.
- **3.xx Engineering Standards** -- Define how engineering tools (Section F) should be used.
