package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASJohorBahruAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASJohorBahruAdapter(cfg)

	if adapter.Name() != "Malaysia-JohorBahru-MyBAS" {
		t.Errorf("expected name Malaysia-JohorBahru-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != johorEndpoint {
		t.Errorf("expected URL %s, got %s", johorEndpoint, adapter.Config().BaseURL)
	}
}
