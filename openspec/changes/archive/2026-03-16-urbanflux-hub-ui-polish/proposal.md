# Proposal: Urbanflux-hub UI Polish

## Intent
The Urbanflux-hub dashboard needs several UI refinements to improve the user experience and visual aesthetic. These changes include fixing the missing Sidebar, refining the Topbar glassmorphism, streamlining the map experience to 2D (disabling 3D for now), improving the right-side Status Bar, ensuring consistent typography (Space Grotesk & JetBrains Mono), and adding a custom Zoom utility.

## Scope
Affected: Hub Platform (Frontend)
Hubs: All Hubs (Jakarta, Istanbul, Switzerland, Japan)

In scope:
- Re-integrating the `Sidebar` component into the `page.tsx` layout structure.
- Adjusting the `Topbar` transparency to a 20% glass effect.
- Forcing the map default experience to 2D, removing the 2D/3D toggle controls.
- Redesigning and polishing the right-sided real-time Status Bar (telemetry metrics).
- Verifying the use of `Space_Grotesk` and `JetBrains_Mono` fonts.
- Adding elegant, custom Zoom in/out controls matching the dark premium enterprise aesthetic.

Out of scope:
- Backend or telemetry feed modifications.
- Modifications to the Landing Page.
- Significant new map features (e.g., transit corridors, layers, additional popups) beyond zoom controls.

## Approach
We will modify the main dashboard layout (`app/page.tsx`) to insert the `<Sidebar />` component alongside the main content area. Next, we will update the Tailwind classes on the Topbar to achieve the 20% glass effect (`bg-[#0E0F13]/80` instead of `bg-white/90` or `glass-panel-light`). We will strip out the `3D View` toggle states and force `<HubMapOSM>` to render exclusively. The right-hand telemetry metrics panels will receive a styling pass to unify their typography, padding, and layout for a more cohesive "status bar" feel. Lastly, we will construct a clean Zoom utility overlay in the bottom-right corner utilizing standard map interactions (e.g., manipulating the Mapbox/Leaflet instance).
