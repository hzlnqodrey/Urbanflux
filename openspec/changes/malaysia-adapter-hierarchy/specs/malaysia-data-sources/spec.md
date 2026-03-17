# Spec: Malaysia Data Sources

## ADDED Requirements

### Requirement: GTFS-RT endpoint integration
The system SHALL integrate with Malaysia's official GTFS-Realtime feeds from api.data.gov.my for all supported operators.

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

#### Scenario: BAS.MY city bus data ingestion
- **GIVEN** a BAS.MY city bus adapter is configured (e.g., Kangar)
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch bus positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas`

### Requirement: No authentication required
The system SHALL access all Malaysia GTFS-RT endpoints without API keys or authentication headers.

#### Scenario: Public API access
- **GIVEN** a Malaysia adapter is configured with default settings
- **WHEN** making HTTP requests to api.data.gov.my
- **THEN** the request SHALL succeed without Authorization headers

### Requirement: Operator-specific transit modes
The system SHALL correctly map each operator's vehicle types to Urbanflux transit mode constants (BUS, RAIL, METRO, MONORAIL).

#### Scenario: Prasarana mode mapping
- **GIVEN** Prasarana operates buses, trains, and MRT feeder services
- **WHEN** parsing Prasarana GTFS-RT data
- **THEN** the system SHALL map vehicle types to MODE_BUS, MODE_RAIL, or MODE_METRO as appropriate

#### Scenario: KTMB mode mapping
- **GIVEN** KTMB operates railway services (KTM Komuter, ETS, intercity)
- **WHEN** parsing KTMB GTFS-RT data
- **THEN** the system SHALL map all vehicles to MODE_RAIL

### Requirement: Multi-city Prasarana support
The system SHALL support Prasarana adapters for multiple Malaysian cities (Kuala Lumpur, Penang, Kuantan) with appropriate hub IDs.

#### Scenario: Penang Prasarana bus hub identification
- **GIVEN** the Penang Prasarana adapter is streaming data
- **WHEN** vehicle telemetry is generated
- **THEN** the hub field SHALL be "penang" and mode SHALL be MODE_BUS

#### Scenario: Kuantan Prasarana bus hub identification
- **GIVEN** the Kuantan Prasarana adapter is streaming data
- **WHEN** vehicle telemetry is generated
- **THEN** the hub field SHALL be "kuantan" and mode SHALL be MODE_BUS

### Requirement: MRT Feeder bus service
The system SHALL support Prasarana MRT Feeder buses as a distinct adapter with appropriate transit mode classification.

#### Scenario: MRT Feeder mode classification
- **GIVEN** the Kuala Lumpur MRT Feeder adapter is configured
- **WHEN** parsing vehicle positions
- **THEN** the system SHALL map MRT Feeder buses to MODE_BUS with operator "Prasarana"

### Requirement: Operator field consistency
The system SHALL consistently populate the operator field in telemetry with the official operator name (Prasarana, KTMB, BAS.MY).

#### Scenario: Operator field in telemetry
- **GIVEN** any Malaysia adapter is streaming data
- **WHEN** telemetry is broadcast via WebSocket
- **THEN** the operator field SHALL be one of: "Prasarana", "KTMB", "BAS.MY"

### Requirement: API endpoint documentation
The system SHALL document all Malaysia GTFS-RT endpoints in code comments and/or configuration files for future reference.

#### Scenario: Endpoint documentation in adapter
- **GIVEN** a Malaysia adapter is implemented
- **WHEN** reviewing the adapter source code
- **THEN** the official api.data.gov.my endpoint URL SHALL be documented in a constant or comment

### Requirement: Polling interval configuration
The system SHALL allow configurable polling intervals for each Malaysia adapter to respect API rate limits and data freshness requirements.

#### Scenario: Default polling interval
- **GIVEN** a Malaysia adapter uses default configuration
- **WHEN** the adapter starts
- **THEN** the polling interval SHALL be 30 seconds

#### Scenario: Custom polling interval
- **GIVEN** a Malaysia adapter requires more frequent updates
- **WHEN** configured with a custom poll interval
- **THEN** the adapter SHALL respect the custom interval

### Requirement: Multi-city BAS.MY support
The system SHALL support individual BAS.MY adapters for each Malaysian city with unique hub IDs.

#### Scenario: BAS.MY city hub identification
- **GIVEN** multiple BAS.MY adapters are registered (Kangar, Alor Setar, Kota Bharu, etc.)
- **WHEN** each adapter streams telemetry
- **THEN** the hub field SHALL match the respective city (kangar, alor-setar, kota-bharu, etc.)

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
