---
name: openspec
description: Create and manage OpenSpec changes with proposal, specs, design, and tasks following the project's config.yaml rules
---

# OpenSpec Integration Skill

## Purpose

Generate new OpenSpec changes following the Urbanflux project's spec-driven development workflow. Creates structured change proposals with delta specs, design docs, and implementation tasks.

## When to Use

- Starting a new feature, bug fix, or refactor
- Planning changes that need clear requirements and implementation steps
- Working with multi-hub transit data adapters (Jakarta, Malaysia, etc.)
- Making frontend/backend changes to the Urbanflux hub platform

## What It Does

1. Reads `openspec/config.yaml` for project context and rules
2. Creates a new change directory at `openspec/changes/<change-name>/`
3. Generates all planning artifacts:
   - `proposal.md` - Intent, scope, approach
   - `specs/<domain>/spec.md` - Delta specs with ADDED/MODIFIED/REMOVED requirements
   - `design.md` - Technical approach and architecture
   - `tasks.md` - Implementation checklist with checkboxes

## Usage

Invoke this skill when you want to create a new OpenSpec change. Provide:
- **Change name** (kebab-case, e.g., `add-penang-ferry-adapter`)
- **Brief description** of what you want to change
- **Affected domains** (frontend, backend, adapter, infrastructure)
- **Affected hubs** (optional, e.g., Jakarta, Kuala Lumpur, Penang, etc.)

## Step-by-Step Process

### 1. Initialize Change

- Parse the change name and description
- Create `openspec/changes/<change-name>/` directory
- Read `openspec/config.yaml` for project context

### 2. Generate Proposal

Create `proposal.md` with:

```markdown
# Proposal: <Change Title>

## Intent
<Why are we doing this? What problem does it solve? What value does it deliver?>

## Scope
In scope:
- <Specific features/changes included>

Out of scope:
- <Explicitly excluded items>

## Approach
<High-level technical approach and strategy>

## Dependencies
- <API endpoints, data sources, or other changes required>

## Testing Strategy
- <How will this be tested? e2e, unit, integration?>
```

### 3. Generate Delta Specs

Create `specs/<domain>/spec.md` for each affected domain:

```markdown
# Delta for <Domain>

## ADDED Requirements

### Requirement: <Requirement Name>
The system SHALL/MUST/SHOULD <description using RFC 2119 keywords>.

#### Scenario: <scenario-name>
- GIVEN <precondition>
- WHEN <action>
- THEN <expected outcome>

#### Scenario: <another-scenario>
- GIVEN <precondition>
- WHEN <action>
- THEN <expected outcome>

## MODIFIED Requirements

### Requirement: <Existing Requirement Name>
The existing requirement SHALL <modified behavior>.

#### Scenario: <scenario-name>
- GIVEN <precondition>
- WHEN <action>
- THEN <modified expected outcome>

## REMOVED Requirements

### Requirement: <Removed Requirement Name>
<This requirement is being deprecated and removed.>
```

**Domains** typically include:
- `adapter` - Hub adapter changes (GTFS-RT parsers, polling logic)
- `backend` - Server, WebSocket, registry changes
- `frontend` - UI, maps, dashboard changes
- `infrastructure` - Docker, CI/CD, deployment

### 4. Generate Design

Create `design.md` with:

```markdown
# Design: <Change Title>

## Technical Approach
<How will this be implemented? Include architecture decisions>

## Architecture Decisions

### Decision: <Decision Name>
**Context:** <What problem are we solving?>
**Decision:** <What are we doing?>
**Rationale:** <Why this approach?>
**Alternatives Considered:**
- <Alternative 1>: <pros/cons>
- <Alternative 2>: <pros/cons>

## Component Changes

### Frontend
- `path/to/file.tsx` (new/modified) - <description>
- Component changes affecting <hubs>

### Backend
- `internal/adapters/<city>/adapter.go` (new/modified) - <description>
- WebSocket or registry changes

### Infrastructure
- Dockerfile changes
- CI/CD pipeline updates
- Environment variables

## Data Flow
<Describe how data flows through the system, especially for adapter changes>

## Error Handling
<How will errors be handled? Include AdapterError types if applicable>

## Performance Considerations
<Polling intervals, caching, WebSocket broadcast rates>

## Security Considerations
<API key handling, rate limiting, input validation>
```

### 5. Generate Tasks

Create `tasks.md` with:

