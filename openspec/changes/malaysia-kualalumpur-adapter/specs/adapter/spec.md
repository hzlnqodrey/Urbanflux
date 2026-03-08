# Delta for Adapter Domain

## ADDED Requirements

### Requirement: Shared GTFS-RT Parser
A shared `gtfsrt` package SHALL parse standard GTFS-RT protobuf `VehiclePosition` feeds into `UrbanfluxTelemetry` structs. The parser SHALL:
- Accept raw protobuf bytes and return a slice of `UrbanfluxTelemetry`
- Map `VehiclePosition.position.latitude/longitude` → `Latitude/Longitude`
- Map `VehiclePosition.position.speed` (m/s) → `Speed` (km/h, converted)
- Map `VehiclePosition.position.bearing` → `Bearing`
- Map `VehiclePosition.vehicle.id` → `ID`
- Map `VehiclePosition.trip.route_id` → `RouteID`
- Map `VehiclePosition.timestamp` → `LastUpdated`
- Accept `hub`, `mode`, and `operator` as parameters to stamp on each telemetry event
- Skip invalid entities (missing position, lat/lon = 0) and emit an `AdapterError` per skip
- Return partial results when some entities are valid and others are not

#### Scenario: parse-valid-gtfsrt-feed
- GIVEN a GTFS-RT protobuf feed with 5 valid VehiclePosition entities
- WHEN the parser processes the feed with hub="kuala-lumpur", mode="BUS", operator="Prasarana"
- THEN 5 `UrbanfluxTelemetry` structs SHALL be returned, each with Hub="kuala-lumpur"

#### Scenario: parse-feed-with-invalid-entities
- GIVEN a GTFS-RT protobuf feed with 3 valid and 2 invalid (zero lat/lon) entities
- WHEN the parser processes the feed
- THEN 3 valid telemetry structs SHALL be returned AND 2 `AdapterError`s with Kind=VALIDATION

#### Scenario: speed-conversion
- GIVEN a VehiclePosition with speed=12.5 (m/s as per GTFS-RT spec)
- WHEN the parser converts it
- THEN Speed SHALL be 45.0 (km/h, ×3.6 conversion)

---

### Requirement: Kuala Lumpur Bus Adapter
A `KualaLumpurBusAdapter` SHALL poll the Malaysia GTFS-RT API for Rapid KL bus positions.

- Endpoint: `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl`
- No API key required
- Default poll interval: 30 seconds
- SHALL use the shared GTFS-RT parser with hub="kuala-lumpur", mode="BUS", operator="Prasarana"
- SHALL implement the full `HubAdapter` interface (Start, Stop, Name, Health, Errors, Config)
- SHALL handle HTTP errors (5xx, timeout, DNS) with retry + exponential backoff
- SHALL mark Health=DISCONNECTED after MaxRetries consecutive failures
- SHALL mark Health=DEGRADED when partial data is received

#### Scenario: successful-poll
- GIVEN the adapter is running with PollInterval=30s
- WHEN the API returns a valid protobuf response with 10 bus positions
- THEN 10 telemetry events SHALL be sent to the stream channel
- AND Health SHALL be CONNECTED

#### Scenario: api-returns-503
- GIVEN the adapter is running
- WHEN the API returns HTTP 503
- THEN an AdapterError{Kind: NETWORK, Retryable: true} SHALL be sent
- AND the adapter SHALL retry with exponential backoff

#### Scenario: api-unreachable
- GIVEN the adapter has failed MaxRetries (3) consecutive times
- WHEN the next poll fails
- THEN Health SHALL be DISCONNECTED
- AND an AdapterError{Kind: NETWORK, Severity: ERROR} SHALL be sent

---

### Requirement: Kuala Lumpur Rail Adapter
A `KualaLumpurRailAdapter` SHALL poll the Malaysia GTFS-RT API for Rapid KL rail (LRT/MRT/Monorail) positions.

- Endpoint: `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl`
- SHALL use the shared GTFS-RT parser with hub="kuala-lumpur", mode="RAIL", operator="Prasarana"
- Same error handling and health behavior as the bus adapter
- Note: this feed may be unstable per data.gov.my documentation

#### Scenario: rail-feed-unstable
- GIVEN the rail API returns inconsistent or empty feeds
- WHEN the adapter receives an empty or malformed response
- THEN Health SHALL be DEGRADED
- AND an AdapterError{Kind: PARSE} SHALL be sent
- AND the adapter SHALL continue polling (not crash)

## MODIFIED Requirements

_(none — new adapters only, existing code unchanged)_

## REMOVED Requirements

_(none)_
