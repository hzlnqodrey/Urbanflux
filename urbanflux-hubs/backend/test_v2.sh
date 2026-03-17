#!/bin/bash
pkill -9 urbanflux-server 2>/dev/null
sleep 1
/tmp/urbanflux-server-v2 > /tmp/v2_output.txt 2>&1 &
sleep 5
echo "=== Started adapters ==="
grep "Started adapter" /tmp/v2_output.txt
echo ""
echo "=== Kuala Lumpur health ==="
curl -s http://localhost:8080/health 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); kl={k:v for k,v in d.items() if 'KualaLumpur' in k}; print(json.dumps(kl, indent=2))"
pkill -9 urbanflux-server 2>/dev/null
