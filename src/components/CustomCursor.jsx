"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [hover, setHover] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const move = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);
            const el = e.target;
            if (!(el instanceof Element)) return;
            const interactive = el.closest(
                "a, button, input, textarea, [data-cursor-hover]"
            );
            setHover(Boolean(interactive));
        };
        const leave = () => setVisible(false);

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseleave", leave);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseleave", leave);
        };
    }, []);

    return (
        <div
            className={`cursor-dot ${hover ? "hover" : ""}`}
            style={{
                left: pos.x,
                top: pos.y,
                opacity: visible ? 1 : 0,
            }}
            aria-hidden="true"
        />
    );
}
