"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function CaseStudies() {
    const { content } = useContent();
    const items = content.projects || [];

    return (
        <section id="work" data-testid="case-studies-section" className="relative py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <p className="eyebrow"><span className="dot" />Selected Work</p>
                        <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4">Projects.</h2>
                    </div>
                    <p className="text-bone-300 max-w-sm text-sm md:text-base leading-relaxed">
                        Flagship products. Real users. Real metrics. Hover any card to peek behind the curtain.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:auto-rows-[280px]">
                    {items.map((c, i) => (
                        <motion.article
                            key={c.id || i}
                            data-testid={`case-${c.id}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className={`relative overflow-hidden rounded-2xl border border-white/8 bg-ink-700 group cursor-pointer ${c.span || "lg:col-span-6 lg:row-span-2"}`}
                            data-cursor-hover
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={c.image}
                                    alt={c.title}
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/10" />
                            </div>

                            <div className="relative z-10 p-6 md:p-7 flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-300 bg-ink-900/60 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                                    {c.tag}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                                    0{i + 1}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 z-10">
                                <h3 className="display text-white text-2xl md:text-3xl leading-tight">{c.title}</h3>
                                <p className="text-bone-300 text-sm mt-2">{c.subtitle}</p>

                                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                                    <div className="overflow-hidden">
                                        <p className="pt-4 text-bone-200 text-sm leading-relaxed max-w-prose">{c.summary}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(c.results || []).map((r) => (
                                                <span key={r} className="text-[11px] font-mono uppercase tracking-[0.15em] text-signal border border-signal/40 px-2.5 py-1 rounded-full bg-signal/5">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="w-9 h-9 rounded-full bg-signal text-ink-900 flex items-center justify-center text-lg font-bold">→</span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
