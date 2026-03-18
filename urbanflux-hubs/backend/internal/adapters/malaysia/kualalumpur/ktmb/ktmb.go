package ktmb

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	ktmbEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb"
)

// KTMAdapter streams real-time KTMB (Keretapi Tanah Melayu Berhad) train positions.
// For development, it generates realistic mock data along KTMB routes.
type KTMAdapter struct {
	config   adapters.AdapterConfig
	name     string
	hub      string
	errChan  chan adapters.AdapterError
	cancel   context.CancelFunc
	vehicles []ktmbTrain
	health   adapters.AdapterHealth
}

type ktmbTrain struct {
	ID           string
	RouteID      string
	RouteName    string
	Lat          float64
	Lon          float64
	Speed        float64
	Bearing      float64
	RoutePath    [][2]float64
	CurrentIndex int
	Progress     float64
	Direction    int
}

// KTMB Route Definitions - KTM Komuter Lines serving KL
var ktmbRoutes = map[string][][2]float64{
	// KTM Komuter Port Klang Line (Tanjung Malim - Port Klang)
	"PORT-KLANG": {
		{3.2340, 101.6900}, // Tanjung Malim (north)
		{3.2000, 101.6850}, // Kuala Kubu Bharu
		{3.1700, 101.6800}, // Rawang
		{3.1500, 101.6850}, // Kuang
		{3.1300, 101.6900}, // Batu Arang
		{3.1100, 101.6950}, // Sentul
		{3.0900, 101.7000}, // Putra
		{3.1450, 101.6900}, // KL Sentral (central interchange)
		{3.1350, 101.6850}, // Mid Valley
		{3.1200, 101.6800}, // Seputeh
		{3.1000, 101.6750}, // Salak Selatan
		{3.0800, 101.6700}, // Bandar Tasik Selatan
		{3.0500, 101.6650}, // Kajang
		{3.0300, 101.6600}, // Serdang
		{3.0100, 101.6550}, // Bangi
		{2.9900, 101.6500}, // Nilai
		{2.9600, 101.6450}, // Bandar Baru Salak Tinggi
		{2.9300, 101.6400}, // Kuala Lumpur International Airport
		{2.9000, 101.6350}, // Salak Tinggi
		{2.8700, 101.6300}, // Teluk Panglima Garang
		{2.8400, 101.6250}, // Klang
		{2.8100, 101.6200}, // Port Klang (south)
	},

	// KTM Komuter Seremban Line (Batang Kali - Pulau Sebang/Tampin)
	"SEREMBAN": {
		{3.2800, 101.7000}, // Batang Kali (north)
		{3.2500, 101.6950}, // Rasa
		{3.2200, 101.6900}, // Batang Kali
		{3.1900, 101.6880}, // Serendah
		{3.1600, 101.6860}, // Rawang
		{3.1300, 101.6840}, // Kuang
		{3.1000, 101.6820}, // Sungai Buloh
		{3.0700, 101.6800}, // Kepong
		{3.1450, 101.6900}, // KL Sentral (central interchange)
		{3.1200, 101.6700}, // Bandar Tasik Selatan
		{3.0900, 101.6500}, // Kajang
		{3.0600, 101.6300}, // Bangi
		{3.0300, 101.6100}, // Nilai
		{3.0000, 101.5900}, // Seremban
		{2.7000, 101.5500}, // Pulau Sebang/Tampin (south)
	},

	// ETS (Electric Train Service) - KL to Ipoh/Padang Besar route
	"ETS-GEMAS": {
		{3.1450, 101.6900}, // KL Sentral
		{3.1200, 101.6600}, // Bandar Tasik Selatan
		{3.0900, 101.6300}, // Kajang
		{3.0600, 101.6000}, // Bangi
		{3.0300, 101.5700}, // Nilai
		{3.0000, 101.5400}, // Seremban
		{2.7000, 101.5000}, // Gemas
	},

	// ETS Gold Route - KL to Butterworth/Padang Besar
	"ETS-BUTTERWORTH": {
		{3.1450, 101.6900}, // KL Sentral
		{3.1800, 101.6400}, // Kepong
		{3.2200, 101.5900}, // Tanjung Malim
		{3.8000, 101.3000}, // Ipoh
		{4.2000, 101.0000}, // Taiping
		{5.1400, 100.3300}, // Butterworth
	},
}

