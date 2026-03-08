# Design: Universal Adapter Architecture

## Technical Approach

Upgrade the Go backend adapter layer from a single-adapter pattern to a multi-adapter registry architecture with comprehensive error handling. All changes are in `urbanflux-hubs/backend/`.

## Architecture Decisions

### Decision: Error Channel Pattern (not callbacks)
Adapters communicate errors through a dedicated `<-chan AdapterError` channel rather than callbacks or returned errors. This keeps the pattern consistent with the existing telemetry channel approach and allows the registry to aggregate errors from all adapters into a single stream for centralized logging.

**Alternatives considered:**
- Callback functions: more coupling, harder to aggregate
- Returning errors from Start(): only captures startup failures, not runtime errors
- Global logger: no structured error categorization

### Decision: Health as a Method (not channel)
`Health()` returns the current health status synchronously rather than streaming health events. Health is a point-in-time query (used by health check endpoints, dashboards), not a continuous stream.

### Decision: Registry Pattern (not adapter chaining)
A central `AdapterRegistry` manages all adapters rather than chaining them. This provides a single point for lifecycle management, health aggregation, and unified streaming.

### Decision: Transport Mode as String Enum
Use string constants (`BUS`, `RAIL`, `METRO`, etc.) rather than Go `iota` enums. This makes JSON serialization cleaner and more readable for frontend consumption.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│                  AdapterRegistry                     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Jakarta  │  │ KL       │  │ Tokyo    │  ... more  │
│  │ Adapter  │  │ Adapter  │  │ Adapter  │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │ telemetry    │ telemetry   │ telemetry       │
│       │ errors       │ errors      │ errors          │
│       ▼              ▼             ▼                 │
│  ┌────────────────────────────────────────┐          │
│  │   Unified Telemetry Channel (fan-in)  │          │
│  └──────────────┬─────────────────────────┘          │
│  ┌──────────────┴─────────────────────────┐          │
│  │   Unified Error Channel (fan-in)      │          │
│  └────────────────────────────────────────┘          │
│                                                      │
│  Health() → map[string]AdapterHealth                 │
└──────────┬───────────────────────┬───────────────────┘
           │                       │
           ▼                       ▼
      WebSocket Hub           Error Logger
      (broadcast)             (structured)
```

## File Changes

### New Files
- `internal/adapters/errors.go` — `AdapterError`, `AdapterHealth`, severity/kind constants
- `internal/adapters/config.go` — `AdapterConfig` struct with defaults
- `internal/adapters/registry.go` — `AdapterRegistry` with fan-in pattern
- `internal/adapters/errors_test.go` — unit tests for error types
- `internal/adapters/registry_test.go` — unit tests for registry lifecycle
- `internal/models/telemetry_test.go` — unit tests for telemetry validation

### Modified Files
- `internal/models/telemetry.go` — add Hub, Mode, Operator, Occupancy, DelaySeconds, ErrorInfo fields
- `internal/adapters/adapter.go` — expand HubAdapter interface with Health(), Errors(), Config()
- `internal/adapters/jakarta/transjakarta.go` — update to implement expanded interface
- `cmd/server/main.go` — use AdapterRegistry, wire graceful shutdown via OS signals

## Error Handling Strategy

```
Adapter polls API
  ├── HTTP error (5xx, timeout, dns)
  │     → Send AdapterError{Kind: NETWORK, Retryable: true}
  │     → Increment retry counter
  │     → If retries exhausted → Health = DISCONNECTED
  │     → Exponential backoff → retry
  │
  ├── Auth error (401, 403)
  │     → Send AdapterError{Kind: AUTH, Retryable: false}
  │     → Health = DISCONNECTED
  │     → Stop polling
  │
  ├── Parse error (bad protobuf, bad JSON)
  │     → Send AdapterError{Kind: PARSE, Retryable: true}
  │     → Health = DEGRADED
  │     → Skip this update, continue polling
  │
  ├── Validation error (invalid lat/lon, missing fields)
  │     → Send AdapterError{Kind: VALIDATION, Retryable: true}
  │     → Health = DEGRADED
  │     → Emit partial telemetry with ErrorInfo
  │
  ├── Rate limit (429)
  │     → Send AdapterError{Kind: RATE_LIMIT, Retryable: true}
  │     → Health = DEGRADED
  │     → Exponential backoff → retry
  │
  └── Success
        → Health = CONNECTED
        → Reset retry counter
        → Emit telemetry
```
