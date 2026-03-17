# Design: Malaysia Frontend Integration

## Technical Approach

Add hub configurations to `hub-config.ts` — the **only file that needs changes**. The existing WebSocket hook, map component, and telemetry types are fully generic and work for any hub.

## Architecture Decisions

### Decision: Minimal Touch — Config Only
The frontend architecture was designed with hub-agnostic patterns:
- `useHubTelemetry` filters by `hub` field from the WebSocket → works for any hub
- `HubMapOSM` renders GeoJSON features → works for any hub  
- `page.tsx` reads `HUB_IDS` from the config → auto-populates dropdown

Adding a new hub = adding one config object. No component changes needed.

### Decision: Viewport Coordinates per City
Each hub gets accurate GPS center coordinates and appropriate zoom level. Malaysian cities vary from dense urban (KL at zoom 12) to smaller towns (Kangar at zoom 13).

## File Changes

### Modified Files
- `frontend/src/lib/hub-config.ts` — add 10 new `HubConfig` entries

### No Changes Needed
- `frontend/src/hooks/useHubTelemetry.ts` — already hub-agnostic
- `frontend/src/components/Mapbox/HubMapOSM.tsx` — already hub-agnostic
- `frontend/src/lib/telemetry-types.ts` — already matches backend types
- `frontend/src/app/page.tsx` — already reads `HUB_IDS` dynamically
