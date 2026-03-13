# Design: Frontend Map Fixes and Light Mode

## Technical Approach

### 1. Map Draggability Fix
The core issue in `HubMapOSM.tsx` is the `MapUpdater` component. It accepts a newly instantiated array `[number, number]` for the `center` prop on every frame render (triggered by `setInterval`). This causes the `useEffect` dependency array to evaluate as changed, firing `map.flyTo` 15 times a second.
- **Fix:** Pass the `activeHub` string directly into the `MapUpdater` (or equivalent Mapbox effect). The effect will use `HUB_CONFIGS[activeHub].viewport.center` and only re-run when the `activeHub` string itself changes.

### 2. KL Data Visibility Fix
The GTFS-RT parser assigns modes like `BUS` or `RAIL`. The frontend `HubMap.tsx` and `HubMapOSM.tsx` expect the `mode` property in the GeoJSON feature properties to map to a color.
- **Investigation:** We need to verify what `mode` string the backend is emitting for KL and ensure `hub-config.ts` has a corresponding color entry, or handle missing modes gracefully with a fallback color instead of failing to render.
- **Fix:** Update `hub-config.ts` to explicitly map KL's specific transit modes, or normalize the modes in the Go adapter.

### 3. Light Mode Implementation
- **State Management:** Add a `theme` state (`'dark' | 'light'`) to `page.tsx`.
- **Styling:** Replace hardcoded colors (e.g., `bg-[#0E0F13]`, `bg-[#0A0B0E]`) with Tailwind classes like `bg-slate-50 dark:bg-[#0E0F13]`.
- **Map Base Layers:** 
  - For Leaflet (2D): Switch `url` between CartoDB Dark Matter (`dark_all`) and CartoDB Positron (`light_all`).
  - For Mapbox (3D): Switch `mapStyle` between Mapbox Dark and Mapbox Light.

## Architecture Decisions

### Decision: Client-Side Theme State
We will use a simple React state in `page.tsx` for the theme toggle rather than a complex Context provider or library like `next-themes`, to minimize structural changes and keep the implementation lightweight.

## File Changes
- `src/components/Mapbox/HubMapOSM.tsx` (modified)
- `src/components/Mapbox/HubMap.tsx` (modified)
- `src/app/page.tsx` (modified)
- `src/lib/hub-config.ts` (modified)
