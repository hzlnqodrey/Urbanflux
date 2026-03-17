#!/bin/bash
/tmp/urbanflux-server > /tmp/server_output.txt 2>&1 &
sleep 5
echo "=== Server output (first 50 lines) ==="
head -50 /tmp/server_output.txt
echo ""
echo "=== Health check ==="
curl -s http://localhost:8080/health 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); kl_keys = [k for k in d.keys() if 'KualaLumpur' in k]; print('Kuala Lumpur adapters:', kl_keys)"
pkill -f urbanflux-server
