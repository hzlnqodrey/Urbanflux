package kualalumpur

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	penangBusEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-penang"
)

// PenangBusAdapter streams real-time Rapid Penang bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
//
// Known issues: E003 (trip_id mismatch) and E004 (route_id mismatch)
// due to legacy operational systems. Vehicle positions are still valid.
type PenangBusAdapter struct {
	*base.BaseAdapter
}

// NewPenangBusAdapter creates a new adapter for Rapid Penang bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewPenangBusAdapter(cfg adapters.AdapterConfig) *PenangBusAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = penangBusEndpoint
	}
	return &PenangBusAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Penang-RapidBus",
			"penang",
			models.ModeBus,
			"Prasarana",
			cfg,
		),
	}
}
