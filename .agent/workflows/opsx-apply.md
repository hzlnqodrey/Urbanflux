---
description: Implement tasks from an OpenSpec change, working through the checklist and writing code
---

# /opsx:apply

1. Read the SKILL.md at `.agent/skills/openspec-apply/SKILL.md` for full instructions
2. Identify the active change in `openspec/changes/` (from name, context, or prompt user)
3. Read all artifacts: `proposal.md`, `specs/`, `design.md`, `tasks.md`
4. Find all incomplete tasks (`- [ ]`) in `tasks.md`
5. For each task:
   a. Understand what it requires from the full artifact context
   b. Write the code / make the changes
   c. Mark complete in `tasks.md`: change `- [ ]` to `- [x]`
   d. Report what was done
6. If implementation reveals issues, update the relevant artifacts and continue
7. When all tasks complete, suggest running `/opsx:archive`
