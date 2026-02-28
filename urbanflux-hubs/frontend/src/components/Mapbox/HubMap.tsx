'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

// Warning: Mapbox token should ideally be in .env.local
// Replace with a valid public token or configure via environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiaHpsbnFvZHJleSIsImEiOiJjbHhxM2gwdm8weXQ5MnFweXJpNXVwYjhnIn0.YOUR_TOKEN_HERE'

export default function HubMap() {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [lng, setLng] = useState(106.8272) // Jakarta
    const [lat, setLat] = useState(-6.1751)
    const [zoom, setZoom] = useState(12)
    const [pitch, setPitch] = useState(60)

    useEffect(() => {
        if (map.current || !mapContainer.current) return // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
            pitch: pitch,
            bearing: -17.6,
            antialias: true
        })

        map.current.on('style.load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.current?.getStyle()?.layers;
            let labelLayerId;
            if (layers) {
                for (let i = 0; i < layers.length; i++) {
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
        });

    }, [lng, lat, zoom, pitch])

    return (
        <div className="absolute inset-0 w-full h-full -z-10">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    )
}
