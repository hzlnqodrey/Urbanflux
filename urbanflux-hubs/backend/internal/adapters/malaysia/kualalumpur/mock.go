package kualalumpur

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
)

// MockKualaLumpurAdapter generates simulated Kuala Lumpur transit data
// for development and testing when live feeds are empty.
type MockKualaLumpurAdapter struct {
	config     adapters.AdapterConfig
	name       string
	hub        string
	errChan    chan adapters.AdapterError
	cancel     context.CancelFunc
	vehicles   []mockVehicle
}

type mockVehicle struct {
	ID           string
	RouteID      string
	RouteName    string
	Mode         string
	Operator     string
	Lat          float64
	Lon          float64
	Speed        float64
	Bearing      float64
	RoutePath    [][2]float64
	CurrentIndex int
	Progress     float64
	Direction    int
	Color        string
}

// KL Transit Route Definitions with realistic coordinates
var klRoutes = map[string][][2]float64{
	// LRT Kelana Jaya Line (formerly PUTRA) - Pink line
	"LRT-KELANA-JAYA": {
		{3.1340, 101.6860}, // KL Sentral
		{3.1395, 101.6915}, // Bangsar
		{3.1425, 101.6955}, // Pasar Seni
		{3.1465, 101.6985}, // Merdeka
		{3.1495, 101.6965}, // Masjid Jamek
		{3.1525, 101.6995}, // Dang Wangi
		{3.1550, 101.7035}, // Kampung Baru
		{3.1575, 101.7085}, // Medan Tuanku
		{3.1590, 101.7145}, // KLCC
		{3.1650, 101.7245}, // Ampang Park
		{3.1705, 101.7325}, // KLCC (other end)
	},

	// LRT Sri Petaling Line (formerly STAR) - Yellow/Green line
	"LRT-SRI-PETALING": {
		{3.1495, 101.6965}, // Masjid Jamek
		{3.1525, 101.6895}, // Plaza Rakyat
		{3.1555, 101.6855}, // Hang Tuah
		{3.1595, 101.6805}, // Pudu
		{3.1655, 101.6755}, // Chan Sow Lin
		{3.1725, 101.6705}, // Sri Petaling
	},

	// MRT Kajang Line (SBK) - Blue line
	"MRT-KAJANG": {
		{3.0750, 101.6870}, // Sungai Buloh
		{3.0950, 101.6950}, // Kwasa Damansara
		{3.1150, 101.7000}, // Bandar Utama
		{3.1350, 101.6950}, // Semantan
		{3.1450, 101.6900}, // Muzium Negara
		{3.1500, 101.6850}, // KL Sentral
		{3.1550, 101.6800}, // Merdeka
		{3.1600, 101.6750}, // Bukit Bintang
		{3.1650, 101.6700}, // Tun Razak Exchange
		{3.1750, 101.6650}, // Kajang
	},

	// MRT Putrajaya Line (PY) - Purple line
	"MRT-PUTRAJAYA": {
		{3.1800, 101.6800}, // Kwasa Damansara
		{3.1700, 101.6850}, // Kampung Selamat
		{3.1600, 101.6900}, // Damansara
		{3.1500, 101.6950}, // Bandar Malaysia
		{3.1400, 101.7000}, // Chan Sow Lin
		{3.1300, 101.7050}, // Kuchai
	},

	// Monorail Line - Light green line
	"MONORAIL": {
		{3.1450, 101.6950}, // KL Sentral
		{3.1475, 101.6975}, // Tun Sambanthan
		{3.1500, 101.7000}, // Maharajalela
		{3.1525, 101.7025}, // Hang Tuah
		{3.1550, 101.7050}, // Imbi
		{3.1575, 101.7075}, // Bukit Bintang
		{3.1600, 101.7100}, // Raja Chulan
		{3.1625, 101.7125}, // Bukit Nanas
		{3.1650, 101.7150}, // Medan Tunku
		{3.1675, 101.7175}, // Chow Kit
		{3.1700, 101.7200}, // Titwangsa
	},

	// Bus Routes - Rapid KL
	"BUS-T100": { // KL Sentral - Bangsar - Mid Valley
		{3.1350, 101.6870},
		{3.1380, 101.6900},
		{3.1410, 101.6930},
		{3.1440, 101.6960},
		{3.1470, 101.6990},
		{3.1500, 101.7020},
		{3.1530, 101.7050},
	},
	"BUS-T101": { // Pasar Seni - Chow Kit
		{3.1425, 101.6955},
		{3.1455, 101.6985},
		{3.1485, 101.7015},
		{3.1515, 101.7045},
		{3.1545, 101.7075},
		{3.1575, 101.7105},
		{3.1605, 101.7135},
		{3.1635, 101.7165},
	},
	"BUS-T102": { // KLCC - Ampang
		{3.1590, 101.7145},
		{3.1620, 101.7195},
		{3.1650, 101.7245},
		{3.1680, 101.7295},
		{3.1710, 101.7345},
	},
	"BUS-B103": { // Bukit Bintang Route
		{3.1550, 101.7000},
		{3.1570, 101.7030},
		{3.1590, 101.7060},
		{3.1610, 101.7090},
		{3.1630, 101.7120},
		{3.1650, 101.7150},
		{3.1670, 101.7180},
		{3.1690, 101.7210},
	},
	"BUS-U80": { // MRT Feeder - Bandar Utama
		{3.1150, 101.7000},
		{3.1180, 101.7030},
		{3.1210, 101.7060},
		{3.1240, 101.7090},
		{3.1270, 101.7120},
	},
}

