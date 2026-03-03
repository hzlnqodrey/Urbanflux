# Urbanflux Deployment Setup

This document outlines the deployment processes for the Urbanflux project suite, currently covering the **Landing Page** and the **Hubs Frontend**. 

---

## 🏗️ 1. Urbanflux Landing (`urbanflux-landing`)

The landing page is a Next.js application containerized using Docker. Its CI/CD pipeline is managed via GitHub Actions.

### A. CI/CD Pipeline (GitHub Actions)
The workflow file `landing-docker-publish.yml` is configured to:
- **On Pull Request (`main`)**: Run Playwright E2E tests, Trivy SAST scanning, TruffleHog secret scanning, and perform a dry-run Docker build to ensure the image compiles successfully.
- **On Push (`main`)**: Execute the full testing suite and automatically push the compiled Docker image to Docker Hub, tagged with both `latest` and the short commit SHA.

### B. Deployment Prerequisites (GitHub Secrets)
To enable the Docker Hub publishing, the following **Repository Secrets** (NOT Environment secrets) must be added in GitHub (`Settings -> Secrets and variables -> Actions`):
- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub Access Token or password.

### C. Cloudflare Deployment
If you prefer not to use Docker, Cloudflare can host this Next.js app natively.
1. Connect Cloudflare Pages directly to the GitHub repository.
2. Set the build command to `cd urbanflux-landing && npm run build`.
3. Ensure Edge rendering is correctly supported depending on Cloudflare's `@cloudflare/next-on-pages` requirements. Alternatively, for standard VPS hosting, run the built Docker container locally and use `cloudflared` to expose it to the internet via a Cloudflare Tunnel.

---

## 🏢 2. Urbanflux Hubs Frontend (`urbanflux-hubs/frontend`)

The Hubs Frontend handles the interactive dashboards and mapping logic.

### A. Environment Preparation
Before deploying the hubs frontend, ensure any required environment variables (e.g., Mapbox GL tokens) are securely provided to the build environment. 

### B. Suggested CI/CD Flow
Similar to the landing page, the Hubs Frontend should utilize a GitHub Actions workflow that:
- Runs static analysis and layout tests on PRs.
- Builds a production-ready application bundle on merges to `main`.
- Triggers a deployment webhook (e.g., Vercel, Cloudflare Pages, or a Docker Registry update).

### C. Deployment Strategy
*Specific CI/CD YAML configurations and Dockerfiles for the Hubs Frontend will be established once the backend API Adapters are fully integrated to ensure seamless environment variable coupling.*

---

## ⚙️ 3. Urbanflux Hubs Backend (Coming Soon)
*Backend deployment configuration will be documented here after the main hub adapter features and APIs are established.*
