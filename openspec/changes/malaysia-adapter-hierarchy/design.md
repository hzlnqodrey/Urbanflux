# Design: Malaysia Adapter Hierarchy Restructure

## Context

### Current State
The Urbanflux backend currently has 13+ Malaysia transit adapters organized flat under `internal/adapters/`:
- `kualalumpur/` - Prasarana RapidKL bus/rail adapters (5 files)
- `ktmb/` - KTMB railway adapter (2 files)
- `mybas/` - BAS.MY city bus adapters (2 files, serving 10 cities)

All adapters use the `BaseAdapter` pattern from `internal/adapters/base/`, which provides GTFS-RT polling, HTTP retry logic, health management, and error handling. The adapter registry in `cmd/server/main.go` registers all adapters and streams unified telemetry via WebSocket.

### Problem
As Malaysia hub coverage expands (currently 13 hubs, more planned), the flat structure creates several issues:
1. **Scalability**: Difficult to locate adapters for specific cities
2. **Onboarding**: New contributors must scan flat directory to understand organization
3. **Multi-country vision**: No pattern for organizing adapters by country
4. **Hub-operator relationship**: Unclear which operators serve which hubs

### Constraints
- **Go module path**: Must remain `github.com/urbanflux/hubs-backend` (no breaking changes to `go.mod`)
- **Adapter interface**: `HubAdapter` interface and `BaseAdapter` implementation unchanged
- **Frontend compatibility**: No WebSocket protocol changes (telemetry format stable)
- **Deployment**: Single binary deployment via Docker, must recompile without manual steps

### Stakeholders
- **Backend developers**: Need clear code organization for maintaining 13+ adapters
- **Frontend developers**: Need stable hub IDs and telemetry format
- **DevOps**: Need smooth deployment with minimal downtime
- **Future contributors**: Need intuitive structure for adding new countries/hubs

## Goals / Non-Goals

**Goals:**
1. Organize Malaysia adapters by geographical hierarchy: `malaysia/<hub>/<operator>/`
2. Maintain backward compatibility with existing telemetry format and WebSocket protocol
3. Enable seamless addition of new Malaysian cities and operators
4. Establish pattern for future country expansions (Indonesia, Thailand, etc.)
5. Integrate with existing Malaysia GTFS-RT feeds from `api.data.gov.my`
6. Provide mock data fallback for development and API outage scenarios

**Non-Goals:**
1. Changing the `HubAdapter` interface or `BaseAdapter` implementation
2. Modifying the WebSocket protocol or telemetry schema
3. Database schema changes (no persistence layer modifications)
4. Frontend map rendering changes (Mapbox layers unchanged)
5. Adding new transit modes beyond existing constants (BUS, RAIL, METRO, etc.)
6. Multi-region deployment (still single binary deployment)

## Decisions

### 1. Directory Structure: Country → Hub → Operator

**Decision**: Organize adapters as `internal/adapters/malaysia/<hub>/<operator>/`

**Rationale:**
- **Country-level**: Enables future expansion to Indonesia, Thailand, Singapore
- **Hub-level**: Groups operators by geographic service area (e.g., Kuala Lumpur has Prasarana + KTMB)
- **Operator-level**: Separates distinct transit companies (Prasarana, KTMB, BAS.MY)

**Structure:**
```
internal/adapters/
├── base/                    # BaseAdapter (unchanged)
├── jakarta/                 # Indonesia (future)
└── malaysia/
    ├── kualalumpur/
    │   ├── prasarana/       # RapidKL bus/rail/MRT feeder
    │   └── ktmb/            # KTM Komuter, ETS, intercity
    ├── penang/
    │   └── prasarana/       # Penang Rapid Bus
    ├── kuantan/
    │   └── prasarana/       # Kuantan Rapid Bus
    ├── kangar/
    │   └── mybas/           # BAS.MY Kangar city bus
    ├── alor-setar/
    │   └── mybas/           # BAS.MY Alor Setar city bus
    └── ...                  # (9 more BAS.MY cities)
```

**Alternatives Considered:**
- **Flat under `malaysia/`**: Rejected - loses hub-operator relationship
- **Operator-first (`malaysia/prasarana/kualalumpur/`)**: Rejected - harder to find all adapters for a specific hub
- **Mode-first (`malaysia/bus/kualalumpur/`)**: Rejected - many operators have multiple modes (Prasarana has bus + rail)

