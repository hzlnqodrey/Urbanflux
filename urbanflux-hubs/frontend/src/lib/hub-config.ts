// Hub configuration registry — viewport, colors, and labels per hub.

export interface HubViewport {
    center: [number, number] // [lng, lat]
    zoom: number
    pitch: number
    bearing: number
}

export interface HubConfig {
    id: string
    displayName: string
    country: string // Hierarchy: Country -> Hub
    timezone: string
    viewport: HubViewport
    modeColors: Record<string, string>
}

// Shared mode color palette for all Malaysia hubs
const MALAYSIA_MODE_COLORS: Record<string, string> = {
    BUS: '#10B981', // Green
    RAIL: '#F59E0B', // Yellow (Train)
    METRO: '#3B82F6', // Blue (MRT)
    TRAM: '#EC4899', // Pink
    FERRY: '#0EA5E9',
    MONORAIL: '#8B5CF6',
}

export const HUB_CONFIGS: Record<string, HubConfig> = {
    jakarta: {
        id: 'jakarta',
        displayName: 'Jakarta Central Hub',
        country: 'Indonesia',
        timezone: 'Asia/Jakarta',
        viewport: {
            center: [106.8272, -6.1751],
            zoom: 13,
            pitch: 60,
            bearing: -17.6,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },

    // --- Malaysia: Kuala Lumpur (Prasarana + KTMB + MRT Feeder) ---
    'kuala-lumpur': {
        id: 'kuala-lumpur',
        displayName: 'Kuala Lumpur Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [101.6869, 3.1390],
            zoom: 12,
            pitch: 50,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },

}

export const HUB_IDS = Object.keys(HUB_CONFIGS) as string[]
