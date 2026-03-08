# Proposal: Universal Adapter Architecture

## Intent

The current `HubAdapter` interface and `UrbanfluxTelemetry` model are minimal — designed only for Jakarta's mock Transjakarta adapter. Before integrating real-world APIs from Malaysia, Japan, and beyond, we need to **harden the adapter layer** so it can:

1. Handle heterogeneous API formats (GTFS-RT protobuf, REST JSON, WebSocket streams, ODPT JSON-LD)
2. Provide robust error handling with retries, circuit breakers, and graceful degradation
3. Report adapter health (connected / degraded / disconnected) to the system
4. Support multiple adapters running concurrently via a central registry
5. Normalize diverse data into a richer, globally standardized telemetry model
6. Gracefully start, stop, and restart adapters without crashing the server

## Scope

**In scope:**
- Expand `UrbanfluxTelemetry` model with fields for hub city, transport mode, operator, occupancy, delay
- Expand `HubAdapter` interface with health reporting, metadata, and error channels
- Create an `AdapterRegistry` to manage multiple concurrent adapters
- Add custom error types and structured error handling patterns
- Add adapter configuration via environment variables / config structs
- Update `main.go` to use the registry pattern
- Unit tests for registry, error handling, and telemetry validation

**Out of scope:**
- Implementing any specific city adapter (Malaysia, Japan) — that comes after this
- Frontend changes
- WebSocket hub protocol changes (existing broadcast works fine)
- Redis caching layer
- GTFS-RT protobuf parsing (will be part of a future shared utility)

## Approach

1. **Enrich the telemetry model** — add `Hub`, `Mode`, `Operator`, `Occupancy`, `DelaySeconds`, `ErrorInfo` fields
2. **Expand the adapter interface** — add `Health()`, `Config()`, `Errors()` methods
3. **Create error types** — `AdapterError` with severity levels and categorized error kinds
4. **Build an `AdapterRegistry`** — manages lifecycle of all adapters, aggregates their telemetry into a single stream, monitors health
5. **Add adapter config** — `AdapterConfig` struct with polling interval, retry policy, timeout
6. **Update the Jakarta mock** to comply with the new interface
7. **Wire the registry into `main.go`** with graceful shutdown via OS signals
8. **Write unit tests** for all new components