var routeInfo = map[string]struct {
	Name string
	Type string
}{
	"PORT-KLANG":     {"Port Klang Line", "KTM Komuter"},
	"SEREMBAN":       {"Seremban Line", "KTM Komuter"},
	"ETS-GEMAS":      {"ETS Gemas", "ETS"},
	"ETS-BUTTERWORTH": {"ETS Butterworth", "ETS"},
}

// NewKTMAdapter creates a new KTMB adapter.
// Uses mock data for development; real GTFS-RT endpoint is configured but optional.
func NewKTMAdapter(cfg adapters.AdapterConfig) *KTMAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = ktmbEndpoint
	}
	adapter := &KTMAdapter{
		config:  cfg,
		name:    "KualaLumpur-KTMB",
		hub:     "kuala-lumpur",
		errChan: make(chan adapters.AdapterError, 64),
		health:  adapters.HealthConnected,
	}
	adapter.vehicles = adapter.initTrains()
	return adapter
}

func (k *KTMAdapter) initTrains() []ktmbTrain {
	trains := []ktmbTrain{}

	// Port Klang Line - 8 trains
	for i := 0; i < 8; i++ {
		route := ktmbRoutes["PORT-KLANG"]
		offset := float64(i) * 0.12
		direction := 1
		if i%2 == 1 {
			direction = -1
		}
		startIdx := int(float64(len(route)-1) * (float64(i) / 8.0))
		trains = append(trains, ktmbTrain{
			ID:           fmt.Sprintf("KTM-PK-%03d", i+1),
			RouteID:      "PORT-KLANG",
			RouteName:    "Port Klang Line",
			Lat:          route[startIdx][0],
			Lon:          route[startIdx][1],
			Speed:        75.0 + float64(i%3)*5,
			Bearing:      90.0,
			RoutePath:    route,
			CurrentIndex: startIdx,
			Progress:     offset,
			Direction:    direction,
		})
	}

	// Seremban Line - 6 trains
	for i := 0; i < 6; i++ {
		route := ktmbRoutes["SEREMBAN"]
		offset := float64(i) * 0.15
		direction := 1
		if i%2 == 1 {
			direction = -1
		}
		startIdx := int(float64(len(route)-1) * (float64(i) / 6.0))
		trains = append(trains, ktmbTrain{
			ID:           fmt.Sprintf("KTM-SR-%03d", i+1),
			RouteID:      "SEREMBAN",
			RouteName:    "Seremban Line",
			Lat:          route[startIdx][0],
			Lon:          route[startIdx][1],
			Speed:        70.0 + float64(i%2)*8,
			Bearing:      180.0,
			RoutePath:    route,
			CurrentIndex: startIdx,
			Progress:     offset,
			Direction:    direction,
		})
	}

	// ETS Gemas - 3 trains (express, fewer stops)
	for i := 0; i < 3; i++ {
		route := ktmbRoutes["ETS-GEMAS"]
		offset := float64(i) * 0.3
		trains = append(trains, ktmbTrain{
			ID:           fmt.Sprintf("ETS-GM-%03d", i+1),
			RouteID:      "ETS-GEMAS",
			RouteName:    "ETS Gemas",
			Lat:          route[0][0],
			Lon:          route[0][1],
			Speed:        120.0, // ETS is faster
			Bearing:      135.0,
			RoutePath:    route,
			CurrentIndex: 0,
			Progress:     offset,
			Direction:    1,
		})
	}

	// ETS Butterworth - 2 trains (long distance)
	for i := 0; i < 2; i++ {
		route := ktmbRoutes["ETS-BUTTERWORTH"]
		offset := float64(i) * 0.4
		trains = append(trains, ktmbTrain{
			ID:           fmt.Sprintf("ETS-BW-%03d", i+1),
			RouteID:      "ETS-BUTTERWORTH",
			RouteName:    "ETS Butterworth",
			Lat:          route[0][0],
			Lon:          route[0][1],
			Speed:        140.0, // ETS express is fastest
			Bearing:      330.0,
			RoutePath:    route,
			CurrentIndex: 0,
			Progress:     offset,
			Direction:    1,
		})
	}

	return trains
}

func (k *KTMAdapter) Name() string                         { return k.name }
func (k *KTMAdapter) Errors() <-chan adapters.AdapterError { return k.errChan }
func (k *KTMAdapter) Config() adapters.AdapterConfig       { return k.config }

func (k *KTMAdapter) Health() adapters.AdapterHealth {
	return k.health
}

func (k *KTMAdapter) SetHealth(h adapters.AdapterHealth) {
	k.health = h
}

