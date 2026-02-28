import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// A high-quality Atmospheric Shader
const AtmosphereMaterial = shaderMaterial(
  {
    color1: new THREE.Color('#00E0FF'), // Cyan
    color2: new THREE.Color('#00C27A'), // Emerald
    time: 0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Calculate atmospheric edge glow (Fresnel)
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      
      // Mix colors based on position to create a gradient atmosphere
      vec3 atmosphereColor = mix(color1, color2, (vPosition.y + 1.0) * 0.5);
      
      // Pulsating effect over time
      float pulse = sin(time * 2.0) * 0.1 + 0.9;
      
      gl_FragColor = vec4(atmosphereColor, 1.0) * intensity * pulse * 2.0;
    }
  `
)

const CoreGlobeMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#0E0F13'), // Very dark charcoal base
    color2: new THREE.Color('#1A1C23'), // Slightly lighter charcoal
  },
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    
    void main() {
      // Subtle gradient on the core globe
      vec3 base = mix(color1, color2, vUv.y);
      gl_FragColor = vec4(base, 1.0);
    }
  `
)

extend({ AtmosphereMaterial, CoreGlobeMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    atmosphereMaterial: any
    coreGlobeMaterial: any
  }
}

export { AtmosphereMaterial, CoreGlobeMaterial }
