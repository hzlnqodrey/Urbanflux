package adapters

import "github.com/urbanflux/hubs-backend/internal/models"

// HubAdapter is the universal interface that all city-specific transit
// data ingesters must implement to ensure standardized data flows into Urbanflux.
type HubAdapter interface {
	// Start begins the data ingestion process (polling, websocket, etc.)
	Start(stream chan<- models.UrbanfluxTelemetry) error

	// Stop gracefully halts the adapter
	Stop() error

	// Name returns the identifier for this adapter (e.g., "Jakarta-Transjakarta")
	Name() string
}
