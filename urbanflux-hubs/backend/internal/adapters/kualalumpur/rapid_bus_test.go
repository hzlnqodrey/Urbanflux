package kualalumpur

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs"
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
	"google.golang.org/protobuf/proto"
)

// buildTestFeed creates a GTFS-RT protobuf feed with the given number of vehicles.
func buildTestFeed(count int) []byte {
	incrementality := gtfs.FeedHeader_FULL_DATASET
	version := "2.0"
	ts := uint64(1709900000)
	feed := &gtfs.FeedMessage{
		Header: &gtfs.FeedHeader{
			GtfsRealtimeVersion: &version,
			Incrementality:      &incrementality,
			Timestamp:           &ts,
		},
	}

	for i := 0; i < count; i++ {
		id := fmt.Sprintf("entity-%d", i)
		vid := fmt.Sprintf("BUS-%03d", i)
		rid := fmt.Sprintf("ROUTE-%d", i%3)
		lat := float32(3.1390) + float32(i)*0.001
		lon := float32(101.6869) + float32(i)*0.001
		speed := float32(10.0)
		bearing := float32(90.0)

		feed.Entity = append(feed.Entity, &gtfs.FeedEntity{
			Id: &id,
			Vehicle: &gtfs.VehiclePosition{
				Position: &gtfs.Position{
					Latitude:  &lat,
					Longitude: &lon,
					Speed:     &speed,
					Bearing:   &bearing,
				},
				Vehicle: &gtfs.VehicleDescriptor{Id: &vid},
				Trip:    &gtfs.TripDescriptor{RouteId: &rid},
			},
		})
	}

	data, _ := proto.Marshal(feed)
	return data
}

func TestKualaLumpurBusAdapter_Lifecycle(t *testing.T) {
	// Create a mock HTTP server returning valid protobuf
	feedData := buildTestFeed(3)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-protobuf")
		w.Write(feedData)
	}))
	defer server.Close()

	cfg := adapters.AdapterConfig{
		PollInterval: 100 * time.Millisecond,
		Timeout:      5 * time.Second,
		MaxRetries:   3,
		RetryBackoff: 100 * time.Millisecond,
		BaseURL:      server.URL,
	}

	adapter := NewKualaLumpurBusAdapter(cfg)

	// Verify name
	if adapter.Name() != "KualaLumpur-RapidBus" {
		t.Errorf("expected name 'KualaLumpur-RapidBus', got %q", adapter.Name())
	}

	// Verify initial health
	if adapter.Health() != adapters.HealthStopped {
		t.Errorf("expected initial health STOPPED, got %q", adapter.Health())
	}

	// Start the adapter
	stream := make(chan models.UrbanfluxTelemetry, 64)
	if err := adapter.Start(stream); err != nil {
		t.Fatalf("Start failed: %v", err)
	}

	// Wait for telemetry
	timeout := time.After(3 * time.Second)
	var received []models.UrbanfluxTelemetry

	for {
		select {
		case tel := <-stream:
			received = append(received, tel)
			if len(received) >= 3 {
				goto done
			}
		case <-timeout:
			goto done
		}
	}

done:
	// Verify we got telemetry
	if len(received) < 3 {
		t.Errorf("expected at least 3 telemetry events, got %d", len(received))
	}

	// Verify telemetry fields
	if len(received) > 0 {
		tel := received[0]
		if tel.Hub != "kuala-lumpur" {
			t.Errorf("expected hub 'kuala-lumpur', got %q", tel.Hub)
		}
		if tel.Mode != models.ModeBus {
			t.Errorf("expected mode BUS, got %q", tel.Mode)
		}
		if tel.Operator != "Prasarana" {
			t.Errorf("expected operator 'Prasarana', got %q", tel.Operator)
		}
	}

	// Verify health is CONNECTED
	if adapter.Health() != adapters.HealthConnected {
		t.Errorf("expected health CONNECTED, got %q", adapter.Health())
	}

	// Stop
	if err := adapter.Stop(); err != nil {
		t.Errorf("Stop failed: %v", err)
	}

	if adapter.Health() != adapters.HealthStopped {
		t.Errorf("expected health STOPPED after stop, got %q", adapter.Health())
	}
}

func TestKualaLumpurBusAdapter_ServerError(t *testing.T) {
	// Return 503 for all requests
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusServiceUnavailable)
	}))
	defer server.Close()

	cfg := adapters.AdapterConfig{
		PollInterval: 100 * time.Millisecond,
		Timeout:      2 * time.Second,
		MaxRetries:   2,
		RetryBackoff: 50 * time.Millisecond,
		BaseURL:      server.URL,
	}

	adapter := NewKualaLumpurBusAdapter(cfg)
	stream := make(chan models.UrbanfluxTelemetry, 16)

	if err := adapter.Start(stream); err != nil {
		t.Fatalf("Start failed: %v", err)
	}

	// Wait for errors to accumulate
	time.Sleep(500 * time.Millisecond)

	// After MaxRetries failures, health should be DISCONNECTED
	health := adapter.Health()
	if health != adapters.HealthDisconnected && health != adapters.HealthDegraded {
		t.Errorf("expected health DISCONNECTED or DEGRADED after errors, got %q", health)
	}

	// Check errors were emitted
	var errors []adapters.AdapterError
	for {
		select {
		case e := <-adapter.Errors():
			errors = append(errors, e)
		default:
			goto checkErrors
		}
	}
checkErrors:
	if len(errors) == 0 {
		t.Error("expected adapter errors to be emitted")
	}

	adapter.Stop()
}

func TestKualaLumpurBusAdapter_EmptyBaseURL(t *testing.T) {
	cfg := adapters.AdapterConfig{
		PollInterval: 100 * time.Millisecond,
		Timeout:      2 * time.Second,
		MaxRetries:   3,
		RetryBackoff: 100 * time.Millisecond,
		// No BaseURL
	}

	adapter := NewKualaLumpurBusAdapter(cfg)

	// Should have the default endpoint
	if adapter.config.BaseURL != klBusEndpoint {
		t.Errorf("expected default BaseURL, got %q", adapter.config.BaseURL)
	}
}

func TestKualaLumpurRailAdapter_Name(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewKualaLumpurRailAdapter(cfg)

	if adapter.Name() != "KualaLumpur-RapidRail" {
		t.Errorf("expected name 'KualaLumpur-RapidRail', got %q", adapter.Name())
	}
}

func TestKualaLumpurRailAdapter_DefaultEndpoint(t *testing.T) {
	cfg := adapters.DefaultConfig()
	adapter := NewKualaLumpurRailAdapter(cfg)

	if adapter.config.BaseURL != klRailEndpoint {
		t.Errorf("expected default rail endpoint, got %q", adapter.config.BaseURL)
	}
}
