'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Line, PointMaterial, Points, OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { MapPin, Users, Train, X } from 'lucide-react'
import { withBasePath } from '@/lib/utils'

const R = 2; // Globe radius

const HUB_LOCATIONS = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456, population: '10.5M', transit: '4 Modes' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, population: '37.3M', transit: '13 Modes' },
    { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, population: '7.9M', transit: '5 Modes' },
    { name: 'Zurich', lat: 47.3769, lon: 8.5417, population: '434K', transit: '7 Modes' },
    { name: 'Istanbul', lat: 41.0082, lon: 28.9784, population: '15.4M', transit: '6 Modes' },
    { name: 'Johannesburg', lat: -26.2041, lon: 28.0473, population: '5.6M', transit: '3 Modes' },
    { name: 'Brasilia', lat: -15.8267, lon: -47.9218, population: '3.0M', transit: '2 Modes' }
];

const HUB_CONNECTIONS = [
    ['Jakarta', 'Tokyo'],
    ['Tokyo', 'Brasilia'],
    ['Brasilia', 'Johannesburg'],
    ['Johannesburg', 'Kuala Lumpur'],
    ['Kuala Lumpur', 'Jakarta'],
    ['Jakarta', 'Zurich'],
    ['Zurich', 'Istanbul'],
    ['Istanbul', 'Tokyo'],
    ['Johannesburg', 'Zurich'],
    ['Istanbul', 'Brasilia']
];

