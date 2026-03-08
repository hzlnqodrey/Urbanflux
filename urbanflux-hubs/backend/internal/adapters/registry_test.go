package adapters

import (
	"sync"
	"testing"
	"time"

	"github.com/urbanflux/hubs-backend/internal/models"
)

// --- Mock Adapter for testing ---

type mockAdapter struct {
	name    string
	config  AdapterConfig
	health  AdapterHealth
	errChan chan AdapterError
	cancel  chan struct{}
	mu      sync.RWMutex
}

func newMockAdapter(name string) *mockAdapter {
	return &mockAdapter{
		name:    name,
		config:  DefaultConfig(),
		health:  HealthStopped,
		errChan: make(chan AdapterError, 16),
		cancel:  make(chan struct{}),
	}
}

func (m *mockAdapter) Name() string                { return m.name }
func (m *mockAdapter) Config() AdapterConfig       { return m.config }
func (m *mockAdapter) Errors() <-chan AdapterError { return m.errChan }

func (m *mockAdapter) Health() AdapterHealth {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.health
}

func (m *mockAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	m.mu.Lock()
	m.health = HealthConnected
	m.mu.Unlock()

	go func() {
		ticker := time.NewTicker(50 * time.Millisecond) // Fast for tests
		defer ticker.Stop()
		for {
			select {
			case <-m.cancel:
				return
			case <-ticker.C:
				select {
				case stream <- models.UrbanfluxTelemetry{
					ID:        m.name + "-001",
					RouteID:   "ROUTE-1",
					Hub:       "test",
					Mode:      models.ModeBus,
					Operator:  m.name,
					Latitude:  1.0,
					Longitude: 1.0,
					Status:    "ACTIVE",
					Occupancy: models.OccupancyUnknown,
				}:
				default:
				}
			}
		}
	}()
	return nil
}

func (m *mockAdapter) Stop() error {
	m.mu.Lock()
	defer m.mu.Unlock()
	close(m.cancel)
	m.health = HealthStopped
	return nil
}

// --- Tests ---

func TestRegistry_Register(t *testing.T) {
	reg := NewRegistry()
	reg.Register(newMockAdapter("Adapter-A"))
	reg.Register(newMockAdapter("Adapter-B"))

	if reg.AdapterCount() != 2 {
		t.Errorf("expected 2 adapters, got %d", reg.AdapterCount())
	}
}

func TestRegistry_StartAll_Empty(t *testing.T) {
	reg := NewRegistry()
	err := reg.StartAll()
	if err == nil {
		t.Error("expected error when starting with no adapters")
	}
}

func TestRegistry_StartAll_StreamFanIn(t *testing.T) {
	reg := NewRegistry()
	reg.Register(newMockAdapter("A"))
	reg.Register(newMockAdapter("B"))

	if err := reg.StartAll(); err != nil {
		t.Fatalf("StartAll failed: %v", err)
	}

	// Collect telemetry from the unified stream
	received := make(map[string]bool)
	timeout := time.After(2 * time.Second)

	for {
		select {
		case tel, ok := <-reg.Stream():
			if !ok {
				goto done
			}
			received[tel.Operator] = true
			// Once we've seen both adapters, we can stop
			if len(received) >= 2 {
				goto done
			}
		case <-timeout:
			goto done
		}
	}

done:
	reg.StopAll()

	if !received["A"] {
		t.Error("expected telemetry from adapter A")
	}
	if !received["B"] {
		t.Error("expected telemetry from adapter B")
	}
}

func TestRegistry_HealthAll(t *testing.T) {
	reg := NewRegistry()
	a := newMockAdapter("Adapter-X")
	b := newMockAdapter("Adapter-Y")
	reg.Register(a)
	reg.Register(b)

	if err := reg.StartAll(); err != nil {
		t.Fatalf("StartAll failed: %v", err)
	}

	health := reg.HealthAll()

	if health["Adapter-X"] != HealthConnected {
		t.Errorf("expected Adapter-X CONNECTED, got %q", health["Adapter-X"])
	}
	if health["Adapter-Y"] != HealthConnected {
		t.Errorf("expected Adapter-Y CONNECTED, got %q", health["Adapter-Y"])
	}

	reg.StopAll()

	// After stopping, health should become STOPPED
	// (give a moment for goroutines to finish)
	time.Sleep(100 * time.Millisecond)

	health = reg.HealthAll()
	if health["Adapter-X"] != HealthStopped {
		t.Errorf("expected Adapter-X STOPPED after StopAll, got %q", health["Adapter-X"])
	}
}

func TestRegistry_StopAll_Idempotent(t *testing.T) {
	reg := NewRegistry()
	reg.Register(newMockAdapter("Test"))

	if err := reg.StartAll(); err != nil {
		t.Fatalf("StartAll failed: %v", err)
	}

	// StopAll should be safe to call multiple times
	reg.StopAll()
	reg.StopAll() // Should not panic
}

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()

	if cfg.PollInterval != 30*time.Second {
		t.Errorf("expected 30s poll interval, got %v", cfg.PollInterval)
	}
	if cfg.Timeout != 10*time.Second {
		t.Errorf("expected 10s timeout, got %v", cfg.Timeout)
	}
	if cfg.MaxRetries != 3 {
		t.Errorf("expected 3 retries, got %d", cfg.MaxRetries)
	}
	if cfg.RetryBackoff != 2*time.Second {
		t.Errorf("expected 2s backoff, got %v", cfg.RetryBackoff)
	}
}
