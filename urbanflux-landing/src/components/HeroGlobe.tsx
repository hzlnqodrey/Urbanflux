'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Line, PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'

const R = 2; // Globe radius

function getPointOnSphere(phi: number, theta: number, radius: number) {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function getCurve(p1: THREE.Vector3, p2: THREE.Vector3) {
    const distance = p1.distanceTo(p2);
    const midPoint = p1.clone().lerp(p2, 0.5);
    midPoint.normalize().multiplyScalar(R + distance * 0.3); // Curve height

    const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
    return curve.getPoints(50);
}

function DotGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const [earthData, setEarthData] = useState<{ dots: Float32Array, lines: THREE.Vector3[][] } | null>(null);

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
            const hubs: THREE.Vector3[] = [];

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

                // Keep point if it's on land (specular map land is white)
                if (r > 40) {
                    const point = getPointOnSphere(phi, theta, R);
                    points.push(point.x, point.y, point.z);

                    // Randomly select some hubs for lines
                    if (Math.random() > 0.999 && hubs.length < 35) {
                        hubs.push(point);
                    }
                }
            }

            // Generate connections between hubs
            const lines: THREE.Vector3[][] = [];
            for (let i = 0; i < hubs.length; i++) {
                // Connect each hub to random other hubs
                const numConnections = Math.floor(Math.random() * 2) + 1;
                for (let j = 0; j < numConnections; j++) {
                    const targetIdx = Math.floor(Math.random() * hubs.length);
                    if (targetIdx !== i && hubs[i].distanceTo(hubs[targetIdx]) > 0.5) {
                        lines.push(getCurve(hubs[i], hubs[targetIdx]));
                    }
                }
            }

            setEarthData({
                dots: new Float32Array(points),
                lines: lines
            });
        };
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.z = 0.05 * Math.sin(state.clock.elapsedTime * 0.1);
        }
    });

    if (!earthData) return null;

    return (
        <group ref={groupRef}>
            {/* Core Dark Globe Map (Occludes back dots) */}
            <Sphere args={[R - 0.02, 64, 64]}>
                <meshBasicMaterial color="#0A0F1C" />
            </Sphere>

            {/* Glowing Atmosphere edge */}
            <Sphere args={[R + 0.15, 64, 64]} scale={[1, 1, 1]}>
                <meshBasicMaterial color="#00E0FF" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
            </Sphere>

            {/* Landmass Dots */}
            <Points positions={earthData.dots}>
                <PointMaterial
                    transparent
                    color="#00C27A"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Flight Lines / Connections */}
            {earthData.lines.map((points, idx) => (
                <Line
                    key={idx}
                    points={points}
                    color="#00E0FF"
                    opacity={0.3}
                    transparent
                    lineWidth={1.5}
                />
            ))}
        </group>
    );
}

export default function HeroGlobe() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
                </Canvas>
            </div>
        </div>
    )
}
