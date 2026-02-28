package main

import (
	"log"
	"net/http"

	"github.com/urbanflux/hubs-backend/internal/websocket"
)

func main() {
	// Initialize a simple WebSocket Hub
	hub := websocket.NewHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})

	log.Println("Urbanflux Backend listening on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
