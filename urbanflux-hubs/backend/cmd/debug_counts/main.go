package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/ktmb"
	"github.com/urbanflux/hubs-backend/internal/adapters/kualalumpur"
	"github.com/urbanflux/hubs-backend/internal/models"
)

func main() {
	registry := adapters.NewRegistry()
	myCfg := adapters.DefaultConfig()
	myCfg.Timeout = 5 * time.Second

	registry.Register(kualalumpur.NewKualaLumpurBusAdapter(myCfg))
	registry.Register(ktmb.NewKTMBAdapter(myCfg))

	if err := registry.StartAll(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Counting telemetry for 15 seconds...")
	counts := make(map[string]int)
	stream := registry.Stream()
	
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

loop:
	for {
		select {
		case tel := <-stream:
			counts[tel.Operator]++
			if tel.Mode == models.ModeRail {
				fmt.Printf("RAIL FOUND: ID=%s Hub=%s Lat=%f Lon=%f\n", tel.ID, tel.Hub, tel.Latitude, tel.Longitude)
			}
		case <-ctx.Done():
			break loop
		}
	}

	fmt.Println("\nSummary:")
	for op, count := range counts {
		fmt.Printf("- %s: %d updates\n", op, count)
	}
	
	registry.StopAll()
}
