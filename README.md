# Urbanflux — Modern Web Projects (Landing + Hub Platform)

Two small production-ready side projects for the Urbanflux smart-city mobility platform:

- `urbanflux-landing/` — Minimal, premium hero landing page (Next.js + Tailwind + Three.js + GLSL OpenGL Shading Language) with 8s globe hero animation.
- `urbanflux-hubs/` — Hub platform for interactive hub maps for Jakarta, Istanbul, Switzerland, and Japan with live transit overlays and demo data.

## Quick Overview

### Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui (optional)
- Maps: Mapbox GL JS (or MapLibre), Leaflet fallback
- Backend: Node.js + Fastify (TypeScript) + WebSocket
- Data: Postgres (PostGIS recommended), Redis for pub/sub
- Dev infra: Docker, docker-compose
- CI/CD: GitHub Actions
- Deployment: Docker on VM + Cloudflare (DNS proxy + WAF). Optional Cloudflare Tunnel.

## Directory Structure