### 2. Package Naming Convention

**Decision**: Use directory hierarchy as Go package name

**Example:**
- Directory: `internal/adapters/malaysia/kualalumpur/prasarana/`
- Package: `prasarana`
- Import: `github.com/urbanflux/hubs-backend/internal/adapters/malaysia/kualalumpur/prasarana`

**Rationale:**
- Follows Go standard library conventions (e.g., `net/http`, `encoding/json`)
- Short package names in code (`prasarana.NewBusAdapter()`)
- Full path in `go.mod` avoids conflicts

**Alternatives Considered:**
- **Full path packages** (`malaysiakualalumpurprasarana`): Rejected - violates Go naming conventions
- **Hub-level packages** (`kualalumpur`): Rejected - doesn't scale when multiple operators per hub

### 3. Prasarana Multi-Hub Adapter Strategy

**Decision**: Separate adapter files for each Prasarana hub (KL, Penang, Kuantan)

**Implementation:**
```
malaysia/kualalumpur/prasarana/
├── rapid_bus.go          # KL bus adapter
├── rapid_rail.go         # KL rail adapter
└── rapid_bus_mrtfeeder.go # KL MRT feeder adapter

malaysia/penang/prasarana/
└── rapid_bus.go          # Penang bus adapter

malaysia/kuantan/prasarana/
└── rapid_bus.go          # Kuantan bus adapter
```

**Rationale:**
- Each hub has unique GTFS-RT endpoint URL
- Hub-specific configuration (polling interval, vehicle counts)
- Clear separation of concerns
- Easy to add new Prasarana cities

**Alternatives Considered:**
- **Single unified Prasarana adapter**: Rejected - would require complex endpoint multiplexing
- **Package-level separation (`malaysia/prasarana/kualalumpur/`)**: Rejected - violates hub-first hierarchy

### 4. Mock Data Architecture

**Decision**: Create `MockAdapter` in `base/` that generates realistic telemetry

**Implementation:**
```go
// internal/adapters/base/mock_adapter.go
type MockAdapter struct {
    *base.BaseAdapter
    hub          string
    mode         string
    operator     string
    vehicleCount int
    boundingBox  BoundingBox
}

func NewMockAdapter(hub, mode, operator string, cfg AdapterConfig) *MockAdapter
```

**Features:**
- Generates vehicles along realistic routes (based on hub bounding box)
- Simulates movement between positions (interpolated lat/lon)
- Randomizes occupancy, status, bearing
- Configurable via environment variables:
  - `MOCK_DATA=true` - Enable mock mode
  - `MOCK_VEHICLE_COUNT=50` - Vehicles per hub
  - `MOCK_UPDATE_INTERVAL=10s` - Position update frequency

**Rationale:**
- Reuses `BaseAdapter` infrastructure (health, errors, streaming)
- Toggle between live/mock via config (no code changes)
- Supports development without API dependencies
- Auto-fallback when live APIs fail consecutively

**Alternatives Considered:**
- **Mock data in frontend**: Rejected - doesn't test backend telemetry pipeline
- **Static JSON files**: Rejected - doesn't simulate real-time movement
- **Separate mock service**: Rejected - adds deployment complexity

### 5. GTFS-RT Endpoint Configuration

**Decision**: Hardcode endpoints as constants in adapter files, allow override via config

**Example:**
```go
const (
    klBusEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl"
)

func NewKualaLumpurBusAdapter(cfg adapters.AdapterConfig) *KualaLumpurBusAdapter {
    if cfg.BaseURL == "" {
        cfg.BaseURL = klBusEndpoint
    }
    // ...
}
```

**Rationale:**
- Official endpoints are stable (provided by Malaysian government)
- Documentation via constants in code
- Flexibility for testing/local development
- No API keys needed (public access)

**Alternatives Considered:**
- **Environment variables**: Rejected - adds deployment complexity for stable URLs
- **Config file**: Rejected - overkill for static URLs
- **Runtime discovery**: Rejected - no Malaysian API discovery service exists

### 6. Import Path Migration Strategy

**Decision**: Single commit to move all adapters and update imports atomically

**Process:**
1. Create new directory structure under `malaysia/`
2. Move adapter files to new locations
3. Update all import paths in:
   - `cmd/server/main.go`
   - All `*_test.go` files
   - Any inter-adapter imports (currently none)
