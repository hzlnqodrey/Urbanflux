package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	ipohEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-ipoh"
)

// MyBASIpohAdapter streams real-time Ipoh city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASIpohAdapter struct{ *base.BaseAdapter }

// NewMyBASIpohAdapter creates a new adapter for Ipoh city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASIpohAdapter(cfg adapters.AdapterConfig) *MyBASIpohAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = ipohEndpoint
	}
	return &MyBASIpohAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Ipoh-MyBAS",
			"ipoh",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
