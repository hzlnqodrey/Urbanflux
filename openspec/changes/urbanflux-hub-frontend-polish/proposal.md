# Proposal: Urbanflux Hub Frontend Polish 2

## Intent
Implement a series of requested frontend UI enhancements to improve the layout, usability, and visual aesthetics of the Urbanflux Hub dashboard. This includes restructuring the layout for a full-width top navigation bar, applying proper glassmorphism, improving the sidebar visibility, adding map legends and interactive popups, and differentiating transit modes by color.

## Scope
In scope:
- Refactoring `page.tsx` layout so the top bar spans full width from left to right.
- Adjusting the top bar styling to a true transparent glassmorphism effect.
- Adding aesthetic map/time utility information to the top bar.
- Expanding the Sidebar to permanently display the educated-guess text labels next to the icons.
- Creating a `MapLegend` component for the bottom-left of the map.
- Adding a click-to-open `Popup` card on Map markers displaying detailed info (Corridor, Departure/Arrival).
- Updating telemetry mocks and hub configs to use specific colors for different transit modes (Bus = Green, Train = Yellow, MRT = Blue, Tram = Pink) and injecting diverse mock vehicles.

Out of scope:
- Backend telemetry server changes (only frontend mock updates are in scope).

## Approach
We will change the main CSS layout in `page.tsx` to a standard column flex layout containing the topbar, followed by a row flex layout containing the sidebar and map. We'll update the `Sidebar.tsx` width and reveal the labels. We'll build a `MapLegend.tsx` overlay. In `HubMapOSM.tsx`, we'll wrap marker contents in standard Leaflet `<Popup>` components containing Tailwind-styled HTML. Finally, `mock-telemetry.ts` will be updated to supply multiple transit modes to properly demonstrate the colored dots and legends.
