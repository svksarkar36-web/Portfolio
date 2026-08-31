"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

/**
 * RoomShell — full-screen overlay with cinematic enter/exit. ESC closes.
 */
export default function RoomShell({ open, title, eyebrow, onClose, children, testId }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="fixed inset-0 z-[80] bg-[#050505]/85 backdrop-blur-2xl overflow-y-auto"
                    data-testid={testId}
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="min-h-screen w-full"
                    >
                        {/* Top bar */}
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 md:px-10 py-4 bg-[#050505]/70 backdrop-blur-xl border-b border-white/8">
                            <div className="min-w-0">
                                {eyebrow && (
                                    <p className="eyebrow"><span className="dot" />{eyebrow}</p>
                                )}
                                <h1 className="display text-white text-2xl md:text-3xl mt-1 truncate">
                                    {title}
                                </h1>
                            </div>
                            <button
                                onClick={onClose}
                                data-testid="room-close-btn"
                                className="flex items-center gap-2 mono text-[10px] uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors px-4 py-2.5 border border-white/10 rounded-full hover:border-accent/40"
                            >
                                <span aria-hidden>×</span> Exit · ESC
                            </button>
                        </div>

                        <div className="px-5 md:px-10 py-10 md:py-16 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
