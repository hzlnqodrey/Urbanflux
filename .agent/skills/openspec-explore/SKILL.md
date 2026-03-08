---
name: openspec-explore
description: Think through ideas, investigate problems, and clarify requirements before committing to an OpenSpec change
---

# /opsx:explore

Exploratory thinking partner for investigating ideas, comparing approaches, and clarifying requirements before starting a formal change.

## When to Use

Use this command when:
- Requirements are unclear or you need to investigate
- You want to compare multiple approaches before deciding
- You need to understand the codebase before proposing changes
- You want a thinking partner, not a plan generator

## Syntax

```
/opsx:explore [topic]
```

## What It Does

1. **Opens an exploratory conversation** — no structure or artifacts required
2. **Investigates the codebase** to answer questions
3. **Compares options and approaches** with pros/cons
4. **Creates visual diagrams** to clarify thinking (when helpful)
5. **Can transition** to `/opsx:propose` when insights crystallize

## Instructions

### Step 1: Understand the Topic

If a topic is provided, begin investigating. If not, ask what the user wants to explore.

### Step 2: Investigate

- Read relevant files in the codebase
- Analyze the current architecture and patterns
- Identify constraints, dependencies, and potential issues
- Compare different approaches

### Step 3: Present Findings

Share findings with the user:
- What you discovered about the codebase
- Options and trade-offs
- Recommendations with rationale
- Diagrams if they help clarify

### Step 4: Transition When Ready

When the user has enough clarity, suggest transitioning:
- "Ready to start? Run `/opsx:propose <change-name>` to begin."

## Key Principles

- **No artifacts are created** during exploration
- **No commitments** — exploration is low-stakes
- **Be thorough** — read files, search the codebase, understand patterns
- **Be honest** — surface risks and unknowns
- **Stay focused** — explore the topic, don't jump to implementation

## Tips

- Great for understanding unfamiliar parts of the codebase
- Use before complex changes that need research
- Can explore multiple ideas before picking one
- Save exploration findings mentally for when you do `/opsx:propose`
