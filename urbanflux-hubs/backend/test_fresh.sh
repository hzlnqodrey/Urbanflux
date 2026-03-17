#!/bin/bash
pkill -9 urbanflux-server 2>/dev/null
sleep 2
/tmp/urbanflux-server > /tmp/test_run.txt 2>&1 &
sleep 5
echo "=== Adapters in output ==="
grep "Registered adapter" /tmp/test_run.txt
echo ""
echo "=== Started adapters ==="
grep "Started adapter" /tmp/test_run.txt
echo ""
echo "=== Health check ==="
curl -s http://localhost:8080/health 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); print(json.dumps(dict((k,d[k]) for k in sorted(d.keys()) if 'KualaLumpur' in k), indent=2))"
pkill -9 urbanflux-server 2>/dev/null
