package jakarta

import (
	"context"
	"math"
	"sync"
	"time"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
)

// TransjakartaAdapter simulates Transjakarta BRT telemetry.
// Currently uses mock data; will integrate with the real Transjakarta API
// when it becomes publicly available.
type TransjakartaAdapter struct {
	config  adapters.AdapterConfig
	cancel  context.CancelFunc
	health  adapters.AdapterHealth
	errChan chan adapters.AdapterError
	mu      sync.RWMutex
}

// NewTransjakartaAdapter creates a new adapter with the given configuration.
// Pass adapters.DefaultConfig() for sensible defaults.
func NewTransjakartaAdapter(cfg adapters.AdapterConfig) *TransjakartaAdapter {
	return &TransjakartaAdapter{
		config:  cfg,
		health:  adapters.HealthStopped,
		errChan: make(chan adapters.AdapterError, 32),
	}
}

func (t *TransjakartaAdapter) Name() string {
	return "Jakarta-Transjakarta"
}

func (t *TransjakartaAdapter) Health() adapters.AdapterHealth {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return t.health
}

func (t *TransjakartaAdapter) Errors() <-chan adapters.AdapterError {
	return t.errChan
}

func (t *TransjakartaAdapter) Config() adapters.AdapterConfig {
	return t.config
}

// setHealth safely updates the adapter's health status.
func (t *TransjakartaAdapter) setHealth(h adapters.AdapterHealth) {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.health = h
}

// Start begins a mock simulation loop since a public API is currently unavailable.
// This implementation proves the adapter pattern and provides live data for the UI.
func (t *TransjakartaAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	ctx, cancel := context.WithCancel(context.Background())
	t.cancel = cancel
	t.setHealth(adapters.HealthConnected)

	go func() {
		pollInterval := t.config.PollInterval
		if pollInterval == 0 {
			pollInterval = 2 * time.Second // Default for mock
		}

		ticker := time.NewTicker(pollInterval)
		defer ticker.Stop()

		// Simplified Monas loop mock coords
		coords := [][2]float64{
			{-6.1754, 106.8271}, // Monas
			{-6.1824, 106.8234}, // Bank Indonesia
			{-6.1951, 106.8229}, // Bundaran HI
			{-6.2025, 106.8224}, // Dukuh Atas
		}

		stops := []string{"Monas", "Bank Indonesia", "Bundaran HI", "Dukuh Atas"}

		idx := 0
		dir := 1

		for {
			select {
			case <-ctx.Done():
				t.setHealth(adapters.HealthStopped)
				return
			case <-ticker.C:
				p1 := coords[idx]
				nextIdx := idx + dir
				if nextIdx < 0 || nextIdx >= len(coords) {
					dir *= -1
					nextIdx = idx + dir
				}
				p2 := coords[nextIdx]

				// Simplified bearing calculation for mock
				dLon := (p2[1] - p1[1]) * (math.Pi / 180)
				y := math.Sin(dLon) * math.Cos(p2[0]*(math.Pi/180))
				x := math.Cos(p1[0]*(math.Pi/180))*math.Sin(p2[0]*(math.Pi/180)) -
					math.Sin(p1[0]*(math.Pi/180))*math.Cos(p2[0]*(math.Pi/180))*math.Cos(dLon)
				brng := math.Atan2(y, x) * (180 / math.Pi)
				brng = math.Mod(brng+360, 360)

				update := models.UrbanfluxTelemetry{
					// Core identification
					ID:      "JKT-TB-0104",
					RouteID: "CORRIDOR-1",

					// Hub & operator metadata
					Hub:      "jakarta",
					Mode:     models.ModeBus,
					Operator: "Transjakarta",

					// Geospatial data
					Latitude:  p1[0] + (p2[0]-p1[0])*0.5,
					Longitude: p1[1] + (p2[1]-p1[1])*0.5,
					Speed:     45.0 + float64(idx),
					Bearing:   brng,

					// Status & schedule
					Status:       "ACTIVE",
					NextStop:     stops[nextIdx],
					Occupancy:    models.OccupancyUnknown,
					DelaySeconds: 0,

					// Timestamp
					LastUpdated: time.Now().UTC(),
				}

				// Validate before sending
				if err := update.Validate(); err != nil {
					t.errChan <- adapters.AdapterError{
						Severity:    adapters.SeverityWarning,
						Kind:        adapters.ErrValidation,
						Message:     err.Error(),
						AdapterName: t.Name(),
						Timestamp:   time.Now().UTC(),
						Retryable:   true,
					}
					t.setHealth(adapters.HealthDegraded)
					continue
				}

				// Send telemetry with non-blocking write
				select {
				case stream <- update:
					// success
				default:
					t.errChan <- adapters.AdapterError{
						Severity:    adapters.SeverityWarning,
						Kind:        adapters.ErrUnknown,
						Message:     "telemetry channel full, dropping update",
						AdapterName: t.Name(),
						Timestamp:   time.Now().UTC(),
						Retryable:   true,
					}
				}

				idx = nextIdx
			}
		}
	}()

	return nil
}

func (t *TransjakartaAdapter) Stop() error {
	if t.cancel != nil {
		t.cancel()
	}
	t.setHealth(adapters.HealthStopped)
	return nil
}
