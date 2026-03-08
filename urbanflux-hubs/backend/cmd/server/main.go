package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/jakarta"
	"github.com/urbanflux/hubs-backend/internal/adapters/kualalumpur"
	"github.com/urbanflux/hubs-backend/internal/websocket"
)

func main() {
	// Initialize WebSocket Hub
	hub := websocket.NewHub()
	go hub.Run()

	// Initialize the Adapter Registry
	registry := adapters.NewRegistry()

	// Register adapters — add new city adapters here
	jakartaCfg := adapters.DefaultConfig()
	jakartaCfg.PollInterval = 2 * 1e9 // 2 seconds for mock (time.Duration nanoseconds)
	registry.Register(jakarta.NewTransjakartaAdapter(jakartaCfg))

	// Kuala Lumpur — real-time GTFS-RT from api.data.gov.my (no API key needed)
	klCfg := adapters.DefaultConfig()
	registry.Register(kualalumpur.NewKualaLumpurBusAdapter(klCfg))
	registry.Register(kualalumpur.NewKualaLumpurRailAdapter(klCfg))

	// Start all registered adapters
	if err := registry.StartAll(); err != nil {
		log.Fatalf("Failed to start adapter registry: %v", err)
	}

	// Route telemetry from the unified stream → WebSocket broadcast
	go func() {
		for update := range registry.Stream() {
			bytes, err := json.Marshal(update)
			if err != nil {
				log.Println("[Main] Error marshaling telemetry:", err)
				continue
			}
			hub.Broadcast(bytes)
		}
	}()

	// Log adapter errors from the unified error stream
	go func() {
		for adapterErr := range registry.ErrorStream() {
			log.Printf("[AdapterError] %s", adapterErr.Error())
		}
	}()

	// HTTP handler for WebSocket connections
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})

	// Health check endpoint — returns adapter health status
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		health := registry.HealthAll()
		bytes, err := json.Marshal(health)
		if err != nil {
			http.Error(w, "failed to serialize health", http.StatusInternalServerError)
			return
		}
		w.Write(bytes)
	})

	// Graceful shutdown on OS signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		sig := <-sigChan
		log.Printf("[Main] Received signal: %s — shutting down...", sig)
		registry.StopAll()
		os.Exit(0)
	}()

	log.Printf("[Main] Urbanflux Backend listening on :8080 (adapters: %d)", registry.AdapterCount())
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("[Main] ListenAndServe: ", err)
	}
}
