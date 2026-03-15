# Delta for Frontend

## ADDED Requirements

### Requirement: Custom Zoom Controls
The map interface MUST provide custom Zoom In (+) and Zoom Out (-) controls in the bottom right corner.
#### Scenario: User zooms the map
- GIVEN the map view is active
- WHEN the user clicks the custom Zoom In or Zoom Out buttons
- THEN the map zoom level should smoothly adjust accordingly, and the buttons should styled consistently with the application's dark premium aesthetic.

### Requirement: 2D-Only Map Mode
The dashboard MUST exclusively render the 2D map view.
#### Scenario: User navigates map
- GIVEN the user is on the dashboard
- WHEN viewing the data
- THEN only the 2D map is visible and there are no controls allowing a switch to a 3D view.

## MODIFIED Requirements

### Requirement: Sidebar Navigation
The layout MUST render the Sidebar navigation component.
#### Scenario: User views dashboard
- GIVEN the user loads the dashboard
- WHEN the screen is rendered
- THEN the Sidebar component is visible on the left side of the screen.

### Requirement: Topbar Glass Aesthetic
The top navigation bar MUST utilize a 20% transparent glassmorphism effect.
#### Scenario: User views the topbar
- GIVEN the topbar is rendered over the map
- WHEN the map content scrolls or pans underneath
- THEN the topbar should slightly blur the map and use an 80% opacity dark background (`bg-[#0E0F13]/80`).

### Requirement: Status Bar Aesthetics
The right-side metrics panel MUST be styled consistently as a unified status bar.
#### Scenario: User looks at metrics
- GIVEN the user is viewing active vehicles and telemetry
- WHEN looking at the right panel
- THEN the typography, padding, and card styles should look cohesive and polished, using Space Grotesk and JetBrains Mono fonts.

## REMOVED Requirements
- Removed the 3D map mode and associated UI toggle buttons.