var routeInfo = map[string]struct {
	Name    string
	Operator string
	Color   string
}{
	"LRT-KELANA-JAYA":  {"LRT Kelana Jaya", "Rapid KL", "#EC4899"},
	"LRT-SRI-PETALING": {"LRT Sri Petaling", "Rapid KL", "#10B981"},
	"MRT-KAJANG":       {"MRT Kajang Line", "MRT Corp", "#3B82F6"},
	"MRT-PUTRAJAYA":    {"MRT Putrajaya Line", "MRT Corp", "#8B5CF6"},
	"MONORAIL":         {"KL Monorail", "Rapid KL", "#F59E0B"},
	"BUS-T100":         {"Rapid KL T100", "Rapid KL", "#10B981"},
	"BUS-T101":         {"Rapid KL T101", "Rapid KL", "#10B981"},
	"BUS-T102":         {"Rapid KL T102", "Rapid KL", "#10B981"},
	"BUS-B103":         {"Rapid KL B103", "Rapid KL", "#10B981"},
	"BUS-U80":          {"MRT Feeder U80", "Rapid KL", "#06B6D4"},
}

func NewMockKualaLumpurAdapter(cfg adapters.AdapterConfig) *MockKualaLumpurAdapter {
	adapter := &MockKualaLumpurAdapter{
		config:   cfg,
		name:     "KualaLumpur-Mock",
		hub:      "kuala-lumpur",
		errChan:  make(chan adapters.AdapterError, 64),
	}
	adapter.vehicles = adapter.initVehicles()
	return adapter
}

