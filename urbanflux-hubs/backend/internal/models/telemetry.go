package models

import (
	"fmt"
	"time"
)

// Transport mode constants
const (
	ModeBus      = "BUS"
	ModeRail     = "RAIL"
	ModeMetro    = "METRO"
	ModeFerry    = "FERRY"
	ModeMonorail = "MONORAIL"
	ModeTram     = "TRAM"
)

// Occupancy level constants
const (
	OccupancyEmpty   = "EMPTY"
	OccupancyLow     = "LOW"
	OccupancyMedium  = "MEDIUM"
	OccupancyHigh    = "HIGH"
	OccupancyFull    = "FULL"
	OccupancyUnknown = "UNKNOWN"
)

// ValidModes contains all allowed transport modes for validation.
var ValidModes = map[string]bool{
	ModeBus: true, ModeRail: true, ModeMetro: true,
	ModeFerry: true, ModeMonorail: true, ModeTram: true,
}

// ValidOccupancies contains all allowed occupancy levels for validation.
var ValidOccupancies = map[string]bool{
	OccupancyEmpty: true, OccupancyLow: true, OccupancyMedium: true,
	OccupancyHigh: true, OccupancyFull: true, OccupancyUnknown: true,
}

// UrbanfluxTelemetry represents the globally standardized output format
// that all city-specific adapters must conform to.
type UrbanfluxTelemetry struct {
	// Core identification
	ID      string `json:"id"`      // Vehicle ID, e.g. "JKT-TB-0104"
	RouteID string `json:"routeId"` // Route/corridor, e.g. "CORRIDOR-1"

	// Hub & operator metadata
	Hub      string `json:"hub"`      // City identifier, e.g. "jakarta", "kuala-lumpur", "tokyo"
	Mode     string `json:"mode"`     // Transport mode: BUS, RAIL, METRO, FERRY, MONORAIL, TRAM
	Operator string `json:"operator"` // Transit operator, e.g. "Transjakarta", "Prasarana", "JR East"

	// Geospatial data
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Speed     float64 `json:"speed"`   // km/h
	Bearing   float64 `json:"bearing"` // 0-360 degrees

	// Status & schedule
	Status       string `json:"status"`       // ACTIVE, DELAYED, OFFLINE
	NextStop     string `json:"nextStop"`     // Next station/stop name
	Occupancy    string `json:"occupancy"`    // EMPTY, LOW, MEDIUM, HIGH, FULL, UNKNOWN
	DelaySeconds int    `json:"delaySeconds"` // Delay in seconds (0 = on time, negative = early)

	// Error context
	ErrorInfo string `json:"errorInfo,omitempty"` // Optional error context when data is degraded

	// Timestamp
	LastUpdated time.Time `json:"lastUpdated"` // UTC timestamp
}

// Validate checks that all required fields are present and values are within
// expected ranges. Returns nil if valid, or an error describing the issue.
func (t *UrbanfluxTelemetry) Validate() error {
	if t.ID == "" {
		return fmt.Errorf("telemetry validation: ID is required")
	}
	if t.RouteID == "" {
		return fmt.Errorf("telemetry validation: RouteID is required")
	}
	if t.Hub == "" {
		return fmt.Errorf("telemetry validation: Hub is required")
	}
	if t.Mode == "" {
		return fmt.Errorf("telemetry validation: Mode is required")
	}
	if !ValidModes[t.Mode] {
		return fmt.Errorf("telemetry validation: invalid Mode %q", t.Mode)
	}
	if t.Latitude < -90 || t.Latitude > 90 {
		return fmt.Errorf("telemetry validation: Latitude %f out of range [-90, 90]", t.Latitude)
	}
	if t.Longitude < -180 || t.Longitude > 180 {
		return fmt.Errorf("telemetry validation: Longitude %f out of range [-180, 180]", t.Longitude)
	}
	if t.Latitude == 0 && t.Longitude == 0 {
		return fmt.Errorf("telemetry validation: Latitude and Longitude are both 0 (likely invalid)")
	}
	if t.Occupancy != "" && !ValidOccupancies[t.Occupancy] {
		return fmt.Errorf("telemetry validation: invalid Occupancy %q", t.Occupancy)
	}
	if t.Bearing < 0 || t.Bearing > 360 {
		return fmt.Errorf("telemetry validation: Bearing %f out of range [0, 360]", t.Bearing)
	}
	return nil
}
