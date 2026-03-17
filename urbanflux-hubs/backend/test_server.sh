#!/bin/bash
timeout 12 go run cmd/server/main.go > /tmp/server_full.txt 2>&1 &
sleep 6
echo "=== First 60 lines of server output ==="
head -60 /tmp/server_full.txt
echo ""
echo "=== Health check for Kuala Lumpur ==="
curl -s http://localhost:8080/health 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); print('KualaLumpur-Mock:', d.get('KualaLumpur-Mock', 'NOT FOUND')); print('KualaLumpur-RapidBus:', d.get('KualaLumpur-RapidBus', 'NOT FOUND'))"
pkill -f "go run cmd/server"
