package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASMelakaAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASMelakaAdapter(cfg)

	if adapter.Name() != "Malaysia-Melaka-MyBAS" {
		t.Errorf("expected name Malaysia-Melaka-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != melakaEndpoint {
		t.Errorf("expected URL %s, got %s", melakaEndpoint, adapter.Config().BaseURL)
	}
}
