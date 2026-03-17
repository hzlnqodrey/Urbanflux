package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

func TestMyBASSerembanAAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASSerembanAAdapter(cfg)

	if adapter.Name() != "Malaysia-Seremban-A-MyBAS" {
		t.Errorf("expected name Malaysia-Seremban-A-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != serembanAEndpoint {
		t.Errorf("expected URL %s, got %s", serembanAEndpoint, adapter.Config().BaseURL)
	}
}

func TestMyBASSerembanBAdapter(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewMyBASSerembanBAdapter(cfg)

	if adapter.Name() != "Malaysia-Seremban-B-MyBAS" {
		t.Errorf("expected name Malaysia-Seremban-B-MyBAS, got %s", adapter.Name())
	}

	if adapter.Config().BaseURL != serembanBEndpoint {
		t.Errorf("expected URL %s, got %s", serembanBEndpoint, adapter.Config().BaseURL)
	}
}
