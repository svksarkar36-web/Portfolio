"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

function Counter({ value, prefix = "", suffix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-15% 0px" });
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf;
        const start = performance.now();
        const dur = 1600;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * value));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value]);

    return (
        <span ref={ref} className="font-mono tabular-nums">
            {prefix}{n}{suffix}
        </span>
    );
}

export default function Metrics() {
    const { content } = useContent();
    const metrics = content.metrics || [];

    return (
        <section id="impact" data-testid="metrics-section" className="relative py-24 md:py-32 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
                    <div>
                        <p className="eyebrow"><span className="dot" />Control Room</p>
                        <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4 max-w-2xl">
                            Outcomes, <span className="text-signal">measured.</span>
                        </h2>
                    </div>
                    <p className="text-bone-300 max-w-sm text-sm md:text-base leading-relaxed">
                        Every product decision tied to a number. Below — the cleanest snapshot of the impact dial.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={`${m.label}-${i}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ delay: i * 0.08, duration: 0.6 }}
                            className="bg-ink-700 p-6 md:p-8 min-h-[180px] flex flex-col justify-between hover:bg-ink-600 transition-colors group"
                            data-testid={`metric-${i}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                                    M.{String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-dot" />
                            </div>
                            <div>
                                <div className="display text-4xl md:text-5xl text-white">
                                    <Counter value={Number(m.value) || 0} prefix={m.prefix || ""} suffix={m.suffix || ""} />
                                </div>
                                <div className="mt-3 text-bone-200 text-sm md:text-base font-medium">{m.label}</div>
                                <div className="mt-1 text-bone-400 text-xs">{m.note}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
