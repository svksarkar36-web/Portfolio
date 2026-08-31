"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionShell from "@/components/SectionShell";

const STEPS = [
    { id: "understand",  title: "Understand Problem",     body: "Pin down the real pain in one sentence. Customer pull, business value, urgency.", artifact: "Brief", tool: "Notion" },
    { id: "research",    title: "Research Users",         body: "Interviews, ticket review, shadowing ops. Hear the words before drawing the screen.", artifact: "Interview log", tool: "Dovetail" },
    { id: "discovery",   title: "Discovery",              body: "Jobs-to-be-done, competitor teardown, opportunity-solution tree.", artifact: "Map", tool: "Miro" },
    { id: "priority",    title: "Prioritization",         body: "RICE / ICE / opportunity scoring. Honest about confidence and cost.", artifact: "Matrix", tool: "Sheets" },
    { id: "prd",         title: "PRD",                    body: "Narrative + scope + success metric + open questions. Engineering reads it once.", artifact: "Spec", tool: "Notion" },
    { id: "design",      title: "Design Collaboration",   body: "Pair on flows. Critique early. Edge-cases > pixel-pushing.", artifact: "Flows", tool: "Figma" },
    { id: "eng",         title: "Engineering",            body: "Story writing, sprint planning, async standups, unblock fast.", artifact: "Stories", tool: "Jira" },
    { id: "release",     title: "Release",                body: "Beta → soft launch → GA. Instrument before announcing. Comms + support in lockstep.", artifact: "Plan", tool: "Linear" },
    { id: "measure",     title: "Measure",                body: "Activation, engagement, drop-off. Define the winning chart upfront.", artifact: "Dashboard", tool: "Mixpanel" },
    { id: "iterate",     title: "Iterate",                body: "Weekly metric review. Kill what doesn't work. Double down on what does.", artifact: "Review", tool: "Looker" },
];

export default function ThinkingSection() {
    const [active, setActive] = useState(0);
    const step = STEPS[active];
    return (
        <SectionShell
            id="section-thinking"
            testId="thinking-section"
            eyebrow="Operating System · Product Thinking"
            title={<>How I move from <span className="text-accent">problem</span> to <span className="text-cyan">scale.</span></>}
            kicker="A ten-stage loop. Tap any stage to see what gets produced, in which tool."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                    <ol className="relative space-y-1.5">
                        <div className="absolute left-[10px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-white/10 to-cyan/40" />
                        {STEPS.map((s, i) => (
                            <li key={s.id}>
                                <button
                                    onClick={() => setActive(i)}
                                    data-testid={`think-step-${s.id}`}
                                    data-cursor-hover
                                    className={`group w-full text-left flex items-center gap-4 pl-1 py-2.5 transition-colors ${active === i ? "text-white" : "text-text-muted hover:text-white"}`}
                                >
                                    <span className={`relative w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${active === i ? "border-accent bg-accent shadow-[0_0_18px_rgba(59,130,246,0.8)]" : "border-white/30 bg-[#050505] group-hover:border-accent/60"}`} />
                                    <span className="mono text-[10px] uppercase tracking-[0.25em] text-text-muted w-6">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="text-sm md:text-base font-medium">{s.title}</span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.45 }}
                            className="glass iridescent rounded-2xl p-7 md:p-10 sticky top-24"
                        >
                            <p className="mono text-[10px] uppercase tracking-[0.3em] text-accent">
                                Stage · {String(active + 1).padStart(2, "0")} / {STEPS.length}
                            </p>
                            <h3 className="display text-white text-3xl md:text-4xl mt-3">{step.title}.</h3>
                            <p className="mt-5 text-text text-base md:text-lg leading-relaxed">{step.body}</p>
                            <div className="mt-7 grid grid-cols-3 gap-3 mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                                <div className="border border-white/10 rounded-lg p-3">
                                    <div>Artifact</div>
                                    <div className="text-white mt-1 normal-case tracking-normal text-sm">{step.artifact}</div>
                                </div>
                                <div className="border border-white/10 rounded-lg p-3">
                                    <div>Tool</div>
                                    <div className="text-white mt-1 normal-case tracking-normal text-sm">{step.tool}</div>
                                </div>
                                <div className="border border-white/10 rounded-lg p-3">
                                    <div>Status</div>
                                    <div className="text-accent mt-1 normal-case tracking-normal text-sm">In motion</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </SectionShell>
    );
}
