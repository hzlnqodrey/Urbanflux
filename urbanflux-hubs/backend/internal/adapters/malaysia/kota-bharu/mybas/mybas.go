package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	kotaBharuEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kota-bharu"
)

// MyBASKotaBharuAdapter streams real-time KotaBharu city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASKotaBharuAdapter struct{ *base.BaseAdapter }

// NewMyBASKotaBharuAdapter creates a new adapter for KotaBharu city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASKotaBharuAdapter(cfg adapters.AdapterConfig) *MyBASKotaBharuAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kotaBharuEndpoint
	}
	return &MyBASKotaBharuAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-KotaBharu-MyBAS",
			"kota-bharu",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
