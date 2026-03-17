package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	johorEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-johor"
)

// MyBASJohorBahruAdapter streams real-time JohorBahru city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASJohorBahruAdapter struct{ *base.BaseAdapter }

// NewMyBASJohorBahruAdapter creates a new adapter for JohorBahru city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASJohorBahruAdapter(cfg adapters.AdapterConfig) *MyBASJohorBahruAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = johorEndpoint
	}
	return &MyBASJohorBahruAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-JohorBahru-MyBAS",
			"johor-bahru",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