4. Run `go mod tidy` to verify no broken imports
5. Run full test suite to ensure no regressions

**Rationale:**
- Atomic change reduces deployment risk
- Git preserves file history (move is tracked)
- No intermediate state with broken imports
- Easy to rollback if issues arise

**Alternatives Considered:**
- **Gradual migration (adapter by adapter)**: Rejected - would require temporary import path aliases
- **Soft migration (deprecate old paths)**: Rejected - unnecessary complexity for single-deployment system

### 7. Hub ID Alignment

**Decision**: Use kebab-case hub IDs matching frontend configuration

**Mapping:**
- Backend adapter hub field: `"kuala-lumpur"`
- Frontend hub config key: `"kuala-lumpur"`
- Frontend display name: `"Kuala Lumpur Hub"`

**Rationale:**
- Consistent identifier across backend/frontend
- URL-safe (kebab-case)
- Human-readable display names separate from IDs

**Alternatives Considered:**
- **snake_case**: Rejected - less URL-friendly
- **camelCase**: Rejected - inconsistent with frontend conventions

### 8. Frontend Configuration Changes

**Decision**: No breaking changes to `hub-config.ts` structure

**Updates:**
- Verify all 13 Malaysia hub IDs exist
- Ensure `modeColors` use shared `MALAYSIA_MODE_COLORS` palette
- Validate viewport coordinates for each hub
- Add any missing hubs from backend

**Rationale:**
- Frontend already configured for Malaysia hubs
- Only verification needed, not structural changes
- Telemetry format unchanged (WebSocket protocol stable)

## Risks / Trade-offs

### Risk 1: Import Path Breakage
**Risk**: Moving adapters breaks import paths in main.go and test files

**Mitigation**:
- Atomic commit with all imports updated
- Run `go build ./...` to verify compilation
- Run full test suite before committing
- Add pre-commit hook to check import paths

### Risk 2: Git History Loss
**Risk**: Moving files may lose commit history if done incorrectly

**Mitigation**:
- Use `git mv` to move files (preserves history)
- Verify with `git log --follow` after move
- Avoid `git add .` after file system moves

### Risk 3: Test Failures After Move
**Risk**: Test imports break due to relative package references

**Mitigation**:
- Update all test imports to use full module paths
- Run `go test ./...` after restructure
- Update CI/CD to catch test failures pre-deploy

### Risk 4: Frontend Hub ID Mismatch
**Risk**: Backend hub IDs don't match frontend configuration

**Mitigation**:
- Audit all hub IDs in `cmd/server/main.go` against `hub-config.ts`
- Add integration test to verify hub ID consistency
- Document hub ID naming convention in CLAUDE.md

### Risk 5: Mock Data Quality
**Risk**: Mock data doesn't reflect real-world vehicle behavior

**Mitigation**:
- Use real route coordinates for positioning
- Validate mock telemetry with same checks as live data
- Compare mock data distributions with live data (speed, occupancy)
- Allow manual override of specific vehicle positions for testing

### Risk 6: API Rate Limiting
**Risk**: api.data.gov.my may rate limit excessive polling from 13+ adapters

**Mitigation**:
- Default poll interval 30s (configurable)
- Stagger adapter startup to avoid thundering herd
- Implement exponential backoff on HTTP 429
- Monitor health endpoint for rate limit errors

### Risk 7: Deployment Downtime
**Risk**: Backend recompilation causes WebSocket disconnection

**Mitigation**:
- Blue-green deployment (run old and new binaries briefly)
- Frontend auto-reconnects with exponential backoff (existing behavior)
- Deploy during low-traffic hours (Malaysian night: UTC 14:00-22:00)

## Migration Plan

### Phase 1: Backend Restructure (Development)
1. Create new directory structure:
   ```bash
   mkdir -p internal/adapters/malaysia/{kualalumpur,penang,kuantan}/{prasarana,ktmb,mybas}
   ```
2. Move adapter files using `git mv`:
   ```bash
   git mv internal/adapters/kualalumpur/* internal/adapters/malaysia/kualalumpur/prasarana/
   git mv internal/adapters/ktmb/* internal/adapters/malaysia/kualalumpur/ktmb/
   # ... (repeat for all adapters)
   ```
3. Update import paths in `cmd/server/main.go`:
   ```go
   import (
       "github.com/urbanflux/hubs-backend/internal/adapters/malaysia/kualalumpur/prasarana"
       "github.com/urbanflux/hubs-backend/internal/adapters/malaysia/kualalumpur/ktmb"
       // ...
   )
   ```
