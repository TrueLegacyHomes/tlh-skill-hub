---
name: "Memory Manager"
skillId: "1.03"
series: "Foundation"
status: "active"
audience: "All Team Members"
oneLiner: "Preserves context, decisions, and institutional knowledge across conversations so nothing gets lost between sessions."
version: "1.0"
last_updated: "2025-02-27"
recommendedFor: ["improve"]
githubPath: "1.xx-foundation/1.03-memory-manager/SKILL.md"
---

# 1.03 Memory Manager

The Memory Manager is TLH's institutional memory. It solves the biggest problem with AI-assisted work: every new conversation starts from zero. Decisions get re-debated, context gets re-explained, and progress gets lost.

Think of it as a project foreman's clipboard combined with a team directory. It writes down every important decision, tracks where things stand, and knows who "Todd" is when someone mentions him by first name. When you come back tomorrow and say "pick up where we left off," the Memory Manager has everything ready.

## When to Use This Skill

- Starting or continuing a multi-session project
- When significant decisions are made during a conversation that should be preserved
- When the user says "save context", "save progress", "checkpoint", or "remember this"
- When the user says "pick up where we left off", "continue [project]", "what were we working on"
- When the user references people, terms, or projects by shorthand and expects Claude to understand
- When a long conversation (15+ exchanges) has produced decisions or progress worth saving
- When the user is wrapping up a session ("thanks", "that's good for now", "gotta go")
- When the user asks "who is X?" or "what does X mean?" about internal people/terms

## Architecture: Two Memory Systems

The Memory Manager maintains two complementary systems -- project memory for tracking work, and institutional memory for understanding TLH's people, terms, and context.

### System 1: Project Memory

Every project gets persistent files on the filesystem so context survives between conversations.

**Location:** `~/Documents/claude-projects/{project-slug}/`

Each project directory contains three files:

**`brief.md` -- What This Project Is**
The source of truth for scope, stakeholders, and requirements. Created at project start, updated as scope evolves.

**`decisions.md` -- Why We Did What We Did**
The most important file. The "why" behind decisions is what future sessions need most. New decisions go at the top (reverse chronological).

**`status.md` -- Pick Up Here**
Updated at the end of each work session. This is what gets read first when resuming.

### System 2: Institutional Memory (Shorthand Decoder)

TLH has its own language -- nicknames, acronyms, project codenames, internal jargon. The Memory Manager maintains a two-tier lookup system so Claude understands shorthand the way a colleague would.

**Tier 1: Hot Cache (`CLAUDE.md`)**
A compact file (~50-80 lines) kept in the working directory. Contains the top ~30 people, ~30 most common terms, active projects, and user preferences. Covers ~90% of daily decoding needs.

**Tier 2: Deep Memory (`memory/` directory)**
The full knowledge base. Searched when something isn't in the hot cache. Can grow indefinitely.

- `memory/glossary.md` -- Complete decoder ring (all people, terms, acronyms, codenames)
- `memory/people/{name}.md` -- Full profiles with communication preferences, context, notes
- `memory/projects/{name}.md` -- Project details, codenames, key people, status
- `memory/context/` -- Company-specific context (teams, tools, processes)

### Lookup Flow

When the user says something with shorthand:

```
1. Check CLAUDE.md (hot cache)    -> Covers 90% of lookups
2. Check memory/glossary.md      -> Full glossary if not in hot cache
3. Check memory/people/, projects/ -> Rich detail when needed for execution
4. Ask the user                   -> Unknown term? Learn it and save it
```

## Core Behaviors

### Auto-Save (Claude does this without being asked)

Save context automatically when ANY of these occur:

1. **A significant decision is made** -- the user chooses between options, sets a direction, or commits to an approach. Log to `decisions.md`.
2. **A milestone is reached** -- a major section of work is completed. Update `status.md`.
3. **The conversation is getting long** -- if the conversation exceeds ~15 back-and-forth exchanges on a project topic, proactively save status.
4. **The user signals they're wrapping up** -- phrases like "thanks", "that's good for now", "let's pick this up later". Update `status.md` with a "pick up here" summary.
5. **New institutional knowledge surfaces** -- the user mentions a person, term, or project by shorthand. Add it to the appropriate memory file.

When auto-saving:
- Do it quietly -- just a brief one-line note like "Saved to project context." Don't make a big deal of it.
- Create the project directory if it doesn't exist yet.
- Never save sensitive information (passwords, API keys, financial account numbers).

### Manual Save

When the user says "save context", "save progress", "checkpoint":
- Update ALL project files with current state
- Update CLAUDE.md and glossary if new terms/people were discussed
- Confirm with a brief summary of what was saved

### Resume

When the user says "pick up where we left off", "continue [project]", "load [project]":

