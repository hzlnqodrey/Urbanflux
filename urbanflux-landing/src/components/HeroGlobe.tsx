'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Line, PointMaterial, Points, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const R = 2; // Globe radius

const HUB_LOCATIONS = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
    { name: 'Zurich', lat: 47.3769, lon: 8.5417 },
    { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
    { name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
    { name: 'Brasilia', lat: -15.8267, lon: -47.9218 }
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

function DotGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const [earthData, setEarthData] = useState<{ dots: Float32Array, hubs: THREE.Vector3[], lines: THREE.Vector3[][] } | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = '/earth-map.jpg';
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
            const hubs: THREE.Vector3[] = HUB_LOCATIONS.map(loc => getHubPosition(loc.lat, loc.lon, R));

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
            for (let i = 0; i < hubs.length; i++) {
                // Connect each hub to 1 or 2 other specific hubs to form a web
                for (let j = 0; j < hubs.length; j++) {
                    if (i !== j && Math.random() > 0.4) {
                        lines.push(getCurve(hubs[i], hubs[j]));
                    }
                }
            }

            setEarthData({
                dots: new Float32Array(points),
                hubs: hubs,
                lines: lines
            });
        };
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    if (!earthData) return null;

    return (
        <group rotation={[0, 0, 23.5 * Math.PI / 180]}>
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
                {earthData.hubs.map((pos, idx) => (
                    <mesh key={idx} position={pos}>
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshBasicMaterial color="#00FF88" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

export default function HeroGlobe() {
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
                <source src="/bg-animation.mp4" type="video/mp4" />
            </video> */}

            <div className="absolute inset-0 w-full h-full md:left-[15%] bg-transparent flex items-center justify-center">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.5} />
                    <DotGlobe />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                </Canvas>
            </div>
        </div>
    )
}
