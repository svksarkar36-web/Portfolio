"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useContent } from "@/contexts/ContentContext";

const API = "/api";

export default function Contact() {
    const { content } = useContent();
    const PROFILE = content.profile;
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (sending) return;
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error("Please fill in name, email and message.");
            return;
        }
        setSending(true);
        try {
            const res = await fetch(`${API}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    subject: form.subject || "Portfolio enquiry",
                    message: form.message,
                }),
            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || "Request failed");
            }
            toast.success("Message sent. I'll reply within 24h.");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(`Could not send. ${err.message || ""}`.trim());
        } finally {
            setSending(false);
        }
    };

    return (
        <section
            id="contact"
            data-testid="contact-section"
            className="relative py-24 md:py-32 border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left */}
                <div className="lg:col-span-5">
                    <p className="eyebrow"><span className="dot" />Let's Talk</p>
                    <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4 leading-[0.95]">
                        Got a product
                        <br />
                        <span className="text-signal">worth shipping?</span>
                    </h2>
                    <p className="text-bone-300 mt-6 max-w-md text-sm md:text-base leading-relaxed">
                        Whether you're hiring, collaborating, or just want to talk product — drop a note. Replies usually land in under 24 hours.
                    </p>

                    <div className="mt-10 space-y-5">
                        <a
                            href={`mailto:${PROFILE.email}`}
                            className="group flex items-center gap-4 text-bone-200 hover:text-signal transition-colors"
                            data-testid="contact-email-link"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400 w-16">
                                Email
                            </span>
                            <span className="link-underline text-base md:text-lg">{PROFILE.email}</span>
                        </a>
                        <a
                            href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
                            className="group flex items-center gap-4 text-bone-200 hover:text-signal transition-colors"
                            data-testid="contact-phone-link"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400 w-16">
                                Phone
                            </span>
                            <span className="link-underline text-base md:text-lg">{PROFILE.phone}</span>
                        </a>
                        <a
                            href={PROFILE.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-4 text-bone-200 hover:text-signal transition-colors"
                            data-testid="contact-linkedin-link"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400 w-16">
                                Social
                            </span>
                            <span className="link-underline text-base md:text-lg">LinkedIn ↗</span>
                        </a>
                        <a
                            href={PROFILE.github}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-4 text-bone-200 hover:text-signal transition-colors"
                            data-testid="contact-github-link"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-400 w-16">
                                Code
                            </span>
                            <span className="link-underline text-base md:text-lg">GitHub ↗</span>
                        </a>
                    </div>
                </div>

                {/* Right: Form */}
                <motion.form
                    onSubmit={submit}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.7 }}
                    className="lg:col-span-7 glass rounded-2xl p-6 md:p-10"
                    data-testid="contact-form"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field
                            label="Your name"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            testid="contact-input-name"
                        />
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            testid="contact-input-email"
                        />
                    </div>
                    <div className="mt-5">
                        <Field
                            label="Subject"
                            name="subject"
                            value={form.subject}
                            onChange={onChange}
                            placeholder="What's this about?"
                            testid="contact-input-subject"
                        />
                    </div>
                    <div className="mt-5">
                        <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                            Message
                        </label>
                        <textarea
                            name="message"
                            rows={5}
                            value={form.message}
                            onChange={onChange}
                            placeholder="Tell me about the role, project or idea…"
                            data-testid="contact-input-message"
                            className="mt-2 w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-bone-500 focus:border-signal focus:outline-none focus:ring-0 resize-none"
                        />
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-bone-400 text-xs max-w-xs">
                            By submitting, you agree to be contacted at the email above. No spam — ever.
                        </p>
                        <button
                            type="submit"
                            disabled={sending}
                            data-testid="contact-submit-btn"
                            className="inline-flex items-center gap-2 bg-signal text-ink-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-signal-hover transition-all disabled:opacity-60 disabled:cursor-wait"
                        >
                            {sending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
                        </button>
                    </div>
                </motion.form>
            </div>
        </section>
    );
}

function Field({ label, name, value, onChange, type = "text", placeholder, testid }) {
    return (
        <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                data-testid={testid}
                className="mt-2 w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-bone-500 focus:border-signal focus:outline-none focus:ring-0"
            />
        </div>
    );
}
