'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CORRIDOR_1_COORDS, CORRIDOR_6_COORDS } from '@/lib/mock-telemetry'
import { HUB_CONFIGS } from '@/lib/hub-config'
import type { UseHubTelemetryReturn } from '@/hooks/useHubTelemetry'

// Component to handle map camera changes on hub switch
function MapUpdater({ activeHub }: { activeHub: string }) {
    const map = useMap()
    useEffect(() => {
        const config = HUB_CONFIGS[activeHub]
        if (config && config.viewport) {
            const center: [number, number] = [config.viewport.center[1], config.viewport.center[0]]
            map.flyTo(center, config.viewport.zoom, { duration: 2 })
        }
    }, [map, activeHub])
    return null
}

function CustomZoomControl() {
    const map = useMap()
    return (
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2 pointer-events-auto">
            <button 
                onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all border border-white/10 shadow-xl"
                title="Zoom In"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all border border-white/10 shadow-xl"
                title="Zoom Out"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
    )
}

interface HubMapOSMProps {
    activeHub: string
    telemetry: UseHubTelemetryReturn
    theme?: 'light' | 'dark'
    showTrains?: boolean
}

export default function HubMapOSM({ activeHub, telemetry, theme = 'dark', showTrains = true }: HubMapOSMProps) {
    const [vehicles, setVehicles] = useState<GeoJSON.Feature[]>([])
    const hubConfig = HUB_CONFIGS[activeHub] || HUB_CONFIGS['jakarta']
    const isJakarta = activeHub === 'jakarta'
    const isDark = theme === 'dark'

    // Polling loop to extract features from the hook's GeoJSON builder
    // Leaflet React markers are DOM-based, so this won't scale to 500+ as well as Mapbox 3D,
    // but we throttle it to ~15fps (64ms) to save CPU.
    useEffect(() => {
        const interval = setInterval(() => {
            const geojson = telemetry.getVehiclesGeoJSON(hubConfig)
            setVehicles(geojson.features)
        }, 64)

        return () => clearInterval(interval)
    }, [telemetry, hubConfig])

    // Custom glowing dot icon
    const createGlowingIcon = (color: string) => {
        return L.divIcon({
            className: 'custom-bus-marker',
            html: `
          <div class="relative flex items-center justify-center w-6 h-6 -ml-3 -mt-3">
              <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-75" style="background-color: ${color}"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 shadow-sm" style="background-color: ${color}; box-shadow: 0 0 10px ${color}"></span>
          </div>
      `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }

    // Convert Mapbox [lng, lat] to Leaflet [lat, lng] for the center
    const leafletCenter: [number, number] = [hubConfig.viewport.center[1], hubConfig.viewport.center[0]]

    const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

    return (
        <div className={`absolute inset-0 w-full h-full z-0 ${isDark ? 'bg-[#0E0F13]' : 'bg-slate-50'}`}>
            <MapContainer
                center={leafletCenter}
                zoom={hubConfig.viewport.zoom}
                style={{ height: '100%', width: '100%', background: isDark ? '#0E0F13' : '#f8fafc' }}
                zoomControl={false}
            >
                <MapUpdater activeHub={activeHub} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url={tileUrl}
                />

                {isJakarta && (
                    <>
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
                    </>
                )}

                {/* Animated Live Markers */}
                {showTrains && vehicles.map((v) => {
                    const props = v.properties!
                    // GeoJSON coordinates are [lng, lat], Leaflet needs [lat, lng]
                    const coords = v.geometry as GeoJSON.Point
                    const lat = coords.coordinates[1]
                    const lng = coords.coordinates[0]

                    return (
                        <Marker
                            key={props.id}
                            position={[lat, lng]}
                            icon={createGlowingIcon(props.color || '#00E0FF')}
                        >
                            <Popup className="urbanflux-popup" closeButton={false}>
                                <div className="flex flex-col gap-1 p-1">
                                    <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: props.color }}></span>
                                        <span className="font-mono text-xs font-bold text-white tracking-widest leading-none">{props.id}</span>
                                        <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded text-white/70 bg-white/10">{props.routeId || 'UNKNOWN'}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mode</span>
                                        <span className="font-mono text-xs text-white uppercase">{props.mode}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Speed</span>
                                        <span className="font-mono text-xs text-[#00E0FF]">{props.speed?.toFixed(1) || '0.0'} <span className="text-[9px] text-slate-500">km/h</span></span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Next Stop</span>
                                        <span className="font-mono text-xs text-white truncate max-w-[100px] text-right" title={props.nextStop || 'Unknown'}>{props.nextStop || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-slate-500 uppercase">Est. Arrival</span>
                                            <span className="font-mono text-xs text-emerald-400 font-medium">+2 min</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] text-slate-500 uppercase text-right">Status</span>
                                            <span className="font-mono text-[9px] font-semibold text-white bg-emerald-500/20 px-1.5 py-0.5 rounded outline outline-1 outline-emerald-500/30">ON TIME</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}

                <CustomZoomControl />
            </MapContainer>
        </div>
    )
}
