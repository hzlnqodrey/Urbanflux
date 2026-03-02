package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/urbanflux/hubs-backend/internal/adapters/jakarta"
	"github.com/urbanflux/hubs-backend/internal/models"
	"github.com/urbanflux/hubs-backend/internal/websocket"
)

func main() {
	// Initialize a simple WebSocket Hub
	hub := websocket.NewHub()
	go hub.Run()

	// Initialize the Hub Adapter for Jakarta
	adapter := jakarta.NewTransjakartaAdapter()
	telemetryStream := make(chan models.UrbanfluxTelemetry)
	adapter.Start(telemetryStream)

	// Route mapped data from the adapter to the WebSocket broadcast
	go func() {
		for update := range telemetryStream {
			bytes, err := json.Marshal(update)
			if err != nil {
				log.Println("Error marshaling telemetry:", err)
				continue
			}
			hub.Broadcast(bytes) // Will need a helper method on Hub or direct channel access
		}
	}()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})

	log.Println("Urbanflux Backend listening on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
