"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

/**
 * LoadingScene — full-screen cinematic intro.
 * Stage 0: tiny blue spark
 * Stage 1: particles emerge & assemble into a glowing sphere
 * Stage 2: sphere explodes into thousands of particles
 * Stage 3: name + tagline fade in
 * Stage 4: scene clears, calls onComplete
 */

function AssemblingSphere({ stage, onPulse }) {
    const ref = useRef();
    const count = 2200;

    // Random outer positions + target sphere positions
    const { outer, sphere } = useMemo(() => {
        const o = new Float32Array(count * 3);
        const s = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 6 + Math.random() * 5;
            const t = Math.random() * Math.PI * 2;
            const p = Math.acos(2 * Math.random() - 1);
            o[i * 3] = r * Math.sin(p) * Math.cos(t);
            o[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
            o[i * 3 + 2] = r * Math.cos(p);
            const sr = 1.4;
            s[i * 3] = sr * Math.sin(p) * Math.cos(t);
            s[i * 3 + 1] = sr * Math.sin(p) * Math.sin(t);
            s[i * 3 + 2] = sr * Math.cos(p);
        }
        return { outer: o, sphere: s };
    }, []);

    const positions = useRef(new Float32Array(outer));
    const explosionVel = useRef(new Float32Array(count * 3));

    useFrame((state, dt) => {
        const arr = positions.current;
        if (stage === 1) {
            // Lerp outer → sphere
            for (let i = 0; i < arr.length; i++) {
                arr[i] += (sphere[i] - arr[i]) * Math.min(1, dt * 1.6);
            }
        } else if (stage === 2) {
            // Pulse + explosion outward
            for (let i = 0; i < count; i++) {
                if (explosionVel.current[i * 3] === 0 && explosionVel.current[i * 3 + 1] === 0 && explosionVel.current[i * 3 + 2] === 0) {
                    const x = arr[i * 3], y = arr[i * 3 + 1], z = arr[i * 3 + 2];
                    const len = Math.sqrt(x * x + y * y + z * z) || 1;
                    const sp = 2.4 + Math.random() * 1.6;
                    explosionVel.current[i * 3] = (x / len) * sp;
                    explosionVel.current[i * 3 + 1] = (y / len) * sp;
                    explosionVel.current[i * 3 + 2] = (z / len) * sp;
                }
                arr[i * 3] += explosionVel.current[i * 3] * dt;
                arr[i * 3 + 1] += explosionVel.current[i * 3 + 1] * dt;
                arr[i * 3 + 2] += explosionVel.current[i * 3 + 2] * dt;
            }
        }
        if (ref.current) {
            ref.current.geometry.attributes.position.needsUpdate = true;
            ref.current.rotation.y += dt * 0.18;
        }
    });

    // Trigger pulse callback once
    useEffect(() => {
        if (stage === 2 && onPulse) onPulse();
    }, [stage, onPulse]);

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={stage >= 1 ? 0.035 : 0.08}
                color={stage === 0 ? "#3B82F6" : "#7DD3FC"}
                sizeAttenuation
                transparent
                opacity={stage === 4 ? 0 : 0.95}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function CoreGlow({ visible }) {
    const ref = useRef();
    useFrame((s) => {
        if (!ref.current) return;
        const k = visible ? 1 : 0;
        ref.current.scale.setScalar(0.6 + Math.sin(s.clock.elapsedTime * 2) * 0.05 + k * 0.4);
        ref.current.material.opacity = visible ? 0.85 : 0;
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshBasicMaterial color="#3B82F6" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
    );
}

export default function LoadingScene({ onComplete }) {
    const { content } = useContent();
    const name = content.profile?.name || "Souvik Sarkar";
    const [stage, setStage] = useState(0);

    useEffect(() => {
        // 0 spark, 1 assemble, 2 explode, 3 title, 4 fade
        const t1 = setTimeout(() => setStage(1), 700);
        const t2 = setTimeout(() => setStage(2), 2200);
        const t3 = setTimeout(() => setStage(3), 3300);
        const t4 = setTimeout(() => setStage(4), 5300);
        const t5 = setTimeout(() => onComplete?.(), 6100);
        return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: stage === 4 ? 0 : 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
            data-testid="loading-scene"
        >
            <div className="absolute inset-0">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 55 }}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                    dpr={[1, 1.5]}
                >
                    <ambientLight intensity={0.3} />
                    <CoreGlow visible={stage >= 1 && stage < 2} />
                    <AssemblingSphere stage={stage} />
                </Canvas>
            </div>

            {/* Initial tiny spark */}
            <AnimatePresence>
                {stage === 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-3 h-3 rounded-full bg-accent shadow-[0_0_40px_rgba(59,130,246,0.9)]"
                    />
                )}
            </AnimatePresence>

            {/* Title reveal */}
            <AnimatePresence>
                {stage >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative text-center px-6"
                        data-testid="loading-title"
                    >
                        <div className="mono text-[10px] tracking-[0.5em] text-text-muted uppercase mb-6">
                            <span className="inline-block w-8 h-px bg-accent align-middle mr-3" />
                            Initialising experience
                        </div>
                        <h1 className="display text-white text-5xl md:text-7xl lg:text-8xl glow-blue tracking-tight">
                            {name.toUpperCase()}
                        </h1>
                        <p className="mt-6 text-text-muted text-lg md:text-2xl">
                            Building products. <span className="text-highlight">Not features.</span>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle scanlines + vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.85)_100%)]" />
        </motion.div>
    );
}
