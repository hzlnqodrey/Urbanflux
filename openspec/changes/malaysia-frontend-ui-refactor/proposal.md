# Proposal: UI Refactoring & KL Corridor Polylines

## Intent

Following user review, we are refining the Hub Platform map UI. Currently, the hub selector is a single dropdown containing all hubs. We will refactor this to a two-step cascaded selection: "Country -> Hub". Additionally, we will introduce routing polylines for the Kuala Lumpur map to visualize major transit corridors (e.g. LRT Kelana Jaya, MRT Kajang), and verify that RapidKL/KTMB vehicles are fully visible when viewing Kuala Lumpur. 

## Scope

**In scope:**
- Add `country` property to all entries in `hub-config.ts`
- Refactor the navbar in `page.tsx` to include an "Active Country" dropdown and an "Active Hub" dropdown.
- Manually generate simplified routing polylines for KL's major rail corridors (Kelana Jaya, Kajang).
- Render these polylines in the `HubMapOSM.tsx` component when Kuala Lumpur is selected.

**Out of scope:**
- Modifying backend adapters (KTMB and RapidKL are already implemented and streaming correctly).
- Adding highly detailed OSM-level polyline traces for the entirety of KL (simplified line strings linking major stations will be used for performance and aesthetic purposes).

## Approach

1. **Config Update**: Update `HUB_CONFIGS` with country metadata (`Indonesia`, `Malaysia`, `Japan`, etc).
2. **UI Refactor**: Modify `page.tsx` state to maintain `activeCountry`. Create cascaded logic so that selecting "Malaysia" restricts the Hub dropdown to Malaysian cities.
3. **KL Map Lines**: Add static coordinates for the LRT and MRT lines in `mock-telemetry.ts` and conditionally render `<Polyline>` components in `HubMapOSM.tsx` when `activeHub === 'kuala-lumpur'`.
