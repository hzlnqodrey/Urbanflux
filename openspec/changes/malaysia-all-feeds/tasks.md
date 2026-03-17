# Tasks

## 1. Extract Shared Base Adapter
- [x] 1.1 Create `internal/adapters/base/adapter.go` — export `BaseAdapter` from current `kualalumpur/adapter_base.go`
- [x] 1.2 Update `kualalumpur/` adapters to import from `base/` package
- [x] 1.3 Verify existing KL adapters still compile with `go build ./...`

## 2. KTMB Train Adapter
- [x] 2.1 Create `internal/adapters/ktmb/ktmb.go` — `KTMBAdapter` with endpoint `https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb`, Hub="kuala-lumpur", Mode=RAIL, Operator="KTMB"
- [x] 2.2 Create `internal/adapters/ktmb/ktmb_test.go` — test name, default endpoint, lifecycle

## 3. Prasarana Additional Adapters
- [x] 3.1 Create `kualalumpur/rapid_bus_mrtfeeder.go` — MRT Feeder endpoint, Hub="kuala-lumpur", Mode=BUS
- [x] 3.2 Create `kualalumpur/rapid_bus_penang.go` — Penang endpoint, Hub="penang", Mode=BUS
- [x] 3.3 Create `kualalumpur/rapid_bus_kuantan.go` — Kuantan endpoint, Hub="kuantan", Mode=BUS
- [x] 3.4 Add tests for new Prasarana adapter constructors

## 4. BAS.MY City Bus Adapters
- [x] 4.1 Create `internal/adapters/mybas/mybas.go` — individual adapters for all 10 BAS.MY endpoints
- [x] 4.2 Create `internal/adapters/mybas/mybas_test.go` — test all constructors and default endpoints

## 5. Server Registration
- [x] 5.1 Update `cmd/server/main.go` — register all 15 new adapters with DefaultConfig

## 6. Tests & Verification
- [x] 6.1 Run `go build ./...` — verify clean compilation ✅
- [x] 6.2 Run `go test ./... -v` — verify all tests pass ✅
- [x] 6.3 Run `go vet ./...` — verify no vet issues ✅
