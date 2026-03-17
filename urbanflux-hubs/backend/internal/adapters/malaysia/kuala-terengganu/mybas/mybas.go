package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

const (
	kualaTerengganuEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kuala-terengganu"
)

// MyBASKualaTerengganuAdapter streams real-time KualaTerengganu city bus positions
// from Malaysia's api.data.gov.my GTFS-RT feed.
type MyBASKualaTerengganuAdapter struct{ *base.BaseAdapter }

// NewMyBASKualaTerengganuAdapter creates a new adapter for KualaTerengganu city bus vehicle positions.
// If cfg.BaseURL is empty, it defaults to the official api.data.gov.my endpoint.
func NewMyBASKualaTerengganuAdapter(cfg adapters.AdapterConfig) *MyBASKualaTerengganuAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kualaTerengganuEndpoint
	}
	return &MyBASKualaTerengganuAdapter{
		BaseAdapter: base.NewBaseAdapter(
			"Malaysia-KualaTerengganu-MyBAS",
			"kuala-terengganu",
			models.ModeBus,
			"BAS.MY",
			cfg,
		),
	}
}
