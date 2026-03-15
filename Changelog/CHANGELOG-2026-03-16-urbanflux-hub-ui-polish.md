# Changelog: Urbanflux Hub UI Polish & Fluidity (2026-03-16)

## Added
*   **Top Bar Enhancements:**
    *   Implemented full-width top navigation bar layout.
    *   Applied refined glassmorphism theme with improved transparency constraints.
    *   Moved the light/dark map theme toggle directly into the top bar for better accessibility.
    *   Integrated a live local `LiveTimeClock` utility in the header to display functional aesthetic info.

*   **Interactive Fluid Map Controls (`useDraggable`):**
    *   Developed a custom reusable `useDraggable` hook to securely memorize floating component positions.
    *   Created `MapControls` component to manage layers (Trains, Stations), map types (Dark/Light/Satellite/Terrain), and real-time panning.
    *   Ensured Map Controls are fluidly draggable across the display viewport without `pointer-events` interference.

*   **Map Integrations (`HubMapOSM.tsx`):**
    *   Introduced a dynamic `MapLegend` component directly below the Map Controls mapping active transit modes.
    *   Configured node popup cards appearing upon marker click displaying live `id`, `routeId`, `mode`, `speed`, and estimated arrival details.
    *   Differentiated marker properties across `BUS` (Emerald), `RAIL` (Amber), `METRO` (Azure), and `TRAM` (Pink) via `mock-telemetry.ts` simulation data and real-time backend output streams.

## Changed
*   **Collapsible Sidebar:**
    *   Rebuilt the Sidebar to support an expanded (18rem) and collapsed (5rem) state using fluid transition animations.
    *   Integrated intelligent tooltips visible only when hovered in collapsed mode.
    *   Added a hamburger toggle menu to the top bar.
    *   Updated the navigation item icons with logical educated guesses based on the feature labels.

*   **Telemetry Simulation:**
    *   Augmented Go backend adapter (`transjakarta.go`) mock streams to simultaneously generate updates for `RAIL`, `METRO`, `TRAM`, and `BUS`.
    *   Redefined `BusTelemetry` globally to support the generic `mode` property across endpoints.
