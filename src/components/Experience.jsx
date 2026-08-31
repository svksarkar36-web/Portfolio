"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function Experience() {
    const { content } = useContent();
    const items = content.experience || [];

    return (
        <section id="experience" data-testid="experience-section" className="relative py-24 md:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-32">
                            <p className="eyebrow"><span className="dot" />Trajectory</p>
                            <h2 className="display text-white text-4xl md:text-5xl mt-4">The path here.</h2>
                            <p className="text-bone-300 mt-5 text-sm md:text-base leading-relaxed max-w-sm">
                                From geospatial QC and drone-imagery pipelines to AI-enabled product work — every step compounded.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-8 relative">
                        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-signal/60 via-white/10 to-transparent" />
                        <div className="space-y-12">
                            {items.map((x, i) => (
                                <motion.div
                                    key={`${x.role}-${i}`}
                                    initial={{ opacity: 0, x: 24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-10% 0px" }}
                                    transition={{ delay: i * 0.07, duration: 0.7 }}
                                    className="relative pl-10"
                                    data-testid={`exp-${i}`}
                                >
                                    <span className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-signal bg-ink-900" />
                                    <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-400">{x.period}</div>
                                    <h3 className="display text-white text-2xl md:text-3xl mt-1.5">{x.role}</h3>
                                    <div className="text-bone-200 mt-1 text-sm">
                                        <span className="text-white">{x.company}</span>
                                        <span className="text-bone-400"> · {x.location}</span>
                                    </div>

                                    <ul className="mt-5 space-y-2.5 text-bone-200 text-sm md:text-[15px] leading-relaxed max-w-2xl">
                                        {(x.bullets || []).map((b) => (
                                            <li key={b} className="flex gap-3">
                                                <span className="text-signal mt-1.5 w-3 h-px bg-signal flex-shrink-0" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {(x.impact || []).map((c) => (
                                            <span key={c} className="text-[11px] font-mono uppercase tracking-[0.15em] text-bone-300 border border-white/10 px-2.5 py-1 rounded-full">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
