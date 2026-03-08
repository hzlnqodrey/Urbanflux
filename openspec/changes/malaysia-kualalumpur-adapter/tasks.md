# Tasks

## 1. Dependencies
- [x] 1.1 Add `google.golang.org/protobuf` to `go.mod`
- [x] 1.2 Add `github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs` to `go.mod`
- [x] 1.3 Run `go mod tidy` to resolve dependency graph

## 2. Shared GTFS-RT Parser
- [x] 2.1 Create `internal/adapters/gtfsrt/parser.go` — `Parse(data []byte, hub, mode, operator string) ([]models.UrbanfluxTelemetry, []adapters.AdapterError)`
- [x] 2.2 Implement VehiclePosition → UrbanfluxTelemetry mapping (lat, lon, speed m/s→km/h, bearing, vehicle ID, route ID, timestamp)
- [x] 2.3 Handle invalid entities (skip + return AdapterError per skip)
- [x] 2.4 Create `internal/adapters/gtfsrt/parser_test.go` — test with constructed protobuf fixtures: valid feed, mixed valid/invalid, empty feed, corrupt bytes

## 3. Kuala Lumpur Base Adapter Logic
- [x] 3.1 Create `internal/adapters/kualalumpur/adapter_base.go` — shared HTTP polling logic with retry, backoff, health state machine
- [x] 3.2 Implement `poll()` method: HTTP GET → read body → return raw bytes or error
- [x] 3.3 Implement retry loop with exponential backoff (base from AdapterConfig.RetryBackoff)
- [x] 3.4 Implement health state transitions: CONNECTED ↔ DEGRADED ↔ DISCONNECTED

## 4. Kuala Lumpur Bus Adapter
- [x] 4.1 Create `internal/adapters/kualalumpur/rapid_bus.go` — `KualaLumpurBusAdapter` implementing `HubAdapter`
- [x] 4.2 Constructor `NewKualaLumpurBusAdapter(cfg)` with BaseURL defaulting to `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl`
- [x] 4.3 Start() → ticker loop → poll() → gtfsrt.Parse() → stream telemetry
- [x] 4.4 Create `internal/adapters/kualalumpur/rapid_bus_test.go` — test adapter lifecycle, mock HTTP responses

## 5. Kuala Lumpur Rail Adapter
- [x] 5.1 Create `internal/adapters/kualalumpur/rapid_rail.go` — `KualaLumpurRailAdapter` implementing `HubAdapter`
- [x] 5.2 Constructor with BaseURL defaulting to `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl`
- [x] 5.3 Same pattern as bus adapter, mode="RAIL"

## 6. Server Registration
- [x] 6.1 Update `cmd/server/main.go` — create and register `KualaLumpurBusAdapter` and `KualaLumpurRailAdapter` with appropriate configs
- [x] 6.2 Add environment variable support for overriding BaseURL (for testing with mock servers)

## 7. Tests & Verification
- [x] 7.1 Run `go build ./...` — verify clean compilation ✅
- [x] 7.2 Run `go test ./... -v` — verify all tests pass (38/38) ✅
- [x] 7.3 Run `go vet ./...` — verify no Go vet issues ✅
