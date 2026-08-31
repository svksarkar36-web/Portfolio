"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";

export default function PrinciplesSection() {
    const { content } = useContent();
    const list = content.principles || [];
    return (
        <SectionShell
            id="section-principles"
            testId="principles-section"
            eyebrow="Product Principles · 04"
            title={<>How I make <span className="text-accent">decisions.</span></>}
            kicker="Four lines I default to when the trade-off isn't obvious."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {list.map((p, i) => (
                    <motion.div
                        key={p.k}
                        data-testid={`principle-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className="relative glass iridescent rounded-2xl p-7 md:p-8 group hover:bg-accent/[0.04] transition-colors"
                    >
                        <span className="display text-accent/30 text-7xl absolute -top-3 right-4 select-none">{String(i + 1).padStart(2, "0")}</span>
                        <p className="mono text-[10px] uppercase tracking-[0.3em] text-cyan">Principle</p>
                        <h3 className="display text-white text-2xl md:text-3xl mt-3 leading-tight">{p.k}.</h3>
                        <p className="text-text-muted text-sm md:text-base mt-4 leading-relaxed">{p.v}</p>
                    </motion.div>
                ))}
            </div>
        </SectionShell>
    );
}
