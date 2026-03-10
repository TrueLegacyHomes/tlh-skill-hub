---
name: "Integration & API Directory"
skillId: "3.08"
series: "Engineering Standards"
status: "active"
audience: "Engineering Team"
oneLiner: "Every API connection TLH has available, who can access it, and how to request access — the credential catalog for the Builder Program."
version: "1.0"
last_updated: "2026-03-09"
recommendedFor: ["reference", "build"]
githubPath: "3.xx-engineering-standards/3.08-integration-and-api-directory/SKILL.md"
---

## What It Does

Integration & API Directory is the catalog of every third-party API connection TLH has available — from Anthropic and OpenAI to Salesforce, Knack, Trestle MLS, Google Ads, and Aframe. It shows what each integration does, who currently has access, and the exact steps to request access or provision it for a Builder.

All credentials live in `TrueLegacyHomes/tlh-secrets`, encrypted with SOPS + age. This skill is the human-readable index that tells you what's on the shelf and how to check it out.

## Available Integrations

| Category | Integration | Who Has Access |
|----------|-------------|----------------|
| AI | Anthropic Claude | Tran |
| AI | OpenAI / ChatGPT | Tran |
| CRM | Salesforce | Tran |
| Data | Knack — Estate Sale | Tran |
| Data | Knack — Real Estate | Tran |
| MLS | Trestle MLS | Tran, Justin Hart |
| Marketing | Google Ads | Tran |
| Disposition | Aframe | Tran |

## How Builders Request Access

1. Open an issue in `TrueLegacyHomes/tlh-secrets` — title: `"Access Request: [Integration] — [Your Name]"`
2. IT Admin approves and adds your age public key to that app's rule
3. IT re-encrypts the file to include you
4. You decrypt with: `sops --decrypt apps/<app>/.env.enc > .env`

Requires a valid age keypair. See the `tlh-secrets` README for setup.
