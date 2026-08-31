"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionShell from "@/components/SectionShell";

const ROWS = [
    { id: "driver",   label: "Driver Onboarding Revamp", metric: "+50%", note: "efficiency uplift", bar: 92 },
    { id: "fyn",      label: "Fyn Guide · Enterprise Learning", metric: "AI", note: "multilingual self-serve", bar: 78 },
    { id: "site",     label: "Company Website Redesign", metric: "↗", note: "B2B-ready surface", bar: 64 },
    { id: "ops",      label: "Operational Workflow Automation", metric: "auto", note: "exception-led ops", bar: 70 },
    { id: "mrr",      label: "B2B + B2C Product Initiatives", metric: "₹20L", note: "monthly recurring", bar: 88 },
];

function Bar({ to }) {
    const ref = useRef(null);
    const [w, setW] = useState(0);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setW(to); obs.disconnect(); }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [to]);
    return (
        <div ref={ref} className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
                animate={{ width: `${w}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-cyan to-highlight rounded-full"
                style={{ boxShadow: "0 0 18px rgba(59,130,246,0.7)" }}
            />
        </div>
    );
}

export default function ImpactSection() {
    return (
        <SectionShell
            id="section-impact"
            testId="impact-section"
            eyebrow="Live Dashboard · Current Impact"
            title={<>Outcomes, <span className="text-accent">measured.</span></>}
            kicker="Every initiative tied to a number. This is what's running today."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* main rows */}
                <div className="lg:col-span-8 glass rounded-2xl p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Throughput · 30d</span>
                        <span className="mono text-[10px] tracking-[0.3em] uppercase text-success">▲ live</span>
                    </div>
                    {ROWS.map((r, i) => (
                        <motion.div
                            key={r.id}
                            data-testid={`impact-${r.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            className="space-y-1.5 pb-2 border-b border-white/5 last:border-0"
                        >
                            <div className="flex items-baseline justify-between gap-4">
                                <div>
                                    <div className="text-white text-sm md:text-base">{r.label}</div>
                                    <div className="text-text-muted text-xs">{r.note}</div>
                                </div>
                                <div className="mono text-accent text-lg md:text-xl glow-blue">{r.metric}</div>
                            </div>
                            <Bar to={r.bar} />
                        </motion.div>
                    ))}
                </div>

                {/* right column: revenue card */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass iridescent rounded-2xl p-6 flex flex-col justify-between min-h-[200px]"
                    >
                        <div>
                            <div className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Monthly Revenue</div>
                            <div className="display text-white text-5xl glow-blue mt-3">₹20L</div>
                            <div className="text-text-muted text-sm mt-2">B2B + B2C product initiatives</div>
                        </div>
                        <div className="mt-6 flex items-center gap-3 mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                            <span className="text-success">▲ 12%</span> vs prior quarter
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-2xl p-6"
                    >
                        <div className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Active surfaces</div>
                        <div className="mt-4 space-y-2.5 text-sm">
                            {["Driver lifecycle", "Fleet ops cockpit", "Buyer enquiry", "Fyn Guide"].map((s) => (
                                <div key={s} className="flex items-center gap-3 text-white">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </SectionShell>
    );
}
