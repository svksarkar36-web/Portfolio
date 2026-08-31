"use client";
import { motion } from "framer-motion";

/**
 * SectionShell — full-viewport block with an eyebrow + heading + slot.
 * Provides the cinematic "entering a new workspace" feel.
 */
export default function SectionShell({ id, eyebrow, title, kicker, children, testId, dense = false }) {
    return (
        <section
            id={id}
            data-testid={testId}
            className={`relative min-h-screen flex flex-col justify-center px-5 md:px-10 ${dense ? "py-16" : "py-24 md:py-28"}`}
        >
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-10 md:mb-14"
                >
                    {eyebrow && <p className="eyebrow"><span className="dot" />{eyebrow}</p>}
                    {title && (
                        <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4 max-w-4xl leading-[1.04]">
                            {title}
                        </h2>
                    )}
                    {kicker && <p className="mt-5 text-text-muted text-base md:text-lg max-w-2xl">{kicker}</p>}
                </motion.div>

                {children}
            </div>
        </section>
    );
}
