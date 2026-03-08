---
description: Create a new OpenSpec change with all planning artifacts (proposal, specs, design, tasks)
---

# /opsx:propose

1. Read the SKILL.md at `.agent/skills/openspec-propose/SKILL.md` for full instructions
2. If a change name is provided, use it; otherwise derive a kebab-case name from the user's description
3. Create the change directory: `openspec/changes/<change-name>/`
4. Read `openspec/config.yaml` for project context and per-artifact rules
5. Create `proposal.md` with intent, scope, and approach
6. Create `specs/<domain>/spec.md` with delta specs (ADDED/MODIFIED/REMOVED)
7. Create `design.md` with technical approach and architecture decisions
8. Create `tasks.md` with implementation checklist (checkboxes)
9. Report what was created and indicate readiness for `/opsx:apply`
