# Proposal: Kuala Lumpur Focus

## Why

The Malaysia adapter hierarchy was implemented with 12 hub cities, but maintaining and monitoring multiple low-traffic hubs adds complexity without proportional value. Focusing on Kuala Lumpur—the capital and largest transit market—allows for deeper feature development, better observability, and a more polished single-hub experience before considering expansion.

## What Changes

- **BREAKING**: Remove 11 Malaysia hub adapters from backend (`alor-setar`, `ipoh`, `johor-bahru`, `kangar`, `kota-bharu`, `kuala-terengganu`, `kuantan`, `kuching`, `melaka`, `penang`, `seremban`)
- **BREAKING**: Remove 11 Malaysia hub configurations from frontend (`hub-config.ts`)
- Retain only `kualalumpur` hub with `prasarana` (bus/rail) and `ktmb` (rail) operators
- Remove or consolidate the `mybas/` adapter directory (BAS.MY city bus services)
- Update documentation and references to reflect single-hub Malaysia focus

## Capabilities

### New Capabilities
- `kuala-lumpur-hub`: Focused single-hub adapter configuration for Kuala Lumpur with Prasarana and KTMB operators

### Modified Capabilities
- `malaysia-adapter-hierarchy`: Simplified from multi-hub to single-hub architecture
- `malaysia-data-sources`: Reduced to only Kuala Lumpur GTFS-RT endpoints (Prasarana, KTMB)

## Impact

**Backend (`urbanflux-hubs/backend/`):**
- Removes: `internal/adapters/malaysia/{11 hub directories}`
- Keeps: `internal/adapters/malaysia/kualalumpur/{prasarana,ktmb}/`
- May require: Simplifying or removing `internal/adapters/mybas/` (BAS.MY integration)
- Updates: `cmd/server/main.go` import paths and adapter registrations

**Frontend (`urbanflux-hubs/frontend/`):**
- Removes: 11 hub configs from `src/lib/hub-config.ts`
- Keeps: `kuala-lumpur` config only
- Updates: Any hub selection UI or documentation listing Malaysia hubs

**API/Data Sources:**
- Retains: Prasarana GTFS-RT feed (bus + rail)
- Retains: KTMB GTFS-RT feed (commuter rail)
- Removes: BAS.MY feeds for 11 cities

**Operations:**
- Reduced adapter count from 12 to 2 (Kuala Lumpur operators)
- Simpler health monitoring and alerting
- Single timezone (Asia/Kuala_Lumpur)
