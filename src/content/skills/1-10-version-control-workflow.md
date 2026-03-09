---
name: "Version Control Workflow"
skillId: "1.10"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "The official branching strategy, anti-override policy, and file storage rules for all TrueLegacyHomes GitHub repos."
version: "1.1"
last_updated: "2026-03-09"
recommendedFor: ["reference"]
githubPath: "1.xx-foundation/1.10-version-control-workflow/SKILL.md"
---

## What It Does

Version Control Workflow is the single source of truth for how all TLH GitHub repositories are managed. It covers two repo types — the Skills2.0 skill hub and Builder Project repos — and applies to every contributor: Tran, Jeff, Brett, and all Builders.

## How It Works

**Two repo types, one set of rules:**

**Skills2.0 (Skill Hub)** — Three-tier branch structure:
- `main` — source of truth, always clean
- `{user}/branch` — individual work (tran/, jeff/, brett/)
- `dev/working` — integration branch, reviewed by all before shipping to main

**Builder Project Repos** — Two-tier branch structure:
- `main` — IT only, connected to production
- `working/Development` — Builder's working branch, connected to staging auto-deploy
- `{username}/test-{feature}` — optional test branches, merged back and deleted

## Anti-Override Policy (All Repos)

- **Rebase before merge** — always rebase on the target branch locally before opening a PR
- **Merge lock** — post in Slack before merging so no one else merges simultaneously
- **Branch protection** — all protected branches require PR + 1 reviewer + up-to-date branch
- **Squash & Merge only** — one branch = one commit, keeps history clean
- **Short-lived branches** — days, not weeks

## File Storage Rules (Builder Projects)

All project files must live in GitHub or Dropbox — nothing persists on a local machine after a session ends.

- **Primary:** GitHub (`working/Development` branch)
- **Secondary:** Dropbox mirror at `True Legacy Homes Team Folder/AI Tools/Working Projects/{Username_AI}/{ProjectName}/`
- **Session-end prompt:** "Do you want to save to both GitHub and Dropbox?" — GitHub and Dropbox must be identical at the end of every session
