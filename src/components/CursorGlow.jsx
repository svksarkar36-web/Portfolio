"use client";
import { useEffect, useRef } from "react";

/**
 * CursorGlow — single-element soft blue glow that follows the cursor.
 * Adds .hover variant on interactive elements. Lazy + cheap (CSS only).
 */
export default function CursorGlow() {
    const glow = useRef(null);
    const dot = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const handleMove = (e) => {
            if (!glow.current || !dot.current) return;
            glow.current.style.left = `${e.clientX}px`;
            glow.current.style.top = `${e.clientY}px`;
            dot.current.style.left = `${e.clientX}px`;
            dot.current.style.top = `${e.clientY}px`;
            const interactive = e.target?.closest?.("a, button, input, textarea, [data-cursor-hover]");
            glow.current.classList.toggle("hover", Boolean(interactive));
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <>
            <div ref={glow} className="cursor-glow" aria-hidden />
            <div ref={dot} className="cursor-dot" aria-hidden />
        </>
    );
}
