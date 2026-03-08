# Design: Malaysia Kuala Lumpur Adapter

## Technical Approach

Add the first real-world adapter integration using Malaysia's `api.data.gov.my` GTFS-RT feed. This also introduces a **shared GTFS-RT parser** that will be reused by any future GTFS-RT hub (Japan Toei, Penang, Johor, etc.).

## Architecture Decisions

### Decision: Shared GTFS-RT Parser (not embedded per-adapter)
Extract protobuf parsing into `internal/adapters/gtfsrt/parser.go` rather than duplicating it in each adapter. GTFS-RT is the global standard — Malaysia, Japan (Toei/JR East), and many other cities all use it.

**Alternatives considered:**
- Inline parsing per adapter: duplicates ~100 lines, no code reuse
- External parsing service: unnecessary overhead for this use case

### Decision: Official GTFS-RT Bindings via `github.com/MobilityData/gtfs-realtime-bindings`
Use the official MobilityData Go bindings rather than vendoring the proto file. This package is maintained by the GTFS-RT standards body and is the canonical Go implementation.

### Decision: Two Separate Adapters for Bus and Rail
Kuala Lumpur Bus and Rail are separate API endpoints with different data quality characteristics. Keeping them as separate adapters allows independent health reporting and the ability to disable one without affecting the other.

### Decision: HTTP Polling with Retry (not streaming)
`api.data.gov.my` only exposes HTTP GET endpoints (no WebSocket/SSE). We poll every 30 seconds with retry + exponential backoff, consistent with the `AdapterConfig` pattern.

## Architecture Diagram

```
api.data.gov.my (GTFS-RT Protobuf)
  │
  ├── /vehicle-position/prasarana?category=rapid-bus-kl
  │        │
  │        ▼
  │   KualaLumpurBusAdapter
  │     → HTTP GET → protobuf bytes → gtfsrt.Parse()
  │     → []UrbanfluxTelemetry{Hub:"kuala-lumpur", Mode:"BUS"}
  │
  └── /vehicle-position/prasarana?category=rapid-rail-kl
           │
           ▼
      KualaLumpurRailAdapter
        → HTTP GET → protobuf bytes → gtfsrt.Parse()
        → []UrbanfluxTelemetry{Hub:"kuala-lumpur", Mode:"RAIL"}
           │
           ▼
      AdapterRegistry (fan-in)
           │
           ▼
      WebSocket Hub → Frontend
```

## Error Handling Flow

```
HTTP GET api.data.gov.my
  ├── Status 200 + valid protobuf
  │     → Parse → validate entities → stream telemetry
  │     → Health = CONNECTED, reset retries
  │
  ├── Status 200 + empty/malformed body
  │     → AdapterError{Kind: PARSE, Severity: WARNING}
  │     → Health = DEGRADED
  │     → Continue polling (don't crash)
  │
  ├── Status 5xx / Timeout / DNS error
  │     → AdapterError{Kind: NETWORK, Retryable: true}
  │     → Increment retry counter
  │     → If retries < MaxRetries → backoff → retry
  │     → If retries >= MaxRetries → Health = DISCONNECTED
  │
  └── Status 429 (rate limit)
        → AdapterError{Kind: RATE_LIMIT, Retryable: true}
        → Health = DEGRADED
        → Extended backoff → retry
```

## File Changes

### New Files
- `internal/adapters/gtfsrt/parser.go` — shared GTFS-RT protobuf → UrbanfluxTelemetry parser
- `internal/adapters/gtfsrt/parser_test.go` — tests with fixture protobuf data
- `internal/adapters/kualalumpur/rapid_bus.go` — KL bus adapter (Rapid KL)
- `internal/adapters/kualalumpur/rapid_rail.go` — KL rail adapter (LRT/MRT/Monorail)
- `internal/adapters/kualalumpur/rapid_bus_test.go` — adapter lifecycle tests
- `internal/adapters/kualalumpur/adapter_base.go` — shared base logic for KL adapters (HTTP polling, retry, health)

### Modified Files
- `go.mod` / `go.sum` — add `google.golang.org/protobuf` and `github.com/MobilityData/gtfs-realtime-bindings`
- `cmd/server/main.go` — register KL bus and rail adapters in the registry
