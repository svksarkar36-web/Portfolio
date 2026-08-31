"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Ambient 3D space backdrop — drifting particle field + slow rotating fog ring.
 * Lightweight: no expensive post-processing, single InstancedMesh.
 */

function ParticleField({ count = 1400 }) {
    const ref = useRef();
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 6 + Math.random() * 14;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return arr;
    }, [count]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta * 0.02;
        ref.current.rotation.x += delta * 0.008;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                color="#7DD3FC"
                sizeAttenuation
                transparent
                opacity={0.85}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function NebulaRing() {
    const ref = useRef();
    useFrame((s, dt) => {
        if (!ref.current) return;
        ref.current.rotation.z += dt * 0.04;
    });
    return (
        <mesh ref={ref} position={[0, 0, -8]}>
            <ringGeometry args={[3.6, 7, 64]} />
            <meshBasicMaterial
                color="#3B82F6"
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function SpaceBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none" data-testid="space-bg">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                <color attach="background" args={["#050505"]} />
                <fog attach="fog" args={["#050505", 6, 22]} />
                <ParticleField />
                <NebulaRing />
            </Canvas>
            {/* faint static grid floor */}
            <div className="absolute inset-0 grid-floor opacity-50" />
            {/* vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />
        </div>
    );
}
