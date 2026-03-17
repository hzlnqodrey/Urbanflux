#!/bin/bash
# Test Kuala Lumpur GTFS-RT feed integration

echo "=== Testing Kuala Lumpur GTFS-RT Integration ==="
echo ""

# Test 1: Check API endpoint directly
echo "1. Testing api.data.gov.my GTFS-RT endpoint..."
VEHICLES=$(curl -sL "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl" | wc -c)
if [ "$VEHICLES" -gt 100 ]; then
  echo "✓ API returns data ($VEHICLES bytes)"
else
  echo "✗ API returns insufficient data"
  exit 1
fi
echo ""

# Test 2: Build backend
echo "2. Building backend..."
cd "$(dirname "$0")"
if go build -o /tmp/test-server ./cmd/server 2>&1 | head -5; then
  echo "✓ Backend builds successfully"
else
  echo "✗ Backend build failed"
  exit 1
fi
echo ""

# Test 3: Start server and check health
echo "3. Starting server and checking health..."
/tmp/test-server > /tmp/test-server.log 2>&1 &
SERVER_PID=$!
sleep 5

HEALTH=$(curl -s http://localhost:8080/health | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('KualaLumpur-RapidBus', 'UNKNOWN'))" 2>/dev/null)
if [ "$HEALTH" = "CONNECTED" ]; then
  echo "✓ KualaLumpur-RapidBus adapter: CONNECTED"
else
  echo "✗ KualaLumpur-RapidBus adapter: $HEALTH"
fi
echo ""

# Test 4: Check for telemetry in logs
echo "4. Checking for vehicle telemetry..."
sleep 3
if grep -q "KualaLumpur" /tmp/test-server.log; then
  echo "✓ Kuala Lumpur adapter is running"
  grep "KualaLumpur" /tmp/test-server.log | head -3
else
  echo "✗ No Kuala Lumpur activity found"
fi
echo ""

# Cleanup
kill $SERVER_PID 2>/dev/null
rm -f /tmp/test-server

echo "=== Test Complete ==="
