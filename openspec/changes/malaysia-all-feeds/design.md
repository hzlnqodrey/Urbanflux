# Design: Malaysia All GTFS-RT Feeds

## Technical Approach

Leverage the existing `baseAdapter` pattern (HTTP polling + GTFS-RT parser) to rapidly add all remaining Malaysia feeds. Since every endpoint uses the same GTFS-RT protobuf format and the same `baseAdapter` code, each new adapter is ~25-35 lines.

## Architecture Decisions

### Decision: Refactor baseAdapter to a Shared Package
Currently `baseAdapter` lives in `internal/adapters/kualalumpur/`. Since KTMB and BAS.MY adapters need the same logic, we move it to a shared location or make it importable. **Chosen approach:** Keep it in `kualalumpur/` for Prasarana adapters; new packages (`ktmb/`, `mybas/`) will embed their own `baseAdapter` instance by importing the common adapters package fields and using a local copy, OR we extract `baseAdapter` to a common package. Given semantic clarity, we'll **extract `baseAdapter` to `internal/adapters/base/`** so all adapters can embed it.

### Decision: Hub Naming Convention
Use lowercase kebab-case city/region names: `kuala-lumpur`, `penang`, `kuantan`, `kangar`, `alor-setar`, `kota-bharu`, `kuala-terengganu`, `ipoh`, `seremban`, `melaka`, `johor-bahru`, `kuching`. The country grouping (Malaysia) will be handled at the frontend/config level.

### Decision: One File Per City for BAS.MY
Each city adapter gets its own file in `internal/adapters/mybas/` for independent lifecycle management. A shared `mybas_base.go` is unnecessary since each is just a constructor.

## Architecture Diagram

```
api.data.gov.my (GTFS-RT Protobuf, keyless, 30s updates)
  │
  ├── /vehicle-position/ktmb
  │     → KTMBAdapter (Hub: "kuala-lumpur", Mode: RAIL, Operator: "KTMB")
  │
  ├── /vehicle-position/prasarana?category=rapid-bus-kl       [EXISTING]
  ├── /vehicle-position/prasarana?category=rapid-rail-kl      [EXISTING]
  ├── /vehicle-position/prasarana?category=rapid-bus-mrtfeeder [NEW]
  ├── /vehicle-position/prasarana?category=rapid-bus-penang    [NEW]
  ├── /vehicle-position/prasarana?category=rapid-bus-kuantan   [NEW]
  │     → KualaLumpur/Penang/Kuantan adapters via baseAdapter
  │
  ├── /vehicle-position/mybas-kangar        → MyBAS Kangar     (Hub: "kangar")
  ├── /vehicle-position/mybas-alor-setar    → MyBAS Alor Setar (Hub: "alor-setar")
  ├── /vehicle-position/mybas-kota-bharu    → MyBAS Kota Bharu (Hub: "kota-bharu")
  ├── /vehicle-position/mybas-kuala-terengganu → MyBAS KT      (Hub: "kuala-terengganu")
  ├── /vehicle-position/mybas-ipoh          → MyBAS Ipoh       (Hub: "ipoh")
  ├── /vehicle-position/mybas-seremban-a    → MyBAS Seremban A (Hub: "seremban")
  ├── /vehicle-position/mybas-seremban-b    → MyBAS Seremban B (Hub: "seremban")
  ├── /vehicle-position/mybas-melaka        → MyBAS Melaka     (Hub: "melaka")
  ├── /vehicle-position/mybas-johor         → MyBAS JB         (Hub: "johor-bahru")
  └── /vehicle-position/mybas-kuching       → MyBAS Kuching    (Hub: "kuching")
        │
        ▼
  AdapterRegistry (fan-in all 17 adapters)
        │
        ▼
  WebSocket Hub → Frontend
```

## File Changes

### New Files
- `internal/adapters/base/adapter.go` — extracted baseAdapter from kualalumpur package
- `internal/adapters/ktmb/ktmb.go` — KTMB train adapter
- `internal/adapters/ktmb/ktmb_test.go` — constructor + lifecycle tests
- `internal/adapters/kualalumpur/rapid_bus_mrtfeeder.go` — MRT feeder bus adapter
- `internal/adapters/kualalumpur/rapid_bus_penang.go` — Penang bus adapter
- `internal/adapters/kualalumpur/rapid_bus_kuantan.go` — Kuantan bus adapter
- `internal/adapters/mybas/mybas.go` — BAS.MY constructor factory + all city adapters
- `internal/adapters/mybas/mybas_test.go` — constructor tests

### Modified Files
- `internal/adapters/kualalumpur/adapter_base.go` → refactored to use shared base (or exported)
- `cmd/server/main.go` — register all 15 new adapters

### Docker Implications
- No new dependencies, no image changes needed
- More adapters = more concurrent HTTP connections (~15 extra)
