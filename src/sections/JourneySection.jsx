"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionShell from "@/components/SectionShell";

const STOPS = [
    {
        id: "renewables", title: "Renewable Energy", role: "Domain · 2022",
        achievements: ["California solar inspection (CASS)", "Drone + aerial imagery QC", "Repeatable QC pipeline"],
        learning: "Operations is product. Workflow design beats heroics.",
    },
    {
        id: "gis", title: "GIS Analyst", role: "Zeitview · Jul 2022 – Jan 2023",
        achievements: ["Geospatial analysis at scale", "QC workflows that reduced rework", "Solar asset thermal review"],
        learning: "Data quality is a product decision. Clean inputs compound forever.",
    },
    {
        id: "senior", title: "Senior Engineer", role: "Zeitview · Feb 2023 – Mar 2024",
        achievements: ["AI-assisted inspection platform", "Process automation rollout", "Annotation pipeline uplift"],
        learning: "Ops insights translated into product specs is the highest-leverage skill.",
    },
    {
        id: "ops", title: "Operations Lead", role: "Zeitview · Apr 2024 – Sep 2025",
        achievements: ["APAC delivery programs", "Cross-functional roadmap influence", "Automation that scaled"],
        learning: "Lead with metrics. The team trusts numbers more than narratives.",
    },
    {
        id: "specialist", title: "Product Specialist", role: "Fyn Mobility · Sep 2025 – Now",
        achievements: ["Driver onboarding +50%", "Fyn Guide multilingual AI KB", "₹20L MRR initiatives"],
        learning: "Operational simplicity is the moat. Reduce decisions, not just clicks.",
    },
];

export default function JourneySection() {
    const [active, setActive] = useState(STOPS.length - 1);
    const s = STOPS[active];
    return (
        <SectionShell
            id="section-journey"
            testId="journey-section"
            eyebrow="Career Journey · Operator Path"
            title={<>From <span className="text-text-muted">grids</span> to <span className="text-accent">products.</span></>}
            kicker="Five stops. Every move compounded into the operator the products needed."
        >
            {/* Line map */}
            <div className="relative mb-12">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-accent/10 via-accent/50 to-cyan/50" />
                <div className="relative grid grid-cols-5 gap-2">
                    {STOPS.map((st, i) => (
                        <button
                            key={st.id}
                            onClick={() => setActive(i)}
                            data-testid={`journey-${st.id}`}
                            className="group flex flex-col items-center"
                            data-cursor-hover
                        >
                            <motion.span
                                whileHover={{ scale: 1.3 }}
                                className={`w-5 h-5 rounded-full border-2 transition-all ${active === i ? "border-accent bg-accent shadow-[0_0_24px_rgba(59,130,246,0.8)]" : "border-white/30 bg-[#050505]"}`}
                            />
                            <div className="mt-4 text-center px-1">
                                <div className={`text-xs md:text-sm ${active === i ? "text-white" : "text-text-muted group-hover:text-white"} transition-colors`}>
                                    {st.title}
                                </div>
                                <div className="mono text-[9px] uppercase tracking-[0.2em] text-text-muted/70 mt-1">{st.role}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Workspace */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5 }}
                    className="glass iridescent rounded-2xl p-7 md:p-10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-5">
                            <p className="mono text-[10px] uppercase tracking-[0.3em] text-cyan">{s.role}</p>
                            <h3 className="display text-white text-3xl md:text-4xl mt-3">{s.title}.</h3>
                            <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4">
                                <div className="mono text-[10px] uppercase tracking-[0.3em] text-accent mb-1.5">Learning</div>
                                <p className="text-white text-sm md:text-base leading-relaxed">{s.learning}</p>
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted mb-3">Achievements</div>
                            <ul className="space-y-3 text-text-muted text-sm md:text-[15px] leading-relaxed">
                                {s.achievements.map((a, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="flex gap-3"
                                    >
                                        <span className="text-accent mt-2 w-4 h-px bg-accent flex-shrink-0" />
                                        <span>{a}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </SectionShell>
    );
}
