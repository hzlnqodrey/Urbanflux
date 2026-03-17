# Proposal: Malaysia All GTFS-RT Feeds

## Intent

Expand the Malaysia hub from the existing 2 KL adapters to the **full set of publicly available GTFS-RT feeds** from `api.data.gov.my`. This brings Urbanflux to comprehensive real-time coverage of Malaysia's national public transport — trains, buses, and rail across 10+ cities — eliminating any need for mock data on the Malaysia hub.

**Hub hierarchy:** Malaysia → sub-hubs per city (kuala-lumpur, penang, ipoh, johor-bahru, etc.)

## Scope

**In scope:**
- Add **KTMB** (national railway) adapter — `vehicle-position/ktmb`
- Add **3 new Prasarana adapters** — MRT Feeder buses, Rapid Penang, Rapid Kuantan
- Add **10 BAS.MY city bus adapters** — Kangar, Alor Setar, Kota Bharu, Kuala Terengganu, Ipoh, Seremban A+B, Melaka, Johor Bahru, Kuching
- Register all 15 new adapters in `main.go`
- Unit tests for new adapter constructors and endpoint defaults
- Leverages existing `baseAdapter` and `gtfsrt.Parse()` — no new dependencies

**Out of scope:**
- Frontend hub hierarchy/grouping changes (separate change)
- Trip updates and service alerts (data.gov.my plans for 2026)
- Redis caching
- GTFS Static schedule data integration

**Affected hubs:** Malaysia (kuala-lumpur, penang, kuantan, kangar, alor-setar, kota-bharu, kuala-terengganu, ipoh, seremban, melaka, johor-bahru, kuching)
**Affected component:** Backend only
**API dependency:** `api.data.gov.my` GTFS-RT (keyless, protobuf, 30s update)

## Approach

1. Add new Prasarana adapter files in `internal/adapters/kualalumpur/` — reuses existing `baseAdapter`
2. Create `internal/adapters/ktmb/` for KTMB trains — new `baseAdapter` instance
3. Create `internal/adapters/mybas/` for all BAS.MY city adapters — each is ~25 lines
4. Register all in `main.go` with `DefaultConfig()`
5. Add unit tests for constructor defaults and names