```markdown
# Tasks: <Change Title>

## 1. Backend
- [ ] 1.1 <Specific backend task>
- [ ] 1.2 <Specific backend task>

## 2. Frontend
- [ ] 2.1 <Specific frontend task>
- [ ] 2.2 <Specific frontend task>

## 3. Testing
- [ ] 3.1 Write unit tests
- [ ] 3.2 Write e2e tests
- [ ] 3.3 Manual testing checklist

## 4. Documentation
- [ ] 4.1 Update README.md
- [ ] 4.2 Add changelog entry
```

## Project-Specific Rules

From `openspec/config.yaml`:

### Proposal Rules
- Include which hub(s) are affected (Jakarta, Istanbul, Switzerland, Japan, Malaysia cities, or global)
- Identify if the change affects landing page, hub platform, or backend
- Note any API/data source dependencies

### Spec Rules
- Use Given/When/Then format for scenarios
- Specify which transit modes are affected (Bus, Rail, Ferry, Metro, Monorail, Tram)
- Include accessibility requirements where applicable

### Design Rules
- Reference existing component patterns in the codebase
- Include Mapbox layer considerations for map-related changes
- Note Docker/deployment implications

### Task Rules
- Group by component (frontend, backend, infrastructure)
- Include test tasks for Playwright e2e coverage

## Tech Stack Context

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Three.js/GLSL (landing), Mapbox GL JS (hubs)
- **Backend**: Go, Fastify (Node.js), WebSocket
- **Data**: Postgres (PostGIS), Redis for pub/sub
- **Dev Infra**: Docker, docker-compose, GitHub Actions CI/CD
- **Deployment**: Docker → Docker Hub, Cloudflare (DNS + WAF)
- **Security**: TruffleHog (secret scanning), Trivy (container scanning)
- **Style**: Dark premium enterprise aesthetic, mobile-responsive
- **Hubs**: Jakarta, Istanbul, Switzerland, Japan, Malaysia (KL, Penang, Kuantan, +9 BAS.MY cities)

## Output

After generating all artifacts, provide a summary:

```
✓ Created OpenSpec change: <change-name>

📁 Location: openspec/changes/<change-name>/

📄 Artifacts Generated:
  - proposal.md        (Intent, scope, approach)
  - specs/             (Delta specs by domain)
    ├── <domain>/spec.md
    └── ...
  - design.md          (Technical approach, architecture)
  - tasks.md           (Implementation checklist)

🚀 Next Steps:
  1. Review the generated artifacts
  2. Edit as needed
  3. Run: /opsx:apply <change-name> to begin implementation
```

## Tips

- Use descriptive kebab-case names: `add-penang-ferry`, `fix-websocket-reconnect`, `refactor-adapter-registry`
- Keep proposals focused - one logical change per proposal
- Delta specs should describe behavior, not implementation details
- Include AdapterError handling for all adapter changes
- Always specify poll intervals for new adapters (default: 30s)
- For map changes, note Mapbox layer and source implications
- Tasks should be small enough to complete in one session
- Test as you go - don't leave all testing for the end

## Examples

### Example 1: New Malaysia Adapter

**Input**: "Add KTMB train adapter for Malaysia"

**Generated**:
- `proposal.md` - Intent: Add KTMB rail adapter for Malaysian trains
- `specs/adapter/spec.md` - Delta spec with KTMBAdapter requirements
- `design.md` - Technical approach using BaseAdapter, GTFS-RT parser
- `tasks.md` - Steps: Create adapter, register in main.go, test

### Example 2: Frontend Map Fix

**Input**: "Fix map vehicle marker z-index for Kuala Lumpur hub"

**Generated**:
- `proposal.md` - Intent: Fix marker rendering order
- `specs/frontend/spec.md` - Delta spec for marker visibility
- `design.md` - Mapbox layer ordering solution
- `tasks.md` - Update HubMapOSM.tsx, test on KL hub

## Integration with Existing Workflow

This skill complements the existing OpenSpec workflow:
- `/opsx:explore` - Explore ideas first (use this skill)
- `/opsx:propose` - Generate formal change (this skill)
- `/opsx:apply` - Implement the change
- `/opsx:archive` - Archive completed changes

## Error Handling

If the change directory already exists:
- Warn the user and ask for confirmation
- Suggest a different name or offer to overwrite

If `openspec/config.yaml` is missing:
- Fall back to default OpenSpec conventions
- Warn the user that project-specific rules aren't being applied

If validation fails:
- Report which artifact failed validation
- Suggest fixes based on the error
