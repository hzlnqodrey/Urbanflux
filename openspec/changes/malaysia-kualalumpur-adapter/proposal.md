# Proposal: Malaysia Kuala Lumpur Adapter

## Intent

Integrate Malaysia's **api.data.gov.my GTFS-RT** public API to bring real-time vehicle position data from Kuala Lumpur's public transport network into Urbanflux. This is the **first real-world adapter** (replacing mock data) and establishes the GTFS-RT parsing pattern that will be reused by Japan and other hubs.

KL is the ideal first integration because:
- **No API key required** — zero authentication friction
- **Standard GTFS-RT protobuf format** — well-documented, Go bindings available
- **30-second update interval** — real-time enough for live dashboards
- **Multiple transport modes** — Bus (Rapid KL), Rail (LRT/MRT via Prasarana), Train (KTMB)

## Scope

**In scope:**
- Add `google.golang.org/protobuf` and GTFS-RT proto definitions as dependencies
- Create a shared `gtfsrt` package for parsing GTFS-RT protobuf feeds into `UrbanfluxTelemetry`
- Create `KualaLumpurBusAdapter` for Rapid KL bus vehicle positions (`rapid-bus-kl`)
- Create `KualaLumpurRailAdapter` for LRT/MRT/Monorail vehicle positions (`rapid-rail-kl`)
- Wire both adapters into the `AdapterRegistry` in `main.go`
- Proper error handling for network, parse, and validation failures
- Unit tests for GTFS-RT parsing and adapter lifecycle

**Out of scope:**
- KTMB (KTM Komuter) train adapter — data availability is intermittent, defer to future PR
- Rapid Penang / myBAS Johor adapters — future PR, same GTFS-RT parser will be reused
- Trip updates and service alerts — `data.gov.my` plans these for 2026
- Frontend map changes for KL (separate change)
- Redis caching

## Approach

1. **Add GTFS-RT protobuf support** — vendor the `gtfs-realtime.proto` spec and generate Go bindings, or use the official `github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs` package
2. **Create shared `internal/adapters/gtfsrt/parser.go`** — converts GTFS-RT `VehiclePosition` entities into `UrbanfluxTelemetry` structs, reusable by any GTFS-RT adapter worldwide
3. **Create `internal/adapters/kualalumpur/rapid_bus.go`** — polls `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl` every 30s, decodes protobuf, maps to telemetry
4. **Create `internal/adapters/kualalumpur/rapid_rail.go`** — polls `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl`, same pattern
5. **Register both in `main.go`** alongside Jakarta
6. **Test** shared parser with fixture data, test adapter lifecycle
