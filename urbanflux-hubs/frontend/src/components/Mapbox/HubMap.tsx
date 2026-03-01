'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { generateInitialBuses, updateBusesStep, CORRIDOR_1_COORDS } from '@/lib/mock-telemetry'

// Warning: Mapbox token should ideally be in .env.local
// Replace with a valid public token or configure via environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiaHpsbnFvZHJleSIsImEiOiJjbHhxM2gwdm8weXQ5MnFweXJpNXVwYjhnIn0.YOUR_TOKEN_HERE'

export default function HubMap() {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});
    const animationFrameRef = useRef<number>(0);
    const cursorRef = useRef(generateInitialBuses());

    useEffect(() => {
        if (map.current || !mapContainer.current) return // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [106.8272, -6.1751],
            zoom: 13,
            pitch: 60,
            bearing: -17.6,
            antialias: true
        })

        map.current.on('style.load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.current?.getStyle()?.layers;
            let labelLayerId;
            if (layers) {
                for (let i = 0; i < layers.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (layers[i].type === 'symbol' && layers[i].layout && (layers[i].layout as any)?.['text-field']) {
                        labelLayerId = layers[i].id;
                        break;
                    }
                }
            }

            // Add 3D buildings layer
            map.current?.addLayer(
                {
                    'id': 'add-3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#111827',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );

            // Add Corridor Route Source
            map.current?.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': CORRIDOR_1_COORDS.map(coord => [coord[1], coord[0]]) // Mapbox expects [lng, lat]
                    }
                }
            });

            // Add Corridor Route Layer
            map.current?.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#00E0FF',
                    'line-width': 4,
                    'line-opacity': 0.6
                }
            });

            // Add secondary glowing aura route layer
            map.current?.addLayer({
                'id': 'route-glow',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#00E0FF',
                    'line-width': 12,
                    'line-opacity': 0.1,
                    'line-blur': 10
                }
            });

            // Initialize markers
            cursorRef.current.forEach(item => {
                const el = document.createElement('div');
                el.className = 'custom-bus-marker relative flex items-center justify-center w-6 h-6';
                const color = item.bus.status === 'DELAYED' ? '#fbbf24' : '#00E0FF';
                el.innerHTML = `
                    <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-75" style="background-color: ${color}"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5" style="background-color: ${color}; box-shadow: 0 0 10px ${color}"></span>
                `;

                const mk = new mapboxgl.Marker(el)
                    .setLngLat([item.bus.longitude, item.bus.latitude])
                    .addTo(map.current!);

                markersRef.current[item.bus.id] = mk;
            });

            // Animation Loop
            const animate = () => {
                cursorRef.current = updateBusesStep(cursorRef.current);
                cursorRef.current.forEach(item => {
                    if (markersRef.current[item.bus.id]) {
                        markersRef.current[item.bus.id].setLngLat([item.bus.longitude, item.bus.latitude]);
                    }
                });
                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animate();
        });

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (map.current) map.current.remove();
        }

    }, [])

    return (
        <div className="absolute inset-0 w-full h-full z-0 bg-[#0E0F13]">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    )
}
