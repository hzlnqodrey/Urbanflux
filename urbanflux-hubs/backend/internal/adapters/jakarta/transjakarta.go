package jakarta

import (
	"context"
	"math"
	"time"

	"github.com/urbanflux/hubs-backend/internal/models"
)

type TransjakartaAdapter struct {
	cancel context.CancelFunc
}

func NewTransjakartaAdapter() *TransjakartaAdapter {
	return &TransjakartaAdapter{}
}

func (t *TransjakartaAdapter) Name() string {
	return "Jakarta-Transjakarta"
}

// Start begins a mock simulation loop since a public API is currently unavailable.
// This implementation proves the adapter pattern and provides live data for the UI.
func (t *TransjakartaAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	ctx, cancel := context.WithCancel(context.Background())
	t.cancel = cancel

	go func() {
		ticker := time.NewTicker(2 * time.Second) // Send update every 2 seconds
		defer ticker.Stop()

		// Simplified Monas loop mock coords
		coords := [][2]float64{
			{-6.1754, 106.8271}, // Monas
			{-6.1824, 106.8234}, // Bank Indonesia
			{-6.1951, 106.8229}, // Bundaran HI
			{-6.2025, 106.8224}, // Dukuh Atas
		}

		idx := 0
		dir := 1

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				p1 := coords[idx]
				p2 := coords[idx+dir]

				// Simplified bearing calculation for mock
				dLon := (p2[1] - p1[1]) * (math.Pi / 180)
				y := math.Sin(dLon) * math.Cos(p2[0]*(math.Pi/180))
				x := math.Cos(p1[0]*(math.Pi/180))*math.Sin(p2[0]*(math.Pi/180)) -
					math.Sin(p1[0]*(math.Pi/180))*math.Cos(p2[0]*(math.Pi/180))*math.Cos(dLon)
				brng := math.Atan2(y, x) * (180 / math.Pi)
				brng = math.Mod(brng+360, 360)

				update := models.UrbanfluxTelemetry{
					ID:          "JKT-TB-0104",
					RouteID:     "CORRIDOR-1",
					Latitude:    p1[0] + (p2[0]-p1[0])*0.5, // midpoint mock
					Longitude:   p1[1] + (p2[1]-p1[1])*0.5,
					Speed:       45.0 + float64(idx),
					Bearing:     brng,
					Status:      "ACTIVE",
					NextStop:    "Station Mock",
					LastUpdated: time.Now().UTC(),
				}

				stream <- update

				idx += dir
				if idx >= len(coords)-1 || idx <= 0 {
					dir *= -1
				}
			}
		}
	}()

	return nil
}

func (t *TransjakartaAdapter) Stop() error {
	if t.cancel != nil {
		t.cancel()
	}
	return nil
}
