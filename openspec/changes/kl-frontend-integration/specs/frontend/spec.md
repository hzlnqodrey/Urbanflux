# Delta for Frontend Domain

## ADDED Requirements

### Requirement: WebSocket Telemetry Hook
A `useHubTelemetry` React hook SHALL manage the real-time data pipeline from the backend WebSocket to the map layer.

- SHALL connect to the backend WebSocket endpoint (`ws://<host>/ws`)
- SHALL filter incoming telemetry by the active hub name (e.g. `hub === "kuala-lumpur"`)
- SHALL store vehicle positions in a `useRef<Map<string, VehicleTelemetry>>` to avoid triggering React re-renders on every message
- SHALL track interpolation state: previous position, current position, and timestamp per vehicle
- SHALL expose a `getVehiclesGeoJSON()` function that returns a GeoJSON FeatureCollection with interpolated positions
- SHALL handle WebSocket reconnection with exponential backoff on disconnect
- SHALL expose connection status (`CONNECTING`, `CONNECTED`, `DISCONNECTED`) for the UI health badge

#### Scenario: receive-kl-telemetry
- GIVEN the user has selected hub "kuala-lumpur"
- AND the WebSocket is connected
- WHEN the backend sends a telemetry event with `hub: "kuala-lumpur"`, `mode: "BUS"`
- THEN the vehicle SHALL appear in `getVehiclesGeoJSON()` with correct coordinates and properties
- AND the previous position SHALL be stored for interpolation

#### Scenario: filter-other-hubs
- GIVEN the user has selected hub "kuala-lumpur"
- WHEN the backend sends a telemetry event with `hub: "jakarta"`
- THEN the event SHALL be silently ignored

#### Scenario: ws-reconnect
- GIVEN the WebSocket disconnects unexpectedly
- WHEN the hook detects the disconnection
- THEN it SHALL attempt reconnection with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- AND the status SHALL change to `DISCONNECTED` → `CONNECTING` → `CONNECTED`

---

### Requirement: GeoJSON Vehicle Layer
Vehicle positions SHALL be rendered using a Mapbox GeoJSON source and circle/symbol layer instead of DOM markers.

- SHALL use `map.addSource('vehicles', { type: 'geojson', data: ... })` with a single GeoJSON FeatureCollection
- SHALL use a `circle` layer with `circle-color` driven by the vehicle's `mode` property
- SHALL update the GeoJSON source every animation frame via `source.setData(geojson)` with interpolated positions
- SHALL NOT create any HTML/DOM elements for vehicle markers (no `mapboxgl.Marker`, no `L.divIcon`)
- SHALL support 500+ simultaneous vehicle points at 60fps

#### Scenario: render-500-vehicles
- GIVEN 500 vehicle positions in the GeoJSON source
- WHEN the map renders a frame
- THEN the frame SHALL complete within 16ms (60fps target)
- AND no DOM markers SHALL exist in the page

#### Scenario: mode-based-coloring
- GIVEN vehicles with different modes (BUS, RAIL, METRO)
- WHEN rendered on the map
- THEN BUS vehicles SHALL be cyan (#00E0FF), RAIL vehicles SHALL be emerald (#00C27A), METRO vehicles SHALL be violet (#7C3AED)

---

### Requirement: Hub Selector & Async Loading
The dashboard SHALL support switching between hubs with lazy data loading.

- SHALL display a hub selector in the top navbar (dropdown or toggle buttons)
- SHALL support at minimum: "Jakarta" and "Kuala Lumpur" hubs
- SHALL only load WebSocket data for the active hub (client-side filter)
- SHALL animate the map camera to the selected hub's viewport via `map.flyTo()`
- SHALL update the header title, health badge, and metric cards to reflect the active hub
- SHALL clear previous hub's vehicle data from the map on hub switch

#### Scenario: switch-to-kl
- GIVEN the user is viewing Jakarta
- WHEN the user clicks "Kuala Lumpur" in the hub selector
- THEN the map SHALL animate to KL's viewport (center: [101.69, 3.14], zoom: 12)
- AND the header SHALL update to "Kuala Lumpur Hub"
- AND Jakarta vehicle markers SHALL be cleared
- AND KL vehicles SHALL begin appearing within the next poll interval (≤30s)

---

### Requirement: Client-Side Position Interpolation
Vehicle positions SHALL be smoothly interpolated between poll snapshots for fluid rendering.

- SHALL store `previousPosition` and `currentPosition` per vehicle
- SHALL compute `progress = (now - lastUpdateTime) / pollInterval`
- SHALL linearly interpolate lat/lon: `lerp(prev, curr, clamp(progress, 0, 1))`
- SHALL clamp interpolation at `progress >= 1` (don't extrapolate beyond last known position)

#### Scenario: smooth-movement
- GIVEN a vehicle at position A at time T, and position B at time T+30s
- WHEN the animation frame renders at time T+15s
- THEN the vehicle SHALL appear at the midpoint between A and B

## MODIFIED Requirements

### Requirement: Dashboard Page Layout
- MODIFIED: Header title SHALL be dynamic based on active hub (was hardcoded "Jakarta Central Hub")
- MODIFIED: Health badge SHALL reflect live WebSocket connection status (was hardcoded "Connected")
- MODIFIED: Active Vehicles count SHALL be computed from live vehicle data (was hardcoded "1,492")

## REMOVED Requirements

_(none)_
