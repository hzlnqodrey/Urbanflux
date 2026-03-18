# Spec: Mock Data Generator

## ADDED Requirements

### Requirement: Mock data generation for development
The system SHALL provide a mock data generator that creates realistic vehicle telemetry for Malaysia hubs when GTFS-RT APIs are unavailable.

#### Scenario: Generate mock Kuala Lumpur bus data
- **GIVEN** the backend is running in development mode
- **WHEN** the mock data generator is enabled for Kuala Lumpur
- **THEN** the system SHALL generate realistic bus telemetry with positions within Kuala Lumpur bounds

#### Scenario: Generate mock KTMB rail data
- **GIVEN** the backend is running in development mode
- **WHEN** the mock data generator is enabled for KTMB
- **THEN** the system SHALL generate realistic train telemetry following KTM Komuter routes

### Requirement: Realistic vehicle movement simulation
The system SHALL simulate vehicle movement between positions to create smooth, realistic trajectories.

#### Scenario: Interpolated vehicle positions
- **GIVEN** a mock vehicle is generated at position A
- **WHEN** the next poll interval occurs
- **THEN** the vehicle SHALL be at a new position B, with distance traveled reflecting realistic speed (20-60 km/h for buses, 40-100 km/h for trains)

### Requirement: Route-based positioning
The system SHALL generate mock vehicle positions along realistic transit routes for each hub.

#### Scenario: Kuala Lumpur bus routes
- **GIVEN** mock data is generated for Kuala Lumpur buses
- **WHEN** vehicle positions are calculated
- **THEN** vehicles SHALL be positioned along major Kuala Lumpur bus corridors (e.g., Jalan Tun Razak, Jalan Ampang)

#### Scenario: KTMB rail routes
- **GIVEN** mock data is generated for KTMB trains
- **WHEN** vehicle positions are calculated
- **THEN** trains SHALL be positioned along KTM Komuter lines (e.g., Sentul-Port Klang, Batu Caves-Pulau Sebang)

### Requirement: Hub-specific bounding boxes
The system SHALL generate mock vehicle positions within geographic bounds appropriate for each hub.

#### Scenario: Kuala Lumpur bounding box
- **GIVEN** mock data is generated for Kuala Lumpur hub
- **WHEN** vehicle coordinates are randomized
- **THEN** all positions SHALL be within approximately 3.0°N to 3.3°N latitude and 101.6°E to 101.8°E longitude

#### Scenario: Penang bounding box
- **GIVEN** mock data is generated for Penang hub
- **WHEN** vehicle coordinates are randomized
- **THEN** all positions SHALL be within approximately 5.3°N to 5.5°N latitude and 100.2°E to 100.4°E longitude

### Requirement: Transit mode consistency
The system SHALL generate mock data with transit modes (BUS, RAIL, METRO) matching the adapter's configured mode.

#### Scenario: Bus mode telemetry
- **GIVEN** a mock adapter is configured for MODE_BUS
- **WHEN** telemetry is generated
- **THEN** the mode field SHALL be "BUS" and speed SHALL be between 10-60 km/h

#### Scenario: Rail mode telemetry
- **GIVEN** a mock adapter is configured for MODE_RAIL
- **WHEN** telemetry is generated
- **THEN** the mode field SHALL be "RAIL" and speed SHALL be between 40-100 km/h

### Requirement: Vehicle ID generation
The system SHALL generate unique, realistic vehicle IDs following Malaysia transit operator naming conventions.

#### Scenario: RapidKL bus vehicle ID format
- **GIVEN** mock data is generated for RapidKL buses
- **WHEN** vehicle IDs are created
- **THEN** IDs SHALL follow the format "RKL-BUS-XXXX" where XXXX is a 4-digit number

#### Scenario: KTMB train vehicle ID format
- **GIVEN** mock data is generated for KTMB trains
- **WHEN** vehicle IDs are created
- **THEN** IDs SHALL follow the format "KTMB-ETS-XXXX" or "KTMB-KOM-XXXX" for ETS and Komuter services

### Requirement: Route ID assignment
The system SHALL assign realistic route IDs to mock vehicles based on the hub and operator.

#### Scenario: Kuala Lumpur bus route IDs
- **GIVEN** mock data is generated for Kuala Lumpur buses
- **WHEN** route IDs are assigned
- **THEN** route IDs SHALL follow the format "CORRIDOR-X" or "BRT-X" matching RapidKL conventions

