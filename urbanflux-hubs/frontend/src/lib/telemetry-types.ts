// TypeScript types matching the backend UrbanfluxTelemetry JSON output.

export type TransportMode = 'BUS' | 'RAIL' | 'METRO' | 'FERRY' | 'MONORAIL' | 'TRAM'
export type OccupancyLevel = 'EMPTY' | 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL' | 'UNKNOWN'
export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'

export interface VehicleTelemetry {
    id: string
    routeId: string
    hub: string
    mode: TransportMode
    operator: string
    latitude: number
    longitude: number
    speed: number
    bearing: number
    status: string
    nextStop: string
    occupancy: OccupancyLevel
    delaySeconds: number
    errorInfo: string
    lastUpdated: string // ISO 8601
}

/** Internal state for smooth interpolation between poll snapshots. */
export interface InterpolatedVehicle {
    prev: { lat: number; lon: number }
    curr: { lat: number; lon: number }
    data: VehicleTelemetry
    updatedAt: number // performance.now() timestamp
}
