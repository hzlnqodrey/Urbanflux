package models

import (
	"testing"
	"time"
)

func validTelemetry() UrbanfluxTelemetry {
	return UrbanfluxTelemetry{
		ID:           "JKT-TB-0104",
		RouteID:      "CORRIDOR-1",
		Hub:          "jakarta",
		Mode:         ModeBus,
		Operator:     "Transjakarta",
		Latitude:     -6.1754,
		Longitude:    106.8271,
		Speed:        45.0,
		Bearing:      180.0,
		Status:       "ACTIVE",
		NextStop:     "Monas",
		Occupancy:    OccupancyUnknown,
		DelaySeconds: 0,
		LastUpdated:  time.Now().UTC(),
	}
}

func TestValidate_Valid(t *testing.T) {
	tel := validTelemetry()
	if err := tel.Validate(); err != nil {
		t.Errorf("expected valid telemetry, got error: %v", err)
	}
}

func TestValidate_MissingID(t *testing.T) {
	tel := validTelemetry()
	tel.ID = ""
	if err := tel.Validate(); err == nil {
		t.Error("expected error for missing ID")
	}
}

func TestValidate_MissingRouteID(t *testing.T) {
	tel := validTelemetry()
	tel.RouteID = ""
	if err := tel.Validate(); err == nil {
		t.Error("expected error for missing RouteID")
	}
}

func TestValidate_MissingHub(t *testing.T) {
	tel := validTelemetry()
	tel.Hub = ""
	if err := tel.Validate(); err == nil {
		t.Error("expected error for missing Hub")
	}
}

func TestValidate_MissingMode(t *testing.T) {
	tel := validTelemetry()
	tel.Mode = ""
	if err := tel.Validate(); err == nil {
		t.Error("expected error for missing Mode")
	}
}

func TestValidate_InvalidMode(t *testing.T) {
	tel := validTelemetry()
	tel.Mode = "HELICOPTER"
	if err := tel.Validate(); err == nil {
		t.Error("expected error for invalid Mode")
	}
}

func TestValidate_LatitudeOutOfRange(t *testing.T) {
	tel := validTelemetry()
	tel.Latitude = 91.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for latitude > 90")
	}

	tel.Latitude = -91.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for latitude < -90")
	}
}

func TestValidate_LongitudeOutOfRange(t *testing.T) {
	tel := validTelemetry()
	tel.Longitude = 181.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for longitude > 180")
	}

	tel.Longitude = -181.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for longitude < -180")
	}
}

func TestValidate_ZeroLatLon(t *testing.T) {
	tel := validTelemetry()
	tel.Latitude = 0
	tel.Longitude = 0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for (0,0) coordinates")
	}
}

func TestValidate_InvalidOccupancy(t *testing.T) {
	tel := validTelemetry()
	tel.Occupancy = "PACKED"
	if err := tel.Validate(); err == nil {
		t.Error("expected error for invalid Occupancy")
	}
}

func TestValidate_EmptyOccupancy(t *testing.T) {
	// Empty occupancy should be allowed (it's optional)
	tel := validTelemetry()
	tel.Occupancy = ""
	if err := tel.Validate(); err != nil {
		t.Errorf("expected no error for empty occupancy, got: %v", err)
	}
}

func TestValidate_InvalidBearing(t *testing.T) {
	tel := validTelemetry()
	tel.Bearing = 361.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for bearing > 360")
	}

	tel.Bearing = -1.0
	if err := tel.Validate(); err == nil {
		t.Error("expected error for bearing < 0")
	}
}

func TestValidate_AllValidModes(t *testing.T) {
	modes := []string{ModeBus, ModeRail, ModeMetro, ModeFerry, ModeMonorail, ModeTram}
	for _, mode := range modes {
		tel := validTelemetry()
		tel.Mode = mode
		if err := tel.Validate(); err != nil {
			t.Errorf("expected mode %q to be valid, got: %v", mode, err)
		}
	}
}

func TestValidate_AllValidOccupancies(t *testing.T) {
	occupancies := []string{OccupancyEmpty, OccupancyLow, OccupancyMedium, OccupancyHigh, OccupancyFull, OccupancyUnknown}
	for _, occ := range occupancies {
		tel := validTelemetry()
		tel.Occupancy = occ
		if err := tel.Validate(); err != nil {
			t.Errorf("expected occupancy %q to be valid, got: %v", occ, err)
		}
	}
}