#### Scenario: KTMB route IDs
- **GIVEN** mock data is generated for KTMB trains
- **WHEN** route IDs are assigned
- **THEN** route IDs SHALL reflect actual KTM Komuter lines (e.g., "PORT-KLANG", "SEREMBAN")

### Requirement: Occupancy simulation
The system SHALL randomly assign occupancy levels (EMPTY, LOW, MEDIUM, HIGH, FULL) to mock vehicles.

#### Scenario: Random occupancy distribution
- **GIVEN** mock data is generated for 100 vehicles
- **WHEN** occupancy levels are assigned
- **THEN** the distribution SHALL approximately be: EMPTY 10%, LOW 30%, MEDIUM 40%, HIGH 15%, FULL 5%

### Requirement: Status simulation
The system SHALL simulate vehicle status (ACTIVE, DELAYED, OFFLINE) with realistic probabilities.

#### Scenario: Status distribution
- **GIVEN** mock data is generated for 100 vehicles
- **WHEN** status values are assigned
- **THEN** approximately 90% SHALL be ACTIVE, 7% DELAYED, and 3% OFFLINE

### Requirement: Bearing calculation
The system SHALL calculate realistic vehicle bearings (0-360°) based on movement direction.

#### Scenario: Bearing from position change
- **GIVEN** a vehicle moves from position A to position B
- **WHEN** the bearing is calculated
- **THEN** the bearing SHALL reflect the direction of travel (0° = North, 90° = East, 180° = South, 270° = West)

### Requirement: Next stop simulation
The system SHALL assign realistic next stop names to mock vehicles based on hub routes.

#### Scenario: Kuala Lumpur next stops
- **GIVEN** mock data is generated for Kuala Lumpur buses
- **WHEN** next stops are assigned
- **THEN** stop names SHALL include actual Kuala Lumpur landmarks (e.g., "KL Sentral", "Bukit Bintang", "Mid Valley")

#### Scenario: KTMB next stops
- **GIVEN** mock data is generated for KTMB trains
- **WHEN** next stops are assigned
- **THEN** stop names SHALL include actual KTM stations (e.g., "KL Sentral", "Bangsar", "Seremban")

### Requirement: Toggle between live and mock data
The system SHALL allow configuration to switch between live GTFS-RT data and mock data via environment variable or config flag.

#### Scenario: Enable mock data via environment variable
- **GIVEN** the backend is configured with MOCK_DATA=true
- **WHEN** the server starts
- **THEN** Malaysia adapters SHALL use mock data instead of polling api.data.gov.my

#### Scenario: Use live data by default
- **GIVEN** no mock data configuration is provided
- **WHEN** the server starts
- **THEN** Malaysia adapters SHALL poll live GTFS-RT endpoints from api.data.gov.my

### Requirement: Mock data configuration
The system SHALL allow configuration of mock data parameters (vehicle count, update interval, geographic bounds).

#### Scenario: Configure vehicle count
- **GIVEN** mock data is enabled
- **WHEN** MOCK_VEHICLE_COUNT=50 is configured
- **THEN** the generator SHALL create exactly 50 vehicles per hub

#### Scenario: Configure update interval
- **GIVEN** mock data is enabled
- **WHEN** MOCK_UPDATE_INTERVAL=10s is configured
- **THEN** the generator SHALL update vehicle positions every 10 seconds

### Requirement: Error resilience
The system SHALL fall back to mock data automatically if live GTFS-RT endpoints fail consecutively beyond a threshold.

#### Scenario: Auto-fallback to mock data
- **GIVEN** a Malaysia adapter fails to fetch live data 5 times in a row
- **WHEN** the failure threshold is exceeded
- **THEN** the adapter SHALL automatically switch to mock data generation and log a warning

### Requirement: Mock data telemetry format
The system SHALL ensure mock data telemetry follows the exact same UrbanfluxTelemetry format as live data.

#### Scenario: Telemetry schema validation
- **GIVEN** mock data is generated
- **WHEN** the telemetry is validated
- **THEN** all required fields (ID, RouteID, Hub, Mode, Operator, Latitude, Longitude, Speed, Bearing, Status, LastUpdated) SHALL be present and valid
