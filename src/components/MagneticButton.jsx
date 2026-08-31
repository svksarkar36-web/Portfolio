"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * MagneticButton — subtle magnet pull on hover. Works for buttons and anchors.
 */
export default function MagneticButton({ children, as: Tag = "button", strength = 24, className = "", ...rest }) {
    const ref = useRef(null);
    const [t, setT] = useState({ x: 0, y: 0 });

    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        setT({ x, y });
    };
    const reset = () => setT({ x: 0, y: 0 });

    const MotionTag = motion[Tag] || motion.button;

    return (
        <MotionTag
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={reset}
            animate={{ x: t.x, y: t.y }}
            transition={{ type: "spring", stiffness: 250, damping: 22, mass: 0.4 }}
            className={`magnetic ${className}`}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
