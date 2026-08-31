"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";

const FOCUS = [
    "Fleet Technology", "Marketplaces", "Workflow Automation",
    "AI Products", "GIS", "Analytics", "Data-driven Decisioning",
];

export default function IdentitySection() {
    const { content } = useContent();
    const p = content.profile;
    return (
        <SectionShell
            id="section-identity"
            testId="identity-section"
            eyebrow="Personnel · Operator OS"
            title={<>The operator behind the products.</>}
            kicker="Live personnel record. Read-only. Updated on launch."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="lg:col-span-5 glass iridescent rounded-2xl p-6 md:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Profile · 01</span>
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                    </div>
                    {[
                        ["Name", p.name],
                        ["Current Role", p.role],
                        ["Company", p.company],
                        ["Location", p.location],
                        ["Experience", "4+ years · Ops → Product"],
                        ["Education", "PG Diploma · Jadavpur University"],
                    ].map(([k, v]) => (
                        <div key={k} className="border-b border-white/5 last:border-0 py-3">
                            <div className="mono text-[10px] uppercase tracking-[0.25em] text-text-muted">{k}</div>
                            <div className="text-white text-base md:text-lg mt-1">{v}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Focus panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-7 glass rounded-2xl p-6 md:p-8 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-cyan">Current focus</span>
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Q1 2026</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                        {FOCUS.map((f, i) => (
                            <motion.div
                                key={f}
                                data-testid={`focus-${i}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 + 0.2, duration: 0.45 }}
                                className="group rounded-xl border border-white/8 bg-black/30 p-4 hover:border-accent/50 transition-colors cursor-default"
                                data-cursor-hover
                            >
                                <div className="mono text-[10px] uppercase tracking-[0.25em] text-accent">{String(i + 1).padStart(2, "0")}</div>
                                <div className="text-white text-sm md:text-base mt-2 group-hover:text-accent transition-colors">{f}</div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 text-text-muted text-sm leading-relaxed">
                        Currently shipping at <span className="text-white">{p.company}</span> — partnering with engineering, design and AI/ML to turn high-friction operational workflows into clean, scalable product surfaces.
                    </div>
                </motion.div>
            </div>
        </SectionShell>
    );
}
