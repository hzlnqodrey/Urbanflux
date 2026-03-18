# Design: Kuala Lumpur Focus

## Context

**Current State:**
The backend currently runs 14 adapters:
- 1 Jakarta adapter (Transjakarta)
- 1 Kuala Lumpur mock adapter
- 2 Prasarana adapters (Penang, Kuantan)
- 10 BAS.MY city bus adapters (Kangar, Alor Setar, Kota Bharu, Kuala Terengganu, Ipoh, Seremban A/B, Melaka, Johor Bahru, Kuching)

The frontend currently exposes 12 Malaysia hub configurations in `hub-config.ts`.

**Problem:**
The multi-hub Malaysia approach adds operational complexity without proportional user value. Most BAS.MY feeds have sparse vehicle coverage, especially outside peak hours. Monitoring and maintaining 12 adapters for low-traffic regions is inefficient.

**Constraints:**
- Backend uses Go with adapter pattern (HubAdapter interface)
- Frontend uses TypeScript/React with hub-config.ts for hub metadata
- CI/CD runs on every push to `urbanflux-hubs/**`
- Deployment is containerized (Docker) with health checks

## Goals / Non-Goals

**Goals:**
- Reduce backend adapter count from 14 to 3 (Jakarta + KL Prasarana + KL KTMB)
- Reduce Malaysia hub configs from 12 to 1 (Kuala Lumpur)
- Remove `internal/adapters/mybas/` directory entirely
- Simplify `internal/adapters/malaysia/` to only contain `kualalumpur/`
- Maintain existing Prasarana and KTMB adapter implementations for KL

**Non-Goals:**
- Changes to Jakarta hub (unaffected)
- Changes to WebSocket protocol or telemetry format
- Database schema changes (no persistence layer affected)
- Frontend UI redesign (hub config cleanup only)

## Decisions

### 1. Remove `mybas/` root-level adapter directory

**Decision:** Delete `internal/adapters/mybas/` entirely rather than moving under `malaysia/`.

**Rationale:**
- BAS.MY serves no cities in the single-hub scope
- Keeping it anywhere would require ongoing maintenance
- Simpler to remove entirely than to partially migrate

**Alternatives Considered:**
- Move to `malaysia/kualalumpur/mybas/` — Rejected because KL doesn't use BAS.MY
- Archive to `internal/adapters/mybas.archive/` — Rejected as unnecessary clutter

### 2. Remove 11 Malaysia hub directories

**Decision:** Delete directories for alor-setar, ipoh, johor-bahru, kangar, kota-bharu, kuala-terengganu, kuantan, kuching, melaka, penang, seremban.

**Rationale:**
- These directories contain Prasarana and BAS.MY adapters that are out of scope
- Keeping Kuala Lumpur only reduces directory traversal and cognitive load
- Git history preserves code if needed for future expansion

