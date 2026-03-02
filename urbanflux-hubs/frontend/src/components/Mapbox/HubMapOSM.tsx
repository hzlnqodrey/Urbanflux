'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, ZoomControl, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { generateInitialBuses, updateBusesStep, CORRIDOR_1_COORDS, CORRIDOR_6_COORDS } from '@/lib/mock-telemetry'

export default function HubMapOSM() {
    const [buses, setBuses] = useState<ReturnType<typeof generateInitialBuses>>(generateInitialBuses());

    useEffect(() => {

        // Simulation loop setting (approx 30fps)
        const interval = setInterval(() => {
            setBuses(prev => updateBusesStep(prev));
        }, 32);

        return () => clearInterval(interval);
    }, []);


    // Custom glowing dot icon
    const createGlowingIcon = (status: string) => {
        const color = status === 'DELAYED' ? '#fbbf24' : '#00E0FF';
        return L.divIcon({
            className: 'custom-bus-marker',
            html: `
                <div class="relative flex items-center justify-center w-6 h-6 -ml-3 -mt-3">
                    <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-75" style="background-color: ${color}"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5" style="background-color: ${color}; box-shadow: 0 0 10px ${color}"></span>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

    return (
        <div className="absolute inset-0 w-full h-full z-0 bg-[#0E0F13]">
            <MapContainer
                center={[-6.1751, 106.8272]}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#0E0F13' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Transit Corridor 1 Polyline (Cyan) */}
                <Polyline
                    positions={CORRIDOR_1_COORDS}
                    pathOptions={{ color: '#ffffff', weight: 4, opacity: 0.2, dashArray: '10, 10' }}
                />
                <Polyline
                    positions={CORRIDOR_1_COORDS}
                    pathOptions={{ color: '#00E0FF', weight: 2, opacity: 0.5 }}
                />

                {/* Transit Corridor 6 Polyline (Emerald) */}
                <Polyline
                    positions={CORRIDOR_6_COORDS}
                    pathOptions={{ color: '#ffffff', weight: 4, opacity: 0.2, dashArray: '10, 10' }}
                />
                <Polyline
                    positions={CORRIDOR_6_COORDS}
                    pathOptions={{ color: '#00C27A', weight: 2, opacity: 0.5 }}
                />

                {/* Animated Bus Markers */}
                {buses.map((b) => (
                    <Marker
                        key={b.bus.id}
                        position={[b.bus.latitude, b.bus.longitude]}
                        icon={createGlowingIcon(b.bus.status)}
                    />
                ))}

                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    )
}
