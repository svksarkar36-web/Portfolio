"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function About() {
    const { content } = useContent();
    const p = content.profile;
    const pillars = content.pillars || [];

    return (
        <section id="about" data-testid="about-section" className="relative py-24 md:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                    <p className="eyebrow"><span className="dot" />About</p>
                    <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4 leading-[0.95]">
                        Operator-turned-PM,
                        <br />
                        <span className="text-signal">obsessed with the seam.</span>
                    </h2>
                </div>

                <div className="lg:col-span-7 space-y-6 text-bone-200 text-base md:text-lg leading-relaxed">
                    <p>
                        I'm <span className="text-white font-semibold">{p.firstName}</span> — a product specialist at {p.company} based in {p.location}. I grew up in operations, processed thousands of drone-captured solar inspections, and translated the day-to-day grind into product roadmaps that actually moved metrics.
                    </p>
                    <p>
                        Today I own the lifecycle of fleet-tech surfaces — payments, compliance, incentives, AI-assisted automation — partnering with engineering, design and AI/ML to ship features users adopt without a tutorial.
                    </p>

                    {pillars.length > 0 && (
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                            {pillars.map((pl, i) => (
                                <motion.div
                                    key={pl.k}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10% 0px" }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className="border border-white/8 rounded-xl p-5 bg-ink-700/40 hover:border-signal/60 transition-colors"
                                    data-testid={`about-pillar-${i}`}
                                >
                                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal mb-2">
                                        0{i + 1} · {pl.k}
                                    </div>
                                    <p className="text-bone-200 text-sm leading-relaxed">{pl.v}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
