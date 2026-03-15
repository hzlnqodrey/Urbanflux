# Tasks

## 1. Layout & Top Bar Aesthetics
- [x] 1.1 Restructure `app/page.tsx` so the top navigation bar spans the full width of the screen, staying above the sidebar.
- [x] 1.2 Modify the top bar styling to use a 40% transparent glassmorphism effect with heavy background blur.
- [x] 1.3 Add an aesthetic map utility component (e.g., a Live Time Clock widget) into the top bar.

## 2. Sidebar Enhancements
- [x] 2.1 Expand the width of `Sidebar.tsx` to 16rem (64).
- [x] 2.2 Modify `NavItem` in `Sidebar.tsx` to permanently render the text labels next to the icons horizontally, rather than using hover tooltips.

## 3. Map Legend & Mode Differentiation
- [x] 3.1 Update `hub-config.ts` so `modeColors` accurately reflect the requested scheme (Bus: Green `#10B981`, Rail: Yellow `#F59E0B`, Metro: Blue `#3B82F6`, Tram: Pink `#EC4899`).
- [x] 3.2 Add new mock vehicles in `mock-telemetry.ts` representing a Train (RAIL), MRT (METRO), and Tram (TRAM) with appropriate initial coordinates so all colors are visible.
- [x] 3.3 Create a new `MapLegend.tsx` component that floats in the bottom-left corner of the maps showcasing the color coding.
- [x] 3.4 Integrate `MapLegend` into `page.tsx` or `HubMapOSM.tsx`.

## 4. Map Node Interaction Popups
- [x] 4.1 Update `HubMapOSM.tsx` to render a `react-leaflet` `<Popup>` inside each vehicle `<Marker>`.
- [x] 4.2 Restyle the default `.leaflet-popup` in `globals.css` to match the dark premium aesthetic.
- [x] 4.3 Populate the popup HTML with the `routeId`, and simulated departure/arrival text strings.

## 5. Review & Testing
- [x] 5.1 Run application to verify the Top Bar is full-width and glassmorphism is active.
- [x] 5.2 Validate the Sidebar labels are permanently visible.
- [x] 5.3 Click multiple mode markers to verify colored popups and correct data display.
- [x] 5.4 Ensure visual hierarchy and "Dark Enterprise" aesthetic are maintained.