func (m *MockKualaLumpurAdapter) initVehicles() []mockVehicle {
	vehicles := []mockVehicle{}

	// LRT Kelana Jaya - 6 trains
	for i := 0; i < 6; i++ {
		route := klRoutes["LRT-KELANA-JAYA"]
		offset := float64(i) * 0.15
		vehicles = append(vehicles, mockVehicle{
			ID:        fmt.Sprintf("LRT-KJ-%03d", i+1),
			RouteID:   "LRT-KELANA-JAYA",
			RouteName: "LRT Kelana Jaya",
			Mode:      models.ModeRail,
			Operator:  "Rapid KL",
			Lat:       route[0][0] + offset,
			Lon:       route[0][1],
			Speed:     55.0 + float64(i)*2,
			Bearing:   45.0,
			RoutePath: route,
			Progress:  float64(i) * 0.15,
			Color:     "#EC4899",
		})
	}

	// LRT Sri Petaling - 4 trains
	for i := 0; i < 4; i++ {
		route := klRoutes["LRT-SRI-PETALING"]
		vehicles = append(vehicles, mockVehicle{
			ID:        fmt.Sprintf("LRT-SP-%03d", i+1),
			RouteID:   "LRT-SRI-PETALING",
			RouteName: "LRT Sri Petaling",
			Mode:      models.ModeRail,
			Operator:  "Rapid KL",
			Lat:       route[0][0],
			Lon:       route[0][1],
			Speed:     50.0,
			Bearing:   90.0,
			RoutePath: route,
			Progress:  float64(i) * 0.2,
			Color:     "#10B981",
		})
	}

	// MRT Kajang - 5 trains
	for i := 0; i < 5; i++ {
		route := klRoutes["MRT-KAJANG"]
		vehicles = append(vehicles, mockVehicle{
			ID:        fmt.Sprintf("MRT-KG-%03d", i+1),
			RouteID:   "MRT-KAJANG",
			RouteName: "MRT Kajang Line",
			Mode:      models.ModeMetro,
			Operator:  "MRT Corp",
			Lat:       route[0][0],
			Lon:       route[0][1],
			Speed:     65.0,
			Bearing:   0.0,
			RoutePath: route,
			Progress:  float64(i) * 0.18,
			Color:     "#3B82F6",
		})
	}

	// MRT Putrajaya - 3 trains
	for i := 0; i < 3; i++ {
		route := klRoutes["MRT-PUTRAJAYA"]
		vehicles = append(vehicles, mockVehicle{
			ID:        fmt.Sprintf("MRT-PY-%03d", i+1),
			RouteID:   "MRT-PUTRAJAYA",
			RouteName: "MRT Putrajaya Line",
			Mode:      models.ModeMetro,
			Operator:  "MRT Corp",
			Lat:       route[0][0],
			Lon:       route[0][1],
			Speed:     70.0,
			Bearing:   180.0,
			RoutePath: route,
			Progress:  float64(i) * 0.25,
			Color:     "#8B5CF6",
		})
	}

	// Monorail - 4 trains
	for i := 0; i < 4; i++ {
		route := klRoutes["MONORAIL"]
		vehicles = append(vehicles, mockVehicle{
			ID:        fmt.Sprintf("MR-%03d", i+1),
			RouteID:   "MONORAIL",
			RouteName: "KL Monorail",
			Mode:      models.ModeMonorail,
			Operator:  "Rapid KL",
			Lat:       route[0][0],
			Lon:       route[0][1],
			Speed:     40.0,
			Bearing:   45.0,
			RoutePath: route,
			Progress:  float64(i) * 0.2,
			Color:     "#F59E0B",
		})
	}

	// Buses - 15 buses across different routes
	busRoutes := []struct{ id, name string; count int }{
		{"BUS-T100", "T100", 4},
		{"BUS-T101", "T101", 4},
		{"BUS-T102", "T102", 3},
		{"BUS-B103", "B103", 2},
		{"BUS-U80", "U80", 2},
	}

	busNum := 1
	for _, br := range busRoutes {
		route := klRoutes[br.id]
		for i := 0; i < br.count; i++ {
			vehicles = append(vehicles, mockVehicle{
				ID:        fmt.Sprintf("BUS-%03d", busNum),
				RouteID:   br.id,
				RouteName: br.name,
				Mode:      models.ModeBus,
				Operator:  "Rapid KL",
				Lat:       route[0][0],
				Lon:       route[0][1],
				Speed:     30.0 + float64(i)*5,
				Bearing:   0.0,
				RoutePath: route,
				Progress:  float64(i) * 0.2,
				Color:     "#10B981",
			})
			busNum++
		}
	}

	return vehicles
}

