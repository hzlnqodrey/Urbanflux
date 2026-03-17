#!/bin/bash
/tmp/urbanflux-server-v2 > /tmp/clean_run.txt 2>&1 &
sleep 6
echo "=== Adapters started ==="
grep "Started adapter" /tmp/clean_run.txt | wc -l
echo ""
echo "=== KL Health ==="
curl -s http://localhost:8080/health 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); kl={k:v for k,v in d.items() if 'KualaLumpur' in k}; print(json.dumps(kl, indent=2))"
echo ""
echo "=== Testing WebSocket for vehicles ==="
echo '{"hub":"kuala-lumpur"}' | timeout 3 websocat ws://localhost:8080/ws --one-message 2>/dev/null || echo "WebSocket test timed out (expected)"
kill -9 $(lsof -t -i:8080) 2>/dev/null
