"use client";
import { useContent } from "@/contexts/ContentContext";

export default function Footer() {
    const { content } = useContent();
    const PROFILE = content.profile;
    const year = new Date().getFullYear();
    return (
        <footer
            data-testid="site-footer"
            className="relative border-t border-white/5 py-12 mt-8"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-7">
                        <div className="display text-white text-3xl md:text-4xl">
                            {PROFILE.firstName}<span className="text-signal">.</span>
                        </div>
                        <p className="text-bone-400 text-sm mt-2 max-w-md">
                            Designed and built by Souvik. Crafted on dark — because product specs deserve focus.
                        </p>
                    </div>
                    <div className="md:col-span-5 flex flex-col md:items-end gap-3">
                        <div className="flex gap-5 text-sm">
                            <a href={`mailto:${PROFILE.email}`} className="text-bone-300 hover:text-signal transition-colors link-underline" data-testid="footer-email">
                                Email
                            </a>
                            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="text-bone-300 hover:text-signal transition-colors link-underline" data-testid="footer-linkedin">
                                LinkedIn
                            </a>
                            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="text-bone-300 hover:text-signal transition-colors link-underline" data-testid="footer-github">
                                GitHub
                            </a>
                            <a href={PROFILE.resumeUrl} download className="text-bone-300 hover:text-signal transition-colors link-underline" data-testid="footer-resume">
                                Resume
                            </a>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-500">
                            © {year} · Bengaluru · IST
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
