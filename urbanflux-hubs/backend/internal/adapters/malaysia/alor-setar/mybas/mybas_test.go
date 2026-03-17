package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASAlorSetarAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASAlorSetarAdapter(cfg)

	if adapter.Name() != "Malaysia-AlorSetar-MyBAS" {
		t.Errorf("expected name Malaysia-AlorSetar-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != alorSetarEndpoint {
		t.Errorf("expected URL %s, got %s", alorSetarEndpoint, adapter.Config().BaseURL)
	}
}
