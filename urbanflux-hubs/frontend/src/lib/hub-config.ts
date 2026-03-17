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

    // --- Malaysia: Penang (Prasarana Rapid Bus) ---
    penang: {
        id: 'penang',
        displayName: 'Penang Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [100.3327, 5.4141],
            zoom: 12,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },

    // --- Malaysia: Kuantan (Prasarana Rapid Bus) ---
    kuantan: {
        id: 'kuantan',
        displayName: 'Kuantan Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [103.4260, 3.8077],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },

    // --- Malaysia: BAS.MY City Hubs ---
    kangar: {
        id: 'kangar',
        displayName: 'Kangar Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [100.1986, 6.4414],
            zoom: 14,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    'alor-setar': {
        id: 'alor-setar',
        displayName: 'Alor Setar Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [100.3685, 6.1248],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    'kota-bharu': {
        id: 'kota-bharu',
        displayName: 'Kota Bharu Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [102.2381, 6.1256],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    'kuala-terengganu': {
        id: 'kuala-terengganu',
        displayName: 'Kuala Terengganu Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [103.1324, 5.3117],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    ipoh: {
        id: 'ipoh',
        displayName: 'Ipoh Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [101.0901, 4.5975],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    seremban: {
        id: 'seremban',
        displayName: 'Seremban Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [101.9424, 2.7258],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    melaka: {
        id: 'melaka',
        displayName: 'Melaka Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [102.2501, 2.1896],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    'johor-bahru': {
        id: 'johor-bahru',
        displayName: 'Johor Bahru Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuala_Lumpur',
        viewport: {
            center: [103.7414, 1.4927],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
    kuching: {
        id: 'kuching',
        displayName: 'Kuching Hub',
        country: 'Malaysia',
        timezone: 'Asia/Kuching',
        viewport: {
            center: [110.3593, 1.5535],
            zoom: 13,
            pitch: 45,
            bearing: 0,
        },
        modeColors: MALAYSIA_MODE_COLORS,
    },
}

export const HUB_IDS = Object.keys(HUB_CONFIGS) as string[]
