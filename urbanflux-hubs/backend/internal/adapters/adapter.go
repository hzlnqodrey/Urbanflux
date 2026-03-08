package adapters

import "github.com/urbanflux/hubs-backend/internal/models"

// HubAdapter is the universal interface that all city-specific transit
// data ingesters must implement to ensure standardized data flows into Urbanflux.
//
// Each adapter connects to a specific upstream API (GTFS-RT, REST, WebSocket, etc.),
// normalizes the data into UrbanfluxTelemetry, and streams it through a channel.
type HubAdapter interface {
	// Start begins the data ingestion process (polling, websocket, etc.).
	// Telemetry events are sent to the provided stream channel.
	// Returns an error if the adapter fails to initialize.
	Start(stream chan<- models.UrbanfluxTelemetry) error

	// Stop gracefully halts the adapter, closing internal resources.
	// Implementations should respect a reasonable shutdown timeout.
	Stop() error

	// Name returns the unique identifier for this adapter (e.g., "Jakarta-Transjakarta").
	Name() string

	// Health returns the current operational status of the adapter.
	// This is a point-in-time snapshot, not a stream.
	Health() AdapterHealth

	// Errors returns a read-only channel of structured errors encountered
	// during data ingestion. Consumers should drain this channel to avoid
	// blocking the adapter.
	Errors() <-chan AdapterError

	// Config returns the adapter's current configuration.
	Config() AdapterConfig
}
