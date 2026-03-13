# Design: KL Frontend Integration

## Technical Approach

Replace the mock-data, DOM-marker frontend with a live WebSocket pipeline feeding GPU-rendered GeoJSON layers on Mapbox. Add per-hub async loading so only the active hub's data flows through the render loop.

## Architecture Decisions

### Decision: `useRef` Vehicle State (not `useState`)
Storing 500+ vehicles in React state would trigger a full component tree re-render on every WebSocket message (~17 messages/second). Instead, store vehicles in a `useRef<Map>` and only update the Mapbox GeoJSON source directly — bypassing React's reconciliation entirely.

### Decision: GeoJSON Source + Circle Layer (not DOM markers)
Mapbox renders GeoJSON circle layers on the GPU via WebGL. A single `source.setData()` call updates all 500+ markers in one batch — zero DOM manipulation, zero layout thrashing. This is the standard pattern for real-time fleet tracking.

### Decision: Single WebSocket, Client-Side Filter
The backend already broadcasts all hub telemetry on `/ws`. Rather than adding hub-specific WS endpoints (backend change), we filter on the client: `if (telemetry.hub !== activeHub) return`. This keeps the backend untouched and works well for 2-3 hubs. Can optimize later with server-side filtering via query params.

### Decision: Linear Interpolation Between Polls
The KL API polls every 30s, but we render at 60fps. We store each vehicle's previous and current snapshot, then `lerp()` between them based on elapsed time. This creates smooth apparent motion without extrapolation artifacts.

## Data Flow Diagram

```
Backend WS (/ws)
    │ JSON: { id, hub, mode, lat, lon, speed, ... }
    ▼
useHubTelemetry(activeHub)
    │ filter: hub === activeHub
    │ store: vehiclesRef.current.set(id, { prev, curr, timestamp })
    ▼
requestAnimationFrame loop
    │ for each vehicle: lerp(prev, curr, progress)
    │ build GeoJSON FeatureCollection
    ▼
map.getSource('vehicles').setData(geojson)
    │ GPU renders circle layer
    ▼
60fps smooth rendering ✅
```

## File Changes

### New Files
- `src/hooks/useHubTelemetry.ts` — WebSocket connection, hub filtering, vehicle state, reconnection
- `src/lib/hub-config.ts` — per-hub viewport, colors, labels (Jakarta, KL, extensible)
- `src/lib/telemetry-types.ts` — TypeScript types matching backend `UrbanfluxTelemetry` JSON

### Modified Files
- `src/components/Mapbox/HubMap.tsx` — replace DOM markers with GeoJSON source + circle layer + animation loop using interpolated positions
- `src/app/page.tsx` — add hub selector, dynamic header, live vehicle count, health badge from WebSocket status
