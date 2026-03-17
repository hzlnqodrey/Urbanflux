package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	alorSetarEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-alor-setar"
)

// MyBASAlorSetarAdapter streams real-time AlorSetar city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASAlorSetarAdapter struct{ *base.BaseAdapter }

// NewMyBASAlorSetarAdapter creates a new adapter for AlorSetar city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASAlorSetarAdapter(cfg adapters.AdapterConfig) *MyBASAlorSetarAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = alorSetarEndpoint
	}
	return &MyBASAlorSetarAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-AlorSetar-MyBAS",
			"alor-setar",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
