# Tasks

## 1. Core Types & Models
- [x] 1.1 Expand `internal/models/telemetry.go` — add `Hub`, `Mode`, `Operator`, `Occupancy`, `DelaySeconds`, `ErrorInfo` fields with JSON tags
- [x] 1.2 Add transport mode constants (`BUS`, `RAIL`, `METRO`, `FERRY`, `MONORAIL`, `TRAM`) and occupancy constants in `telemetry.go`
- [x] 1.3 Add a `Validate()` method on `UrbanfluxTelemetry` that checks required fields (ID, RouteID, Hub, Mode, Lat, Lon)

## 2. Adapter Error Handling
- [x] 2.1 Create `internal/adapters/errors.go` — define `AdapterError` struct with `Severity`, `Kind`, `Message`, `AdapterName`, `Timestamp`, `Retryable`
- [x] 2.2 Add severity constants: `INFO`, `WARNING`, `ERROR`, `FATAL`
- [x] 2.3 Add error kind constants: `NETWORK`, `PARSE`, `VALIDATION`, `TIMEOUT`, `AUTH`, `RATE_LIMIT`, `UNKNOWN`
- [x] 2.4 Add `AdapterHealth` type with constants: `CONNECTED`, `DEGRADED`, `DISCONNECTED`, `STOPPED`
- [x] 2.5 Implement `Error() string` method on `AdapterError` (satisfies Go `error` interface)

## 3. Adapter Configuration
- [x] 3.1 Create `internal/adapters/config.go` — define `AdapterConfig` struct with `PollInterval`, `Timeout`, `MaxRetries`, `RetryBackoff`, `BaseURL`, `APIKey`
- [x] 3.2 Add `DefaultConfig()` function returning sensible defaults (30s poll, 10s timeout, 3 retries, 2s backoff)

## 4. Expand HubAdapter Interface
- [x] 4.1 Update `internal/adapters/adapter.go` — add `Health()`, `Errors()`, `Config()` methods to interface

## 5. Adapter Registry
- [x] 5.1 Create `internal/adapters/registry.go` — `AdapterRegistry` struct with adapter slice, unified telemetry channel, unified error channel
- [x] 5.2 Implement `Register(adapter HubAdapter)` method
- [x] 5.3 Implement `StartAll()` — starts all adapters, fans-in telemetry and errors into unified channels
- [x] 5.4 Implement `StopAll()` — gracefully stops all adapters with a 10s timeout
- [x] 5.5 Implement `Stream() <-chan models.UrbanfluxTelemetry` — returns unified read-only telemetry channel
- [x] 5.6 Implement `ErrorStream() <-chan AdapterError` — returns unified read-only error channel
- [x] 5.7 Implement `HealthAll() map[string]AdapterHealth` — returns health map

## 6. Update Jakarta Adapter
- [x] 6.1 Update `TransjakartaAdapter` to embed `AdapterConfig` and accept it in constructor
- [x] 6.2 Add internal `health` field and `Health()` method
- [x] 6.3 Add internal `errChan` and `Errors()` method
- [x] 6.4 Add `Config()` method returning the embedded config
- [x] 6.5 Update telemetry emission to include `Hub: "jakarta"`, `Mode: "BUS"`, `Operator: "Transjakarta"`

## 7. Update Server Main
- [x] 7.1 Refactor `main.go` to create an `AdapterRegistry`, register Jakarta adapter
- [x] 7.2 Wire registry's `Stream()` to the WebSocket Hub broadcast
- [x] 7.3 Add a goroutine to log errors from the registry's `ErrorStream()`
- [x] 7.4 Add OS signal handling (SIGINT, SIGTERM) for graceful shutdown via `StopAll()`

## 8. Tests
- [x] 8.1 Create `internal/models/telemetry_test.go` — test `Validate()` with valid, missing-field, and edge-case inputs
- [x] 8.2 Create `internal/adapters/errors_test.go` — test `AdapterError.Error()` string formatting, verify constants
- [x] 8.3 Create `internal/adapters/registry_test.go` — test registry with mock adapters: Register, StartAll, StopAll, Stream fan-in, HealthAll
