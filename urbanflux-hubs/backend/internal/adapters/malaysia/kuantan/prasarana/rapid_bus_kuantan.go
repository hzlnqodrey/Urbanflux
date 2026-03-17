package kualalumpur

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	kuantanBusEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kuantan"
)

// KuantanBusAdapter streams real-time Rapid Kuantan bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
//
// Known issues: E003 (trip_id mismatch) and E004 (route_id mismatch)
// due to legacy operational systems. Vehicle positions are still valid.
type KuantanBusAdapter struct {
	*base.BaseAdapter
}

// NewKuantanBusAdapter creates a new adapter for Rapid Kuantan bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewKuantanBusAdapter(cfg adapters.AdapterConfig) *KuantanBusAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kuantanBusEndpoint
	}
	return &KuantanBusAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Kuantan-RapidBus",
			"kuantan",
			models.ModeBus,
			"Prasarana",
			cfg,
		),
	}
}
