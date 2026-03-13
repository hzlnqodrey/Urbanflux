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
    timezone: string
    viewport: HubViewport
    modeColors: Record<string, string>
}

export const HUB_CONFIGS: Record<string, HubConfig> = {
    jakarta: {
        id: 'jakarta',
        displayName: 'Jakarta Central Hub',
        timezone: 'Asia/Jakarta',
        viewport: {
            center: [106.8272, -6.1751],
            zoom: 13,
            pitch: 60,
            bearing: -17.6,
        },
        modeColors: {
            BUS: '#00E0FF',
            RAIL: '#00C27A',
            METRO: '#7C3AED',
            FERRY: '#3B82F6',
            MONORAIL: '#F59E0B',
            TRAM: '#EC4899',
        },
    },
    'kuala-lumpur': {
        id: 'kuala-lumpur',
        displayName: 'Kuala Lumpur Hub',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [101.6869, 3.1390],
            zoom: 12,
            pitch: 50,
            bearing: 0,
        },
        modeColors: {
            BUS: '#00E0FF',
            RAIL: '#00C27A',
            METRO: '#7C3AED',
            FERRY: '#3B82F6',
            MONORAIL: '#F59E0B',
            TRAM: '#EC4899',
        },
    },
}

export const HUB_IDS = Object.keys(HUB_CONFIGS) as string[]
