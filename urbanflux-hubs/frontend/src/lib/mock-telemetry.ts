// src/lib/mock-telemetry.ts

export type BusTelemetry = {
    id: string;
    routeId: string;
    latitude: number;
    longitude: number;
    speed: number;
    status: 'ACTIVE' | 'DELAYED' | 'OFFLINE';
    bearing: number;
    nextStop: string;
};

// Route: Corridor 1 (Blok M - Kota) - Simplified segment around Sudirman/Thamrin
export const CORRIDOR_1_COORDS: [number, number][] = [
    [-6.17552, 106.83005],
    [-6.17534, 106.83015],
    [-6.17458, 106.83004],
    [-6.17415, 106.83026],
    [-6.17366, 106.83024],
    [-6.17338, 106.82983],
    [-6.17313, 106.82925],
    [-6.17286, 106.82912],
    [-6.17233, 106.82921],
    [-6.17181, 106.82929],
    [-6.17160, 106.82913],
    [-6.17150, 106.82888],
    [-6.17148, 106.82735],
    [-6.17146, 106.82569],
    [-6.17157, 106.82347],
    [-6.17190, 106.82319],
    [-6.17463, 106.82309],
    [-6.17925, 106.82297],
    [-6.17987, 106.82300],
    [-6.18042, 106.82310],
    [-6.18062, 106.82318],
    [-6.18085, 106.82310],
    [-6.18100, 106.82305],
    [-6.18197, 106.82308],
    [-6.18256, 106.82311],
    [-6.18327, 106.82317],
    [-6.18384, 106.82320],
    [-6.18483, 106.82327],
    [-6.18559, 106.82328],
    [-6.18610, 106.82324],
    [-6.18689, 106.82321],
    [-6.18726, 106.82320],
    [-6.18913, 106.82312],
    [-6.18981, 106.82310],
    [-6.19090, 106.82308],
    [-6.19251, 106.82312],
    [-6.19376, 106.82316],
    [-6.19433, 106.82325],
    [-6.19456, 106.82340],
    [-6.19474, 106.82351],
    [-6.19483, 106.82355],
    [-6.19491, 106.82356],
    [-6.19501, 106.82357],
    [-6.19511, 106.82355],
    [-6.19524, 106.82350],
    [-6.19537, 106.82339],
    [-6.19554, 106.82325],
    [-6.19607, 106.82319],
    [-6.19656, 106.82321],
    [-6.19733, 106.82323],
    [-6.19862, 106.82327],
    [-6.19905, 106.82328],
    [-6.19943, 106.82329],
    [-6.20089, 106.82325],
    [-6.20226, 106.82296],
    [-6.20335, 106.82271],
    [-6.20490, 106.82246],
    [-6.20687, 106.82224],
    [-6.20773, 106.82214],
    [-6.20815, 106.82207],
    [-6.20903, 106.82183],
    [-6.21060, 106.82112],
    [-6.21133, 106.82075],
    [-6.21211, 106.82035],
    [-6.21300, 106.81986],
    [-6.21360, 106.81945],
    [-6.21412, 106.81902],
    [-6.21489, 106.81823],
    [-6.21598, 106.81693],
    [-6.21641, 106.81637],
    [-6.21704, 106.81558],
    [-6.21751, 106.81512],
    [-6.21791, 106.81460],
    [-6.21823, 106.81434],
    [-6.21859, 106.81422],
    [-6.21936, 106.81399],
    [-6.21991, 106.81382],
    [-6.22047, 106.81367],
    [-6.22066, 106.81367],
    [-6.22080, 106.81369],
    [-6.22108, 106.81378],
    [-6.22158, 106.81412],
    [-6.22228, 106.81461],
    [-6.22308, 106.81525],
    [-6.22378, 106.81575],
    [-6.22442, 106.81613],
    [-6.22514, 106.81677],
    [-6.22399, 106.81642]
];

// Helper to calculate distance between two coords
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

// Calculate bearing between two points
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dLon = deg2rad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(deg2rad(lat2));
    const x = Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
        Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = brng * (180 / Math.PI);
    brng = (brng + 360) % 360;
    return brng;
}

export function generateInitialBuses(): { bus: BusTelemetry, segmentIndex: number, progress: number, direction: 1 | -1 }[] {
    const startIndex = CORRIDOR_1_COORDS.length - 2;
    return [
        {
            bus: {
                id: "TB-0104",
                routeId: "CORRIDOR-1",
                latitude: CORRIDOR_1_COORDS[startIndex + 1][0],
                longitude: CORRIDOR_1_COORDS[startIndex + 1][1],
                speed: 45,
                status: 'ACTIVE',
                bearing: 0,
                nextStop: "Monas"
            },
            segmentIndex: startIndex,
            progress: 0,
            direction: -1 // Moving towards Monas
        }
    ]
}

export function updateBusesStep(busesState: ReturnType<typeof generateInitialBuses>) {
    const speedMultiplier = 0.05; // Simulation speed

    return busesState.map(state => {
        let { segmentIndex, progress, direction } = state;
        const bus = state.bus;

        const p1 = direction === 1 ? CORRIDOR_1_COORDS[segmentIndex] : CORRIDOR_1_COORDS[segmentIndex + 1];
        const p2 = direction === 1 ? CORRIDOR_1_COORDS[segmentIndex + 1] : CORRIDOR_1_COORDS[segmentIndex];

        if (!p1 || !p2) {
            // Reached the end, turn around
            direction = direction === 1 ? -1 : 1;
            segmentIndex = direction === 1 ? 0 : CORRIDOR_1_COORDS.length - 2;
            progress = 0;
            return { bus, segmentIndex, progress, direction };
        }

        const dist = getDistanceFromLatLonInKm(p1[0], p1[1], p2[0], p2[1]);

        // Progress based on speed and distance (faster if shorter segment)
        progress += (bus.speed / 3600) * speedMultiplier * (1 / Math.max(0.01, dist));

        if (progress >= 1) {
            progress -= 1;
            if (direction === 1) segmentIndex++; else segmentIndex--;

            // Check bounds again
            if (segmentIndex >= CORRIDOR_1_COORDS.length - 1 || segmentIndex < 0) {
                direction = direction === 1 ? -1 : 1;
                segmentIndex = direction === 1 ? 0 : CORRIDOR_1_COORDS.length - 2;
                progress = 0;
            }
        }

        // Interpolate position
        const cp1 = direction === 1 ? CORRIDOR_1_COORDS[segmentIndex] : CORRIDOR_1_COORDS[segmentIndex + 1];
        const cp2 = direction === 1 ? CORRIDOR_1_COORDS[segmentIndex + 1] : CORRIDOR_1_COORDS[segmentIndex];

        if (cp1 && cp2) {
            bus.latitude = cp1[0] + (cp2[0] - cp1[0]) * progress;
            bus.longitude = cp1[1] + (cp2[1] - cp1[1]) * progress;
            bus.bearing = calculateBearing(cp1[0], cp1[1], cp2[0], cp2[1]);
        }

        return { bus: { ...bus }, segmentIndex, progress, direction };
    });
}
