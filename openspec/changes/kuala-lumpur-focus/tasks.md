# Tasks: Kuala Lumpur Focus

## 1. Backend Directory Cleanup

- [x] 1.1 Remove `internal/adapters/mybas/` directory using `git rm -r`
- [x] 1.2 Remove `internal/adapters/malaysia/alor-setar/` directory
- [x] 1.3 Remove `internal/adapters/malaysia/ipoh/` directory
- [x] 1.4 Remove `internal/adapters/malaysia/johor-bahru/` directory
- [x] 1.5 Remove `internal/adapters/malaysia/kangar/` directory
- [x] 1.6 Remove `internal/adapters/malaysia/kota-bharu/` directory
- [x] 1.7 Remove `internal/adapters/malaysia/kuala-terengganu/` directory
- [x] 1.8 Remove `internal/adapters/malaysia/kuantan/` directory
- [x] 1.9 Remove `internal/adapters/malaysia/kuching/` directory
- [x] 1.10 Remove `internal/adapters/malaysia/melaka/` directory
- [x] 1.11 Remove `internal/adapters/malaysia/penang/` directory
- [x] 1.12 Remove `internal/adapters/malaysia/seremban/` directory
- [x] 1.13 Verify `internal/adapters/malaysia/kualalumpur/` remains with `prasarana/` and `ktmb/` subdirectories

## 2. Backend Code Updates

- [x] 2.1 Update `cmd/server/main.go`: Remove mybas import
- [x] 2.2 Update `cmd/server/main.go`: Remove Penang Prasarana import
- [x] 2.3 Update `cmd/server/main.go`: Remove Kuantan Prasarana import
- [x] 2.4 Update `cmd/server/main.go`: Remove all 10 mybas adapter registrations
- [x] 2.5 Update `cmd/server/main.go`: Remove Penang and Kuantan adapter registrations
- [x] 2.6 Update `cmd/server/main.go`: Verify KTMB adapter exists and import path is correct
- [x] 2.7 Update `cmd/server/main.go`: Verify Prasarana adapter imports (rapid_bus, rapid_rail)
- [x] 2.8 Update `cmd/server/main.go`: Replace `kualalumpur.NewMockKualaLumpurAdapter()` with real Prasarana adapters
- [x] 2.9 Update `cmd/server/main.go`: Register KTMB adapter if not already registered
- [x] 2.10 Update `cmd/server/main.go`: Update debug endpoint adapter count (14 → 5)
- [x] 2.11 Run `go mod tidy` to clean up unused imports
- [x] 2.12 Verify compilation: `go build ./...`

## 3. KTMB Adapter Implementation

- [x] 3.1 Verify `internal/adapters/malaysia/kualalumpur/ktmb/` directory exists
- [x] 3.2 Verify KTMB adapter implements HubAdapter interface
- [x] 3.3 Verify KTMB adapter has `NewKTMAdapter()` constructor
- [x] 3.4 Created KTMB adapter with mock data (19 trains: Port Klang Line, Seremban Line, ETS Gemas, ETS Butterworth)
- [x] 3.5 Run `go test ./...` - all tests pass

## 4. Frontend Hub Configuration Cleanup

- [x] 4.1 Remove `penang` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.2 Remove `kuantan` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.3 Remove `kangar` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.4 Remove `alor-setar` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.5 Remove `kota-bharu` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.6 Remove `kuala-terengganu` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.7 Remove `ipoh` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.8 Remove `seremban` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.9 Remove `melaka` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.10 Remove `johor-bahru` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.11 Remove `kuching` hub config from `frontend/src/lib/hub-config.ts`
- [x] 4.12 Verify `jakarta` and `kuala-lumpur` configs remain in `HUB_CONFIGS`

## 5. Frontend Code Verification

- [x] 5.1 Search codebase for references to removed hub IDs (`penang`, `kuantan`, etc.) - none found
- [x] 5.2 Remove or update any hardcoded references to removed hubs - N/A
- [x] 5.3 Verify TypeScript compilation: `npm run build` - success
- [x] 5.4 Verify no TypeScript errors related to hub IDs
- [ ] 5.5 Spot-check hub selector UI (if component exists)

## 6. Backend Testing

- [x] 6.1 Start backend server: `go run cmd/server/main.go`
- [x] 6.2 Verify server logs show 5 adapters registered (Jakarta + 3 KL Prasarana + KL KTMB)
- [x] 6.3 Query `/health` endpoint and verify adapter status - all KL adapters present
- [x] 6.4 Verify health endpoint shows KL adapters (not removed hubs)
- [x] 6.5 Connect WebSocket client to `/ws` endpoint - backend accepting connections
- [x] 6.6 Verify telemetry streams for Kuala Lumpur vehicles - KTMB emitted 19 trains
- [x] 6.7 Verify no telemetry streams for removed hubs
- [x] 6.8 Run backend tests: `go test ./...` - all pass
- [x] 6.9 Verify no test failures related to removed adapters

## 7. Frontend Testing

- [ ] 7.1 Start frontend dev server: `npm run dev`
- [ ] 7.2 Verify hub selector only shows Jakarta and Kuala Lumpur
- [ ] 7.3 Select Kuala Lumpur hub and verify map loads
- [ ] 7.4 Verify vehicle markers render for Kuala Lumpur
- [ ] 7.5 Verify no console errors related to removed hubs
- [ ] 7.6 Run frontend lint: `npm run lint`
- [ ] 7.7 Run Playwright E2E tests if applicable: `npm run test:e2e`

## 8. CI/CD Verification

- [ ] 8.1 Review `.github/workflows/hubs-ci.yml` for Malaysia-specific path filters
- [ ] 8.2 Update CI workflow if path filters reference removed adapters
- [ ] 8.3 Verify CI workflow passes on push
- [ ] 8.4 Check for any TruffleHog or Trivy scan warnings

## 9. Docker Build Verification

- [ ] 9.1 Build backend Docker image: `docker build -t urbanflux-hubs-backend ./urbanflux-hubs/backend`
- [ ] 9.2 Build frontend Docker image: `docker build -t urbanflux-hubs-frontend ./urbanflux-hubs/frontend`
- [ ] 9.3 Verify backend container starts successfully
- [ ] 9.4 Verify `/health` endpoint works in container
- [ ] 9.5 Verify adapter count is 5 in container

## 10. Deployment

- [ ] 10.1 Tag current production image as rollback backup
- [ ] 10.2 Push new Docker images to registry
- [ ] 10.3 Deploy new backend container
- [ ] 10.4 Deploy new frontend container
- [ ] 10.5 Monitor `/health` endpoint for adapter status
- [ ] 10.6 Check logs for any import or registration errors
- [ ] 10.7 Verify WebSocket connections established
- [ ] 10.8 Spot-check Kuala Lumpur hub for live vehicle data

## 11. Documentation Updates

- [ ] 11.1 Update `CLAUDE.md` with simplified adapter structure
- [ ] 11.2 Remove references to removed Malaysia hubs from documentation
- [ ] 11.3 Update adapter count documentation (14 → 5)
- [ ] 11.4 Update hub count documentation (12 Malaysia hubs → 1)

## 12. Cleanup

- [ ] 12.1 Verify no orphaned files in `internal/adapters/`
- [ ] 12.2 Verify no orphaned hub references in frontend code
- [ ] 12.3 Commit all changes with descriptive message
- [ ] 12.4 Create PR for review (if required)
- [ ] 12.5 Archive this OpenSpec change after successful deployment
