package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASKuchingAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASKuchingAdapter(cfg)

	if adapter.Name() != "Malaysia-Kuching-MyBAS" {
		t.Errorf("expected name Malaysia-Kuching-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != kuchingEndpoint {
		t.Errorf("expected URL %s, got %s", kuchingEndpoint, adapter.Config().BaseURL)
	}
}
