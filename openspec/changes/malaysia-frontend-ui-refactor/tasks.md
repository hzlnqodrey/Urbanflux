# Tasks

## 1. Hub Configuration Update
- [x] 1.1 Add `country` property to `HubConfig` interface in `frontend/src/lib/hub-config.ts`
- [x] 1.2 Update all existing hub definitions with their respective countries (Indonesia, Malaysia)

## 2. Mock Polylines
- [x] 2.1 Add `KL_LRT_KJ_COORDS` to `frontend/src/lib/mock-telemetry.ts`
- [x] 2.2 Add `KL_MRT_KG_COORDS` to `frontend/src/lib/mock-telemetry.ts`

## 3. UI Refactoring
- [x] 3.1 Update `frontend/src/app/page.tsx` state to include `activeCountry`
- [x] 3.2 Derive a list of unique countries from `HUB_CONFIGS`
- [x] 3.3 Create a Country select dropdown in the Top Navbar
- [x] 3.4 Filter the Hub dropdown to only show hubs belonging to `activeCountry`
- [x] 3.5 Make sure `activeHub` automatically selects the first valid hub when `activeCountry` changes

## 4. Map Rendering
- [x] 4.1 Update `frontend/src/components/Mapbox/HubMapOSM.tsx` to accept the new KL coordinates
- [x] 4.2 Render KL polylines conditionally when `activeHub === 'kuala-lumpur'`
