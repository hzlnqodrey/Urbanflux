package gtfsrt

import (
	"testing"

	"github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs"
	"github.com/urbanflux/hubs-backend/internal/models"
	"google.golang.org/protobuf/proto"
)

// buildFeed constructs a GTFS-RT FeedMessage protobuf for testing.
func buildFeed(entities []*gtfs.FeedEntity) []byte {
	incrementality := gtfs.FeedHeader_FULL_DATASET
	version := "2.0"
	ts := uint64(1709900000)
	feed := &gtfs.FeedMessage{
		Header: &gtfs.FeedHeader{
			GtfsRealtimeVersion: &version,
			Incrementality:      &incrementality,
			Timestamp:           &ts,
		},
		Entity: entities,
	}
	data, _ := proto.Marshal(feed)
	return data
}

// vehicleEntity builds a VehiclePosition FeedEntity for testing.
func vehicleEntity(id string, lat, lon, speed, bearing float32, vehicleID, routeID string) *gtfs.FeedEntity {
	return &gtfs.FeedEntity{
		Id: &id,
		Vehicle: &gtfs.VehiclePosition{
			Position: &gtfs.Position{
				Latitude:  &lat,
				Longitude: &lon,
				Speed:     &speed,
				Bearing:   &bearing,
			},
			Vehicle: &gtfs.VehicleDescriptor{
				Id: &vehicleID,
			},
			Trip: &gtfs.TripDescriptor{
				RouteId: &routeID,
			},
		},
	}
}

func TestParse_ValidFeed(t *testing.T) {
	data := buildFeed([]*gtfs.FeedEntity{
		vehicleEntity("e1", 3.1390, 101.6869, 12.5, 180, "BUS-001", "ROUTE-A"),
		vehicleEntity("e2", 3.1500, 101.7100, 8.33, 90, "BUS-002", "ROUTE-B"),
	})

	result := Parse(data, "kuala-lumpur", models.ModeBus, "Prasarana", "Test-Adapter")

	if len(result.Telemetry) != 2 {
		t.Fatalf("expected 2 telemetry events, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 0 {
		t.Errorf("expected 0 errors, got %d", len(result.Errors))
	}

	tel := result.Telemetry[0]
	if tel.Hub != "kuala-lumpur" {
		t.Errorf("expected hub 'kuala-lumpur', got %q", tel.Hub)
	}
	if tel.Mode != models.ModeBus {
		t.Errorf("expected mode BUS, got %q", tel.Mode)
	}
	if tel.Operator != "Prasarana" {
		t.Errorf("expected operator 'Prasarana', got %q", tel.Operator)
	}
	if tel.ID != "BUS-001" {
		t.Errorf("expected ID 'BUS-001', got %q", tel.ID)
	}
	if tel.RouteID != "ROUTE-A" {
		t.Errorf("expected RouteID 'ROUTE-A', got %q", tel.RouteID)
	}
}

func TestParse_SpeedConversion(t *testing.T) {
	// 12.5 m/s * 3.6 = 45.0 km/h
	data := buildFeed([]*gtfs.FeedEntity{
		vehicleEntity("e1", 3.1390, 101.6869, 12.5, 0, "V1", "R1"),
	})

	result := Parse(data, "test", models.ModeBus, "Op", "Test")

	if len(result.Telemetry) != 1 {
		t.Fatalf("expected 1 telemetry event, got %d", len(result.Telemetry))
	}

	expected := 45.0
	got := result.Telemetry[0].Speed
	if got < expected-0.1 || got > expected+0.1 {
		t.Errorf("expected speed ~%.1f km/h, got %.1f", expected, got)
	}
}

func TestParse_MixedValidInvalid(t *testing.T) {
	var zeroLat, zeroLon float32 = 0, 0
	data := buildFeed([]*gtfs.FeedEntity{
		vehicleEntity("valid1", 3.1390, 101.6869, 10, 0, "V1", "R1"),
		// Invalid: null island
		{
			Id: strPtr("invalid1"),
			Vehicle: &gtfs.VehiclePosition{
				Position: &gtfs.Position{
					Latitude:  &zeroLat,
					Longitude: &zeroLon,
				},
			},
		},
		vehicleEntity("valid2", 3.1500, 101.7100, 5, 90, "V2", "R2"),
	})

	result := Parse(data, "kuala-lumpur", models.ModeBus, "Prasarana", "Test")

	if len(result.Telemetry) != 2 {
		t.Errorf("expected 2 valid telemetry events, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 1 {
		t.Errorf("expected 1 error (null island), got %d", len(result.Errors))
	}
}

func TestParse_MissingPosition(t *testing.T) {
	id := "no-pos"
	data := buildFeed([]*gtfs.FeedEntity{
		{
			Id:      &id,
			Vehicle: &gtfs.VehiclePosition{
				// No Position field
			},
		},
	})

	result := Parse(data, "test", models.ModeBus, "Op", "Test")

	if len(result.Telemetry) != 0 {
		t.Errorf("expected 0 telemetry, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 1 {
		t.Errorf("expected 1 error for missing position, got %d", len(result.Errors))
	}
}

func TestParse_EmptyFeed(t *testing.T) {
	data := buildFeed([]*gtfs.FeedEntity{})

	result := Parse(data, "test", models.ModeBus, "Op", "Test")

	if len(result.Telemetry) != 0 {
		t.Errorf("expected 0 telemetry, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 0 {
		t.Errorf("expected 0 errors, got %d", len(result.Errors))
	}
}

func TestParse_CorruptBytes(t *testing.T) {
	result := Parse([]byte("this is not protobuf"), "test", models.ModeBus, "Op", "Test")

	if len(result.Telemetry) != 0 {
		t.Errorf("expected 0 telemetry, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 1 {
		t.Errorf("expected 1 parse error, got %d", len(result.Errors))
	}
}

func TestParse_NonVehicleEntities(t *testing.T) {
	// Entity without vehicle (e.g. alert or trip update) should be silently skipped
	id := "alert-entity"
	data := buildFeed([]*gtfs.FeedEntity{
		{
			Id: &id,
			// No Vehicle field — this is not a VehiclePosition
		},
	})

	result := Parse(data, "test", models.ModeBus, "Op", "Test")

	if len(result.Telemetry) != 0 {
		t.Errorf("expected 0 telemetry, got %d", len(result.Telemetry))
	}
	if len(result.Errors) != 0 {
		t.Errorf("expected 0 errors (silent skip), got %d", len(result.Errors))
	}
}

func strPtr(s string) *string {
	return &s
}
