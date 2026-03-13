# Proposal: Frontend Map Fixes and Light Mode (KL & Jakarta)

## Intent
The Urbanflux hub platform currently suffers from usability and data visibility issues affecting the Kuala Lumpur hub, as well as an overly restrictive dark-only theme. The map's camera rigidly locks onto the center point, preventing user exploration (panning/dragging). Furthermore, vehicle data for Kuala Lumpur (Bus and Rail modes) is either not rendering or missing, rendering the hub functionally incomplete. Finally, to improve accessibility and user preference, a light mode theme is required.

## Scope
In scope:
- Fixing the map centering logic in `HubMap.tsx` and `HubMapOSM.tsx` to allow user panning and zooming after the initial hub selection fly-to animation.
- Diagnosing and fixing the missing Kuala Lumpur vehicle data (bus/train modes) on the frontend map.
- Adding a Light/Dark mode toggle to the frontend application, updating Tailwind utility classes and map basemaps to support both themes.
- Affected hubs: Kuala Lumpur, Jakarta.
- Affected components: Hub Platform Frontend.

Out of scope:
- Adding new hubs.
- Modifying backend scraping logic unless data format mismatches are the root cause of the missing KL vehicles.
- Landing page modifications.

## Approach
1.  **Map Draggability:** Refactor the `MapUpdater` (Leaflet) and Mapbox camera logic. Instead of firing `flyTo` on every render (due to array reference changes in the `useEffect` dependency array), we will track the *previous* `activeHub` and only execute `flyTo` when the hub string explicitly changes.
2.  **KL Data Visibility:** Inspect the telemetry payload structure for KL. Ensure the `mode` property in the GTFS-RT payload correctly maps to the modes defined in `hub-config.ts` (e.g., matching "rapid-bus-kl" to a known color). If the backend is returning unmapped modes, update the frontend configuration to display them.
3.  **Light Mode:** Implement a theme toggle state in `page.tsx` (or React Context). Update hardcoded dark hex colors (e.g., `#0E0F13`) to Tailwind dark mode variants (`dark:bg-[#0E0F13] bg-slate-50`). Switch the Leaflet tile layer URL and Mapbox style URL dynamically based on the current theme.
