package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	kuchingEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kuching"
)

// MyBASKuchingAdapter streams real-time Kuching city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASKuchingAdapter struct{ *base.BaseAdapter }

// NewMyBASKuchingAdapter creates a new adapter for Kuching city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASKuchingAdapter(cfg adapters.AdapterConfig) *MyBASKuchingAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kuchingEndpoint
	}
	return &MyBASKuchingAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-Kuching-MyBAS",
			"kuching",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
