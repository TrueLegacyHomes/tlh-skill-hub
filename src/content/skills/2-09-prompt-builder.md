---
name: "Prompt Builder"
skillId: "2.09"
series: "Blueprints"
status: "active"
audience: "All Team Members"
oneLiner: "Walks you through building a clear, effective prompt for Claude before starting any project or task — auto-detects your project type and applies Anthropic's best practices."
version: "2.0"
last_updated: "2026-03-13"
recommendedFor: ["improve", "define", "build"]
githubPath: "2.xx-blueprints/2.09-prompt-builder/SKILL.md"
---

# 2.09 Prompt Builder

Every project in Claude starts with a prompt. A good prompt gets you 80% of the way there on the first try. A bad prompt gets you three rounds of "that's not what I meant" before you give up and start over.

The Prompt Builder is a guided interview that asks you the right questions, detects what kind of project you're working on, and hands you a prompt that follows Anthropic's recommended best practices for Claude. It works for everyone — whether you're a Builder kicking off a new app in Claude Code or writing a follow-up email after an estate sale.

## How It Works

**4-Phase Interview:**
1. **Orient** — What are you trying to accomplish? (1-2 questions)
2. **Scope** — What's in, what's out, what format? (mode-specific questions added here)
3. **Detail** — The skill assembles your prompt using Anthropic's best practices (XML tags, role assignment, context ordering, examples, guardrails)
4. **Confirm** — Review the prompt and adjust before using it

**5 Project Modes** (auto-detected, not chosen):
- **Technical Build** — Apps, databases, APIs, tools
- **Research** — Data gathering, web scraping, market research
- **Document** — SOPs, reports, emails, proposals
- **Creative** — Marketing, brand content, social media
- **General** — Everything else

**4 Complexity Tiers:**
- **Quick** — Simple tasks, 2-3 sentence prompt
- **Standard** — Defined projects, structured prompt
- **Full** — Complex projects, XML-structured prompt with examples
- **Template** — Recurring tasks, reusable prompt with fill-in variables