function getPointOnSphere(phi: number, theta: number, radius: number) {
    // Negate x so that the map isn't mirrored from the +Z viewer perspective
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function getHubPosition(lat: number, lon: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lon * (Math.PI / 180);
    return getPointOnSphere(phi, theta, radius);
}

function getCurve(p1: THREE.Vector3, p2: THREE.Vector3) {
    const distance = p1.distanceTo(p2);
    const midPoint = p1.clone().lerp(p2, 0.5);
    midPoint.normalize().multiplyScalar(R + distance * 0.5); // Curve height made higher

    const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
    return curve.getPoints(50);
}

interface HubData {
    name: string;
    pos: THREE.Vector3;
    population: string;
    transit: string;
}

interface DotGlobeProps {
    activeHub: string | null;
    setActiveHub: (hub: string | null) => void;
    mode: 'offset' | 'fixed';
}

function DotGlobe({ activeHub, setActiveHub, mode }: DotGlobeProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [earthData, setEarthData] = useState<{ dots: Float32Array, hubs: HubData[], lines: THREE.Vector3[][] } | null>(null);
    const { viewport } = useThree();

    // Smooth offset to right on larger screens so UI text isn't blocked by the globe
    const targetXOffset = Math.min(1.8, Math.max(0, (viewport.width - 4) * 0.4));

    // We animate the offset using useFrame instead of abrupt jumping
    const currentXOffset = useRef(mode === 'offset' ? targetXOffset : 0);

    useEffect(() => {
        const img = new Image();
        img.src = withBasePath('/earth-map.jpg');
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

            const points = [];
            const hubs: HubData[] = HUB_LOCATIONS.map(loc => ({
                name: loc.name,
                pos: getHubPosition(loc.lat, loc.lon, R),
                population: loc.population,
                transit: loc.transit
            }));

            // Generate dots using Fibonacci sphere
            const totalPoints = 65000;
            const goldenRatio = (1 + Math.sqrt(5)) / 2;

            for (let i = 0; i < totalPoints; i++) {
                const theta = 2 * Math.PI * i / goldenRatio;
                const phi = Math.acos(1 - 2 * (i + 0.5) / totalPoints);

                let u = (theta + Math.PI) / (2 * Math.PI);
                let v = phi / Math.PI;
                u = u % 1.0;

                const x = Math.floor(u * img.width);
                const y = Math.floor(v * img.height);

                const pixelIndex = (y * img.width + x) * 4;
                const r = imageData[pixelIndex];

                // Earth specular map: oceans are bright (r > ~90), continents are dark (r < 40)
                // We keep the point if it's on land (continent instead of ocean)
                if (r < 40) {
                    const point = getPointOnSphere(phi, theta, R);
                    points.push(point.x, point.y, point.z);
                }
            }

            // Generate golden connections between specific hubs
            const lines: THREE.Vector3[][] = [];
            HUB_CONNECTIONS.forEach(([startName, endName]) => {
                const h1 = hubs.find(h => h.name === startName);
                const h2 = hubs.find(h => h.name === endName);
                if (h1 && h2) {
                    lines.push(getCurve(h1.pos, h2.pos));
                }
            });

            setEarthData({
                dots: new Float32Array(points),
                hubs: hubs,
                lines: lines
            });
        };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;

            // Animate transition between fixed and offset
            const target = mode === 'offset' ? targetXOffset : 0;
            currentXOffset.current = THREE.MathUtils.lerp(currentXOffset.current, target, 4 * delta);
            if (groupRef.current.parent) {
                groupRef.current.parent.position.x = currentXOffset.current;
            }
        }
    });

    if (!earthData) return null;

    return (
        <group position={[currentXOffset.current, 0, 0]} rotation={[0, 0, 23.5 * Math.PI / 180]}>
            <group ref={groupRef}>
                {/* Core Dark Globe Map (Occludes back dots) */}
                <Sphere args={[R - 0.02, 64, 64]}>
                    <meshBasicMaterial color="#0A0F1C" />
                </Sphere>

                {/* Glowing Atmosphere edge */}
                <Sphere args={[R + 0.15, 64, 64]} scale={[1, 1, 1]}>
                    <meshBasicMaterial color="#00E0FF" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
                </Sphere>

                {/* Continents Dots */}
                <Points positions={earthData.dots}>
                    <PointMaterial
                        transparent
                        color="#00C27A"
                        size={0.012}
                        sizeAttenuation={true}
                        depthWrite={false}
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                    />
                </Points>

                {/* Golden Flight Lines */}
                {earthData.lines.map((points, idx) => (
                    <Line
                        key={idx}
                        points={points}
                        color="#FFD700"
                        opacity={0.6}
                        transparent
                        lineWidth={2}
                    />
                ))}

                {/* Global Hubs */}
                {earthData.hubs.map((hub, idx) => (
                    <mesh
                        key={idx}
                        position={hub.pos}
                        onClick={(e) => { e.stopPropagation(); setActiveHub(hub.name); }}
                        onPointerOver={() => document.body.style.cursor = 'pointer'}
                        onPointerOut={() => document.body.style.cursor = 'auto'}
                    >
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshBasicMaterial color={activeHub === hub.name ? "#FFFFFF" : "#00FF88"} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />

                        {activeHub === hub.name && (
                            <Html position={[0, 0.1, 0]} center className="pointer-events-none">
                                <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 min-w-[200px] shadow-[0_0_20px_rgba(0,224,255,0.2)] bg-[#0A0F1C]/80 backdrop-blur-md border border-[#00E0FF]/30 pointer-events-auto">
                                    <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#00E0FF]" />
                                            <span className="font-bold text-white tracking-wide">{hub.name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveHub(null); }}
                                            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 -mr-1 -mt-1 rounded-full hover:bg-white/10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users className="w-4 h-4 text-[#00C27A]" />
                                            <span>Population</span>
                                        </div>
                                        <span className="font-medium text-white">{hub.population}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Train className="w-4 h-4 text-[#00C27A]" />
                                            <span>Transits</span>
                                        </div>
                                        <span className="font-medium text-white">{hub.transit}</span>
                                    </div>
                                </div>
                            </Html>
                        )}
                    </mesh>
                ))}
            </group>
        </group>
    );
}

interface HeroGlobeProps {
    mode?: 'offset' | 'fixed';
}

export default function HeroGlobe({ mode = 'offset' }: HeroGlobeProps) {
    const [activeHub, setActiveHub] = useState<string | null>(null);

    // Allow clicking anywhere to dismiss, but avoid clicks inside the glass-panel
    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            if (activeHub && !(e.target as HTMLElement).closest('.glass-panel')) {
                setActiveHub(null);
            }
        };
        document.addEventListener('mousedown', handleDocClick);
        return () => document.removeEventListener('mousedown', handleDocClick);
    }, [activeHub]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
            {/* Background video commented out as requested */}
            {/* <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90"
            >
                <source src={withBasePath('/bg-animation.mp4')} type="video/mp4" />
            </video> */}

            <div className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    dpr={[1, 2]}
                    className="pointer-events-auto"
                    onPointerMissed={() => setActiveHub(null)}
                >
                    <ambientLight intensity={0.5} />
                    <Stars radius={10} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
                    <DotGlobe activeHub={activeHub} setActiveHub={setActiveHub} mode={mode} />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                </Canvas>
            </div>
        </div>
    )
}
