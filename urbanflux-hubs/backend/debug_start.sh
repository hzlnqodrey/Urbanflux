#!/bin/bash
pkill -9 urbanflux-server 2>/dev/null
sleep 1
/tmp/urbanflux-server > /tmp/debug.txt 2>&1 &
sleep 6
echo "=== All registry messages ==="
grep "Registry" /tmp/debug.txt
echo ""
echo "=== Any errors? ==="
grep -i "error\|fail\|panic" /tmp/debug.txt | head -10
pkill -9 urbanflux-server 2>/dev/null
