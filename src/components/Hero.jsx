"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

const lineUp = {
    hidden: { y: "110%", opacity: 0 },
    show: (i) => ({
        y: 0,
        opacity: 1,
        transition: { delay: 0.05 + i * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function Hero() {
    const { content } = useContent();
    const p = content.profile;
    const firstName = p.firstName || (p.name || "").split(" ")[0] || "";
    const lastName = (p.name || "").split(" ").slice(1).join(" ") || "";

    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative min-h-screen flex flex-col justify-end pb-16 pt-32 hero-glow"
        >
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-12 md:mb-20"
                >
                    <p className="eyebrow"><span className="dot" />Available for product roles</p>
                    <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-bone-300">
                        <span>{p.location}</span>
                        <span className="w-1 h-1 rounded-full bg-bone-400" />
                        <span>IST · UTC+5:30</span>
                    </div>
                </motion.div>

                <h1 className="display text-white text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9rem] xl:text-[11rem]">
                    <span className="block overflow-hidden">
                        <motion.span variants={lineUp} custom={0} initial="hidden" animate="show" className="block">
                            {firstName}
                        </motion.span>
                    </span>
                    <span className="block overflow-hidden">
                        <motion.span variants={lineUp} custom={1} initial="hidden" animate="show" className="block">
                            {lastName}<span className="text-signal">.</span>
                        </motion.span>
                    </span>
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end"
                >
                    <div className="md:col-span-7">
                        <p className="text-bone-200 text-lg md:text-xl leading-relaxed max-w-xl">{p.tagline}</p>
                        <p className="mt-4 text-bone-400 text-sm max-w-xl">{p.intro}</p>
                    </div>
                    <div className="md:col-span-5 flex flex-col md:items-end gap-5">
                        <div className="flex flex-col font-mono text-[11px] uppercase tracking-[0.25em] text-bone-300 md:items-end">
                            <span className="text-bone-400">Currently</span>
                            <span className="text-white mt-1">{p.role} · {p.company}</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <a href={p.resumeUrl} download data-testid="hero-resume-btn"
                                className="inline-flex items-center gap-2 bg-signal text-ink-900 px-5 py-3 rounded-full font-semibold text-sm hover:bg-signal-hover transition-all hover:translate-y-[-1px]">
                                Download Resume <span aria-hidden>↓</span>
                            </a>
                            <a href="#contact" data-testid="hero-contact-btn"
                                className="inline-flex items-center gap-2 border border-white/15 text-white px-5 py-3 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors">
                                Get in touch
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="mt-16 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 relative z-10">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400">
                    <span className="block w-10 h-px bg-bone-500" />
                    <span>Scroll · 01 / 07</span>
                </div>
            </motion.div>
        </section>
    );
}