1. List available projects in `~/Documents/claude-projects/` if the project name is ambiguous
2. Read `status.md` FIRST (most recent context)
3. Read `brief.md` for background
4. Read recent entries from `decisions.md` for decision context
5. Load `CLAUDE.md` for institutional context
6. Summarize where things stand and ask what to tackle next

### Adding Memory

When the user says "remember this" or new terms/people surface:

| Type | Where it goes |
|------|--------------|
| Acronym/term/shorthand | `memory/glossary.md` + promote to `CLAUDE.md` if frequently used |
| Person (new contact) | `memory/people/{name}.md` + add to `CLAUDE.md` People if top 30 |
| Project | `memory/projects/{name}.md` + add to `CLAUDE.md` Projects if active |
| Preference | `CLAUDE.md` Preferences section |

### Promotion / Demotion

**Promote to CLAUDE.md** when a term, person, or project is used frequently or is part of active work.

**Demote to memory/ only** when a project completes, a person is no longer a frequent contact, or a term is rarely used. This keeps the hot cache fresh and under ~100 lines.

## Project Naming

- Ask the user for a project name when creating a new project
- Convert to a slug for the directory name: "True Legacy Business Plan" -> `true-legacy-business-plan`
- Use the full name in file headers

## Foundation Check

Before producing output, consult the TLH Foundation skills that are relevant to this work.

| If your output involves... | Consult |
|---------------------------|---------|
| Anything about the company | 1.05 Company Profile |
| People, teams, or roles | 1.06 People & Roles |
| Visual design, layouts, branding | 1.07 Brand Look & Feel |
| Writing tone, terminology, voice | 1.08 Brand Tone & Language |
| Software, platforms, integrations | 1.09 Tools & Platforms Map |

**Special note for 1.03:** The Memory Manager has a unique relationship with Foundation skills. When 1.06 People & Roles is built, it becomes the authoritative source for team structure -- the Memory Manager's people files should be consistent with 1.06 but can contain additional personal context (nicknames, communication preferences) that 1.06 doesn't track.

## Output Format

The Memory Manager doesn't produce a single deliverable -- it maintains an ongoing set of files:

| File | Purpose | Updated when |
|------|---------|-------------|
| `~/Documents/claude-projects/{slug}/brief.md` | Project scope & requirements | Project starts or scope changes |
| `~/Documents/claude-projects/{slug}/decisions.md` | Decision log with rationale | Significant decisions are made |
| `~/Documents/claude-projects/{slug}/status.md` | Current state & next steps | End of each session or milestone |
| `CLAUDE.md` | Hot cache for shorthand decoding | New frequent terms/people surface |
| `memory/glossary.md` | Complete decoder ring | Any new term, person, or codename |
| `memory/people/{name}.md` | Full person profiles | New contact details or context |
| `memory/projects/{name}.md` | Project details | New project or major update |

When resuming a project, the "output" is a verbal summary of current state + asking what to tackle next.

## What This Skill Does NOT Do

- It does not create deliverables -- it preserves context so other skills can create better deliverables
- It does not make decisions -- it records decisions that have been made
- It does not manage tasks or to-dos -- it tracks project status and next steps at a high level
- It does not replace Foundation skills -- 1.05-1.09 are the source of truth for company knowledge; the Memory Manager handles session-specific and project-specific context
- It does not store sensitive information -- passwords, API keys, financial account numbers are never saved

## When Things Go Wrong

**The user references a project that doesn't exist in `~/Documents/claude-projects/`:**
List the projects that DO exist and ask: "I don't see a project called [X]. Did you mean one of these, or should I create a new project?"

**The user mentions a person/term the Memory Manager doesn't recognize:**
Don't pretend to know. Ask directly: "I don't know who/what [X] is yet. Can you tell me? I'll remember it for next time."

**Conflicting information -- user says something that contradicts a previous decision:**
Flag it explicitly: "Heads up -- this conflicts with Decision #3 where we decided [X]. Want me to update that decision, or is this a different situation?"

**Filesystem tools aren't available:**
Fall back to presenting the context as markdown in the conversation and ask the user to save it manually.

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-02-26 | Rebuilt from context-manager and productivity:memory-management. Merged project persistence (brief/decisions/status) with institutional memory (CLAUDE.md + memory/ directory). Added Foundation Check, standard template sections, two-tier lookup flow, promotion/demotion rules. |

## Reference: Related Skills

- **1.01 Skill Builder** -- When building skills across sessions, the Memory Manager preserves build progress, decisions, and taxonomy state.
- **1.02 Quality Checker** -- Audits may reference decisions or context stored by the Memory Manager.
- **1.05 Company Profile** -- Source of truth for company-level knowledge. Memory Manager stores session/project context that 1.05 doesn't cover.
- **1.06 People & Roles** -- Source of truth for org structure. Memory Manager adds informal context (nicknames, communication preferences) on top of 1.06's formal definitions.
- **1.09 Tools & Platforms Map** -- Source of truth for systems. Memory Manager may track informal names people use for those systems.
