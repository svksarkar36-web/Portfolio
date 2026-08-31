"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function NotableWork() {
    const { content } = useContent();
    const items = content.notable || [];

    return (
        <section id="notable" data-testid="notable-section" className="relative py-24 md:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <p className="eyebrow"><span className="dot" />Highlights</p>
                        <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4">Notable work.</h2>
                    </div>
                    <p className="text-bone-300 max-w-sm text-sm md:text-base leading-relaxed">
                        Smaller bets, outsized impact. Moves that quietly compounded into the metrics above.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    {items.map((n, i) => (
                        <motion.article
                            key={n.id || i}
                            data-testid={`notable-${n.id}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ delay: i * 0.08, duration: 0.6 }}
                            className="group bg-ink-700 p-7 md:p-8 flex flex-col gap-5 hover:bg-ink-600 transition-colors cursor-default min-h-[320px]"
                            data-cursor-hover
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                                    NW.{String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-bone-300 border border-white/10 px-2.5 py-1 rounded-full">
                                    {n.tag}
                                </span>
                            </div>

                            <div>
                                <div className="display text-5xl md:text-6xl text-signal leading-none">{n.metric}</div>
                                <div className="text-bone-400 text-xs font-mono uppercase tracking-[0.25em] mt-2">
                                    {n.metricLabel}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <h3 className="display text-white text-xl md:text-2xl group-hover:text-signal transition-colors">{n.title}</h3>
                                <p className="text-bone-300 text-sm leading-relaxed mt-3">{n.summary}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {(n.chips || []).map((c) => (
                                        <span key={c} className="text-[10px] font-mono uppercase tracking-[0.15em] text-bone-300 border border-white/10 px-2 py-0.5 rounded-full">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
