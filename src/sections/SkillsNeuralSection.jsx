"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionShell from "@/components/SectionShell";

const NODES = [
    { id: "strategy", label: "Product Strategy", x: 50, y: 18, projects: "Fyn Mobility roadmap, Cross-functional planning" },
    { id: "roadmaps", label: "Roadmaps",        x: 78, y: 28, projects: "Quarterly product roadmaps at Fyn & Zeitview" },
    { id: "discovery",label: "Discovery",       x: 88, y: 50, projects: "Driver Onboarding · Buyer Enquiry · Fyn Guide" },
    { id: "research", label: "User Research",   x: 78, y: 72, projects: "Driver interviews, ops shadowing at scale" },
    { id: "analytics",label: "Analytics",       x: 50, y: 82, projects: "Mixpanel funnels, retention dashboards" },
    { id: "sql",      label: "SQL",             x: 22, y: 72, projects: "Self-serve queries for product + ops" },
    { id: "ai",       label: "AI",              x: 12, y: 50, projects: "Fyn Guide (multilingual AI) · Inspection AI at Zeitview" },
    { id: "gis",      label: "GIS",             x: 22, y: 28, projects: "California solar inspection, drone imagery QC" },
    { id: "jira",     label: "Jira",            x: 35, y: 8,  projects: "Sprint planning, story writing daily" },
    { id: "figma",    label: "Figma",           x: 65, y: 8,  projects: "Design collaboration on Driver / Fyn Guide" },
    { id: "stake",    label: "Stakeholder Mgmt",x: 42, y: 50, projects: "Eng, AI/ML, Design, Ops, Support — daily" },
];

export default function SkillsNeuralSection() {
    const [hover, setHover] = useState(null);
    const active = NODES.find((n) => n.id === hover);

    return (
        <SectionShell
            id="section-skills"
            testId="skills-section"
            eyebrow="Toolkit · Neural Map"
            title={<>One brain, <span className="text-accent">eleven wires.</span></>}
            kicker="Hover any node to see where it shows up in real product work."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                    <div className="relative w-full aspect-square max-w-[640px] mx-auto">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            {NODES.map((n) => (
                                <line
                                    key={n.id}
                                    x1="50" y1="50" x2={n.x} y2={n.y}
                                    stroke={hover === n.id ? "#3B82F6" : "#3B82F6"}
                                    strokeOpacity={hover ? (hover === n.id ? 0.9 : 0.15) : 0.4}
                                    strokeWidth={hover === n.id ? 0.4 : 0.18}
                                    strokeDasharray={hover === n.id ? "0" : "0.6 0.8"}
                                />
                            ))}
                        </svg>
                        {/* core */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full glass-strong iridescent"
                        >
                            <span className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse-dot" />
                        </motion.div>
                        {/* nodes */}
                        {NODES.map((n, i) => (
                            <motion.button
                                key={n.id}
                                data-testid={`neural-${n.id}`}
                                onMouseEnter={() => setHover(n.id)}
                                onMouseLeave={() => setHover(null)}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.04, type: "spring" }}
                                whileHover={{ scale: 1.18 }}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                                data-cursor-hover
                            >
                                <span className="absolute inset-0 rounded-full bg-accent/40 blur-md opacity-70" />
                                <span className={`relative inline-block text-xs px-3 py-1.5 rounded-full transition-colors ${hover === n.id ? "glass-strong border border-accent text-white" : "glass border border-cyan/30 text-cyan"}`}>
                                    {n.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="glass iridescent rounded-2xl p-7">
                        <div className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted">Skill detail</div>
                        <h3 className="display text-white text-3xl md:text-4xl mt-2">
                            {active ? active.label : "Hover a node."}
                        </h3>
                        <p className="text-text-muted mt-5 text-base leading-relaxed">
                            {active ? "Where this shows up in real product work:" : "Each node lights up the real projects it powered."}
                        </p>
                        {active && (
                            <p className="mt-4 text-white text-base leading-relaxed">{active.projects}</p>
                        )}
                    </div>
                </div>
            </div>
        </SectionShell>
    );
}
