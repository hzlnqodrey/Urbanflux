/** @type {import('next').NextConfig} */
const nextConfig = {
    // Static export for GitHub Pages
    output: "export",

    // Base path for GitHub Pages: hzlnqodrey.github.io/urbanflux-hubs
    basePath: "/urbanflux-hubs",

    // Image optimization (required for static export)
    images: {
        unoptimized: true,
    },

    // Environment variables
    env: {
        // WebSocket URL for production (adjust as needed)
        NEXT_PUBLIC_WS_URL: process.env.NODE_ENV === 'production'
            ? 'wss://urbanflux-hubs.pages.dev/ws' // Update with your actual backend URL
            : 'ws://localhost:8080/ws',
        NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/urbanflux-hubs' : '',
    },
};

export default nextConfig;
