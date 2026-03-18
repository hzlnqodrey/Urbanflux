# Proposal: Malaysia Adapter Hierarchy Restructure

## Why

The current adapter architecture has Malaysia-specific adapters (RapidKL, KTMB, myBAS) scattered flat under `internal/adapters/`, making it difficult to scale as more Malaysian cities and operators are added. With 13+ Malaysia hubs already integrated and more planned, we need a clean geographical hierarchy that groups adapters by country → hub → operator. This restructure will improve maintainability, make onboarding new Malaysian operators easier, and align the codebase with the platform's multi-country vision.

## What Changes

### Backend Restructure
- **BREAKING**: Reorganize `internal/adapters/` from flat structure to geographical hierarchy:
  - New structure: `internal/adapters/malaysia/<hub>/` (e.g., `malaysia/kualalumpur/`, `malaysia/penang/`)
  - Move existing adapters: `kualalumpur/` → `malaysia/kualalumpur/prasarana/`, `ktmb/` → `malaysia/kualalumpur/ktmb/`, `mybas/` → `malaysia/<city>/mybas/`
  - Update all import paths in `cmd/server/main.go` and test files

### Frontend Hub Registry Enhancement
- Add hub metadata for newly structured Malaysia hubs in `frontend/src/lib/hub-config.ts`
- Ensure hub IDs align with new backend structure (e.g., `kuala-lumpur`, `penang`, `kuantan`)

### Data Source Integration
- Verify and document existing GTFS-RT endpoints from `api.data.gov.my`:
  - **Prasarana**: RapidKL bus/rail/MRT feeder, Penang bus, Kuantan bus
  - **KTMB**: National railway (KTM Komuter, ETS, intercity)
  - **BAS.MY**: City bus networks (Kangar, Alor Setar, Kota Bharu, etc.)
- Create comprehensive mock data generator for development/testing when APIs are unavailable

### Documentation Updates
- Update `CLAUDE.md` with new adapter hierarchy structure
- Document Malaysia-specific adapter patterns for future operator onboarding

## Capabilities

### New Capabilities
- `malaysia-adapter-hierarchy`: Geographical adapter organization by country → hub → operator
- `malaysia-data-sources`: Integration with Malaysia's official GTFS-RT feeds (api.data.gov.my)
- `mock-data-generator`: Fallback mock data system for development and API outage scenarios

### Modified Capabilities
- `adapter-architecture`: Core adapter interface and registry remain unchanged, but import paths and package structure are modified

## Impact

### Affected Code
- **Backend**:
  - `urbanflux-hubs/backend/internal/adapters/` (complete restructure)
  - `urbanflux-hubs/backend/cmd/server/main.go` (import path updates)
  - All adapter test files (import path updates)
  - `urbanflux-hubs/backend/go.mod` (no changes needed, module path remains same)

- **Frontend**:
  - `urbanflux-hubs/frontend/src/lib/hub-config.ts` (hub metadata updates)
  - No breaking changes to WebSocket protocol or telemetry format

### Dependencies
- **External APIs**:
  - `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl` (RapidKL bus)
  - `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl` (RapidKL rail)
  - `https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb` (KTMB trains)
  - `https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas` (BAS.MY buses)

- **No new dependencies**: Uses existing GTFS-RT parsing infrastructure

### Migration Notes
- Existing deployments will need to recompile and redeploy backend binary
- Frontend changes are backward compatible (no WebSocket protocol changes)
- Database schema changes: None (telemetry model unchanged)
- API changes: None (HTTP endpoints `/ws` and `/health` unchanged)

### Testing Strategy
- Unit tests for all moved adapters (update import paths)
- Integration tests for Malaysia-specific data flows
- E2E tests using mock data generator
- Verify all 13+ Malaysia hubs stream correctly after restructure

### Benefits
- **Scalability**: Easy to add new Malaysian operators under appropriate hub folders
- **Maintainability**: Clear geographical organization reduces cognitive load
- **Onboarding**: New contributors can quickly locate country/hub-specific code
- **Consistency**: Establishes pattern for future country expansions (e.g., Indonesia, Thailand)
