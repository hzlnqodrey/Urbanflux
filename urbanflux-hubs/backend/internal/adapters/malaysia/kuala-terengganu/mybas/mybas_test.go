package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASKualaTerengganuAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASKualaTerengganuAdapter(cfg)

	if adapter.Name() != "Malaysia-KualaTerengganu-MyBAS" {
		t.Errorf("expected name Malaysia-KualaTerengganu-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != kualaTerengganuEndpoint {
		t.Errorf("expected URL %s, got %s", kualaTerengganuEndpoint, adapter.Config().BaseURL)
	}
}
