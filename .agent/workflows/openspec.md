---
description: Create a new OpenSpec change with proposal, specs, design, and tasks following Urbanflux project conventions
---

# /openspec

1. Read the skill at `.agent/skills/openspec-integration/SKILL.md` for full instructions
2. Ask the user for:
   - Change name (kebab-case)
   - Brief description of what to change
   - Affected domains (adapter, backend, frontend, infrastructure)
   - Affected hubs (optional)
3. Read `openspec/config.yaml` for project context and rules
4. Create the change directory: `openspec/changes/<change-name>/`
5. Generate all planning artifacts:
   - `proposal.md` with intent, scope, approach
   - `specs/<domain>/spec.md` with delta specs (ADDED/MODIFIED/REMOVED)
   - `design.md` with technical approach and architecture decisions
   - `tasks.md` with implementation checklist
6. Report what was created and next steps
