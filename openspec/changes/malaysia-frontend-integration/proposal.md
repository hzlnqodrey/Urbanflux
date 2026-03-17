# Proposal: Malaysia Frontend Integration

## Intent

Connect the frontend hub platform to the newly added Malaysia GTFS-RT backend adapters. The backend now streams 17 Malaysia adapters across 12 cities — the frontend needs hub configurations for each city so users can switch between them and see live vehicle positions on the map.

## Scope

**In scope:**
- Add `HubConfig` entries for all 10 new Malaysia sub-hubs in `hub-config.ts`
- Each config includes: display name, timezone, viewport (map center/zoom), and mode colors
- The hub selector dropdown auto-populates from `HUB_IDS`
- Test frontend connects to backend WebSocket and shows live vehicles

**Out of scope:**
- New map layers or corridors for non-Jakarta hubs
- Hub grouping/hierarchy UI (Malaysia → sub-hubs)
- New dashboard components or metrics panels
- Frontend build/deployment changes

**Affected hubs:** All 12 Malaysia sub-hubs (penang, kuantan, kangar, alor-setar, kota-bharu, kuala-terengganu, ipoh, seremban, melaka, johor-bahru, kuching + existing kuala-lumpur)
**Affected component:** Frontend only
**API dependency:** Backend WebSocket at `ws://localhost:8080/ws`

## Approach

1. Add 10 new entries to `HUB_CONFIGS` in `hub-config.ts` with correct GPS coordinates and zoom levels
2. The existing `useHubTelemetry` hook filters by `hub` field — no changes needed
3. The `HubMapOSM` component renders any hub's vehicles via GeoJSON — no changes needed  
4. Test end-to-end: start backend → start frontend → select Malaysia hub → verify live dots appear
