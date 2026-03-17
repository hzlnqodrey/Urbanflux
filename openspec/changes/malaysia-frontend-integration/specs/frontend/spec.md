# Delta for Frontend

## ADDED Requirements

### Requirement: Malaysia Sub-Hub Configurations
The system SHALL provide `HubConfig` entries for all Malaysia sub-hubs so users can select and view real-time data for each city.

#### Scenario: hub-selector-shows-all-malaysia-cities
- GIVEN the user opens the hub platform
- WHEN the user opens the hub selector dropdown
- THEN all 12 Malaysia hubs SHALL be listed with display names

#### Scenario: map-flies-to-selected-hub
- GIVEN the user selects a Malaysia hub (e.g., "Penang")
- WHEN the hub changes
- THEN the map SHALL fly to the correct GPS coordinates for Penang

#### Scenario: live-vehicles-displayed
- GIVEN the backend is running with Malaysia adapters
- WHEN the user selects "Kuala Lumpur Hub"
- THEN live vehicle positions from RapidBus KL, RapidRail KL, MRT Feeder, and KTMB SHALL appear as glowing dots on the map
