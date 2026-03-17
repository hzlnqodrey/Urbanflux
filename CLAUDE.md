# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urbanflux is a smart-city mobility platform with two main components:
- **urbanflux-landing/**: Premium hero landing page with 3D globe animation (Next.js 16 + Three.js + GLSL)
- **urbanflux-hubs/**: Real-time transit hub dashboard for multiple cities (Next.js 16 + Go backend)

The platform ingests GTFS-RT feeds from transit operators across Malaysia, Indonesia, and other regions, normalizing the data into a unified telemetry format streamed to frontend map visualizations.

## Architecture

### Monorepo Structure
```
Urbanflux/
├── urbanflux-landing/          # Landing page (Next.js + Three.js)
├── urbanflux-hubs/             # Hub platform
│   ├── backend/               # Go WebSocket server + adapters
│   │   ├── cmd/server/        # Main entry point
│   │   ├── internal/
│   │   │   ├── adapters/      # City-specific transit adapters
│   │   │   │   ├── base/      # BaseAdapter with shared GTFS-RT logic
│   │   │   │   ├── jakarta/   # Transjakarta adapter
│   │   │   │   ├── kualalumpur/ # Prasarana bus/rail adapters
│   │   │   │   ├── ktmb/      # KTMB railway adapter
│   │   │   │   └── mybas/     # BAS.MY city bus adapters
│   │   │   ├── websocket/     # WebSocket hub for client connections
│   │   │   └── models/        # Telemetry data models
│   └── frontend/              # Next.js dashboard (Mapbox/Leaflet)
├── openspec/                  # OpenSpec change management
└── .github/workflows/         # CI/CD pipelines
```

### Backend Architecture (Go)

The backend uses an **adapter pattern** for ingesting transit data:

1. **HubAdapter Interface** (`internal/adapters/adapter.go`): All city adapters implement this unified interface
   - `Start()`: Begin data ingestion
   - `Stop()`: Graceful shutdown
   - `Health()`: Return operational status
   - `Errors()`: Stream of structured errors
   - `Config()`: Adapter configuration

2. **BaseAdapter** (`internal/adapters/base/adapter.go`): Shared implementation for GTFS-RT adapters
   - HTTP polling with configurable intervals
   - Automatic retry logic with exponential backoff
   - Health state management (Connected, Degraded, Disconnected, Stopped)
   - Error channel management (non-blocking emits)
   - Protobuf feed parsing via `gtfsrt.Parse()`

3. **Adapter Registry** (`internal/adapters/registry.go`): Manages all adapter lifecycles
   - Register adapters in `cmd/server/main.go`
   - Unified telemetry stream from all adapters
   - Unified error stream for monitoring
   - Health check endpoint at `/health`

4. **WebSocket Hub** (`internal/websocket/hub.go`): Broadcasts telemetry to connected frontend clients
   - Endpoint: `/ws`
   - Single channel per connection
   - Automatic client cleanup on disconnect

5. **Telemetry Model** (`internal/models/telemetry.go`): Standardized format across all adapters
   - Core fields: ID, RouteID, Hub, Mode, Operator
   - Geospatial: Latitude, Longitude, Speed, Bearing
   - Status: Status, NextStop, Occupancy, DelaySeconds
   - Validation via `Validate()` method

### Frontend Architecture (Next.js 16)

The frontend uses **React hooks** for real-time data management:

1. **useHubTelemetry** (`src/hooks/useHubTelemetry.ts`): WebSocket connection and vehicle tracking
   - Connects to `ws://localhost:8080/ws` (configurable via `NEXT_PUBLIC_WS_URL`)
   - Client-side hub filtering (no server overhead)
   - Vehicle interpolation for smooth animations
   - Automatic reconnection with exponential backoff
   - Stale vehicle cleanup (90s timeout)
   - Returns `getVehiclesGeoJSON()` for map rendering

2. **Hub Configuration** (`src/lib/hub-config.ts`): Hub metadata and styling
   - Viewport settings (center, zoom, pitch, bearing)
   - Mode color palette (BUS, RAIL, METRO, etc.)
   - Hub IDs: jakarta, kuala-lumpur, penang, kuantan, +9 BAS.MY cities

3. **Map Components** (`src/components/Mapbox/`):
   - `HubMapOSM.tsx`: Mapbox GL map with vehicle layers
   - `HubMap.tsx`: Alternative implementation
   - `MapControls.tsx`: Zoom/rotation controls
   - `MapLegend.tsx`: Mode color legend

### Data Flow

```
Transit Operator API (GTFS-RT)
    ↓
BaseAdapter (polling + retry)
    ↓
gtfsrt.Parse() (protobuf → UrbanfluxTelemetry)
    ↓
Adapter Registry (unified stream)
    ↓
WebSocket Hub (broadcast)
    ↓
Frontend useHubTelemetry (filter + interpolate)
    ↓
Mapbox GL (GeoJSON layers)
```

## Common Commands

### Development

**Landing Page**:
```bash
cd urbanflux-landing
npm install
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run lint         # ESLint
npm run test:e2e     # Playwright E2E tests
```

**Hubs Backend** (Go):
```bash
cd urbanflux-hubs/backend
go run cmd/server/main.go           # Start server on :8080
go build -o server ./cmd/server     # Build binary
go test ./...                       # Run all tests
go test -v ./internal/adapters/ktmb # Run specific package tests
```

**Hubs Frontend**:
```bash
cd urbanflux-hubs/frontend
npm install
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run lint         # ESLint
```

### Docker

**Full Stack** (requires docker-compose):
```bash
docker-compose up -d              # Start all services
docker-compose ps                 # Check status
docker-compose logs backend       # View backend logs
docker-compose down               # Stop all services
```

**Individual Services**:
```bash
# Backend
cd urbanflux-hubs/backend
docker build -t urbanflux-hubs-backend .
docker run -p 8080:8080 urbanflux-hubs-backend

# Frontend
cd urbanflux-hubs/frontend
docker build -t urbanflux-hubs-frontend .
docker run -p 3000:3000 urbanflux-hubs-frontend

# Landing
cd urbanflux-landing
docker build -t urbanflux-landing .
docker run -p 3001:3000 urbanflux-landing
```

### Testing

**Backend Tests** (Go):
```bash
cd urbanflux-hubs/backend
go test ./...                          # All tests
go test -v ./internal/adapters/gtfsrt  # Specific package
go test -run TestParseFeed            # Specific test
```

**Frontend E2E** (Playwright):
```bash
cd urbanflux-landing
npm run test:e2e                      # Run all E2E tests
npx playwright test --headed          # Run with browser UI
npx playwright test --project=chromium # Run specific browser
```

### CI/CD

GitHub Actions workflows are in `.github/workflows/`:
- `hubs-ci.yml`: Runs on PR to main (path-filtered to `urbanflux-hubs/**`)
  - Security scan (TruffleHog secrets + Trivy vulnerabilities)
  - Frontend build + lint
  - Backend build + vet
  - Docker build verification
- `landing-docker-publish.yml`: Landing page Docker build + push to Docker Hub
- `deploy.yml`: Production deployment workflow

## Adding a New Transit Adapter

When adding support for a new city/operator, follow the adapter pattern:

1. **Create adapter directory**: `internal/adapters/<operator>/`
2. **Implement HubAdapter interface**:
   ```go
   type MyAdapter struct {
       *base.BaseAdapter
   }

   func NewMyAdapter(cfg adapters.AdapterConfig) *MyAdapter {
       return &MyAdapter{
           BaseAdapter: base.NewBaseAdapter(
               "MyCity-MyOperator",  // name
               "my-city",             // hub
               "BUS",                 // mode
               "MyOperator",          // operator
               cfg,                   // config
           ),
       }
   }
   ```
3. **Register in main.go**:
   ```go
   registry.Register(myoperator.NewMyAdapter(myCfg))
   ```
4. **Add frontend hub config** in `frontend/src/lib/hub-config.ts`
5. **Test**: Run `go test ./internal/adapters/<operator>/`

## Transit Modes

Standard modes (constants in `internal/models/telemetry.go`):
- `BUS`: Bus services
- `RAIL`: Heavy rail, commuter rail
- `METRO`: Metro/subway services (MRT, LRT)
- `FERRY`: Ferry services
- `MONORAIL`: Monorail lines
- `TRAM`: Tram/streetcar services

## Occupancy Levels

Standard occupancy levels:
- `EMPTY`, `LOW`, `MEDIUM`, `HIGH`, `FULL`, `UNKNOWN`

## GTFS-RT Parsing

The `gtfsrt.Parse()` function (`internal/adapters/gtfsrt/parser.go`) converts GTFS-RT protobuf feeds into UrbanfluxTelemetry:

**Input**: GTFS-RT FeedMessage (vehicle positions)
**Output**: ParseResult containing:
- `Telemetry []UrbanfluxTelemetry`: Valid vehicle positions
- `Errors []AdapterError`: Parse errors (e.g., missing coordinates)

**Key parsing logic**:
- Extracts vehicle ID, route ID, position, bearing, speed
- Maps GTFS-RT occupancy to Urbanflux levels
- Validates coordinates (rejects 0,0)
- Sets timestamps to UTC

## WebSocket Protocol

**Client → Server**: Connect to `ws://backend:8080/ws`

**Server → Client**: JSON messages (UrbanfluxTelemetry):
```json
{
  "id": "JKT-TB-0104",
  "routeId": "CORRIDOR-1",
  "hub": "jakarta",
  "mode": "BUS",
  "operator": "Transjakarta",
  "latitude": -6.1751,
  "longitude": 106.8272,
  "speed": 45.0,
  "bearing": 180.0,
  "status": "ACTIVE",
  "nextStop": "Bundaran HI",
  "occupancy": "MEDIUM",
  "delaySeconds": 0,
  "lastUpdated": "2025-03-18T00:00:00Z"
}
```

## Health Monitoring

**Endpoint**: `GET /health`

**Response**: JSON object with adapter health status:
```json
{
  "MyCity-MyOperator": {
    "status": "CONNECTED",
    "uptime": "2h30m45s",
    "lastError": null
  }
}
```

Health states: `CONNECTED`, `DEGRADED`, `DISCONNECTED`, `STOPPED`

## Error Handling

**Structured Errors** (`internal/adapters/errors.go`):
- `SeverityFatal`: Unrecoverable (e.g., auth failure) → adapter stops
- `SeverityError`: Retryable but serious (e.g., max retries exceeded)
- `SeverityWarning`: Minor issues (e.g., rate limit, degraded parse)

**Error Kinds**:
- `ErrAuth`: Authentication/authorization failure
- `ErrRateLimit`: HTTP 429 rate limit
- `ErrNetwork`: Network/connection issues
- `ErrParse`: Data parsing errors
- `ErrUnknown`: Unclassified errors

**Error Channel**: All adapters emit errors to a non-blocking channel (buffer 64). Drain this channel to prevent blocking.

## OpenSpec Integration

This project uses OpenSpec for spec-driven development. See `AGENTS.md` for details, but key commands:

- `/opsx:new` or `/openspec`: Create a new change with planning artifacts
- `/opsx:apply` or `/openspec-apply-change`: Implement tasks from a change
- `/opsx:explore` or `/openspec-explore`: Explore ideas before committing
- `/opsx:archive` or `/openspec-archive-change`: Archive completed changes

OpenSpec configuration is in `openspec/config.yaml`.

## Deployment

**Production Stack**:
- Docker containers orchestrated via docker-compose
- Cloudflare for DNS proxy + WAF (optional Cloudflare Tunnel)
- GitHub Actions for CI/CD (build + push to Docker Hub)

**Environment Variables**:
- `NEXT_PUBLIC_WS_URL`: WebSocket URL for frontend (default: `ws://localhost:8080/ws`)
- `PORT`: Backend port (default: 8080)
- `REDIS_URL`: Redis connection string (optional, for pub/sub)
- `DB_URL`: Postgres connection string (optional, for persistence)

**See Also**: `deployment-guide.sh` for Cloudflare setup instructions.

## Important Notes

1. **Go Version**: Backend uses Go 1.23.12. Use `.tool-versions` or `go.mod` for version management.
2. **Node Version**: Frontends use Node 20. See `package.json` engines.
3. **GTFS-RT Feeds**: Many feeds require no authentication (e.g., api.data.gov.my), but some may need API keys stored in environment variables.
4. **Time Zones**: Backend uses UTC. Frontend displays in hub's local timezone (see `hub-config.ts`).
5. **Vehicle Interpolation**: Frontend interpolates positions between polls (default 30s) for smooth animations. Adjust `POLL_INTERVAL_MS` in `useHubTelemetry.ts` if backend poll interval changes.
6. **Mapbox Tokens**: For Mapbox GL maps, set `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env` (not in repo).
7. **Testing**: Backend has 7 test files. Frontend uses Playwright for E2E tests in landing page.
8. **Security**: CI runs TruffleHog (secret scanning) and Trivy (vulnerability scanning) on all PRs.
9. **Adapter Health**: Monitor `/health` endpoint for adapter status. Degraded adapters may indicate upstream API issues.
10. **WebSocket Reconnection**: Frontend auto-reconnects with exponential backoff (max 30s). Check `connectionStatus` in UI for connectivity state.