4. Update test file imports
5. Run `go mod tidy`
6. Verify compilation: `go build ./...`
7. Run tests: `go test ./...`

### Phase 2: Mock Data Implementation (Development)
1. Create `internal/adapters/base/mock_adapter.go`
2. Implement vehicle generation along routes
3. Add environment variable parsing (`MOCK_DATA`, `MOCK_VEHICLE_COUNT`)
4. Add auto-fallback logic after 5 consecutive failures
5. Test mock data generation with `MOCK_DATA=true go run cmd/server/main.go`

### Phase 3: Frontend Verification (Development)
1. Audit `frontend/src/lib/hub-config.ts` for all 13 Malaysia hubs
2. Verify hub IDs match backend adapter configurations
3. Validate viewport coordinates for each hub
4. Test WebSocket connection with restructured backend
5. Verify vehicle markers render correctly on map

### Phase 4: Documentation Updates (Development)
1. Update `CLAUDE.md` with new adapter hierarchy
2. Document Malaysia GTFS-RT endpoints
3. Add mock data configuration guide
4. Update deployment guide with recompile steps

### Phase 5: Deployment (Production)
1. **Pre-deploy**:
   - Run full test suite
   - Build Docker image locally
   - Test mock data mode
2. **Deploy**:
   - Build new Docker image
   - Push to registry
   - Update production container
   - Monitor `/health` endpoint
3. **Post-deploy**:
   - Verify all Malaysia hubs streaming
   - Check logs for import errors
   - Monitor WebSocket connections
4. **Rollback Plan**:
   - Revert to previous Docker image
   - No database rollback needed (no schema changes)

## Open Questions

### Q1: Should we add a country-level adapter registry?
**Question**: Create separate `MalaysiaAdapterRegistry` to manage all Malaysia adapters?

**Context**: Currently all adapters register in global registry. Country-level registry could group Malaysia adapters for health checks, metrics.

**Options**:
- A) Add `MalaysiaAdapterRegistry` wrapper
- B) Keep using global registry (current approach)

**Recommendation**: B - Keep global registry. Country-level registry adds complexity without clear benefit. Health endpoint already groups by adapter name (includes hub/operator).

### Q2: How should we handle multi-city operators (KTMB serves entire peninsular Malaysia)?
**Question**: KTMB serves multiple hubs (Kuala Lumpur, Ipoh, Seremban, Johor Bahru). Should we create separate KTMB adapters per hub or single adapter with multi-hub telemetry?

**Context**: Current KTMB adapter uses hub ID "kuala-lumpur" for all trains, regardless of actual location.

**Options**:
- A) Single KTMB adapter, infer hub from train coordinates
- B) Separate KTMB adapter per hub (requires route coordinate mapping)
- C) Keep KTMB under "kuala-lumpur" hub (current approach)

**Recommendation**: A - Single KTMB adapter with coordinate-based hub inference. Use bounding boxes to determine which hub a train is currently in. Most accurate representation of cross-hub service.

### Q3: Should mock data support route-specific vehicle generation?
**Question**: Should mock generators create vehicles along specific transit routes (e.g., KL Sentral → Bangsar) or random positions within hub bounds?

**Context**: Real vehicles follow fixed routes. Random positions less realistic but simpler to implement.

**Options**:
- A) Route-specific positioning (requires GTFS static data)
- B) Bounding box randomization (current design)
- C) Hybrid: Define key corridors manually

**Recommendation**: B - Bounding box randomization for MVP. GTFS static data integration (route shapes) deferred to future enhancement. Hybrid approach good middle-ground if time permits.

### Q4: How should we handle BAS.MY adapters for cities without GTFS-RT coverage?
**Question**: Some BAS.MY cities may not have live GTFS-RT feeds yet. Should we create mock adapters or wait for live data?

**Context**: Proposal mentions 10 BAS.MY cities, but api.data.gov.my may not have all cities live yet.

**Options**:
- A) Create mock adapters for all cities immediately
- B) Only create adapters for cities with confirmed live data
- C) Hybrid: Live adapters where available, mock where not

**Recommendation**: C - Verify live data availability for each city during implementation. Use mock data generator for cities without live feeds. Document which cities are live vs. mock in README.
