'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { CORRIDOR_1_COORDS } from '@/lib/mock-telemetry'
import { HUB_CONFIGS } from '@/lib/hub-config'
import type { UseHubTelemetryReturn } from '@/hooks/useHubTelemetry'

// Replace with a valid public token or configure via environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiaHpsbnFvZHJleSIsImEiOiJjbHhxM2gwdm8weXQ5MnFweXJpNXVwYjhnIn0.YOUR_TOKEN_HERE'

interface HubMapProps {
    activeHub: string
    telemetry: UseHubTelemetryReturn
    theme?: 'light' | 'dark'
}

export default function HubMap({ activeHub, telemetry, theme = 'dark' }: HubMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const animationFrameRef = useRef<number>(0)
    const prevHubRef = useRef<string>(activeHub)

    const hubConfig = HUB_CONFIGS[activeHub] || HUB_CONFIGS['jakarta']

    // Build the initial empty GeoJSON
    const emptyGeoJSON = useCallback((): GeoJSON.FeatureCollection => ({
        type: 'FeatureCollection',
        features: [],
    }), [])

    useEffect(() => {
        if (map.current || !mapContainer.current) return

        const initialHub = HUB_CONFIGS[activeHub] || HUB_CONFIGS['jakarta']

        const isDark = theme === 'dark'

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
            center: initialHub.viewport.center,
            zoom: initialHub.viewport.zoom,
            pitch: initialHub.viewport.pitch,
            bearing: initialHub.viewport.bearing,
            antialias: true,
        })

        map.current.on('style.load', () => {
            const m = map.current!

            // --- 3D Buildings ---
            const layers = m.getStyle()?.layers
            let labelLayerId: string | undefined
            if (layers) {
                for (const layer of layers) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (layer.type === 'symbol' && layer.layout && (layer.layout as any)?.['text-field']) {
                        labelLayerId = layer.id
                        break
                    }
                }
            }

            m.addLayer({
                id: 'add-3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 15,
                paint: {
                    'fill-extrusion-color': '#111827',
                    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
                    'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
                    'fill-extrusion-opacity': 0.6,
                },
            }, labelLayerId)

            // --- Jakarta Corridor Route (static, only for Jakarta) ---
            m.addSource('route-jakarta', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: CORRIDOR_1_COORDS.map(coord => [coord[1], coord[0]]),
                    },
                },
            })

            m.addLayer({
                id: 'route-jakarta',
                type: 'line',
                source: 'route-jakarta',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#00E0FF', 'line-width': 4, 'line-opacity': 0.6 },
            })

            m.addLayer({
                id: 'route-jakarta-glow',
                type: 'line',
                source: 'route-jakarta',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#00E0FF', 'line-width': 12, 'line-opacity': 0.1, 'line-blur': 10 },
            })

            // --- Vehicle GeoJSON Source (GPU-rendered, no DOM markers) ---
            m.addSource('vehicles', {
                type: 'geojson',
                data: emptyGeoJSON(),
            })

            // Outer glow ring
            m.addLayer({
                id: 'vehicles-glow',
                type: 'circle',
                source: 'vehicles',
                paint: {
                    'circle-radius': 10,
                    'circle-color': ['get', 'color'],
                    'circle-opacity': 0.15,
                    'circle-blur': 1,
                },
            })

            // Inner solid dot
            m.addLayer({
                id: 'vehicles-dot',
                type: 'circle',
                source: 'vehicles',
                paint: {
                    'circle-radius': 4,
                    'circle-color': ['get', 'color'],
                    'circle-opacity': 0.9,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'rgba(255,255,255,0.3)',
                },
            })

            // Toggle Jakarta corridor visibility based on active hub
            const isJakarta = activeHub === 'jakarta'
            m.setLayoutProperty('route-jakarta', 'visibility', isJakarta ? 'visible' : 'none')
            m.setLayoutProperty('route-jakarta-glow', 'visibility', isJakarta ? 'visible' : 'none')

            // --- Animation Loop (60fps, GPU-rendered) ---
            const animate = () => {
                const currentConfig = HUB_CONFIGS[prevHubRef.current] || HUB_CONFIGS['jakarta']
                const geojson = telemetry.getVehiclesGeoJSON(currentConfig)
                const source = m.getSource('vehicles') as mapboxgl.GeoJSONSource | undefined
                if (source) {
                    source.setData(geojson)
                }
                animationFrameRef.current = requestAnimationFrame(animate)
            }

            animate()
        })

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            if (map.current) map.current.remove()
            map.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // --- Hub switch: fly to new viewport + toggle corridors ---
    useEffect(() => {
        if (!map.current || prevHubRef.current === activeHub) return

        const config = HUB_CONFIGS[activeHub]
        if (!config) return

        map.current.flyTo({
            center: config.viewport.center,
            zoom: config.viewport.zoom,
            pitch: config.viewport.pitch,
            bearing: config.viewport.bearing,
            duration: 2000,
            essential: true,
        })

        // Toggle Jakarta corridors
        const isJakarta = activeHub === 'jakarta'
        try {
            map.current.setLayoutProperty('route-jakarta', 'visibility', isJakarta ? 'visible' : 'none')
            map.current.setLayoutProperty('route-jakarta-glow', 'visibility', isJakarta ? 'visible' : 'none')
        } catch {
            // Layers may not be loaded yet
        }

        // Clear vehicles source during transition
        const source = map.current.getSource('vehicles') as mapboxgl.GeoJSONSource | undefined
        if (source) {
            source.setData(emptyGeoJSON())
        }

        prevHubRef.current = activeHub
    }, [activeHub, emptyGeoJSON, hubConfig])

    return (
        <div className={`absolute inset-0 w-full h-full z-0 ${theme === 'dark' ? 'bg-[#0E0F13]' : 'bg-slate-50'}`}>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    )
}
