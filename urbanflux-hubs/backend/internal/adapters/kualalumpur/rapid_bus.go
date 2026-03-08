package kualalumpur

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	klBusEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl"
)

// KualaLumpurBusAdapter streams real-time Rapid KL bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type KualaLumpurBusAdapter struct {
	*baseAdapter
}

// NewKualaLumpurBusAdapter creates a new adapter for Rapid KL bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewKualaLumpurBusAdapter(cfg adapters.AdapterConfig) *KualaLumpurBusAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = klBusEndpoint
	}
	return &KualaLumpurBusAdapter{
		baseAdapter: newBaseAdapter(
			"KualaLumpur-RapidBus",
			"kuala-lumpur",
			models.ModeBus,
			"Prasarana",
			cfg,
		),
	}
}
