---
name: "Builder Compliance Checker"
skillId: "3.10"
series: "Engineering Standards"
status: "active"
audience: "Engineering Team"
oneLiner: "Pre-handoff audit that walks Builders through every required setup component before Cloudflare — and sends engineering a formatted compliance report in Slack."
version: "1.0"
last_updated: "2026-03-13"
recommendedFor: ["reference", "build"]
githubPath: "3.xx-engineering-standards/3.10-builder-compliance-checker/SKILL.md"
---

## What It Does

Builder Compliance Checker is the pre-flight checklist every Builder must pass before their project goes to engineering for Cloudflare setup and production merge. It audits each setup component against 3.07 Builder Program Standards, cross-references APIs against 3.08, flags blockers vs. warnings, and generates a formatted Slack message to `#it-engineering` summarizing the project status.

Builders can run it as a self-check mid-build. Engineering can use it as the formal PR gate when a Builder opens `working/Development` → `main`. Cloudflare setup (3.09) is out of scope — this skill covers everything that must be confirmed before that step.

## What Gets Checked

| Group | Check | Severity |
|-------|-------|----------|
| **GitHub** | Repo name (`{FirstName}_{ProjectName}`), private, TrueLegacyHomes org, `main` + `working/Development` branches | 🚫 Blocker |
| **Dropbox** | Mirror path exists and is current | ⚠️ Warning |
| **Staging** | GitHub Actions configured, staging URL live after push | 🚫 Blocker |
| **Supabase** | IT created project, correct org, Builder has Developer role, `.env` set up (if DB used) | 🚫 Blocker |
| **Secrets** | No keys in code, no `.env` committed, credentials in SOPS + age | 🚫 Blocker |
| **Data sensitivity** | PII / financial / credentials flagged for engineering scrutiny | ⚠️ Flag |
| **APIs** | Each API cross-referenced against 3.08, access provisioned | 🚫 Blocker |
| **Tech stack** | All components match 3.07 approved list | 🚫 Blocker |
| **Cron jobs** | Documented, Builder knows engineering migrates at merge | ⚠️ Warning |
| **Audit companion** | Present for any data merge / manipulation app | ⚠️ Warning |
| **Exports** | Files route to Downloads only, not in repo | ⚠️ Warning |
| **Auth flag** | Login requirement documented — engineering implements, not Builder | ⚠️ Flag |
| **README** | Complete and accurate | ⚠️ Warning |

## Gap Severity

- **🚫 Blocker** — Must be fixed before the Slack message is generated. The skill re-confirms each blocker is resolved before proceeding.
- **⚠️ Warning** — Flagged in the Slack message but doesn't block sending. Engineering is aware and can address at merge.

## Slack Output (to #it-engineering)

Once all blockers are resolved, the skill generates a formatted message including:
- ✅ Confirmed setup items
- 🚫 Any remaining blockers
- ⚠️ Open warnings
- 📋 Engineering to-dos at merge (cron migration, auth, Supabase RLS)
- 🔌 Integrations required with `tlh-secrets` paths