func (k *KTMAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	ctx, cancel := context.WithCancel(context.Background())
	k.cancel = cancel
	k.health = adapters.HealthConnected

	go func() {
		fmt.Printf("[KTMB] Starting with %d trains\n", len(k.vehicles))
		k.emitTelemetry(stream)

		ticker := time.NewTicker(k.config.PollInterval)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				k.health = adapters.HealthStopped
				return
			case <-ticker.C:
				k.updateTrains()
				k.emitTelemetry(stream)
			}
		}
	}()

	return nil
}

func (k *KTMAdapter) emitTelemetry(stream chan<- models.UrbanfluxTelemetry) {
	now := time.Now().UTC()

	// KTMB station names for next stop
	stops := []string{
		"KL Sentral", "Rawang", "Kuang", "Sungai Buloh", "Kepong",
		"Mid Valley", "Seputeh", "Bandar Tasik Selatan", "Kajang",
		"Bangi", "Nilai", "Seremban", "Port Klang", "Tanjung Malim",
		"Ipoh", "Taiping", "Butterworth", "Gemas",
	}

	sent := 0
	for _, t := range k.vehicles {
		nextStop := stops[(int(t.Progress*20))%len(stops)]

		tel := models.UrbanfluxTelemetry{
			ID:           t.ID,
			RouteID:      t.RouteID,
			Hub:          k.hub,
			Mode:         models.ModeRail,
			Operator:     "KTMB",
			Latitude:     t.Lat,
			Longitude:    t.Lon,
			Speed:        t.Speed,
			Bearing:      t.Bearing,
			Status:       "ACTIVE",
			NextStop:     nextStop,
			Occupancy:    randomOccupancy(),
			DelaySeconds: randomDelay(),
			LastUpdated:  now,
		}

		select {
		case stream <- tel:
			sent++
		default:
		}
		time.Sleep(10 * time.Millisecond)
	}
	fmt.Printf("[KTMB] Emitted %d trains\n", sent)
}

func randomOccupancy() string {
	occupancies := []string{
		models.OccupancyLow,
		models.OccupancyLow,
		models.OccupancyMedium,
		models.OccupancyMedium,
		models.OccupancyHigh,
	}
	return occupancies[int(time.Now().Unix()/90)%len(occupancies)]
}

func randomDelay() int {
	// KTMB often has delays; simulate realistic range
	delays := []int{0, 0, 30, 60, 120, 180, 300}
	return delays[int(time.Now().Unix()/120)%len(delays)]
}

func (k *KTMAdapter) Stop() error {
	if k.cancel != nil {
		k.cancel()
	}
	k.health = adapters.HealthStopped
	return nil
}

func (k *KTMAdapter) updateTrains() {
	for i := range k.vehicles {
		t := &k.vehicles[i]

		// Move train along route - ETS moves faster, Komuter slower
		speedFactor := 0.015 // Default for Komuter
		if t.RouteID == "ETS-GEMAS" || t.RouteID == "ETS-BUTTERWORTH" {
			speedFactor = 0.04 // ETS moves faster
		}

		t.Progress += speedFactor

		if t.Progress >= 1.0 {
			t.Progress = 0
			t.CurrentIndex += t.Direction

			if t.CurrentIndex >= len(t.RoutePath)-1 {
				t.Direction = -1
				t.CurrentIndex = len(t.RoutePath) - 2
			} else if t.CurrentIndex < 0 {
				t.Direction = 1
				t.CurrentIndex = 0
			}
		}

		if t.CurrentIndex < len(t.RoutePath)-1 {
			p1 := t.RoutePath[t.CurrentIndex]
			p2 := t.RoutePath[t.CurrentIndex+1]

			t.Lat = p1[0] + (p2[0]-p1[0])*t.Progress
			t.Lon = p1[1] + (p2[1]-p1[1])*t.Progress
			t.Bearing = calculateBearing(p1[0], p1[1], p2[0], p2[1])
		}
	}
}

func calculateBearing(lat1, lon1, lat2, lon2 float64) float64 {
	dLon := (lon2 - lon1) * math.Pi / 180
	lat1Rad := lat1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180

	y := math.Sin(dLon) * math.Cos(lat2Rad)
	x := math.Cos(lat1Rad)*math.Sin(lat2Rad) - math.Sin(lat1Rad)*math.Cos(lat2Rad)*math.Cos(dLon)

	bearing := math.Atan2(y, x) * 180 / math.Pi
	return math.Mod(bearing+360, 360)
}
