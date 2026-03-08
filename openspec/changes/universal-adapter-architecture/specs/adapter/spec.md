# Delta for Adapter Domain

## ADDED Requirements

### Requirement: Enriched Telemetry Model
The `UrbanfluxTelemetry` struct SHALL include the following additional fields to support multi-hub, multi-mode data:
- `Hub` (string) — city identifier, e.g. `"kuala-lumpur"`, `"tokyo"`, `"jakarta"`
- `Mode` (string) — transport mode enum: `BUS`, `RAIL`, `METRO`, `FERRY`, `MONORAIL`, `TRAM`
- `Operator` (string) — transit operator name, e.g. `"Prasarana"`, `"JR East"`, `"Transjakarta"`
- `Occupancy` (string) — optional load level: `EMPTY`, `LOW`, `MEDIUM`, `HIGH`, `FULL`, `UNKNOWN`
- `DelaySeconds` (int) — delay in seconds (0 = on time, negative = early)
- `ErrorInfo` (string) — optional error context when data is degraded

#### Scenario: telemetry-from-malaysia-bus
- GIVEN a Rapid KL bus adapter emitting vehicle positions
- WHEN a telemetry event is produced
- THEN Hub SHALL be `"kuala-lumpur"`, Mode SHALL be `"BUS"`, Operator SHALL be `"Prasarana"`

#### Scenario: telemetry-with-delay
- GIVEN an adapter that receives delay information from its API
- WHEN a bus is 120 seconds behind schedule
- THEN DelaySeconds SHALL be `120`

#### Scenario: telemetry-without-optional-fields
- GIVEN an API that does not provide occupancy data
- WHEN telemetry is constructed
- THEN Occupancy SHALL default to `"UNKNOWN"` and the event SHALL still be valid

---

### Requirement: Adapter Health Reporting
Each adapter SHALL expose its health status via a `Health()` method returning one of:
- `CONNECTED` — actively receiving and streaming data
- `DEGRADED` — receiving data but with errors or missing fields
- `DISCONNECTED` — unable to reach the upstream API
- `STOPPED` — adapter has been deliberately stopped

#### Scenario: adapter-loses-connection
- GIVEN a running adapter connected to an upstream API
- WHEN the API becomes unreachable for 3 consecutive attempts
- THEN the adapter's `Health()` SHALL return `DISCONNECTED`

#### Scenario: adapter-receives-partial-data
- GIVEN a running adapter receiving vehicle positions
- WHEN some responses contain invalid GPS coordinates
- THEN the adapter's `Health()` SHALL return `DEGRADED`

---

### Requirement: Adapter Error Channel
Each adapter SHALL expose an `Errors()` method returning a read-only channel of `AdapterError`.

The `AdapterError` type SHALL include:
- `Severity` — `INFO`, `WARNING`, `ERROR`, `FATAL`
- `Kind` — `NETWORK`, `PARSE`, `VALIDATION`, `TIMEOUT`, `AUTH`, `RATE_LIMIT`, `UNKNOWN`
- `Message` (string) — human-readable error description
- `AdapterName` (string) — which adapter produced the error
- `Timestamp` (time.Time) — when the error occurred
- `Retryable` (bool) — whether the operation can be retried

#### Scenario: network-error-during-polling
- GIVEN an adapter polling a REST API every 30 seconds
- WHEN the HTTP request returns a 503 status
- THEN an `AdapterError` SHALL be sent with Kind=`NETWORK`, Severity=`WARNING`, Retryable=`true`

#### Scenario: malformed-protobuf-response
- GIVEN an adapter parsing a GTFS-RT protobuf feed
- WHEN the response cannot be decoded
- THEN an `AdapterError` SHALL be sent with Kind=`PARSE`, Severity=`ERROR`, Retryable=`true`

#### Scenario: authentication-failure
- GIVEN an adapter that requires an API key (e.g. ODPT Japan)
- WHEN the API returns a 401/403 status
- THEN an `AdapterError` SHALL be sent with Kind=`AUTH`, Severity=`FATAL`, Retryable=`false`

---

### Requirement: Adapter Configuration
Each adapter SHALL accept an `AdapterConfig` struct at construction time containing:
- `PollInterval` (time.Duration) — how often to fetch data (default 30s)
- `Timeout` (time.Duration) — HTTP request timeout (default 10s)
- `MaxRetries` (int) — max retry attempts before marking disconnected (default 3)
- `RetryBackoff` (time.Duration) — base backoff between retries (default 2s)
- `BaseURL` (string) — the API endpoint URL
- `APIKey` (string) — optional API key for authenticated endpoints

#### Scenario: adapter-uses-custom-poll-interval
- GIVEN an AdapterConfig with PollInterval=60s
- WHEN the adapter is started
- THEN it SHALL poll the upstream API every 60 seconds

---

### Requirement: Adapter Registry
An `AdapterRegistry` SHALL manage the lifecycle of multiple adapters:
- `Register(adapter)` — adds an adapter to the registry
- `StartAll()` — starts all registered adapters concurrently
- `StopAll()` — gracefully stops all adapters
- `Stream()` — returns a unified telemetry channel aggregating all adapter outputs
- `HealthAll()` — returns a map of adapter name → health status
- `ErrorStream()` — returns a unified error channel aggregating all adapter errors

#### Scenario: multiple-adapters-running
- GIVEN a registry with Jakarta, KualaLumpur, and Tokyo adapters registered
- WHEN `StartAll()` is called
- THEN all three adapters SHALL begin streaming telemetry into the unified `Stream()` channel

#### Scenario: graceful-shutdown
- GIVEN three running adapters
- WHEN `StopAll()` is called
- THEN all adapters SHALL stop within 10 seconds and the registry SHALL close the unified stream

## MODIFIED Requirements

### Requirement: HubAdapter Interface
The existing `HubAdapter` interface SHALL be expanded from:
```go
type HubAdapter interface {
    Start(stream chan<- models.UrbanfluxTelemetry) error
    Stop() error
    Name() string
}
```

To:
```go
type HubAdapter interface {
    Start(stream chan<- models.UrbanfluxTelemetry) error
    Stop() error
    Name() string
    Health() AdapterHealth
    Errors() <-chan AdapterError
    Config() AdapterConfig
}
```

## REMOVED Requirements

_(none)_
