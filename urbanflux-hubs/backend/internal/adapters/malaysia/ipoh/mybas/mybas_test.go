package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASIpohAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASIpohAdapter(cfg)

	if adapter.Name() != "Malaysia-Ipoh-MyBAS" {
		t.Errorf("expected name Malaysia-Ipoh-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != ipohEndpoint {
		t.Errorf("expected URL %s, got %s", ipohEndpoint, adapter.Config().BaseURL)
	}
}
