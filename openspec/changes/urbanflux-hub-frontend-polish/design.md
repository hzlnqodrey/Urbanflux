# Design: Urbanflux Hub Frontend Polish 2

## Technical Approach
1. **Layout (`page.tsx`)**: Change the wrapper `div` to `flex flex-col`. Place the `header` first as full width. Below it, add a `flex-1 flex flex-row` container housing the `Sidebar` and the main dashboard content/map.
2. **Top Bar**: Update CSS to `bg-[#0E0F13]/40 backdrop-blur-xl border-b border-white/10`. Inside the top bar, add a React component `LiveTimeClock` or similar utility next to the hub selector.
3. **Sidebar (`Sidebar.tsx`)**: Change width from `w-[5.5rem]` to `w-[16rem]` (64). Update `NavItem` to render the label inline `<span className="ml-3 text-sm font-medium">{label}</span>` instead of an absolute hover tooltip. Left-align the buttons.
4. **Map Legend (`MapLegend.tsx`)**: Create a new component rendering a small glass panel at `absolute bottom-6 left-6`. Display colored dots and labels for Train, Bus, MRT, Tram. Incorporate into `page.tsx` overlay.
5. **Popups (`HubMapOSM.tsx`)**: Import `Popup` from `react-leaflet`. Inside our `vehicles.map()`, add a `<Popup>` to each `<Marker>`. The popup content will use Tailwind to look like a dark premium card. It will read `props.routeId` and simulated arrival/departure times.
6. **Telemetry & Colors**: 
   - Update `hub-config.ts` `modeColors` to exactly match the requested scheme: BUS: `#10B981` (Green), RAIL (Train): `#F59E0B` (Yellow), METRO (MRT): `#3B82F6` (Blue), TRAM: `#EC4899` (Pink).
   - Update `mock-telemetry.ts` to export buses with `mode: 'BUS'`, and add fake coordinates for a Train (`mode: 'RAIL'`), MRT (`mode: 'METRO'`), and Tram (`mode: 'TRAM'`) so all colors show up on the map.

## Architecture Decisions
### Decision: Leaflet Popups
React-leaflet Popups inject standard DOM elements. We will use a standard Tailwind styling inside the Popup and override leaflet's default white background CSS in `globals.css` (e.g., `.leaflet-popup-content-wrapper { background: #0E0F13; }`).

## File Changes
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/Dashboard/Sidebar.tsx`
- `src/components/Mapbox/HubMapOSM.tsx`
- `src/components/Mapbox/MapLegend.tsx` (NEW)
- `src/lib/hub-config.ts`
- `src/lib/mock-telemetry.ts`
