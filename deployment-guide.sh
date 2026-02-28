#!/bin/bash
# Urbanflux Cloudflare Deployment Checklist & Scripts

echo "=== System Provisioning ==="
echo "1. Install Docker & Docker Compose on Ubuntu VM"
echo "2. Clone repository to /opt/urbanflux"
echo "3. Run 'docker compose up -d'"
echo ""

echo "=== Cloudflare DNS & Proxy ==="
echo "1. Add A Record pointing 'hubs.urbanflux.example' to the VM Public IP."
echo "2. Ensure the 'Proxy status' cloud icon is ORANGE (Proxied)."
echo "3. Under SSL/TLS, set encryption mode to 'Full (strict)'."
echo ""

echo "=== Cloudflare WAF (Web Application Firewall) ==="
echo "1. Go to Security -> WAF -> Managed rules."
echo "2. Enable 'Cloudflare Managed Ruleset' to protect against SQLi and XSS."
echo "3. Create a custom rule to block traffic originating outside of target operator countries if necessary."
echo ""

echo "=== Cloudflare Tunnels (Zero Trust - Optional but Recommended) ==="
echo "If you wish to hide the VM's public IP completely:"
echo "1. Remove the public A record."
echo "2. Install cloudflared on the VM."
echo "3. Authenticate: 'cloudflared tunnel login'"
echo "4. Create tunnel: 'cloudflared tunnel create urbanflux-prod'"
echo "5. Route DNS: 'cloudflared tunnel route dns urbanflux-prod hubs.urbanflux.example'"
echo "6. Map config.yml ingress to 'http://localhost:3000' and 'http://localhost:8080'"
echo "7. Run 'cloudflared tunnel run urbanflux-prod'"
