# Changelog: Jakarta Adapter & Hub Maps (2026-03-02)

## Added
*   **Go Backend Hub Adapter Architecture:**
    *   Implemented standardized `UrbanfluxTelemetry` model (`models/telemetry.go`).
    *   Created universal `HubAdapter` interface (`adapters/adapter.go`).
    *   Developed fully mocked `TransjakartaAdapter` (`adapters/jakarta/transjakarta.go`) generating realistic local telemetry for Jakarta.
    *   Integrated adapter stream into the WebSocket Hub in `cmd/server/main.go` for real-time `JSON` broadcasting.
*   **Frontend 2D/3D Maps & Routing:**
    *   Refined 2D Map (`HubMapOSM.tsx`) z-index visibility logic.
    *   Added dynamic 2D/3D toggle in `page.tsx` (`mapMode` state).
    *   Upgraded `HubMap.tsx` with native Mapbox GL JS markers, geojson sources, and high-performance `requestAnimationFrame` polling.
    *   Extracted exact routing polyline coordinates for Transjakarta **Corridor 1 (Monas-Senayan)** via OSRM.
    *   Extracted exact routing polyline coordinates for Transjakarta **Corridor 6 (Blok M-Ragunan)** via OSRM.
*   **Typography & Styling:**
    *   Added globally injected `JetBrains Mono` font for precise metrics and technical data.

## Changed
*   Refactored `mock-telemetry.ts` routing arrays to support dynamic corridor assignment.
*   Updated `task.md` and created an `adapter_architecture.md` specification diagram.
