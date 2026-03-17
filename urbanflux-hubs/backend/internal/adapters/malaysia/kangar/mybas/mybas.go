package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	kangarEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kangar"
)

// MyBASKangarAdapter streams real-time Kangar city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASKangarAdapter struct{ *base.BaseAdapter }

// NewMyBASKangarAdapter creates a new adapter for Kangar city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASKangarAdapter(cfg adapters.AdapterConfig) *MyBASKangarAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kangarEndpoint
	}
	return &MyBASKangarAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Kangar-MyBAS",
			"kangar",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
