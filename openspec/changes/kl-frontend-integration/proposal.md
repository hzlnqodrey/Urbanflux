# Proposal: KL Frontend Integration

## Intent

Connect the Urbanflux frontend to the live backend WebSocket, replace DOM markers with GPU-rendered GeoJSON layers for scalable real-time vehicle rendering, add a hub selector for async per-hub data loading, and enable smooth 60fps rendering with client-side interpolation between 30-second API polls.

This change transforms the frontend from a **single-hub mock demo** into a **multi-hub live dashboard** capable of rendering 500+ vehicles without frame drops.

## Scope

**In scope:**
- `useHubTelemetry` WebSocket hook — connects to backend `/ws`, filters by active hub, stores vehicle state in `useRef` (no React re-renders per frame)
- Replace DOM markers with Mapbox GeoJSON source + circle/symbol layer (GPU-rendered, 1 draw call for all vehicles)
- Hub selector in the top navbar — switch between Jakarta ↔ Kuala Lumpur, with lazy data loading
- Client-side position interpolation — smooth 60fps between 30s poll snapshots
- Hub-specific map viewport config (center, zoom) with animated `flyTo` transitions
- Dynamic metric cards — vehicle count, health status from `/health` endpoint
- Mode-based marker coloring (BUS = cyan, RAIL = emerald, METRO = violet, etc.)

**Out of scope:**
- Backend WebSocket changes (current `/ws` broadcasts all hubs — client filters)
- Leaflet 2D map refactor (focus on Mapbox 3D map only — 2D will follow)
- Route corridor overlays for KL (needs route shape data, separate change)
- Mobile responsive layout (future change)

## Approach

1. Create `useHubTelemetry` hook — WebSocket + vehicle state management + interpolation
2. Create hub config registry — coordinates, zoom, color themes per hub
3. Refactor `HubMap.tsx` — replace DOM markers with GeoJSON source + circle layer
4. Add hub selector to `page.tsx` navbar
5. Wire dynamic metrics (vehicle count, health badge) from live data
6. Polish transitions (flyTo on hub switch, marker fade-in/out)
