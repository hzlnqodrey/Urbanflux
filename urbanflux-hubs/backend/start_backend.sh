#!/bin/bash
echo "Starting Urbanflux Backend with Kuala Lumpur Mock Data..."
echo ""
echo "15 Adapters starting:"
echo "- Jakarta (mock)"
echo "- Kuala Lumpur RapidBus (live GTFS-RT)"
echo "- Kuala Lumpur Mock (10 simulated vehicles: 3 LRT + 2 Monorail + 5 Buses)"
echo "- Penang, Kuantan, and 10 MyBAS city hubs"
echo ""
/tmp/urbanflux-server-v2
