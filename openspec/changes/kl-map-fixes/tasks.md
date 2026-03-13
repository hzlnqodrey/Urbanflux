# Tasks

## 1. Map Draggability Fix
- [x] 1.1 Update `HubMapOSM.tsx`: Refactor `MapUpdater` to depend on `activeHub` string, not a dynamic `center` array.
- [x] 1.2 Update `HubMap.tsx`: Ensure Mapbox `flyTo` logic is strictly tied to `activeHub` changes, not render cycles.
- [x] 1.3 Verify user can drag and pan both 2D and 3D maps freely.

## 2. Kuala Lumpur Data Visibility
- [x] 2.1 Inspect backend payload to identify the exact `mode` string emitted for KL RapidBus and RapidRail.
- [x] 2.2 Update `src/lib/hub-config.ts` to map KL modes to distinct colors. (Note: already mapped, but fixed backend buffer dropping 95% of KL bus data).
- [x] 2.3 Verify bus and rail markers scale and render correctly for KL. (Rail API is down with 404 from .gov.my, but Bus is rendering).

## 3. Light Mode Theme
- [x] 3.1 Add `theme` state (`'light' | 'dark'`) to `src/app/page.tsx`.
- [x] 3.2 Add a Sun/Moon toggle button to the top navbar.
- [x] 3.3 Refactor hardcoded hex backgrounds in `page.tsx` to use Tailwind `dark:` variants.
- [x] 3.4 Update `HubMapOSM.tsx` to dynamically switch CartoDB tile URLs based on theme.
- [x] 3.5 Update `HubMap.tsx` to dynamically switch Mapbox styles based on theme.
