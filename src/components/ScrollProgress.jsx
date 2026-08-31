"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

    return (
        <motion.div
            data-testid="scroll-progress"
            style={{ scaleX: x, transformOrigin: "0% 50%" }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-signal z-[60]"
            aria-hidden="true"
        />
    );
}