**Alternatives Considered:**
- Soft deprecation (keep dirs, don't register) — Rejected as ongoing maintenance burden
- Create `internal/adapters/malaysia.archive/` — Rejected, overkill for this change

### 3. Replace KL mock adapter with real adapters

**Decision:** The current `kualalumpur.NewMockKualaLumpurAdapter()` is a development placeholder. Replace with separate Prasarana and KTMB adapters using `internal/adapters/malaysia/kualalumpur/prasarana/` and `ktmb/` implementations.

**Rationale:**
- Mock data is useful for development but shouldn't be production
- Real adapters already exist in the directory structure
- Aligns with the proposal's goal of "focused single-hub with Prasarana + KTMB"

**Alternatives Considered:**
- Keep mock as fallback — Rejected, adds unnecessary complexity
- Add mock mode flag — Out of scope for this change

### 4. Frontend hub config cleanup

**Decision:** Remove 11 Malaysia hub entries from `HUB_CONFIGS`, keep only `kuala-lumpur`.

**Rationale:**
- Direct mapping to backend adapter removal
- No UI changes needed; hub list dynamically populates from config
- Simplifies hub selector (if present in UI)

**Alternatives Considered:**
- Mark hubs as `disabled: true` — Rejected, still exposes metadata
- Create separate `MALAYSIA_HUBS` constant — Rejected, over-abstraction

### 5. Update `cmd/server/main.go` imports

**Decision:** Remove all non-KL Malaysia imports and registrations.

**Current imports to remove:**
```go
import (
    penangprasarana "github.com/urbanflux/hubs-backend/internal/adapters/malaysia/penang/prasarana"
    kuantanprasarana "github.com/urbanflux/hubs-backend/internal/adapters/malaysia/kuantan/prasarana"
    "github.com/urbanflux/hubs-backend/internal/adapters/mybas"
)
```

**Registrations to remove:**
```go
registry.Register(penangprasarana.NewPenangBusAdapter(myCfg))
registry.Register(kuantanprasarana.NewKuantanBusAdapter(myCfg))
registry.Register(mybas.NewMyBASKangarAdapter(myCfg))
// ... 8 more mybas adapters
```

**Rationale:**
- Clean compilation after directory removal
- Reduces adapter count in health endpoint output

## Directory Structure After

```
internal/adapters/
├── adapter.go
├── config.go
├── errors.go
├── base/
├── gtfsrt/
├── jakarta/
├── malaysia/
│   └── kualalumpur/
│       ├── prasarana/
│       │   ├── rapid_bus.go
│       │   ├── rapid_bus_mrtfeeder.go
│       │   └── rapid_rail.go
│       └── ktmb/
│           └── (ktmb adapter files)
└── registry.go
```

**Removed:**
- `mybas/` (root level)
- `malaysia/alor-setar/`
- `malaysia/ipoh/`
- `malaysia/johor-bahru/`
- `malaysia/kangar/`
- `malaysia/kota-bharu/`
- `malaysia/kuala-terengganu/`
- `malaysia/kuantan/`
- `malaysia/kuching/`
- `malaysia/melaka/`
- `malaysia/penang/`
- `malaysia/seremban/`

## Frontend Changes

**File:** `urbanflux-hubs/frontend/src/lib/hub-config.ts`

**Hub entries to remove:**
- `penang`
- `kuantan`
- `kangar`
- `alor-setar`
- `kota-bharu`
- `kuala-terengganu`
- `ipoh`
- `seremban`
- `melaka`
- `johor-bahru`
- `kuching`

**Hub entries to keep:**
- `jakarta` (unaffected)
- `kuala-lumpur` (Malaysia focus)

## Migration Plan

### Phase 1: Backend Cleanup
1. Remove 11 Malaysia hub directories using `git rm -r`
2. Remove `internal/adapters/mybas/` using `git rm -r`
3. Update `cmd/server/main.go`:
   - Remove imports for deleted adapters
   - Remove adapter registrations
   - Replace `kualalumpur.NewMockKualaLumpurAdapter()` with real Prasarana/KTMB adapters
   - Update debug endpoint adapter count (14 → 3)
4. Run `go mod tidy` to clean imports
5. Verify compilation: `go build ./...`

### Phase 2: Frontend Cleanup
1. Remove 11 hub configs from `HUB_CONFIGS`
2. Verify TypeScript compilation: `npm run build`
3. Spot-check hub selector UI (if present)

### Phase 3: Testing
1. Start backend, verify 3 adapters register
2. Query `/health` endpoint, verify KL adapters present
3. Connect WebSocket client, verify KL telemetry streams
4. Run existing tests: `go test ./...`

### Phase 4: Deployment
1. Build Docker image
2. Deploy to production
3. Monitor `/health` for adapter status

### Rollback Strategy
- Revert to previous Docker image
- Git revert is available if code rollback needed
- No data migration required (no persistence layer affected)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| KL mock adapter removed, real feeds may be sparse at night | Acceptable trade-off; real data preferred over mock. Can re-add mock mode if needed. |
| Frontend may reference removed hub IDs elsewhere | Search codebase for hub IDs before removal; TypeScript will catch at compile time |
| CI/CD path filters may need updating | Review `.github/workflows/hubs-ci.yml` for Malaysia-specific paths |
| Users expecting other Malaysia hubs | Document breaking change; this is internal refactoring, public API unaffected |

## Open Questions

1. **KTMB adapter implementation:** Does `internal/adapters/malaysia/kualalumpur/ktmb/` have a production-ready adapter, or does it need to be created?
   - **Action:** Verify during implementation. If missing, add as sub-task.

2. **Prasarana bus vs rail:** Should these be separate adapters or combined?
   - **Decision:** Keep as separate adapters (rapid_bus.go, rapid_rail.go) as currently structured.

3. **MRT Feeder buses:** Currently a separate adapter file. Should it be merged?
   - **Decision:** Keep `rapid_bus_mrtfeeder.go` separate for clarity; all under `prasarana/` directory.

4. **Hub ID hyphenation:** Backend uses `kualalumpur` (no hyphen), frontend uses `kuala-lumpur` (hyphenated).
   - **Action:** Verify this mapping is handled consistently. May need adapter name normalization in health endpoint.
