"use client";

import { useEffect, useState } from "react";
import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";

import SpaceBackground from "@/three/SpaceBackground";
import LoadingScene from "@/scenes/LoadingScene";

import HeroDeck from "@/scenes/HeroDeck";
import IdentitySection from "@/sections/IdentitySection";
import ImpactSection from "@/sections/ImpactSection";
import FeaturedProductsSection from "@/sections/FeaturedProductsSection";
import ThinkingSection from "@/sections/ThinkingSection";
import JourneySection from "@/sections/JourneySection";
import SkillsNeuralSection from "@/sections/SkillsNeuralSection";
import CertificationsSection from "@/sections/CertificationsSection";
import PrinciplesSection from "@/sections/PrinciplesSection";
import ResumeSection from "@/sections/ResumeSection";
import ContactSection from "@/sections/ContactSection";

import ChatbotWidget from "@/components/ChatbotWidget";

const SECTIONS = [
    { id: "hero", label: "Landing" },
    { id: "section-identity", label: "Identity" },
    { id: "section-impact", label: "Impact" },
    { id: "section-products", label: "Products" },
    { id: "section-thinking", label: "Thinking" },
    { id: "section-journey", label: "Journey" },
    { id: "section-skills", label: "Skills" },
    { id: "section-principles", label: "Principles" },
    { id: "section-certifications", label: "Certs" },
    { id: "section-resume", label: "Résumé" },
    { id: "section-contact", label: "Contact" },
];

function HUD() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 16);
        on();
        window.addEventListener("scroll", on, { passive: true });
        return () => window.removeEventListener("scroll", on);
    }, []);
    return (
        <div className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${scrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/8" : "bg-black/20 backdrop-blur-md border-b border-white/5"}`}>
            <div className="px-5 md:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    <span className="display text-white font-bold tracking-tight">SOUVIK<span className="text-accent">.</span></span>
                    <span className="mono text-[9px] tracking-[0.3em] uppercase text-text-muted hidden sm:inline">PRODUCT_OS · v3.0</span>
                </div>
                <div className="flex items-center gap-4 mono text-[10px] tracking-[0.25em] uppercase text-text-muted">
                    <span className="hidden md:inline">SYS · OK</span>
                    <span className="hidden md:inline">IST · UTC+5:30</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
                </div>
            </div>
        </div>
    );
}

function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    return (
        <motion.div
            data-testid="scroll-progress"
            style={{ scaleX: x, transformOrigin: "0% 50%" }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[60]"
        />
    );
}

function SideRail() {
    const [active, setActive] = useState("hero");
    useEffect(() => {
        const handler = () => {
            const fromTop = window.scrollY + window.innerHeight * 0.4;
            let cur = "hero";
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id);
                if (el && el.offsetTop <= fromTop) cur = s.id;
            }
            setActive(cur);
        };
        handler();
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <div className="hidden lg:flex fixed top-1/2 -translate-y-1/2 right-5 z-40 flex-col gap-3 pointer-events-auto" data-testid="side-rail">
            {SECTIONS.map((s) => (
                <button
                    key={s.id}
                    onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                    data-testid={`rail-${s.id}`}
                    className="group flex items-center justify-end gap-3"
                    data-cursor-hover
                >
                    <span className={`opacity-0 group-hover:opacity-100 transition-opacity mono text-[10px] uppercase tracking-[0.25em] ${active === s.id ? "text-white" : "text-text-muted"}`}>
                        {s.label}
                    </span>
                    <span className={`h-px transition-all duration-300 ${active === s.id ? "w-8 bg-accent shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "w-4 bg-white/20 group-hover:w-6 group-hover:bg-white/50"}`} />
                </button>
            ))}
        </div>
    );
}

export default function Page() {
    const [loading, setLoading] = useState(true);

    return (
        <div className="App relative scanline" data-testid="portfolio-root">
            <SpaceBackground />

            <AnimatePresence>
                {loading && <LoadingScene onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            {!loading && (
                <>
                    <HUD />
                    <ScrollProgress />
                    <SideRail />
                </>
            )}

            <main className="relative z-10">
                <HeroDeck />
                <IdentitySection />
                <ImpactSection />
                <FeaturedProductsSection />
                <ThinkingSection />
                <JourneySection />
                <SkillsNeuralSection />
                <PrinciplesSection />
                <CertificationsSection />
                <ResumeSection />
                <ContactSection />
            </main>

            <ChatbotWidget />
        </div>
    );
}
