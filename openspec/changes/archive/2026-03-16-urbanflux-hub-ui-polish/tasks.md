# Tasks

## 1. Frontend Layout & Polish (app/page.tsx)
- [ ] 1.1 Insert the `<Sidebar />` component into the `absolute inset-0 flex` container on the left side.
- [ ] 1.2 Update the `<header>` (Topbar) styles to be a 20% transparent glass panel (`bg-[#0E0F13]/80 backdrop-blur-md border-b border-white/10`).
- [ ] 1.3 Remove the `mapMode` state and its associated UI toggle buttons.
- [ ] 1.4 Hardcode the application to only render `<HubMapOSM>` and remove the 3D Mapbox component from the render tree.
- [ ] 1.5 Polish the Right Panel (Status Bar) metric cards. Check spacing, typography (`font-mono` where digits are displayed), and padding for a cohesive "Enterprise Dark" feel.

## 2. Shared Map Controls (HubMapOSM.tsx)
- [ ] 2.1 Remove the default `<ZoomControl />` from `react-leaflet`.
- [ ] 2.2 Create a custom React component `CustomZoomControl` using `useMap` hook.
- [ ] 2.3 Style `CustomZoomControl` buttons with `+` and `-` icons, placing them visually in the bottom right corner with appropriate glassmorphism styling.

## 3. Review & Testing
- [ ] 3.1 Run frontend and ensure the Sidebar does not block map interactions.
- [ ] 3.2 Ensure the topbar has the proper transparency.
- [ ] 3.3 Verify zooming functions smoothly using the new custom buttons.
- [ ] 3.4 Ensure the new Dark Premium visual design is consistent.
