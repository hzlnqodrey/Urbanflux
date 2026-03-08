---
name: openspec-archive
description: Archive a completed OpenSpec change, merging delta specs into main specs
---

# /opsx:archive

Archive a completed change — merges delta specs into the main specs and moves the change to the archive folder.

## When to Use

Use this command when all tasks in a change are complete and you're ready to finalize it.

## Syntax

```
/opsx:archive [change-name]
```

## What It Does

1. **Checks artifact completion** — verifies planning artifacts exist
2. **Checks task completion** — warns if tasks are incomplete
3. **Syncs delta specs** — merges ADDED/MODIFIED/REMOVED requirements into main `openspec/specs/`
4. **Moves to archive** — moves the change folder to `openspec/changes/archive/YYYY-MM-DD-<name>/`

## Instructions

### Step 1: Identify the Change

Look for active changes in `openspec/changes/`. If a change name is provided, use it.

### Step 2: Validate Completion

Check for:
- `proposal.md` exists
- `specs/` directory exists (if applicable)
- `design.md` exists
- `tasks.md` exists and check task completion

If tasks are incomplete, **warn the user** but don't block archiving.

### Step 3: Sync Delta Specs

For each delta spec file in `openspec/changes/<name>/specs/`:

1. **Read the delta spec** — parse ADDED, MODIFIED, REMOVED sections
2. **Find the corresponding main spec** in `openspec/specs/<domain>/spec.md`
3. **Apply changes**:
   - **ADDED**: Append new requirements to the main spec
   - **MODIFIED**: Replace existing requirements with updated versions
   - **REMOVED**: Delete deprecated requirements from the main spec
4. **Create main spec** if it doesn't exist yet

### Step 4: Archive the Change

Move the entire change folder:
```
openspec/changes/<name>/ → openspec/changes/archive/YYYY-MM-DD-<name>/
```

Use today's date as the prefix.

### Step 5: Report

Summarize:
- Which specs were updated
- Where the change was archived
- Confirm the archive is complete

## Key Principles

- **Preserve history** — all artifacts are kept in the archive for audit trail
- **Merge carefully** — delta spec merging should be intelligent, not copy-paste
- **Warn, don't block** — incomplete tasks get warnings but don't prevent archiving
- **Date-prefix archives** — enables chronological ordering

## Tips

- Run `/opsx:apply` first to ensure all tasks are complete
- Archived changes are read-only snapshots
- The main `openspec/specs/` directory grows organically as changes are archived
- Multiple changes can touch the same spec domain without conflict (if different requirements)
