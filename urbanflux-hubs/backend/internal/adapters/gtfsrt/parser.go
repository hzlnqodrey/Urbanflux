package gtfsrt

import (
	"fmt"
	"time"

	"github.com/MobilityData/gtfs-realtime-bindings/golang/gtfs"
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/models"
	"google.golang.org/protobuf/proto"
)

// OccupancyMap converts GTFS-RT OccupancyStatus enum values to Urbanflux occupancy strings.
var OccupancyMap = map[gtfs.VehiclePosition_OccupancyStatus]string{
	gtfs.VehiclePosition_EMPTY:                      models.OccupancyEmpty,
	gtfs.VehiclePosition_MANY_SEATS_AVAILABLE:       models.OccupancyLow,
	gtfs.VehiclePosition_FEW_SEATS_AVAILABLE:        models.OccupancyMedium,
	gtfs.VehiclePosition_STANDING_ROOM_ONLY:         models.OccupancyHigh,
	gtfs.VehiclePosition_CRUSHED_STANDING_ROOM_ONLY: models.OccupancyFull,
	gtfs.VehiclePosition_FULL:                       models.OccupancyFull,
	gtfs.VehiclePosition_NOT_ACCEPTING_PASSENGERS:   models.OccupancyFull,
	gtfs.VehiclePosition_NO_DATA_AVAILABLE:          models.OccupancyUnknown,
	gtfs.VehiclePosition_NOT_BOARDABLE:              models.OccupancyFull,
}

// ParseResult holds the output of a GTFS-RT feed parse operation.
type ParseResult struct {
	Telemetry []models.UrbanfluxTelemetry
	Errors    []adapters.AdapterError
}

// Parse decodes a GTFS-RT protobuf feed and extracts VehiclePosition entities
// into UrbanfluxTelemetry structs. It accepts hub, mode, and operator strings
// to stamp on each telemetry event.
//
// Invalid entities (missing position, zero lat/lon) are skipped and reported
// as AdapterErrors. The function returns partial results — valid entities are
// always included even when some entities fail.
func Parse(data []byte, hub, mode, operator, adapterName string) ParseResult {
	result := ParseResult{}

	feed := &gtfs.FeedMessage{}
	if err := proto.Unmarshal(data, feed); err != nil {
		result.Errors = append(result.Errors, adapters.AdapterError{
			Severity:    adapters.SeverityError,
			Kind:        adapters.ErrParse,
			Message:     fmt.Sprintf("failed to unmarshal GTFS-RT protobuf: %v", err),
			AdapterName: adapterName,
			Timestamp:   time.Now().UTC(),
			Retryable:   true,
		})
		return result
	}

	for i, entity := range feed.GetEntity() {
		vp := entity.GetVehicle()
		if vp == nil {
			continue // Not a VehiclePosition entity, skip silently
		}

		pos := vp.GetPosition()
		if pos == nil {
			result.Errors = append(result.Errors, adapters.AdapterError{
				Severity:    adapters.SeverityWarning,
				Kind:        adapters.ErrValidation,
				Message:     fmt.Sprintf("entity[%d] (%s): missing position data", i, entity.GetId()),
				AdapterName: adapterName,
				Timestamp:   time.Now().UTC(),
				Retryable:   true,
			})
			continue
		}

		lat := float64(pos.GetLatitude())
		lon := float64(pos.GetLongitude())

		// Skip null-island positions
		if lat == 0 && lon == 0 {
			result.Errors = append(result.Errors, adapters.AdapterError{
				Severity:    adapters.SeverityWarning,
				Kind:        adapters.ErrValidation,
				Message:     fmt.Sprintf("entity[%d] (%s): lat/lon both 0 (null island)", i, entity.GetId()),
				AdapterName: adapterName,
				Timestamp:   time.Now().UTC(),
				Retryable:   true,
			})
			continue
		}

		// Extract vehicle ID
		vehicleID := ""
		if v := vp.GetVehicle(); v != nil {
			vehicleID = v.GetId()
			if vehicleID == "" {
				vehicleID = v.GetLabel()
			}
		}
		if vehicleID == "" {
			vehicleID = entity.GetId()
		}

		// Extract route ID from trip descriptor
		routeID := ""
		if trip := vp.GetTrip(); trip != nil {
			routeID = trip.GetRouteId()
			if routeID == "" {
				routeID = trip.GetTripId()
			}
		}
		// Fallback: some GTFS-RT feeds (e.g., BAS.MY) lack TripDescriptor entirely.
		// Use "UNKNOWN" so the entity passes validation and shows on the map.
		if routeID == "" {
			routeID = "UNKNOWN"
		}

		// Convert speed from m/s (GTFS-RT spec) to km/h
		speed := float64(pos.GetSpeed()) * 3.6

		// Get bearing (0-360)
		bearing := float64(pos.GetBearing())
		if bearing < 0 {
			bearing += 360
		}

		// Parse timestamp
		var lastUpdated time.Time
		if ts := vp.GetTimestamp(); ts > 0 {
			lastUpdated = time.Unix(int64(ts), 0).UTC()
		} else if feed.GetHeader() != nil && feed.GetHeader().GetTimestamp() > 0 {
			lastUpdated = time.Unix(int64(feed.GetHeader().GetTimestamp()), 0).UTC()
		} else {
			lastUpdated = time.Now().UTC()
		}

		// Map occupancy status
		occupancy := models.OccupancyUnknown
		if occ, ok := OccupancyMap[vp.GetOccupancyStatus()]; ok {
			occupancy = occ
		}

		// Determine vehicle status
		status := "ACTIVE"
		stopStatus := vp.GetCurrentStatus()
		switch stopStatus {
		case gtfs.VehiclePosition_STOPPED_AT:
			status = "STOPPED_AT"
		case gtfs.VehiclePosition_INCOMING_AT:
			status = "INCOMING"
		}

		tel := models.UrbanfluxTelemetry{
			ID:           vehicleID,
			RouteID:      routeID,
			Hub:          hub,
			Mode:         mode,
			Operator:     operator,
			Latitude:     lat,
			Longitude:    lon,
			Speed:        speed,
			Bearing:      bearing,
			Status:       status,
			NextStop:     vp.GetStopId(),
			Occupancy:    occupancy,
			DelaySeconds: 0,
			LastUpdated:  lastUpdated,
		}

		// Validate before including
		if err := tel.Validate(); err != nil {
			result.Errors = append(result.Errors, adapters.AdapterError{
				Severity:    adapters.SeverityWarning,
				Kind:        adapters.ErrValidation,
				Message:     fmt.Sprintf("entity[%d]: %v", i, err),
				AdapterName: adapterName,
				Timestamp:   time.Now().UTC(),
				Retryable:   true,
			})
			continue
		}

		result.Telemetry = append(result.Telemetry, tel)
	}

	return result
}
