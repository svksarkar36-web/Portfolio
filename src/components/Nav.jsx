"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/contexts/ContentContext";

const LINKS = [
    { href: "#about", label: "About" },
    { href: "#work", label: "Projects" },
    { href: "#notable", label: "Notable" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#feed", label: "Feed" },
    { href: "#contact", label: "Contact" },
];

export default function Nav() {
    const { content } = useContent();
    const PROFILE = content.profile;
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 24);
        on();
        window.addEventListener("scroll", on, { passive: true });
        return () => window.removeEventListener("scroll", on);
    }, []);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
                scrolled ? "bg-ink-900/80 backdrop-blur-xl border-b border-white/5" : ""
            }`}
            data-testid="site-nav"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-16 py-4">
                <a
                    href="#top"
                    className="flex items-center gap-2 text-sm tracking-tight"
                    data-testid="nav-brand"
                >
                    <span className="inline-block w-2 h-2 rounded-full bg-signal animate-pulse-dot" />
                    <span className="font-display font-bold text-white">{PROFILE.firstName}.</span>
                    <span className="text-bone-300 font-mono text-[10px] uppercase tracking-[0.3em] hidden sm:inline">
                        Portfolio · 2026
                    </span>
                </a>

                <nav className="hidden md:flex items-center gap-7">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                            className="text-sm text-bone-300 hover:text-white transition-colors link-underline"
                        >
                            {l.label}
                        </a>
                    ))}
                    <a
                        href={PROFILE.resumeUrl}
                        download
                        data-testid="nav-resume-btn"
                        className="ml-2 inline-flex items-center gap-2 text-sm bg-signal text-ink-900 px-4 py-2 rounded-full font-semibold hover:bg-signal-hover transition-colors"
                    >
                        Resume <span aria-hidden>↓</span>
                    </a>
                </nav>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-white p-2"
                    aria-label="menu"
                    data-testid="nav-mobile-toggle"
                >
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-px bg-white transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                        <span className={`block w-6 h-px bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
                        <span className={`block w-6 h-px bg-white transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
                    </div>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-ink-800/95 backdrop-blur-xl border-t border-white/5"
                    >
                        <div className="px-6 py-6 flex flex-col gap-4">
                            {LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="text-bone-200 text-base"
                                    data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                                >
                                    {l.label}
                                </a>
                            ))}
                            <a
                                href={PROFILE.resumeUrl}
                                download
                                className="mt-2 inline-flex items-center justify-center gap-2 bg-signal text-ink-900 px-4 py-2.5 rounded-full font-semibold"
                                data-testid="nav-mobile-resume-btn"
                            >
                                Download Resume ↓
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
