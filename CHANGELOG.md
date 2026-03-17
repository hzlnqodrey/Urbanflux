# Changelog - Kuala Lumpur Hub Integration

## [feat/add-gitaction-hubs] - 2026-03-18

### Added

#### Backend
- **New Mock Adapter** (`backend/internal/adapters/malaysia/kualalumpur/mock.go`)
  - 37 simulated vehicles across 5 transit modes
  - LRT Kelana Jaya Line (6 trains) - Pink line
  - LRT Sri Petaling Line (4 trains) - Green line
  - MRT Kajang Line (5 trains) - Blue line
  - MRT Putrajaya Line (3 trains) - Purple line
  - KL Monorail (4 trains) - Orange line
  - Rapid KL Buses (15 buses) - Green
  - Realistic route coordinates for Kuala Lumpur
  - Configurable movement speed and bearing calculation

- **BaseAdapter** (`backend/internal/adapters/base/`)
  - Shared GTFS-RT polling logic
  - Automatic retry with exponential backoff
  - Health state management (Connected, Degraded, Disconnected, Stopped)
  - Non-blocking error channel (buffer 64)

#### Frontend
- **Kuala Lumpur Hub Configuration** (`frontend/src/lib/hub-config.ts`)
  - Hub ID: `kuala-lumpur`
  - Viewport: centered on KL (3.1390°N, 101.6869°E)
  - Timezone: Asia/Kuala_Lumpur
  - Mode colors: BUS, RAIL, METRO, MONORAIL, TRAM, FERRY

- **Vehicle Count Badge** (`frontend/src/app/page.tsx`)
  - Shows real-time KL vehicle count in header
  - Green indicator when vehicles are tracked

### Changed

#### Backend
- **Adapter Reorganization**
  - Moved from `adapters/kualalumpur/` to `adapters/malaysia/kualalumpur/`
  - Created `prasarana/` subdirectory for Prasarana-specific adapters
  - Prepared for hierarchical Malaysia adapter structure

- **WebSocket Message Handling**
  - Added 10ms delay between vehicle emissions
  - Prevents message concatenation in WebSocket frames

#### Frontend
- **WebSocket Parser** (`frontend/src/hooks/useHubTelemetry.ts`)
  - Fixed parsing of concatenated JSON objects
  - Handles multiple vehicles in single WebSocket frame
  - Improved error handling

- **Vehicle Rendering** (`frontend/src/components/Mapbox/HubMapOSM.tsx`)
  - Reduced refresh rate to 500ms (from 64ms)
  - Larger vehicle markers (32px from 24px)
  - Removed flickering ping animation
  - Stable glow effect for better visibility

- **Map Layers**
  - Added KL rail line polylines (LRT Kelana Jaya, MRT Kajang)
  - Pink line for LRT Kelana Jaya
  - Blue line for MRT Kajang

### Fixed

- WebSocket JSON parsing error when multiple vehicles sent in one frame
- Vehicle flickering caused by rapid re-rendering (64ms → 500ms refresh)
- Kuala Lumpur hub not appearing in frontend hub selector
- Empty vehicle list when switching to Kuala Lumpur hub

### Technical Details

**Vehicle Movement Speed:**
- Mock progress: 0.02 per poll (30 second intervals)
- Interpolation: Linear between previous and current positions
- Realistic transit speeds: 30-70 km/h depending on mode

**WebSocket Protocol:**
- Endpoint: `ws://localhost:8080/ws`
- Message format: JSON per vehicle (concatenated frames supported)
- Hub filtering: Client-side by `hub` field

**Mode Colors:**
- BUS: `#10B981` (Green)
- RAIL: `#F59E0B` (Yellow)
- METRO: `#3B82F6` (Blue)
- MONORAIL: `#8B5CF6` (Purple)
- TRAM: `#EC4899` (Pink)
- FERRY: `#0EA5E9` (Sky)

### Configuration

**Backend:**
```go
registry.Register(kualalumpur.NewMockKualaLumpurAdapter(myCfg))
```

**Frontend:**
```typescript
// .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Migration Notes

- Old adapter path: `internal/adapters/kualalumpur/`
- New adapter path: `internal/adapters/malaysia/kualalumpur/`
- Update imports when migrating to new structure
