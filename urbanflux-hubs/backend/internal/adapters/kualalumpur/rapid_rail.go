package kualalumpur

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	klRailEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-rail-kl"
)

// KualaLumpurRailAdapter streams real-time Rapid KL rail (LRT/MRT/Monorail)
// positions from Malaysia's api.data.gov.my GTFS-RT feed.
//
// Note: the rail feed may be less stable than the bus feed per data.gov.my docs.
// This adapter handles degraded states gracefully without crashing.
type KualaLumpurRailAdapter struct {
	*baseAdapter
}

// NewKualaLumpurRailAdapter creates a new adapter for Rapid KL rail vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewKualaLumpurRailAdapter(cfg adapters.AdapterConfig) *KualaLumpurRailAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = klRailEndpoint
	}
	return &KualaLumpurRailAdapter{
		baseAdapter: newBaseAdapter(
			"KualaLumpur-RapidRail",
			"kuala-lumpur",
			models.ModeRail,
			"Prasarana",
			cfg,
		),
	}
}
