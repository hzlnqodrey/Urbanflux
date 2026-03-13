'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { VehicleTelemetry, InterpolatedVehicle, ConnectionStatus } from '@/lib/telemetry-types'
import type { HubConfig } from '@/lib/hub-config'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'
const MAX_RECONNECT_DELAY = 30_000
const INITIAL_RECONNECT_DELAY = 1_000
const POLL_INTERVAL_MS = 30_000 // Backend polls every 30s
const VEHICLE_STALE_MS = 90_000 // Remove vehicles not updated for 90s

export interface UseHubTelemetryReturn {
    /** Build a GeoJSON FeatureCollection with lerped positions for the current frame. */
    getVehiclesGeoJSON: (hubConfig: HubConfig) => GeoJSON.FeatureCollection
    /** Current WebSocket connection status. */
    connectionStatus: ConnectionStatus
    /** Number of live vehicles for the active hub. */
    vehicleCount: number
}

/**
 * useHubTelemetry — connects to the backend WebSocket, filters by hub,
 * and provides interpolated GeoJSON for GPU-rendered map layers.
 *
 * Vehicles are stored in a useRef (not state) to avoid re-renders.
 * The map's animation loop calls getVehiclesGeoJSON() each frame.
 */
export function useHubTelemetry(activeHub: string): UseHubTelemetryReturn {
    const vehiclesRef = useRef<Map<string, InterpolatedVehicle>>(new Map())
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY)
    const activeHubRef = useRef(activeHub)

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED')
    const [vehicleCount, setVehicleCount] = useState(0)

    // Keep ref in sync for use inside WS callbacks
    activeHubRef.current = activeHub

    // --- WebSocket message handler ---
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const telemetry: VehicleTelemetry = JSON.parse(event.data)

            // Client-side hub filter — cheap, no server overhead
            if (telemetry.hub !== activeHubRef.current) return

            const existing = vehiclesRef.current.get(telemetry.id)
            const now = performance.now()

            vehiclesRef.current.set(telemetry.id, {
                prev: existing
                    ? { lat: existing.curr.lat, lon: existing.curr.lon }
                    : { lat: telemetry.latitude, lon: telemetry.longitude },
                curr: { lat: telemetry.latitude, lon: telemetry.longitude },
                data: telemetry,
                updatedAt: now,
            })
        } catch {
            // Silently ignore malformed messages
        }
    }, [])

    // --- Connect / reconnect ---
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        setConnectionStatus('CONNECTING')
        const ws = new WebSocket(WS_URL)

        ws.onopen = () => {
            setConnectionStatus('CONNECTED')
            reconnectDelayRef.current = INITIAL_RECONNECT_DELAY
        }

        ws.onmessage = handleMessage

        ws.onclose = () => {
            setConnectionStatus('DISCONNECTED')
            // Exponential backoff reconnection
            const delay = reconnectDelayRef.current
            reconnectTimerRef.current = setTimeout(() => {
                reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY)
                connect()
            }, delay)
        }

        ws.onerror = () => {
            ws.close() // triggers onclose → reconnect
        }

        wsRef.current = ws
    }, [handleMessage])

    // --- Lifecycle ---
    useEffect(() => {
        connect()
        return () => {
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
            wsRef.current?.close()
        }
    }, [connect])

    // --- Clear vehicles on hub switch ---
    useEffect(() => {
        vehiclesRef.current.clear()
        setVehicleCount(0)
    }, [activeHub])

    // --- Periodic stale-vehicle cleanup & count update (every 5s) ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = performance.now()
            for (const [id, v] of vehiclesRef.current) {
                if (now - v.updatedAt > VEHICLE_STALE_MS) {
                    vehiclesRef.current.delete(id)
                }
            }
            setVehicleCount(vehiclesRef.current.size)
        }, 5_000)

        return () => clearInterval(interval)
    }, [])

    // --- GeoJSON builder with interpolation ---
    const getVehiclesGeoJSON = useCallback((hubConfig: HubConfig): GeoJSON.FeatureCollection => {
        const now = performance.now()
        const features: GeoJSON.Feature[] = []

        for (const [, vehicle] of vehiclesRef.current) {
            // Linear interpolation: lerp between prev → curr
            const elapsed = now - vehicle.updatedAt
            const progress = Math.min(elapsed / POLL_INTERVAL_MS, 1)
            const lat = vehicle.prev.lat + (vehicle.curr.lat - vehicle.prev.lat) * progress
            const lon = vehicle.prev.lon + (vehicle.curr.lon - vehicle.prev.lon) * progress

            const modeColor = hubConfig.modeColors[vehicle.data.mode] || '#00E0FF'

            features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [lon, lat],
                },
                properties: {
                    id: vehicle.data.id,
                    mode: vehicle.data.mode,
                    operator: vehicle.data.operator,
                    speed: vehicle.data.speed,
                    bearing: vehicle.data.bearing,
                    status: vehicle.data.status,
                    routeId: vehicle.data.routeId,
                    occupancy: vehicle.data.occupancy,
                    color: modeColor,
                },
            })
        }

        return {
            type: 'FeatureCollection',
            features,
        }
    }, [])

    return { getVehiclesGeoJSON, connectionStatus, vehicleCount }
}
