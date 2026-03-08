---
description: Archive a completed OpenSpec change, merging delta specs into main specs
---

# /opsx:archive

1. Read the SKILL.md at `.agent/skills/openspec-archive/SKILL.md` for full instructions
2. Identify the change to archive in `openspec/changes/`
3. Validate completion: check that artifacts exist and tasks are done (warn if incomplete)
4. Sync delta specs into main `openspec/specs/`:
   - ADDED requirements → append to main spec
   - MODIFIED requirements → replace in main spec
   - REMOVED requirements → delete from main spec
   - Create the main spec file if it doesn't exist yet
5. Move the change folder to `openspec/changes/archive/YYYY-MM-DD-<name>/`
6. Report which specs were updated and confirm archival
