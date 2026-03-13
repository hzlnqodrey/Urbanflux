# Delta for Frontend

## MODIFIED Requirements

### Requirement: Interactive Map Camera
The map SHALL allow the user to freely pan, drag, and zoom the viewport. The camera SHALL automatically fly to the hub's center coordinates ONLY when the user explicitly changes the `activeHub` via the selector.

#### Scenario: User explores the map
- GIVEN the user has selected the Kuala Lumpur hub
- WHEN the map completes its initial fly-to animation
- THEN the user can drag the map to view surrounding areas without the map snapping back to the center.

#### Scenario: User switches hubs
- GIVEN the user is viewing an off-center location in Jakarta
- WHEN the user selects Kuala Lumpur from the dropdown
- THEN the map camera flies to the center of Kuala Lumpur.

### Requirement: Multi-Mode Display
The map SHALL correctly render all supported transit modes for the active hub, assigning distinct colors based on the mode configuration. 

#### Scenario: Viewing Kuala Lumpur Transit
- GIVEN the backend is successfully streaming GTFS-RT data for KL buses and rail
- WHEN the user views the KL hub on the frontend
- THEN markers for both Bus and Train modes are visible and colored according to `hub-config.ts`.

## ADDED Requirements

### Requirement: Light Mode Theme
The frontend platform MUST support both a Dark and Light visual theme. The user SHALL be able to toggle between these themes.

#### Scenario: Toggling Light Mode
- GIVEN the dashboard is currently in Dark Mode
- WHEN the user clicks the Theme Toggle button
- THEN the application switches to Light Mode, updating the background colors, UI panel styles, and the map base tiles (osm cartocdn light / mapbox light style).
