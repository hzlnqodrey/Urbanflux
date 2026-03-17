package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	melakaEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-melaka"
)

// MyBASMelakaAdapter streams real-time Melaka city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASMelakaAdapter struct{ *base.BaseAdapter }

// NewMyBASMelakaAdapter creates a new adapter for Melaka city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASMelakaAdapter(cfg adapters.AdapterConfig) *MyBASMelakaAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = melakaEndpoint
	}
	return &MyBASMelakaAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Melaka-MyBAS",
			"melaka",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
