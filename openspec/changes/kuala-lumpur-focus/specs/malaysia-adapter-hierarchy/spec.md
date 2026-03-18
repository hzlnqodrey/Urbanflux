# Delta Spec: Malaysia Adapter Hierarchy

## MODIFIED Requirements

### Requirement: Geographical adapter organization
The system SHALL organize transit adapters by geographical hierarchy: country → hub → operator, with only Kuala Lumpur hub for Malaysia.

#### Scenario: Navigate to Malaysia Kuala Lumpur adapter
- **GIVEN** the backend codebase is restructured to single-hub focus
- **WHEN** a developer navigates to `internal/adapters/malaysia/kualalumpur/`
- **THEN** they SHALL find all Kuala Lumpur-specific transit adapters organized by operator (prasarana/, ktmb/)

#### Scenario: No other Malaysia hub directories
- **GIVEN** the backend is simplified to single-hub focus
- **WHEN** viewing `internal/adapters/malaysia/`
- **THEN** only the `kualalumpur/` subdirectory SHALL exist

### Requirement: Hub-based operator grouping
The system SHALL group multiple operators under the same hub directory when they serve the same geographic area.

#### Scenario: Kuala Lumpur multi-operator hub
- **GIVEN** Kuala Lumpur has multiple transit operators (Prasarana, KTMB)
- **WHEN** viewing the `malaysia/kualalumpur/` directory
- **THEN** both `prasarana/` and `ktmb/` adapters SHALL exist as subdirectories

## REMOVED Requirements

### Requirement: City-specific BAS.MY adapters
**Reason**: Simplifying to single-hub focus removes all non-Kuala Lumpur city adapters including BAS.MY services for other cities.

**Migration**: Any clients depending on BAS.MY city data for Kangar, Alor Setar, Kota Bharu, Kuala Terengganu, Ipoh, Seremban, Melaka, Johor Bahru, or Kuching should transition to alternative data sources or await future multi-hub expansion.

### Requirement: Multi-city Prasarana support
**Reason**: Simplifying to single-hub focus removes Prasarana adapters for Penang and Kuantan.

**Migration**: Penang and Kuantan hub support is removed. Future expansion may restore these hubs if demand warrants.

### Requirement: Multi-city BAS.MY support
**Reason**: Simplifying to single-hub focus removes all BAS.MY city bus adapters.

**Migration**: All BAS.MY integrations are removed. The `internal/adapters/mybas/` directory should be removed or archived.

## ADDED Requirements

### Requirement: Simplified Malaysia adapter hierarchy
The system SHALL maintain a minimal Malaysia adapter hierarchy with only Kuala Lumpur hub.

#### Scenario: Malaysia directory structure after simplification
- **GIVEN** the multi-hub structure is removed
- **WHEN** viewing `internal/adapters/malaysia/`
- **THEN** only `kualalumpur/` SHALL exist as a subdirectory

#### Scenario: No mybas directory
- **GIVEN** the BAS.MY integration is removed
- **WHEN** viewing `internal/adapters/`
- **THEN** no `mybas/` directory SHALL exist at the root level

### Requirement: Import path simplification
The system SHALL update all import statements to reflect the simplified single-hub hierarchy.

#### Scenario: Update cmd/server/main.go imports
- **GIVEN** adapters are simplified to Kuala Lumpur only
- **WHEN** reviewing cmd/server/main.go
- **THEN** only Kuala Lumpur adapter imports SHALL be present (malaysia/kualalumpur/prasarana, malaysia/kualalumpur/ktmb)

#### Scenario: No non-KL adapter imports
- **GIVEN** the backend is simplified
- **WHEN** reviewing cmd/server/main.go
- **THEN** no imports for penang, kuantan, or other Malaysia cities SHALL be present
