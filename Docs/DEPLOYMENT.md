# Urbanflux Landing Deployment Guide

This document outlines the CI/CD pipeline and the deployment process for `urbanflux-landing`.

## Overview

The CI/CD pipeline is designed to:
1. Automatically run Playwright end-to-end (E2E) tests.
2. Perform static application security testing (SAST) using Trivy.
3. Check for leaked secrets using TruffleHog.
4. Build a highly optimized, standalone Next.js Docker image.
5. Push the resulting Docker image to Docker Hub.

---

## 🚀 GitHub Actions Setup (Docker Hub Push + Testing)

To enable the automated GitHub Actions pipeline (`landing-docker-publish.yml`):

1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Add the following credentials:
   - `DOCKER_USERNAME`: Your Docker Hub username.
   - `DOCKER_PASSWORD`: Your Docker Hub personal access token (recommended) or password.
4. Once added:
   - Any **Pull Request** targeting the `main` branch affecting the `urbanflux-landing` directory will trigger the Playwright Tests and Security Scans to validate the PR.
   - Any **push** (merge) to the `main` branch will trigger the entire pipeline, including the Docker Build & Push to Docker Hub.

--- 

## 🐳 Running with Docker Locally

To build and run the Docker image on your local machine:

```bash
cd urbanflux-landing
docker build -t urbanflux-landing:latest .
docker run -p 3000:3000 urbanflux-landing:latest
```
Visit `http://localhost:3000` to view the application.

---

## ☁️ Cloudflare Pages / Vercel Deployment

While Docker is excellent for container orchestrators (like Kubernetes or CapRover), Edge native platforms like Cloudflare Pages or Vercel can directly host Next.js apps without needing the Dockerfile.

### Cloudflare Pages (Direct Deployment)

If you prefer using Cloudflare Pages directly instead of a Docker container:

1. Log into your **Cloudflare Dashboard**.
2. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select this repository (`hzlnqodrey/Urbanflux`).
4. Configure the build settings:
   - **Framework preset:** Next.js
   - **Build command:** `cd urbanflux-landing && npm run build`
   - **Build output directory:** `urbanflux-landing/.next` (Cloudflare might auto-detect `out/` depending on standard settings, but Next.js standard SSR requires `@cloudflare/next-on-pages` usually. To run Next.js natively, Vercel is highly recommended).
5. Ensure your Cloudflare bindings are set up if using edge functions.

### Cloudflare Pages (with Docker/Cloudflare Access / Tunnel)
If you want to use the Docker container on a VPS, you can proxy it via a Cloudflare Tunnel:
1. Run the Docker container on your server.
2. Install `cloudflared` on the server and create a tunnel to `localhost:3000`.
3. Route traffic to the tunnel from your Cloudflare dashboard.
