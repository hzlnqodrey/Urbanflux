# Tasks

## 1. TypeScript Types & Hub Config
- [x] 1.1 Create `src/lib/telemetry-types.ts` — `VehicleTelemetry` type matching backend JSON
- [x] 1.2 Create `src/lib/hub-config.ts` — hub registry with viewport, display name, color theme per mode

## 2. WebSocket Telemetry Hook
- [x] 2.1 Create `src/hooks/useHubTelemetry.ts` — WebSocket connection to backend `/ws`
- [x] 2.2 Implement hub-based message filtering
- [x] 2.3 Implement vehicle state storage in `useRef<Map>`
- [x] 2.4 Implement `getVehiclesGeoJSON()` with lerped positions
- [x] 2.5 Implement WebSocket reconnection with exponential backoff
- [x] 2.6 Expose `connectionStatus` and `vehicleCount`
- [x] 2.7 Clear vehicle state on hub switch

## 3. Mapbox Map Refactor
- [x] 3.1 Refactor `HubMap.tsx` — remove all DOM marker logic
- [x] 3.2 Add GeoJSON source `vehicles` on map load
- [x] 3.3 Add `circle` layer with data-driven `circle-color` from `mode`
- [x] 3.4 Add outer `glow` circle layer
- [x] 3.5 Implement `requestAnimationFrame` loop → `source.setData()` each frame
- [x] 3.6 Accept `activeHub` prop — trigger `map.flyTo()` when hub changes
- [x] 3.7 Keep corridor polylines for Jakarta, hide for KL

## 4. Dashboard Page Updates
- [x] 4.1 Add `activeHub` state to `page.tsx`
- [x] 4.2 Add hub selector UI (pill toggle: Jakarta | Kuala Lumpur)
- [x] 4.3 Update header title dynamically from hub config
- [x] 4.4 Wire health badge to WebSocket `connectionStatus`
- [x] 4.5 Wire "Active Vehicles" metric card to live `vehicleCount`
- [x] 4.6 Pass `activeHub` to `HubMap` component

## 5. Verification
- [x] 5.1 Run `npm run build` — verify TypeScript compilation ✅ (5.0s, 0 errors)
- [x] 5.2 Fix pre-existing `@types/mapbox__point-geometry` broken package
- [ ] 5.3 Verify hub switching with running backend (`go run ./cmd/server`)
