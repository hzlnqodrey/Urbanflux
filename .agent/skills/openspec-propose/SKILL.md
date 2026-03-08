---
name: openspec-propose
description: Create a new OpenSpec change with all planning artifacts (proposal, specs, design, tasks) in one step
---

# /opsx:propose

Create a new change and generate all planning artifacts needed before implementation.

## When to Use

Use this command when you want to start a new feature, fix, or refactor — and you know enough to plan it upfront.

## Syntax

```
/opsx:propose [change-name-or-description]
```

## What It Does

1. **Creates the change folder** at `openspec/changes/<change-name>/`
2. **Generates all planning artifacts** in dependency order:
   - `proposal.md` — Intent, scope, and high-level approach
   - `specs/<domain>/spec.md` — Delta specs showing ADDED/MODIFIED/REMOVED requirements
   - `design.md` — Technical approach and architecture decisions
   - `tasks.md` — Implementation checklist with checkboxes

## Instructions

### Step 1: Determine Change Name

If not provided, derive a kebab-case name from the description (e.g., `add-dark-mode`, `fix-login-bug`, `refactor-auth`).

### Step 2: Create Change Directory

```
openspec/changes/<change-name>/
```

### Step 3: Create proposal.md

```markdown
# Proposal: <Change Title>

## Intent
<Why are we doing this? What problem does it solve?>

## Scope
In scope:
- <What's included>

Out of scope:
- <What's explicitly excluded>

## Approach
<High-level technical approach>
```

### Step 4: Create Delta Specs

Create `specs/<domain>/spec.md` inside the change folder. Use the delta format:

```markdown
# Delta for <Domain>

## ADDED Requirements

### Requirement: <Name>
<Description using SHALL/MUST/SHOULD keywords>

#### Scenario: <scenario-name>
- GIVEN <precondition>
- WHEN <action>
- THEN <expected result>

## MODIFIED Requirements
(if changing existing behavior)

## REMOVED Requirements
(if deprecating behavior)
```

### Step 5: Create design.md

```markdown
# Design: <Change Title>

## Technical Approach
<How will this be implemented?>

## Architecture Decisions
### Decision: <Name>
<Rationale and alternatives considered>

## File Changes
- `path/to/file` (new/modified)
```

### Step 6: Create tasks.md

```markdown
# Tasks

## 1. <Category>
- [ ] 1.1 <Specific task>
- [ ] 1.2 <Specific task>

## 2. <Category>
- [ ] 2.1 <Specific task>
```

### Step 7: Report

Summarize what was created and indicate the change is ready for `/opsx:apply`.

## Project Context

<context>
Read the project's `openspec/config.yaml` for tech stack context and per-artifact rules.
If it exists, inject that context into all artifacts.
</context>

## Tips

- Use descriptive names: `add-feature`, `fix-bug`, `refactor-module`
- Avoid generic names like `update`, `changes`, `wip`
- Keep proposals focused — one logical change per proposal
- Delta specs should describe behavior, not implementation details
- Tasks should be small enough to complete in one session
