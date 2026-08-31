"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";
import MagneticButton from "@/components/MagneticButton";

export default function ResumeSection() {
    const { content } = useContent();
    const p = content.profile;
    const [open, setOpen] = useState(false);

    return (
        <SectionShell
            id="section-resume"
            testId="resume-section"
            eyebrow="Résumé · Notion-style viewer"
            title={<>The full file.</>}
            kicker="Preview inline. Download or print without leaving the site."
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="glass iridescent rounded-3xl overflow-hidden"
            >
                {/* toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                        <span className="display text-white text-base">{p.name} · résumé.pdf</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MagneticButton
                            onClick={() => setOpen((o) => !o)}
                            data-testid="resume-preview-btn"
                            className="text-xs mono uppercase tracking-[0.2em] text-text-muted hover:text-accent px-3 py-2 border border-white/10 rounded-full hover:border-accent/40 transition-colors"
                        >
                            {open ? "Hide" : "Preview"}
                        </MagneticButton>
                        <MagneticButton
                            as="a"
                            href={p.resumeUrl}
                            download
                            data-testid="resume-download-btn"
                            className="text-xs mono uppercase tracking-[0.2em] text-ink-900 bg-accent hover:bg-accent-hover px-3 py-2 rounded-full transition-colors"
                        >
                            Download ↓
                        </MagneticButton>
                        <MagneticButton
                            onClick={() => window.open(p.resumeUrl, "_blank")?.print?.()}
                            data-testid="resume-print-btn"
                            className="text-xs mono uppercase tracking-[0.2em] text-text-muted hover:text-accent px-3 py-2 border border-white/10 rounded-full hover:border-accent/40 transition-colors"
                        >
                            Print ⎙
                        </MagneticButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Notion-style sidebar summary */}
                    <div className="lg:col-span-4 border-r border-white/8 p-6 md:p-7 space-y-4">
                        {[
                            ["Operator", p.name],
                            ["Role", p.role],
                            ["Company", p.company],
                            ["Location", p.location],
                            ["Email", p.email],
                            ["LinkedIn", "linkedin.com/in/souvik"],
                            ["GitHub", "@svksarkar36-web"],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <div className="mono text-[10px] uppercase tracking-[0.25em] text-text-muted">{k}</div>
                                <div className="text-white text-sm mt-1 truncate">{v}</div>
                            </div>
                        ))}
                    </div>

                    {/* PDF viewer / preview */}
                    <div className="lg:col-span-8 min-h-[420px] relative bg-black/40">
                        {open ? (
                            <iframe
                                src={`${p.resumeUrl}#toolbar=0&navpanes=0`}
                                title="Resume"
                                data-testid="resume-iframe"
                                className="w-full h-[720px] bg-white"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[420px] p-8 text-center">
                                <div className="mono text-[10px] uppercase tracking-[0.3em] text-cyan">PDF · 1 page</div>
                                <h4 className="display text-white text-2xl md:text-3xl mt-3 max-w-md">
                                    Click <span className="text-accent">Preview</span> to read inline,<br />or download a copy.
                                </h4>
                                <p className="mt-4 text-text-muted text-sm max-w-sm">
                                    The full PDF opens here without leaving the page. Print directly from your browser.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </SectionShell>
    );
}
