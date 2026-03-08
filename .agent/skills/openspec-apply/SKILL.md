---
name: openspec-apply
description: Implement tasks from an OpenSpec change, working through the checklist and writing code
---

# /opsx:apply

Implement tasks from a change, working through the task checklist and writing actual code.

## When to Use

Use this command after planning artifacts are complete (proposal, specs, design, tasks) and you're ready to implement.

## Syntax

```
/opsx:apply [change-name]
```

## What It Does

1. **Identifies the active change** (from name, context, or prompts user to choose)
2. **Reads all artifacts** for full context (proposal, specs, design, tasks)
3. **Works through tasks** one by one, writing code and checking off items
4. **Updates task checkboxes** `[x]` as tasks complete
5. **Can update artifacts** if implementation reveals needed changes

## Instructions

### Step 1: Identify the Change

Look for active changes in `openspec/changes/`. If a change name is provided, use it. Otherwise:
- Check conversation context for a recent change
- List active changes and prompt the user to choose

### Step 2: Read All Artifacts

Read these files from the change directory:
1. `proposal.md` — understand intent and scope
2. `specs/` — understand requirements and scenarios
3. `design.md` — understand technical approach
4. `tasks.md` — get the implementation checklist

### Step 3: Identify Incomplete Tasks

Parse `tasks.md` and find all unchecked tasks (`- [ ]`). Work through them in order.

### Step 4: Implement Each Task

For each task:
1. Understand what the task requires (from context of all artifacts)
2. Write the code / make the changes
3. Mark the task complete in `tasks.md`: change `- [ ]` to `- [x]`
4. Report what was done

### Step 5: Handle Issues

If implementation reveals problems:
- **Design was wrong**: Update `design.md` with the correction, then continue
- **Missing requirement**: Update `specs/` with the new delta, then continue
- **Scope change**: Update `proposal.md`, then continue
- **Blocked**: Report the blocker and stop

### Step 6: Report Completion

When all tasks are done, summarize:
- What was implemented
- Any artifacts that were updated during implementation
- Suggest running `/opsx:archive` when ready

## Key Principles

- **Follow the design** — implement according to `design.md`, don't freelance
- **Check tasks off** — always update `tasks.md` as you complete work
- **Stay in scope** — only implement what's in the proposal's scope
- **Update artifacts** — if reality differs from plan, update the artifacts
- **Test as you go** — run tests relevant to each task

## Tips

- Can resume where you left off if interrupted
- Specify change name when working on multiple changes in parallel
- If a task is too big, it's OK to split it into sub-tasks in `tasks.md`
- Keep commits/changes atomic and aligned with task boundaries
