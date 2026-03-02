# Changelog: Landing Page Deployment & Testing (2026-03-02)

## Added
*   **Typography:**
    *   Changed the secondary font from `SF` to `JetBrains Mono` across `urbanflux-landing`.
    *   Applied `JetBrains Mono` to the top navigation bar, the hero description text, and the main CTA buttons in `page.tsx`.
*   **Dockerization:**
    *   Created an optimized, multi-stage `Dockerfile` tailored for Next.js to minimize the production image size.
    *   Enabled `output: "standalone"` in `next.config.ts`.
    *   Added a `.dockerignore` file for optimized build contexts.
*   **CI/CD Pipeline (GitHub Actions):**
    *   Added `.github/workflows/landing-docker-publish.yml` for automated testing and deployment to Docker Hub.
    *   Integrated **TruffleHog** for secret scanning (exposed API keys).
    *   Integrated **Trivy** for static application security testing (SAST) and vulnerability scanning.
*   **Test Automation (Playwright):**
    *   Installed Playwright and created the configuration file (`playwright.config.ts`).
    *   Added end-to-end (E2E) tests (`tests/landing.spec.ts`) to verify rendering, navigation, and specific 3D globe interactions (drag functionality, playful interaction, and green node clicking for data dialog cards).
    *   Added `"test:e2e"` script to `package.json`.
*   **Documentation:**
    *   Created `DEPLOYMENT.md` providing step-by-step instructions for GitHub Actions credentials, local Docker verification, and alternative Cloudflare Pages/Vercel deployments.

## Changed
*   Updated Next.js configuration to natively support standalone optimized builds.
