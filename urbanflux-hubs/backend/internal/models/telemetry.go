package models

import "time"

// UrbanfluxTelemetry represents the globally standardized output format
// that all city-specific adapters must conform to.
type UrbanfluxTelemetry struct {
	ID          string    `json:"id"`          // JKT-TB-0104
	RouteID     string    `json:"routeId"`     // CORRIDOR-1
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Speed       float64   `json:"speed"`       // km/h
	Bearing     float64   `json:"bearing"`     // 0-360
	Status      string    `json:"status"`      // ACTIVE, DELAYED, OFFLINE
	NextStop    string    `json:"nextStop"`
	LastUpdated time.Time `json:"lastUpdated"` // UTC timestamp
}
