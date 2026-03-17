# Design: UI Refactoring & KL Corridor Polylines

## Technical Approach

### Country / Hub Cascaded Dropdown
The UI currently lacks hierarchical organization for its growing list of Hubs. 
We will augment `HubConfig` with a `country: string` attribute. In `page.tsx`, we will compute a list of unique countries, and derive the filtered list of available hubs based on the selected country to populate the secondary dropdown. 

### KL Corridors
We will provide basic corridor geometry for visual context on the Kuala Lumpur hub map. We will inject static `[lat, lon][]` arrays to represent:
1. LRT Kelana Jaya Line (Pink/Red)
2. MRT Kajang Line (Green)

These arrays will be added to `src/lib/mock-telemetry.ts` (as `KL_LRT_KJ_COORDS` and `KL_MRT_KG_COORDS`) and rendered via `react-leaflet`'s `Polyline` component inside `HubMapOSM.tsx`.

## Architecture Decisions

### Decision: Simplified Polylines
Instead of downloading and parsing MBs of OpenStreetMap relation data for exact track curves, we will employ a straight-line point-to-point approach connecting major stations (e.g. KL Sentral -> Pasar Seni -> Masjid Jamek). This reduces bundle size significantly while maintaining the desired visual aesthetic of "transit corridors". 

## File Changes

### Modified Files
- `frontend/src/lib/hub-config.ts`: Added `country` property.
- `frontend/src/app/page.tsx`: Added Country dropdown, added state propagation logic.
- `frontend/src/lib/mock-telemetry.ts`: Added KL coordinate arrays.
- `frontend/src/components/Mapbox/HubMapOSM.tsx`: Added KL conditional polyline rendering.
