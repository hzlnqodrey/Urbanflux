'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function HubMapOSM() {
    const [isMounted, setIsMounted] = React.useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 w-full h-full -z-10 bg-[#0E0F13]">
            <MapContainer
                center={[-6.1751, 106.8272]}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#0E0F13' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    )
}
