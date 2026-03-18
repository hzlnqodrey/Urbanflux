# Spec: Malaysia Adapter Hierarchy

## ADDED Requirements

### Requirement: Geographical adapter organization
The system SHALL organize transit adapters by geographical hierarchy: country → hub → operator.

#### Scenario: Navigate to Malaysia Kuala Lumpur adapter
- **GIVEN** the backend codebase is restructured
- **WHEN** a developer navigates to `internal/adapters/malaysia/kualalumpur/`
- **THEN** they SHALL find all Kuala Lumpur-specific transit adapters organized by operator (prasarana/, ktmb/)

### Requirement: Package path consistency
The system SHALL maintain consistent Go package naming following the directory hierarchy.

#### Scenario: Import path after restructure
- **GIVEN** the adapter hierarchy is reorganized
- **WHEN** a developer imports the KTMB adapter
- **THEN** the import path SHALL be `github.com/urbanflux/hubs-backend/internal/adapters/malaysia/kualalumpur/ktmb`

### Requirement: Hub-based operator grouping
The system SHALL group multiple operators under the same hub directory when they serve the same geographic area.

#### Scenario: Kuala Lumpur multi-operator hub
- **GIVEN** Kuala Lumpur has multiple transit operators (Prasarana, KTMB)
- **WHEN** viewing the `malaysia/kualalumpur/` directory
- **THEN** both `prasarana/` and `ktmb/` adapters SHALL exist as subdirectories

### Requirement: City-specific BAS.MY adapters
The system SHALL organize BAS.MY adapters under their respective city hub directories.

#### Scenario: Penang BAS.MY adapter location
- **GIVEN** Penang has BAS.MY city bus service
- **WHEN** locating the Penang bus adapter
- **THEN** it SHALL be at `malaysia/penang/mybas/`

### Requirement: Import path updates across codebase
The system SHALL update all import statements in main.go, test files, and adapter references to reflect the new hierarchy.

#### Scenario: Update cmd/server/main.go imports
- **GIVEN** adapters are moved to new locations
- **WHEN** reviewing cmd/server/main.go
- **THEN** all adapter imports SHALL use new paths (e.g., `malaysia/kualalumpur/prasarana`)

### Requirement: Test file co-location
The system SHALL maintain test files (`*_test.go`) in the same directory as the source files they test.

#### Scenario: Test file location after restructure
- **GIVEN** the KTMB adapter moves to `malaysia/kualalumpur/ktmb/`
- **WHEN** looking for KTMB adapter tests
- **THEN** `ktmb_test.go` SHALL be in the same directory

### Requirement: Hub ID alignment
The system SHALL ensure hub IDs in adapter configurations match frontend hub configurations.

#### Scenario: Hub ID consistency
- **GIVEN** backend adapter uses hub ID "kuala-lumpur"
- **WHEN** frontend queries for hub configuration
- **THEN** the hub ID SHALL exist in frontend/src/lib/hub-config.ts with matching metadata

## MODIFIED Requirements

### Requirement: Adapter registry registration
The system SHALL register all adapters in the central registry regardless of their directory location.

#### Scenario: Register all Malaysia adapters
- **GIVEN** adapters are reorganized under malaysia/ hierarchy
- **WHEN** the backend server starts
- **THEN** all Malaysia adapters (Prasarana, KTMB, myBAS) SHALL be registered and streaming telemetry
