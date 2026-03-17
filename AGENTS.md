# Urbanflux — OpenSpec Skills for Claude

This project uses **OpenSpec** — a spec-driven development workflow — integrated with Claude Code skills to manage changes systematically.

## Quick Start

To create a new change, simply ask Claude:

```
Create an OpenSpec change for [your description]
```

Example:
```
Create an OpenSpec change for adding Penang ferry adapter
```

## Available OpenSpec Commands

The project includes these OpenSpec skills/workflows:

### `/openspec` or `/opsx:propose`
Create a new change with all planning artifacts (proposal, specs, design, tasks).

**When to use**: Starting a new feature, bug fix, or refactor.

**What it does**:
- Creates `openspec/changes/<change-name>/` directory
- Generates `proposal.md` with intent, scope, approach
- Generates `specs/<domain>/spec.md` with delta requirements
- Generates `design.md` with technical approach
- Generates `tasks.md` with implementation checklist

### `/opsx:apply`
Implement tasks from an existing change.

**When to use**: Ready to write code after planning is complete.

**What it does**:
- Reads all artifacts from the change
- Works through tasks one by one
- Writes code and checks off completed tasks
- Updates artifacts if implementation reveals needed changes

### `/opsx:explore`
Explore ideas and investigate problems before committing to a change.

**When to use**: Requirements are unclear or you need to research.

**What it does**:
- Investigates the codebase
- Compares approaches
- No artifacts created — exploratory only

### `/opsx:archive`
Archive a completed change to `openspec/changes/archive/`.

**When to use**: Change is fully implemented and ready to archive.

## Typical Workflow

```
1. /openspec              → Plan the change
2. Review artifacts       → Edit as needed
3. /opsx:apply           → Implement the change
4. Test & commit         → Verify and ship
5. /opsx:archive         → Archive when done
```

## OpenSpec Structure

```
openspec/
├── config.yaml                 # Project rules and context
├── changes/
│   ├── <change-name>/         # Active changes
│   │   ├── proposal.md        # Intent, scope, approach
│   │   ├── specs/             # Delta specs by domain
│   │   │   ├── adapter/spec.md
│   │   │   ├── backend/spec.md
│   │   │   └── frontend/spec.md
│   │   ├── design.md          # Technical approach
│   │   └── tasks.md           # Implementation checklist
│   └── archive/               # Completed changes
└── specs/                     # Global specifications
```

## Project Context

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Mapbox GL JS
- **Backend**: Go, WebSocket, GTFS-RT protobuf parsing
- **Infrastructure**: Docker, GitHub Actions CI/CD, Cloudflare

### Hubs
Jakarta, Istanbul, Switzerland, Japan, Malaysia (Kuala Lumpur, Penang, Kuantan, +9 BAS.MY cities)

### Change Domains
- **adapter** - Hub adapters (GTFS-RT, REST, WebSocket)
- **backend** - Server, WebSocket hub, adapter registry
- **frontend** - Maps, dashboard, UI components
- **infrastructure** - Docker, CI/CD, deployment

### Transit Modes
BUS, RAIL, METRO, FERRY, MONORAIL, TRAM

## Delta Spec Format

All spec files use the **delta format** showing what's ADDED, MODIFIED, or REMOVED:

```markdown
# Delta for <Domain>

## ADDED Requirements

### Requirement: <Name>
The system SHALL <requirement description>.

#### Scenario: <scenario-name>
- GIVEN <precondition>
- WHEN <action>
- THEN <expected outcome>

## MODIFIED Requirements
### Requirement: <Existing Name>
The requirement SHALL <modified behavior>.

## REMOVED Requirements
### Requirement: <Old Name>
<This requirement is deprecated.>
```

## Tips for Claude Users

1. **Be specific** with change names: `add-penang-ferry` (not `update` or `changes`)
2. **Specify affected hubs** when working with multi-hub platform
3. **Include transit modes** in spec scenarios (Bus, Rail, etc.)
4. **Reference config.yaml** — it has project-specific rules
5. **Keep changes focused** — one logical change per proposal
6. **Test as you go** — don't leave all testing for the end
7. **Update artifacts** if implementation reveals design issues

## Examples

### Example 1: New Adapter
```
Create an OpenSpec change for adding KTMB train adapter
```

Generates:
- Proposal for KTMB adapter integration
- Adapter delta spec with GTFS-RT requirements
- Design using BaseAdapter pattern
- Tasks: Create adapter, register in main.go, test

### Example 2: Frontend Fix
```
Create an OpenSpec change for fixing map marker z-index
```

Generates:
- Proposal for marker rendering fix
- Frontend delta spec for visibility logic
- Design with Mapbox layer ordering
- Tasks: Update HubMapOSM.tsx, test on hubs

### Example 3: Architecture Refactor
```
Create an OpenSpec change for refactoring adapter registry
```

Generates:
- Proposal for registry improvements
- Backend delta spec for new registry API
- Design with architecture decisions
- Tasks: Refactor registry, update all adapters

## Skill Files

The OpenSpec skills are defined in:
- `.agent/skills/openspec-integration/SKILL.md` - Main integration skill
- `.agent/workflows/openspec.md` - Quick workflow reference
- `.agent/skills/openspec-*/SKILL.md` - Detailed skill instructions

## Configuration

The `openspec/config.yaml` file defines:
- Tech stack context
- Per-artifact rules (proposal, specs, design, tasks)
- Hub and transit mode conventions
- Testing requirements

Claude reads this file automatically when creating new changes to ensure all artifacts follow project conventions.
