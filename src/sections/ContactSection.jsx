"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useContent } from "@/contexts/ContentContext";
import SectionShell from "@/components/SectionShell";

const API = "/api";

const BOOT = [
    "> initiate_connection()",
    "> establishing secure link …",
    "> AES-256 channel · ready",
    "> awaiting transmission_",
];

export default function ContactSection() {
    const { content } = useContent();
    const p = content.profile;
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [lines, setLines] = useState([]);
    const ref = useRef(null);

    // Typewriter boot when the section enters
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            let cancelled = false;
            const acc = [];
            (async () => {
                for (const l of BOOT) {
                    if (cancelled) return;
                    acc.push(l);
                    setLines([...acc]);
                    await new Promise((r) => setTimeout(r, 550));
                }
            })();
            obs.disconnect();
        }, { threshold: 0.3 });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error("Name, email and message are required"); return;
        }
        setSending(true);
        try {
            const res = await fetch(`${API}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, subject: form.subject || "Portfolio enquiry" }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success("Transmission received. Reply within 24h.");
            setSent(true);
            setTimeout(() => setForm({ name: "", email: "", subject: "", message: "" }), 1800);
        } catch (err) {
            toast.error(`Failed: ${err.message || "unknown"}`);
        } finally {
            setSending(false);
        }
    }

    return (
        <SectionShell
            id="section-contact"
            testId="contact-section"
            eyebrow="Communication Terminal · Secure"
            title={<>initiate<span className="text-accent">_</span>connection<span className="text-text-muted">()</span></>}
            kicker="The fastest way to reach me. No spam — direct reply within 24h."
        >
            <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-5">
                    {[
                        ["Email", p.email, `mailto:${p.email}`],
                        ["Phone", p.phone, `tel:${(p.phone || "").replace(/\s/g, "")}`],
                        ["LinkedIn", "linkedin.com/in/souvik", p.linkedin],
                        ["GitHub", "@svksarkar36-web", p.github],
                    ].map(([k, v, href]) => (
                        <a
                            key={k}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            data-testid={`contact-${k.toLowerCase()}`}
                            className="group flex items-baseline gap-5 hover:text-accent transition-colors"
                        >
                            <span className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted w-20">{k}</span>
                            <span className="link-underline text-base md:text-lg text-white group-hover:text-accent">{v}</span>
                        </a>
                    ))}
                </div>

                <form onSubmit={submit} className="lg:col-span-7 glass-strong iridescent rounded-2xl overflow-hidden" data-testid="contact-form">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/60">
                        <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                        </div>
                        <span className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted">souvik://terminal</span>
                    </div>

                    <div className="px-6 pt-5 mono text-xs text-success space-y-1 min-h-[110px]">
                        {lines.map((l, i) => (<div key={i}>{l}</div>))}
                        <span className="inline-block w-2 h-3 bg-success animate-pulse" />
                    </div>

                    <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field name="name" placeholder="Your name" value={form.name} onChange={onChange} testid="contact-input-name" />
                        <Field name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} testid="contact-input-email" />
                        <Field name="subject" placeholder="Subject" value={form.subject} onChange={onChange} testid="contact-input-subject" className="md:col-span-2" />
                        <textarea
                            name="message" rows={5} value={form.message} onChange={onChange}
                            placeholder="What are we building together?"
                            data-testid="contact-input-message"
                            className="md:col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted/60 focus:border-accent focus:outline-none resize-none mono text-sm"
                        />
                    </div>

                    <div className="px-6 pb-6 flex items-center justify-between flex-wrap gap-3">
                        <span className="mono text-[10px] uppercase tracking-[0.3em] text-text-muted">Encrypted · direct reply</span>
                        <motion.button
                            type="submit" disabled={sending}
                            data-testid="contact-submit-btn"
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-accent text-ink-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-60 shadow-[0_0_36px_-10px_rgba(59,130,246,0.8)]"
                        >
                            {sending ? "Transmitting…" : sent ? "Sent ✓" : "Send transmission"}
                            {!sending && !sent && <span aria-hidden>↗</span>}
                        </motion.button>
                    </div>
                </form>
            </div>
        </SectionShell>
    );
}

function Field({ name, placeholder, value, onChange, type = "text", testid, className = "" }) {
    return (
        <input
            type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
            data-testid={testid}
            className={`bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted/60 focus:border-accent focus:outline-none mono text-sm ${className}`}
        />
    );
}
