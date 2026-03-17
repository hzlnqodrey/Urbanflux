package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASKotaBharuAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASKotaBharuAdapter(cfg)

	if adapter.Name() != "Malaysia-KotaBharu-MyBAS" {
		t.Errorf("expected name Malaysia-KotaBharu-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != kotaBharuEndpoint {
		t.Errorf("expected URL %s, got %s", kotaBharuEndpoint, adapter.Config().BaseURL)
	}
}
