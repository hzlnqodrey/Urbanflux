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
    mode?: string;
};

// Route: Corridor 1 (Blok M - Kota) - Simplified segment around Sudirman/Thamrin
export const CORRIDOR_6_COORDS: [number, number][] = [
    [-6.24324, 106.80000],
    [-6.24310, 106.79940],
    [-6.24277, 106.79899],
    [-6.24233, 106.79894],
    [-6.24263, 106.79846],
    [-6.24337, 106.79820],
    [-6.24446, 106.79821],
    [-6.24524, 106.79820],
    [-6.24589, 106.79836],
    [-6.24589, 106.79984],
    [-6.24588, 106.80127],
    [-6.24589, 106.80223],
    [-6.24586, 106.80316],
    [-6.24580, 106.80343],
    [-6.24539, 106.80428],
    [-6.24527, 106.80445],
    [-6.24607, 106.80505],
    [-6.24752, 106.80615],
    [-6.24830, 106.80677],
    [-6.24891, 106.80757],
    [-6.24936, 106.80821],
    [-6.24943, 106.80864],
    [-6.24986, 106.80946],
    [-6.25044, 106.80973],
    [-6.25082, 106.80970],
    [-6.25156, 106.80912],
    [-6.25293, 106.80839],
    [-6.25360, 106.80815],
    [-6.25525, 106.80811],
    [-6.25659, 106.80802],
    [-6.25718, 106.80804],
    [-6.25884, 106.80814],
    [-6.26106, 106.80827],
    [-6.26233, 106.80834],
    [-6.26403, 106.80843],
    [-6.26473, 106.80847],
    [-6.26593, 106.80853],
    [-6.26761, 106.80862],
    [-6.27072, 106.80878],
    [-6.27271, 106.80882],
    [-6.27354, 106.80876],
    [-6.27502, 106.80867],
    [-6.27604, 106.80855],
    [-6.27780, 106.80838],
    [-6.27879, 106.80785],
    [-6.27939, 106.80754],
    [-6.28067, 106.80745],
    [-6.28350, 106.80732],
    [-6.28667, 106.80713],
    [-6.28802, 106.80699],
    [-6.28870, 106.80677],
    [-6.28929, 106.80655],
    [-6.29033, 106.80616],
    [-6.29073, 106.80610],
    [-6.29144, 106.80646],
    [-6.29190, 106.80703],
    [-6.29200, 106.80873],
    [-6.29200, 106.80906],
    [-6.29195, 106.81015],
    [-6.29190, 106.81197],
    [-6.29187, 106.81297],
    [-6.29195, 106.81448],
    [-6.29198, 106.81568],
    [-6.29202, 106.81647],
    [-6.29204, 106.81683],
    [-6.29211, 106.81780],
    [-6.29222, 106.81871],
    [-6.29253, 106.82000],
    [-6.29305, 106.82136],
    [-6.29360, 106.82250],
    [-6.29422, 106.82237],
    [-6.29684, 106.82134],
    [-6.29721, 106.82120],
    [-6.29827, 106.82120],
    [-6.29893, 106.82117],
    [-6.29941, 106.82116],
    [-6.30044, 106.82127],
    [-6.30101, 106.82137],
    [-6.30231, 106.82123],
    [-6.30295, 106.82114],
    [-6.30438, 106.82091],
    [-6.30516, 106.82076],
    [-6.30584, 106.82060],
    [-6.30641, 106.82065],
    [-6.24324, 106.80000],
    [-6.30649, 106.82165]
];

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
                nextStop: "Monas",
                mode: "BUS"
            },
            segmentIndex: startIndex,
            progress: 0,
            direction: -1 // Moving towards Monas
        },
        {
            bus: { 
                id: "TB-0622", 
                routeId: "CORRIDOR-6", 
                latitude: CORRIDOR_6_COORDS[0][0], 
                longitude: CORRIDOR_6_COORDS[0][1], 
                speed: 35, 
                status: 'ACTIVE', 
                bearing: 0, 
                nextStop: "Bundaran Senayan",
                mode: "BUS"
            },
            segmentIndex: 0, 
            progress: 0, 
            direction: 1 // Moving towards Ragunan
        },
        // --- ADDED TRAIN, MRT, TRAM MOCKS FOR COLOR TESTING ---
        {
            bus: {
                id: "KRL-001",
                routeId: "BOGOR-LINE",
                latitude: -6.1850,
                longitude: 106.8250,
                speed: 65,
                status: 'ACTIVE',
                bearing: 15,
                nextStop: "Sudirman",
                mode: "RAIL"
            },
            segmentIndex: 0,
            progress: 0,
            direction: 1
        },
        {
            bus: {
                id: "MRT-001",
                routeId: "NS-LINE",
                latitude: -6.1950,
                longitude: 106.8229,
                speed: 70,
                status: 'ACTIVE',
                bearing: -10,
                nextStop: "Bundaran HI",
                mode: "METRO"
            },
            segmentIndex: 0,
            progress: 0,
            direction: 1
        },
        {
            bus: {
                id: "LRT-001",
                routeId: "CB-LINE",
                latitude: -6.2050,
                longitude: 106.8300,
                speed: 55,
                status: 'ACTIVE',
                bearing: 45,
                nextStop: "Dukuh Atas",
                mode: "TRAM"
            },
            segmentIndex: 0,
            progress: 0,
            direction: 1
        }
    ]
}

export function updateBusesStep(busesState: ReturnType<typeof generateInitialBuses>) {
    const speedMultiplier = 0.05; // Simulation speed

    return busesState.map(state => {
        let { segmentIndex, progress, direction } = state;
        const bus = state.bus;

        const coords = bus.routeId === 'CORRIDOR-1' ? CORRIDOR_1_COORDS : CORRIDOR_6_COORDS;
        const p1 = direction === 1 ? coords[segmentIndex] : coords[segmentIndex + 1];
        const p2 = direction === 1 ? coords[segmentIndex + 1] : coords[segmentIndex];

        if (!p1 || !p2) {
            // Reached the end, turn around
            direction = direction === 1 ? -1 : 1;
            segmentIndex = direction === 1 ? 0 : coords.length - 2;
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
            if (segmentIndex >= coords.length - 1 || segmentIndex < 0) {
                direction = direction === 1 ? -1 : 1;
                segmentIndex = direction === 1 ? 0 : coords.length - 2;
                progress = 0;
            }
        }

        // Interpolate position
        const cp1 = direction === 1 ? coords[segmentIndex] : coords[segmentIndex + 1];
        const cp2 = direction === 1 ? coords[segmentIndex + 1] : coords[segmentIndex];

        if (cp1 && cp2) {
            bus.latitude = cp1[0] + (cp2[0] - cp1[0]) * progress;
            bus.longitude = cp1[1] + (cp2[1] - cp1[1]) * progress;
            bus.bearing = calculateBearing(cp1[0], cp1[1], cp2[0], cp2[1]);
        }

        return { bus: { ...bus }, segmentIndex, progress, direction };
    });
}
