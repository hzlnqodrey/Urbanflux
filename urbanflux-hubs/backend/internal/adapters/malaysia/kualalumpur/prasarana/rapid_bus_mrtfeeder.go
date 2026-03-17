package prasarana

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	klMRTFeederEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana/?category=rapid-bus-mrtfeeder-kl"
)

// KualaLumpurMRTFeederBusAdapter streams real-time Rapid KL MRT Feeder bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type KualaLumpurMRTFeederBusAdapter struct {
	*base.BaseAdapter
}

// NewKualaLumpurMRTFeederBusAdapter creates a new adapter for Rapid KL MRT Feeder bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewKualaLumpurMRTFeederBusAdapter(cfg adapters.AdapterConfig) *KualaLumpurMRTFeederBusAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = klMRTFeederEndpoint
	}
	return &KualaLumpurMRTFeederBusAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"KualaLumpur-MRTFeeder",
			"kuala-lumpur",
			models.ModeBus,
			"Prasarana",
			cfg,
		),
	}
}
