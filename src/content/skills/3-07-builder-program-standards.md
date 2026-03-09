---
name: "Builder Program Standards"
skillId: "3.07"
series: "Engineering Standards"
status: "active"
audience: "Engineering Team"
oneLiner: "The single source of truth for TLH's Builder Program — approved tech stack, secrets management, deployment flow, and MVP handoff checklist."
version: "1.0"
last_updated: "2026-03-09"
recommendedFor: ["reference", "build"]
githubPath: "3.xx-engineering-standards/3.07-builder-program-standards/SKILL.md"
---

## What It Does

Builder Program Standards is the rulebook for TLH's Builder Program — the system that lets senior executives ("Builders") build internal web tools using Claude Code without prior technical knowledge. It defines what Builders are allowed to build, what tech they must use, how secrets are stored, how projects are deployed, and what engineering reviews at handoff.

The Engineering Guardrail skill (loaded by Builders into every Claude Code project) reads this rulebook and enforces it in real time.

## Approved Tech Stack

| Layer | Approved Choice |
|-------|----------------|
| Frontend | HTML / CSS / JS → React / React Native (if complex or mobile) |
| Backend | None → CF Pages Functions → Hono + CF Workers |
| Language | JavaScript / TypeScript only |
| Database | Supabase (default) → MongoDB Atlas (when scaled) |
| Deployment | Cloudflare Pages + Workers only |
| Version Control | GitHub (TrueLegacyHomes org, private repos) |
| Secrets | SOPS + age (encrypted GitHub org repo) |

## Deployment Flow

Three phases — IT only touches the project once, at MVP review:

1. **Localhost** — Builder develops and previews via Claude Code. No Cloudflare needed.
2. **Staging** — Builder pushes to `working/Development` → GitHub Actions auto-deploys to Cloudflare Pages staging URL (~1-2 min).
3. **Production** — Builder opens PR: `working/Development` → `main` → IT reviews security → engineering migrates cron jobs, adds auth → IT merges to production.

## MVP Handoff Checklist

Before IT merges `working/Development` → `main`, engineering verifies:

**Security (blocks merge):**
- No API keys, tokens, or secrets in code or any file
- No `.env` files present (must use SOPS + age)
- No hardcoded sensitive data (PII, credentials, passwords)
- Supabase Row Level Security (RLS) enabled
- No unapproved tech stack components

**Completeness (warns but doesn't block):**
- README complete and accurate
- Cron jobs documented and ready for CF Workers migration
- Audit companion app present (required for data pipeline apps)
- Export functionality saves to Downloads or approved path only
