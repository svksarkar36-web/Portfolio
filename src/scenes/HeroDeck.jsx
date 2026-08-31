"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import MagneticButton from "@/components/MagneticButton";

function Stat({ value, prefix = "", suffix = "" }) {
    const ref = useRef(null);
    const [n, setN] = useState(0);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            let raf;
            const start = performance.now();
            const tick = (t) => {
                const p = Math.min(1, (t - start) / 1700);
                const eased = 1 - Math.pow(1 - p, 3);
                setN(Math.round(eased * value));
                if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            obs.disconnect();
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [value]);
    return <span ref={ref} className="mono tabular-nums">{prefix}{n}{suffix}</span>;
}

export default function HeroDeck() {
    const { content } = useContent();
    const p = content.profile;
    const metrics = content.metrics || [];

    // depth parallax on scroll
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
    const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);

    return (
        <section
            ref={ref}
            id="hero"
            data-testid="hero-section"
            className="relative min-h-screen flex items-center justify-center px-5 md:px-10 pt-20 pb-8"
        >
            <motion.div style={{ y, scale, opacity }} className="relative w-full max-w-6xl">
                {/* glow */}
                <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.18)_0%,_transparent_70%)] blur-3xl" aria-hidden />

                <div className="relative glass-strong iridescent rounded-3xl overflow-hidden">
                    {/* terminal strip */}
                    <div className="flex items-center justify-between border-b border-white/8 px-6 md:px-8 py-3 mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
                                Online
                            </span>
                            <span className="hidden md:inline">PRODUCT_OS · v3.0</span>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <span>{p.location}</span>
                            <span>UTC+5:30</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-9">
                        <div className="lg:col-span-8">
                            <p className="eyebrow"><span className="dot" />Product Specialist · {p.company}</p>
                            <h1 className="display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 leading-[1.04]">
                                Turning operational <span className="text-text-muted">complexity</span> into
                                <span className="text-accent glow-blue"> scalable digital products.</span>
                            </h1>
                            <p className="mt-5 text-text text-sm md:text-base leading-relaxed max-w-2xl">
                                {p.intro}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <MagneticButton
                                    onClick={() => document.getElementById("section-products")?.scrollIntoView({ behavior: "smooth" })}
                                    data-testid="hero-explore-btn"
                                    className="inline-flex items-center gap-2 bg-accent text-ink-900 px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-accent-hover transition-colors shadow-[0_0_44px_-10px_rgba(59,130,246,0.8)]"
                                >
                                    Explore products <span aria-hidden>→</span>
                                </MagneticButton>
                                <MagneticButton
                                    onClick={() => document.getElementById("section-resume")?.scrollIntoView({ behavior: "smooth" })}
                                    data-testid="hero-resume-btn"
                                    className="inline-flex items-center gap-2 border border-white/15 text-white px-6 py-3.5 rounded-full font-medium text-sm hover:border-accent hover:text-accent transition-colors"
                                >
                                    View résumé <span aria-hidden>↗</span>
                                </MagneticButton>
                                <MagneticButton
                                    onClick={() => document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth" })}
                                    data-testid="hero-contact-btn"
                                    className="inline-flex items-center gap-2 text-text-muted px-6 py-3.5 rounded-full font-medium text-sm hover:text-white transition-colors"
                                >
                                    Initiate contact
                                </MagneticButton>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="rounded-2xl border border-white/8 bg-black/40 p-5 md:p-6 h-full">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="mono text-[10px] tracking-[0.3em] uppercase text-text-muted">Operator · 01</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                                </div>
                                {[
                                    ["Operator", p.firstName],
                                    ["Role", p.role],
                                    ["Company", p.company],
                                    ["Location", p.location],
                                    ["Domains", "Fleet · Marketplaces · AI · Ops"],
                                ].map(([k, v]) => (
                                    <div key={k} className="grid grid-cols-12 gap-3 py-2 items-baseline border-b border-white/5 last:border-0">
                                        <span className="col-span-5 mono text-[10px] uppercase tracking-[0.22em] text-text-muted">{k}</span>
                                        <span className="col-span-7 text-white text-sm">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats — real impact */}
                    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/8 divide-x divide-white/5">
                        {metrics.slice(0, 4).map((m, i) => (
                            <motion.div
                                key={`${m.label}-${i}`}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                                className="p-4 md:p-5"
                                data-testid={`hero-stat-${i}`}
                            >
                                <div className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted mb-1.5">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div className="display text-2xl md:text-3xl text-white glow-blue">
                                    {m.value > 1 ? (
                                        <Stat value={Number(m.value) || 0} prefix={m.prefix || ""} suffix={m.suffix || ""} />
                                    ) : (
                                        <span className="mono">{m.prefix}{m.label === "Enterprise AI Platform" ? "Fyn Guide" : m.value}{m.suffix}</span>
                                    )}
                                </div>
                                <div className="mt-1.5 text-white/90 text-sm font-medium">{m.label}</div>
                                <div className="text-text-muted text-xs mt-0.5">{m.note}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* scroll cue (fades out as user scrolls) */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 0.5, 0]) }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.4em] uppercase text-text-muted flex items-center gap-3 pointer-events-none"
            >
                <span className="w-10 h-px bg-text-muted/40" /> Scroll <span className="w-10 h-px bg-text-muted/40" />
            </motion.div>
        </section>
    );
}
