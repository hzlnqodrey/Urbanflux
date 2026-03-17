package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	serembanAEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-seremban-a"
	serembanBEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-seremban-b"
)

// MyBASSerembanAAdapter streams real-time Seremban route A city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASSerembanAAdapter struct{ *base.BaseAdapter }

// NewMyBASSerembanAAdapter creates a new adapter for Seremban route A city bus vehicle positions.
func NewMyBASSerembanAAdapter(cfg adapters.AdapterConfig) *MyBASSerembanAAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = serembanAEndpoint
	}
	return &MyBASSerembanAAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Seremban-A-MyBAS",
			"seremban",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}

// MyBASSerembanBAdapter streams real-time Seremban route B city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASSerembanBAdapter struct{ *base.BaseAdapter }

// NewMyBASSerembanBAdapter creates a new adapter for Seremban route B city bus vehicle positions.
func NewMyBASSerembanBAdapter(cfg adapters.AdapterConfig) *MyBASSerembanBAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = serembanBEndpoint
	}
	return &MyBASSerembanBAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Seremban-B-MyBAS",
			"seremban",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
