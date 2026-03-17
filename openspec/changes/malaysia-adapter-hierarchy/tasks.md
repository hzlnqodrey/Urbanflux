# Tasks: Malaysia Adapter Hierarchy Restructure

## 1. Backend Directory Restructure

- [ ] 1.1 Create new Malaysia adapter directory structure (`internal/adapters/malaysia/`)
- [ ] 1.2 Create hub subdirectories (kualalumpur, penang, kuantan, kangar, alor-setar, kota-bharu, kuala-terengganu, ipoh, seremban, melaka, johor-bahru, kuching)
- [ ] 1.3 Create operator subdirectories under each hub (prasarana/, ktmb/, mybas/)
- [ ] 1.4 Move Kuala Lumpur Prasarana adapters to `malaysia/kualalumpur/prasarana/` using `git mv`
- [ ] 1.5 Move KTMB adapter to `malaysia/kualalumpur/ktmb/` using `git mv`
- [ ] 1.6 Move Penang Prasarana adapter to `malaysia/penang/prasarana/` using `git mv`
- [ ] 1.7 Move Kuantan Prasarana adapter to `malaysia/kuantan/prasarana/` using `git mv`
- [ ] 1.8 Move all BAS.MY adapters to respective city `mybas/` subdirectories using `git mv`

## 2. Backend Import Path Updates

- [ ] 2.1 Update import paths in `cmd/server/main.go` for all Malaysia adapters
- [ ] 2.2 Update import paths in all `*_test.go` files for moved adapters
- [ ] 2.3 Verify no broken imports with `go mod tidy`
- [ ] 2.4 Verify compilation with `go build ./...`
- [ ] 2.5 Run backend tests to ensure no regressions (`go test ./...`)

## 3. Mock Data Implementation

- [ ] 3.1 Create `internal/adapters/base/mock_adapter.go` with `MockAdapter` struct
- [ ] 3.2 Implement vehicle generation with realistic positioning (hub bounding boxes)
- [ ] 3.3 Implement movement simulation (interpolated positions between polls)
- [ ] 3.4 Implement random occupancy, status, and bearing assignment
- [ ] 3.5 Add vehicle ID generation following Malaysia operator conventions (RKL-BUS-XXXX, KTMB-ETS-XXXX)
- [ ] 3.6 Add route ID assignment based on hub and operator
- [ ] 3.7 Implement next stop name simulation for each hub
- [ ] 3.8 Add environment variable parsing (`MOCK_DATA`, `MOCK_VEHICLE_COUNT`, `MOCK_UPDATE_INTERVAL`)
- [ ] 3.9 Implement auto-fallback to mock data after 5 consecutive API failures
- [ ] 3.10 Create unit tests for mock data generator
- [ ] 3.11 Test mock data mode with `MOCK_DATA=true go run cmd/server/main.go`

## 4. Backend Configuration & Documentation

- [ ] 4.1 Document all Malaysia GTFS-RT endpoints as constants in adapter files
- [ ] 4.2 Update `CLAUDE.md` with new adapter hierarchy structure
- [ ] 4.3 Document Malaysia-specific adapter patterns for future onboarding
- [ ] 4.4 Add mock data configuration guide to README or CLAUDE.md
- [ ] 4.5 Verify hub IDs match between backend adapters and frontend config

## 5. Frontend Verification

- [ ] 5.1 Audit `frontend/src/lib/hub-config.ts` for all 13 Malaysia hubs
- [ ] 5.2 Verify hub IDs match backend adapter configurations (kuala-lumpur, penang, kuantan, etc.)
- [ ] 5.3 Validate viewport coordinates for each Malaysia hub
- [ ] 5.4 Ensure `modeColors` use shared `MALAYSIA_MODE_COLORS` palette
- [ ] 5.5 Test WebSocket connection with restructured backend locally
- [ ] 5.6 Verify vehicle markers render correctly for all Malaysia hubs
- [ ] 5.7 Test hub switching between different Malaysia cities

## 6. Testing & Validation

- [ ] 6.1 Run unit tests for all moved adapters (`go test ./internal/adapters/malaysia/...`)
- [ ] 6.2 Run integration test: Start backend and verify all adapters register
- [ ] 6.3 Run integration test: Query `/health` endpoint and verify Malaysia adapter status
- [ ] 6.4 Run integration test: Connect WebSocket and verify telemetry streams
- [ ] 6.5 Test each Malaysia hub individually (13 hubs total)
- [ ] 6.6 Verify mock data generates correct telemetry format
- [ ] 6.7 Verify mock data toggle works (env var on/off)
- [ ] 6.8 Test auto-fallback to mock data on API failure
- [ ] 6.9 Run Playwright E2E tests for frontend (if applicable)
- [ ] 6.10 Load test: Verify all 13+ adapters streaming simultaneously

## 7. CI/CD Updates

- [ ] 7.1 Verify GitHub Actions workflow (`hubs-ci.yml`) passes with new structure
- [ ] 7.2 Update CI workflow if any path filters affected by adapter moves
- [ ] 7.3 Ensure Docker build succeeds with restructured backend
- [ ] 7.4 Test Docker container startup and health checks

## 8. Deployment Preparation

- [ ] 8.1 Build production Docker image locally
- [ ] 8.2 Test container with mock data mode
- [ ] 8.3 Test container with live API connections
- [ ] 8.4 Verify `/health` endpoint returns all adapter statuses
- [ ] 8.5 Create deployment checklist (backup current image, deploy new image, monitor)
- [ ] 8.6 Document rollback steps (revert to previous Docker image)

## 9. Deployment & Monitoring

- [ ] 9.1 Deploy new backend image to production
- [ ] 9.2 Monitor `/health` endpoint for adapter connectivity
- [ ] 9.3 Check logs for import errors or panics
- [ ] 9.4 Verify WebSocket connections established
- [ ] 9.5 Spot check 3-5 Malaysia hubs for live vehicle data
- [ ] 9.6 Monitor error rates for adapter failures
- [ ] 9.7 Verify mock data fallback works if APIs fail

## 10. Documentation & Cleanup

- [ ] 10.1 Update CLAUDE.md with final adapter hierarchy documentation
- [ ] 10.2 Add Malaysia GTFS-RT endpoint documentation
- [ ] 10.3 Document mock data usage in development guide
- [ ] 10.4 Clean up any temporary files or branches
- [ ] 10.5 Create Git tag for deployment (if applicable)
- [ ] 10.6 Archive this OpenSpec change after successful deployment

## 11. Optional Enhancements (Future Work)

- [ ] 11.1 Implement coordinate-based hub inference for KTMB multi-hub trains
- [ ] 11.2 Add route-specific vehicle positioning for mock data (use GTFS static data)
- [ ] 11.3 Create Malaysia-specific adapter registry for health monitoring
- [ ] 11.4 Add metrics/observability for Malaysia adapter performance
- [ ] 11.5 Implement staggered adapter startup to avoid API thundering herd