func (m *MockKualaLumpurAdapter) Name() string                         { return m.name }
func (m *MockKualaLumpurAdapter) Errors() <-chan adapters.AdapterError { return m.errChan }
func (m *MockKualaLumpurAdapter) Config() adapters.AdapterConfig       { return m.config }

func (m *MockKualaLumpurAdapter) Health() adapters.AdapterHealth {
	return adapters.HealthConnected
}

func (m *MockKualaLumpurAdapter) SetHealth(h adapters.AdapterHealth) {}

func (m *MockKualaLumpurAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	ctx, cancel := context.WithCancel(context.Background())
	m.cancel = cancel

	go func() {
		// Log initial emission
		fmt.Printf("[KL-Mock] Starting with %d vehicles\n", len(m.vehicles))
		m.emitTelemetry(stream)

		ticker := time.NewTicker(m.config.PollInterval)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				m.updateVehicles()
				m.emitTelemetry(stream)
			}
		}
	}()

	return nil
}

func (m *MockKualaLumpurAdapter) emitTelemetry(stream chan<- models.UrbanfluxTelemetry) {
	now := time.Now().UTC()

	stops := []string{"KL Sentral", "Bangsar", "Pasar Seni", "Masjid Jamek", "Dang Wangi", "KLCC", "Bukit Bintang", "Tun Razak", "Kajang"}

	sent := 0
	for _, v := range m.vehicles {
		nextStop := stops[(int(v.Progress*10))%len(stops)]

		tel := models.UrbanfluxTelemetry{
			ID:           v.ID,
			RouteID:      v.RouteID,
			Hub:          m.hub,
			Mode:         v.Mode,
			Operator:     v.Operator,
			Latitude:     v.Lat,
			Longitude:    v.Lon,
			Speed:        v.Speed,
			Bearing:      v.Bearing,
			Status:       "ACTIVE",
			NextStop:     nextStop,
			Occupancy:    randomOccupancy(),
			DelaySeconds: 0,
			LastUpdated:  now,
		}

		select {
		case stream <- tel:
			sent++
		default:
		}
		// Delay to ensure each message is sent as a separate WebSocket frame
		time.Sleep(10 * time.Millisecond)
	}
	fmt.Printf("[KL-Mock] Emitted %d vehicles\n", sent)
}

func randomOccupancy() string {
	occupancies := []string{
		models.OccupancyLow,
		models.OccupancyMedium,
		models.OccupancyMedium,
		models.OccupancyHigh,
	}
	return occupancies[int(time.Now().Unix()/60)%len(occupancies)]
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

func (m *MockKualaLumpurAdapter) GetVehicleCount() int {
	return len(m.vehicles)
}

func (m *MockKualaLumpurAdapter) Stop() error {
	if m.cancel != nil {
		m.cancel()
	}
	return nil
}

func (m *MockKualaLumpurAdapter) updateVehicles() {
	for i := range m.vehicles {
		v := &m.vehicles[i]
		// Move very slowly - only 2% of segment per poll (30 sec) = 1 segment per 25 minutes
		// This is realistic for transit vehicles
		v.Progress += 0.02

		if v.Progress >= 1.0 {
			v.Progress = 0
			v.CurrentIndex += v.Direction

			if v.CurrentIndex >= len(v.RoutePath)-1 {
				v.Direction = -1
				v.CurrentIndex = len(v.RoutePath) - 2
			} else if v.CurrentIndex < 0 {
				v.Direction = 1
				v.CurrentIndex = 0
			}
		}

		if v.CurrentIndex < len(v.RoutePath)-1 {
			p1 := v.RoutePath[v.CurrentIndex]
			p2 := v.RoutePath[v.CurrentIndex+1]

			v.Lat = p1[0] + (p2[0]-p1[0])*v.Progress
			v.Lon = p1[1] + (p2[1]-p1[1])*v.Progress
			v.Bearing = calculateBearing(p1[0], p1[1], p2[0], p2[1])
		}
	}
}

