package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASKangarAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASKangarAdapter(cfg)

	if adapter.Name() != "Malaysia-Kangar-MyBAS" {
		t.Errorf("expected name Malaysia-Kangar-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != kangarEndpoint {
		t.Errorf("expected URL %s, got %s", kangarEndpoint, adapter.Config().BaseURL)
	}
}
