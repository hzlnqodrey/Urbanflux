# Spec: Kuala Lumpur Hub

## ADDED Requirements

### Requirement: Single-hub Kuala Lumpur adapter configuration
The system SHALL provide a focused, single-hub adapter configuration for Kuala Lumpur with only Prasarana and KTMB operators.

#### Scenario: Kuala Lumpur hub initialization
- **GIVEN** the backend server starts with Malaysia adapters configured
- **WHEN** the adapter registry loads
- **THEN** only Kuala Lumpur adapters SHALL be registered (Prasarana, KTMB)

#### Scenario: No other Malaysia hubs registered
- **GIVEN** the backend server starts with Malaysia adapters configured
- **WHEN** querying the adapter registry
- **THEN** no adapters for Penang, Kuantan, or other Malaysia cities SHALL be present

### Requirement: Prasarana operator support
The system SHALL support Prasarana (RapidKL) bus and rail services for Kuala Lumpur.

#### Scenario: Prasarana bus data ingestion
- **GIVEN** the Prasarana bus adapter is configured for Kuala Lumpur
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch vehicle positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl`

#### Scenario: Prasarana rail data ingestion
- **GIVEN** the Prasarana rail adapter is configured for Kuala Lumpur
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch train positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl`

#### Scenario: Prasarana hub identification
- **GIVEN** a Prasarana adapter is streaming data
- **WHEN** vehicle telemetry is generated
- **THEN** the hub field SHALL be "kuala-lumpur" and operator SHALL be "Prasarana"

### Requirement: KTMB operator support
The system SHALL support KTMB (Keretapi Tanah Melayu Berhad) railway services for Kuala Lumpur.

#### Scenario: KTMB train data ingestion
- **GIVEN** the KTMB railway adapter is configured
- **WHEN** the adapter polls the GTFS-RT endpoint
- **THEN** the system SHALL fetch train positions from `https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb`

#### Scenario: KTMB hub identification
- **GIVEN** the KTMB adapter is streaming data
- **WHEN** vehicle telemetry is generated
- **THEN** the hub field SHALL be "kuala-lumpur" and operator SHALL be "KTMB"

### Requirement: Directory structure simplification
The system SHALL organize Kuala Lumpur adapters under a simplified `malaysia/kualalumpur/` directory with only operator subdirectories.

#### Scenario: Kuala Lumpur adapter directory structure
- **GIVEN** the backend adapter hierarchy is simplified
- **WHEN** viewing `internal/adapters/malaysia/kualalumpur/`
- **THEN** only two subdirectories SHALL exist: `prasarana/` and `ktmb/`

### Requirement: Frontend hub configuration
The system SHALL provide a single Kuala Lumpur hub configuration in the frontend.

#### Scenario: Kuala Lumpur is the only Malaysia hub
- **GIVEN** the frontend hub configuration is loaded
- **WHEN** querying for Malaysia hubs
- **THEN** only "kuala-lumpur" SHALL be present in HUB_CONFIGS

#### Scenario: Kuala Lumpur hub metadata
- **GIVEN** the Kuala Lumpur hub config is queried
- **WHEN** retrieving hub properties
- **THEN** displayName SHALL be "Kuala Lumpur Hub", country SHALL be "Malaysia", timezone SHALL be "Asia/Kuala_Lumpur"

### Requirement: Mode classification
The system SHALL correctly map transit modes for Kuala Lumpur operators.

#### Scenario: Prasarana mode mapping
- **GIVEN** Prasarana operates buses and trains in Kuala Lumpur
- **WHEN** parsing Prasarana GTFS-RT data
- **THEN** the system SHALL map vehicles to MODE_BUS or MODE_RAIL as appropriate

#### Scenario: KTMB mode mapping
- **GIVEN** KTMB operates railway services
- **WHEN** parsing KTMB GTFS-RT data
- **THEN** the system SHALL map all vehicles to MODE_RAIL

### Requirement: Health monitoring
The system SHALL provide health monitoring for both Kuala Lumpur operators via the `/health` endpoint.

#### Scenario: Health check returns Kuala Lumpur adapters
- **GIVEN** the backend is running with Kuala Lumpur adapters
- **WHEN** querying the `/health` endpoint
- **THEN** the response SHALL include status for "KualaLumpur-Prasarana" and "KualaLumpur-KTMB"

### Requirement: WebSocket telemetry streaming
The system SHALL stream Kuala Lumpur vehicle telemetry to connected WebSocket clients.

#### Scenario: Kuala Lumpur vehicle data broadcast
- **GIVEN** a WebSocket client is connected to `/ws`
- **WHEN** Kuala Lumpur adapters receive vehicle position updates
- **THEN** the client SHALL receive telemetry messages with hub "kuala-lumpur"
