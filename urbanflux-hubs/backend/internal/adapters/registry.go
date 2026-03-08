package adapters

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/urbanflux/hubs-backend/internal/models"
)

// AdapterRegistry manages the lifecycle of multiple HubAdapters,
// aggregating their telemetry and error streams into unified channels.
type AdapterRegistry struct {
	mu       sync.RWMutex
	adapters []HubAdapter

	// unified output channels
	stream    chan models.UrbanfluxTelemetry
	errStream chan AdapterError

	// per-adapter internal streams (used for fan-in)
	adapterStreams []chan models.UrbanfluxTelemetry

	// shutdown coordination
	stopOnce sync.Once
	done     chan struct{}
}

// NewRegistry creates a new AdapterRegistry with buffered unified channels.
func NewRegistry() *AdapterRegistry {
	return &AdapterRegistry{
		adapters:  make([]HubAdapter, 0),
		stream:    make(chan models.UrbanfluxTelemetry, 256),
		errStream: make(chan AdapterError, 128),
		done:      make(chan struct{}),
	}
}

// Register adds a HubAdapter to the registry. Must be called before StartAll.
func (r *AdapterRegistry) Register(adapter HubAdapter) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.adapters = append(r.adapters, adapter)
	log.Printf("[Registry] Registered adapter: %s", adapter.Name())
}

// StartAll starts all registered adapters concurrently. Each adapter gets its
// own telemetry channel, and a fan-in goroutine forwards events to the unified
// Stream() channel. Errors from each adapter are forwarded to ErrorStream().
func (r *AdapterRegistry) StartAll() error {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if len(r.adapters) == 0 {
		return fmt.Errorf("registry: no adapters registered")
	}

	var wg sync.WaitGroup

	for _, adapter := range r.adapters {
		// Create a per-adapter telemetry channel
		adapterStream := make(chan models.UrbanfluxTelemetry, 64)
		r.adapterStreams = append(r.adapterStreams, adapterStream)

		// Start the adapter
		if err := adapter.Start(adapterStream); err != nil {
			// Log the error but continue starting other adapters
			log.Printf("[Registry] Failed to start adapter %s: %v", adapter.Name(), err)
			r.errStream <- AdapterError{
				Severity:    SeverityError,
				Kind:        ErrUnknown,
				Message:     fmt.Sprintf("failed to start: %v", err),
				AdapterName: adapter.Name(),
				Timestamp:   time.Now().UTC(),
				Retryable:   false,
			}
			continue
		}

		log.Printf("[Registry] Started adapter: %s", adapter.Name())

		// Fan-in: forward per-adapter telemetry → unified stream
		wg.Add(1)
		go func(a HubAdapter, s chan models.UrbanfluxTelemetry) {
			defer wg.Done()
			for {
				select {
				case <-r.done:
					return
				case t, ok := <-s:
					if !ok {
						return
					}
					select {
					case r.stream <- t:
					case <-r.done:
						return
					}
				}
			}
		}(adapter, adapterStream)

		// Fan-in: forward per-adapter errors → unified error stream
		wg.Add(1)
		go func(a HubAdapter) {
			defer wg.Done()
			errCh := a.Errors()
			for {
				select {
				case <-r.done:
					return
				case e, ok := <-errCh:
					if !ok {
						return
					}
					select {
					case r.errStream <- e:
					case <-r.done:
						return
					}
				}
			}
		}(adapter)
	}

	// Background goroutine to close unified channels after all fan-ins complete
	go func() {
		wg.Wait()
		close(r.stream)
		close(r.errStream)
	}()

	return nil
}

// StopAll gracefully stops all registered adapters with a 10-second timeout.
func (r *AdapterRegistry) StopAll() {
	r.stopOnce.Do(func() {
		log.Println("[Registry] Stopping all adapters...")

		// Signal all fan-in goroutines to exit
		close(r.done)

		r.mu.RLock()
		defer r.mu.RUnlock()

		// Create a timeout context
		stopDone := make(chan struct{})

		go func() {
			var wg sync.WaitGroup
			for _, adapter := range r.adapters {
				wg.Add(1)
				go func(a HubAdapter) {
					defer wg.Done()
					if err := a.Stop(); err != nil {
						log.Printf("[Registry] Error stopping adapter %s: %v", a.Name(), err)
					} else {
						log.Printf("[Registry] Stopped adapter: %s", a.Name())
					}
				}(adapter)
			}
			wg.Wait()
			close(stopDone)
		}()

		// Wait for graceful stop or timeout
		select {
		case <-stopDone:
			log.Println("[Registry] All adapters stopped gracefully")
		case <-time.After(10 * time.Second):
			log.Println("[Registry] WARNING: Timed out waiting for adapters to stop (10s)")
		}
	})
}

// Stream returns the unified read-only telemetry channel that aggregates
// events from all registered adapters.
func (r *AdapterRegistry) Stream() <-chan models.UrbanfluxTelemetry {
	return r.stream
}

// ErrorStream returns the unified read-only error channel that aggregates
// errors from all registered adapters.
func (r *AdapterRegistry) ErrorStream() <-chan AdapterError {
	return r.errStream
}

// HealthAll returns a map of adapter name → current health status.
func (r *AdapterRegistry) HealthAll() map[string]AdapterHealth {
	r.mu.RLock()
	defer r.mu.RUnlock()

	health := make(map[string]AdapterHealth, len(r.adapters))
	for _, adapter := range r.adapters {
		health[adapter.Name()] = adapter.Health()
	}
	return health
}

// AdapterCount returns the number of registered adapters.
func (r *AdapterRegistry) AdapterCount() int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.adapters)
}
