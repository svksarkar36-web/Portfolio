"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";
import RoomShell from "@/components/RoomShell";

const LAYERS = [
    { k: "Overview",          v: (p) => p.summary },
    { k: "Problem",           v: (p) => `Friction in ${p.tag.toLowerCase()} — ${p.subtitle.toLowerCase()}.` },
    { k: "Discovery",         v: () => "Stakeholder interviews, ticket-mining and ops shadowing. Surfaced the latent jobs-to-be-done." },
    { k: "Research",          v: () => "Behavioural data + competitor teardown + lightweight surveys to triangulate the wedge." },
    { k: "User Journey",      v: () => "Mapped the full flow with personas, hand-offs and breakage points called out explicitly." },
    { k: "Business Rules",    v: () => "Logged invariants: SLAs, compliance gates, edge-cases. Engineering had zero surprise on day 1." },
    { k: "Wireframes",        v: () => "Low-fi → mid-fi → final. Designed alongside ops & support so adoption was non-negotiable." },
    { k: "Solution",          v: (p) => p.summary },
    { k: "Product Decisions", v: () => "Build vs buy, surface placement, instrumentation, fallback paths — every call documented." },
    { k: "Success Metrics",   v: (p) => (p.results || []).join(" · ") },
    { k: "Business Impact",   v: () => "Cleaner ops, faster reaction, compounding revenue. Foundation for the next set of bets." },
    { k: "Lessons Learned",   v: () => "Start with the workflow, not the screen. Ship a thin slice. Instrument before announcing." },
];

function ProjectTile({ p, i, onOpen }) {
    return (
        <motion.button
            data-testid={`product-${p.id}`}
            onClick={() => onOpen(p)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: i * 0.07, duration: 0.65 }}
            whileHover={{ y: -4 }}
            className="group relative text-left glass iridescent rounded-3xl overflow-hidden"
            data-cursor-hover
        >
            <div className="relative h-56 md:h-64 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                <span className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-cyan bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-cyan/30">
                    {p.tag}
                </span>
                <span className="absolute top-4 right-4 mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
                    P.0{i + 1}
                </span>
            </div>
            <div className="p-5 md:p-6">
                <div className="display text-white text-xl md:text-2xl group-hover:text-accent transition-colors">{p.title}</div>
                <div className="text-text-muted text-sm mt-1.5">{p.subtitle}</div>
                <div className="mt-5 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em]">
                    <span className="text-text-muted">View case study</span>
                    <span className="text-accent">→</span>
                </div>
            </div>
        </motion.button>
    );
}

function CaseStudyModal({ project, onClose }) {
    return (
        <RoomShell open={Boolean(project)} onClose={onClose} title={project?.title || ""} eyebrow={project ? `Case Study · ${project.tag}` : ""} testId="case-study-modal">
            {project && (
                <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden h-48 md:h-72">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
                    </div>
                    <p className="text-text text-lg leading-relaxed max-w-3xl">{project.subtitle}.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {LAYERS.map((l, i) => (
                            <motion.div
                                key={l.k}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="glass rounded-xl p-5"
                                data-testid={`layer-${l.k.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="mono text-[10px] uppercase tracking-[0.3em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="text-white font-semibold text-sm">{l.k}</span>
                                </div>
                                <p className="text-text-muted text-sm leading-relaxed">{l.v(project)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </RoomShell>
    );
}

export default function FeaturedProductsSection() {
    const { content } = useContent();
    const projects = (content.projects || []).slice(0, 5);
    const [active, setActive] = useState(null);

    return (
        <>
            <SectionShell
                id="section-products"
                testId="products-section"
                eyebrow="Featured Products · 05"
                title={<>The products. <span className="text-text-muted">In their own words.</span></>}
                kicker="Five products shipped end-to-end. Click any tile to enter the case study."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {projects.map((p, i) => (
                        <ProjectTile key={p.id} p={p} i={i} onOpen={setActive} />
                    ))}
                </div>
            </SectionShell>
            <AnimatePresence>
                {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
            </AnimatePresence>
        </>
    );
}
