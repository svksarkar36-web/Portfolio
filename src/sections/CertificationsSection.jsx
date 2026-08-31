"use client";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";

export default function CertificationsSection() {
    const { content } = useContent();
    const certs = content.certs || [];
    return (
        <SectionShell
            id="section-certifications"
            testId="certifications-section"
            eyebrow="Stamped · Verified"
            title={<>Certifications.</>}
            kicker="Programs that sharpened the operating system."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certs.map((c, i) => {
                    const [head, ...rest] = c.split(" — ");
                    const body = rest.join(" — ");
                    return (
                        <motion.div
                            key={`${c}-${i}`}
                            data-testid={`cert-${i}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ delay: i * 0.07, duration: 0.6 }}
                            className="group glass iridescent rounded-2xl p-6 hover:bg-accent/[0.06] transition-colors min-h-[200px] flex flex-col"
                            data-cursor-hover
                        >
                            <div className="flex items-center justify-between mb-5">
                                <span className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted">C.0{i + 1}</span>
                                <span className="text-cyan text-[10px] mono uppercase tracking-[0.2em]">Verified</span>
                            </div>
                            <div className="display text-white text-xl md:text-2xl leading-tight group-hover:text-accent transition-colors">
                                {head}
                            </div>
                            {body && (
                                <div className="text-text-muted text-sm mt-3">{body}</div>
                            )}
                            <div className="mt-auto pt-5 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" /> Active
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </SectionShell>
    );
}
