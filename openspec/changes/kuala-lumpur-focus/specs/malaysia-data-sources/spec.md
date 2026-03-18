# Delta Spec: Malaysia Data Sources

## MODIFIED Requirements

### Requirement: GTFS-RT endpoint integration
The system SHALL integrate with Malaysia's official GTFS-Realtime feeds from api.data.gov.my for Kuala Lumpur operators only.

#### Scenario: Prasarana RapidKL bus data ingestion
- **GIVEN** the Prasarana RapidKL bus adapter is configured
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch vehicle positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl`

#### Scenario: Prasarana RapidKL rail data ingestion
- **GIVEN** the Prasarana RapidKL rail adapter is configured
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch train positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl`

#### Scenario: KTMB train data ingestion
- **GIVEN** the KTMB railway adapter is configured
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch train positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb`

### Requirement: Operator field consistency
The system SHALL consistently populate the operator field in telemetry with the official operator name (Prasarana, KTMB).

#### Scenario: Operator field in telemetry
- **GIVEN** a Kuala Lumpur adapter is streaming data
- **WHEN** telemetry is broadcast via WebSocket
- **THEN** the operator field SHALL be one of: "Prasarana", "KTMB"

### Requirement: Operator-specific transit modes
The system SHALL correctly map each operator's vehicle types to Urbanflux transit mode constants (BUS, RAIL, METRO, MONORAIL).

#### Scenario: Prasarana mode mapping
- **GIVEN** Prasarana operates buses and trains in Kuala Lumpur
- **WHEN** parsing Prasarana GTFS-RT data
- **THEN** the system SHALL map vehicle types to MODE_BUS or MODE_RAIL as appropriate

#### Scenario: KTMB mode mapping
- **GIVEN** KTMB operates railway services (KTM Komuter, ETS, intercity)
- **WHEN** parsing KTMB GTFS-RT data
- **THEN** the system SHALL map all vehicles to MODE_RAIL

### Requirement: API endpoint documentation
The system SHALL document all Malaysia GTFS-RT endpoints in code comments and/or configuration files for future reference.

#### Scenario: Endpoint documentation in adapter
- **GIVEN** a Kuala Lumpur adapter is implemented
- **WHEN** reviewing the adapter source code
- **THEN** the official api.data.gov.my endpoint URL SHALL be documented in a constant or comment

### Requirement: Polling interval configuration
The system SHALL allow configurable polling intervals for each Kuala Lumpur adapter to respect API rate limits and data freshness requirements.

#### Scenario: Default polling interval
- **GIVEN** a Kuala Lumpur adapter uses default configuration
- **WHEN** the adapter starts
- **THEN** the polling interval SHALL be 30 seconds

#### Scenario: Custom polling interval
- **GIVEN** a Kuala Lumpur adapter requires more frequent updates
- **WHEN** configured with a custom poll interval
- **THEN** the adapter SHALL respect the custom interval

### Requirement: No authentication required
The system SHALL access all Malaysia GTFS-RT endpoints without API keys or authentication headers.

#### Scenario: Public API access
- **GIVEN** a Kuala Lumpur adapter is configured with default settings
- **WHEN** making HTTP requests to api.data.gov.my
- **THEN** the request SHALL succeed without Authorization headers

### Requirement: Data validation
The system SHALL validate all incoming GTFS-RT data from Malaysia endpoints before broadcasting to clients.

#### Scenario: Invalid coordinate rejection
- **GIVEN** Malaysia GTFS-RT feed contains a vehicle with coordinates (0, 0)
- **WHEN** the parser processes this vehicle
- **THEN** the vehicle SHALL be rejected and an error SHALL be emitted

#### Scenario: Missing vehicle ID handling
- **GIVEN** Malaysia GTFS-RT feed contains a vehicle without an ID
- **WHEN** the parser processes this vehicle
- **THEN** the vehicle SHALL be rejected and a parse error SHALL be emitted

## REMOVED Requirements

### Requirement: Multi-city Prasarana support
**Reason**: Simplifying to single-hub focus removes Prasarana adapters for Penang and Kuantan.

**Migration**: Penang and Kuantan Prasarana endpoints are no longer supported. Use the Kuala Lumpur Prasarana adapter or await future multi-hub expansion.

### Requirement: Multi-city BAS.MY support
**Reason**: Simplifying to single-hub focus removes all BAS.MY city bus adapters.

**Migration**: All BAS.MY integrations are removed. The endpoint `https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas` is no longer polled.

### Requirement: MRT Feeder bus service
**Reason**: MRT Feeder services are part of Prasarana RapidKL bus operations and do not require a separate adapter.

**Migration**: MRT Feeder buses are included in the Prasarana RapidKL bus data ingestion.

### Requirement: Operator field includes BAS.MY
**Reason**: BAS.MY operator is removed as part of single-hub simplification.

**Migration**: No migration path. BAS.MY data is no longer supported.
