# Design: Urbanflux-hub UI Polish

## Technical Approach
The changes are strictly limited to the `frontend` Next.js application, primarily focusing on React components and Tailwind CSS styles.

- **Sidebar**: Wraps the `Sidebar` and the current `flex-1` layout inside a parent flex container so the Sidebar rendering doesn't obscure the Map. Or, place the Map absolutely behind and lay the Sidebar and content flex over it. Given the current `absolute inset-0 z-10 pointer-events-none flex` setup, the `Sidebar` can simply be the first child inside this flex container.
- **Topbar**: Modify the `header` className in `app/page.tsx` to `bg-[#0E0F13]/80 backdrop-blur-md border-b border-white/10`.
- **2D Mode**: Completely remove the `mapMode` state in `app/page.tsx`. Delete instances of `HubMap` component lazy loading and render. Only use `<HubMapOSM>`.
- **Zoom Controls**: The `HubMapOSM.tsx` component is currently using `react-leaflet`, which has a `<ZoomControl position="bottomright" />` which is default. Wait! Leaflet's default is white. I will create custom React DOM buttons positioned `absolute bottom-6 right-6` in `app/page.tsx` that trigger zoom events via standard state or context, OR wrap Leaflet functionality. Actually, since `react-leaflet` allows custom controls, or we can just hide the default and overlay buttons. Let's overlay generic buttons in `page.tsx` and pass zoom events down. Wait, passing refs to maps is tricky. It's easier to create a `<CustomZoomControl />` component inside the MapContainer.
- **Fonts**: `layout.tsx` is already setup for Space Grotesk and JetBrains Mono. Verify that `font-sans` maps to Space Grotesk and `font-mono` maps to JetBrains Mono in globals.css. (It does). Add consistent font classes to the right status panel.
- **Status Bar**: Clean up the right panel's styling (spacing, borders) in `page.tsx`.

## Architecture Decisions
### Decision: Leaflet 2D vs Mapbox 2D
For 2D mode, the `HubMapOSM.tsx` currently uses Leaflet + Carto tiles. `HubMap.tsx` uses Mapbox GL JS. Since we are removing 3D, and the prompt implies focusing solely on 2D, we will use the `HubMapOSM` Leaflet setup, as it is already the designated '2D map' in the code.

### Decision: Zoom UI Implementation
We will replace the default `react-leaflet` `<ZoomControl>` with a custom React component that uses the `useMap` hook from `react-leaflet` to interact with the map zoom. This ensures perfect control over the Tailwind styling for the buttons.

## File Changes
- `src/app/page.tsx` (modified): Layout structure, topbar styles, 2D rendering, Sidebar insert, status bar polish.
- `src/components/Mapbox/HubMapOSM.tsx` (modified): Removing default ZoomControl and adding custom ZoomControl component.
- `src/components/Mapbox/HubMap.tsx` (modified): To be phased out or left dormant (we will just not render it).
