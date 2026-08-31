"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

export default function Skills() {
    const { content } = useContent();
    const product = content.skills_product || [];
    const data = content.skills_data || [];
    const tools = content.skills_tools || [];
    const education = content.education || [];
    const certs = content.certs || [];

    const groups = [
        { title: "Product", items: product },
        { title: "Data & Analytics", items: data },
        { title: "Tools", items: tools },
    ];

    return (
        <section id="skills" data-testid="skills-section" className="relative py-24 md:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <p className="eyebrow"><span className="dot" />Toolkit</p>
                        <h2 className="display text-white text-4xl md:text-5xl mt-4">How I ship.</h2>
                        <p className="text-bone-300 mt-5 text-sm md:text-base leading-relaxed max-w-md">
                            Frameworks, instrumentation, and the soft skills that hold cross-functional teams together. The kit gets sharper every quarter.
                        </p>

                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/8 bg-ink-700 py-4">
                            <div className="marquee-track gap-10 px-6">
                                {[...product, ...data, ...tools, ...product].map((s, idx) => (
                                    <span key={`${s}-${idx}`} className="font-mono text-xs uppercase tracking-[0.25em] text-bone-300 whitespace-nowrap">
                                        {s}<span className="text-signal mx-6">•</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-10">
                        {groups.map((g, gi) => (
                            <motion.div
                                key={g.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10% 0px" }}
                                transition={{ delay: gi * 0.07, duration: 0.6 }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400">
                                        0{gi + 1} / {groups.length}
                                    </span>
                                    <span className="h-px flex-1 bg-white/10" />
                                    <span className="text-bone-300 text-sm">{g.title}</span>
                                </div>
                                <div className="flex flex-wrap gap-2.5" data-testid={`skill-group-${gi}`}>
                                    {g.items.map((s) => (
                                        <span key={s} data-cursor-hover className="px-4 py-2 rounded-full border border-white/10 text-bone-200 text-sm hover:border-signal hover:text-signal transition-colors duration-300 cursor-default">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7">
                        <p className="eyebrow"><span className="dot" />Education</p>
                        <h3 className="display text-white text-3xl md:text-4xl mt-3">Foundations.</h3>
                        <div className="mt-8 divide-y divide-white/5 border-y border-white/5">
                            {education.map((e, i) => (
                                <motion.div
                                    key={`${e.title}-${i}`}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="py-5 grid grid-cols-12 gap-4 items-baseline group"
                                    data-testid={`edu-${i}`}
                                >
                                    <span className="col-span-4 md:col-span-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-400">{e.period}</span>
                                    <div className="col-span-8 md:col-span-9">
                                        <div className="text-white text-base md:text-lg group-hover:text-signal transition-colors">{e.title}</div>
                                        <div className="text-bone-400 text-sm">{e.org}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <p className="eyebrow"><span className="dot" />Certifications</p>
                        <h3 className="display text-white text-3xl md:text-4xl mt-3">Stamped.</h3>
                        <ul className="mt-8 space-y-3">
                            {certs.map((c, i) => (
                                <motion.li
                                    key={`${c}-${i}`}
                                    initial={{ opacity: 0, x: 16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3 text-bone-200 text-sm md:text-[15px]"
                                    data-testid={`cert-${i}`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                                    {c}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
