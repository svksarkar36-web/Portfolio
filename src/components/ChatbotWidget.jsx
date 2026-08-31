"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api";

const SUGGESTIONS = [
    "Tell me about Fyn Guide",
    "Explain your product process",
    "Show Driver Onboarding case study",
    "How do you prioritize products?",
    "How do you work with Engineering?",
    "How do you write PRDs?",
];

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hey 👋 I'm Ask Souvik. Ask me about his work, products, or how to get in touch.",
        },
    ]);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 280);
    }, [open]);

    const send = async (textOverride) => {
        const text = (textOverride ?? input).trim();
        if (!text || busy) return;
        setInput("");
        setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: "" }]);
        setBusy(true);

        try {
            const res = await fetch(`${API}/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, session_id: sessionId }),
            });
            if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // split SSE frames
                let idx;
                while ((idx = buffer.indexOf("\n\n")) >= 0) {
                    const frame = buffer.slice(0, idx).trim();
                    buffer = buffer.slice(idx + 2);
                    if (!frame.startsWith("data:")) continue;
                    const json = frame.slice(5).trim();
                    try {
                        const evt = JSON.parse(json);
                        if (evt.type === "meta" && evt.session_id) {
                            setSessionId(evt.session_id);
                        } else if (evt.type === "delta") {
                            setMessages((m) => {
                                const last = m[m.length - 1];
                                if (last && last.role === "assistant") {
                                    return [
                                        ...m.slice(0, -1),
                                        { ...last, text: last.text + evt.text },
                                    ];
                                }
                                return m;
                            });
                        } else if (evt.type === "error") {
                            setMessages((m) => {
                                const last = m[m.length - 1];
                                const errTxt = `Sorry — chat is unavailable right now. ${evt.message || ""}`.trim();
                                if (last && last.role === "assistant" && !last.text) {
                                    return [...m.slice(0, -1), { ...last, text: errTxt }];
                                }
                                return [...m, { role: "assistant", text: errTxt }];
                            });
                        }
                    } catch {
                        /* ignore malformed frame */
                    }
                }
            }
        } catch (e) {
            setMessages((m) => {
                const last = m[m.length - 1];
                const errTxt =
                    "Couldn't reach the chat service. Try the contact form below 👇";
                if (last && last.role === "assistant" && !last.text) {
                    return [...m.slice(0, -1), { ...last, text: errTxt }];
                }
                return [...m, { role: "assistant", text: errTxt }];
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 18 }}
                onClick={() => setOpen((o) => !o)}
                data-testid="chatbot-fab"
                aria-label="Open Souvik AI chat"
                className="fixed bottom-20 right-6 z-[80] group"
            >
                <span className="absolute inset-0 rounded-full bg-signal/30 blur-xl group-hover:bg-signal/50 transition-colors" />
                <span className="relative flex items-center gap-2.5 bg-signal text-ink-900 pl-4 pr-5 py-3 rounded-full font-semibold text-sm shadow-2xl hover:bg-signal-hover transition-colors">
                    <span className="relative flex w-2 h-2">
                        <span className="absolute inset-0 rounded-full bg-ink-900 opacity-70 animate-ping" />
                        <span className="relative w-2 h-2 rounded-full bg-ink-900" />
                    </span>
                    {open ? "Close" : "Ask Souvik"}
                </span>
            </motion.button>

            {/* Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-[65] md:w-[400px] max-h-[calc(100vh-140px)] flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-ink-800/80 backdrop-blur-2xl shadow-[0_30px_120px_-20px_rgba(255,0,64,0.45)]"
                        data-testid="chatbot-panel"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-ink-900/60">
                            <div className="flex items-center gap-3">
                                <span className="relative flex w-2.5 h-2.5">
                                    <span className="absolute inset-0 rounded-full bg-signal opacity-60 animate-ping" />
                                    <span className="relative w-2.5 h-2.5 rounded-full bg-signal" />
                                </span>
                                <div>
                                    <div className="text-white font-semibold text-sm">Ask Souvik</div>
                                    <div className="text-bone-400 text-[10px] font-mono uppercase tracking-[0.25em]">
                                        Powered by Claude · Live
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-bone-400 hover:text-white text-lg leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5"
                                aria-label="close chat"
                                data-testid="chatbot-close-btn"
                            >
                                ×
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
                            data-testid="chatbot-messages"
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-4 py-2.5 ${
                                            m.role === "user"
                                                ? "bg-signal text-ink-900 font-medium"
                                                : "bg-ink-700 text-bone-100 border border-white/5"
                                        }`}
                                    >
                                        {m.text || (
                                            <span className="inline-flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-bone-400 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-bone-400 rounded-full animate-bounce [animation-delay:120ms]" />
                                                <span className="w-1.5 h-1.5 bg-bone-400 rounded-full animate-bounce [animation-delay:240ms]" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Suggestions */}
                        {messages.length <= 1 && (
                            <div className="px-5 pb-3 flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => send(s)}
                                        disabled={busy}
                                        className="text-[11px] text-bone-300 border border-white/10 px-2.5 py-1.5 rounded-full hover:border-signal hover:text-signal transition-colors"
                                        data-testid="chatbot-suggestion"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Composer */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                send();
                            }}
                            className="flex items-center gap-2 px-4 py-4 border-t border-white/8 bg-ink-900/60"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything…"
                                disabled={busy}
                                data-testid="chatbot-input"
                                className="flex-1 bg-ink-700 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-bone-500 focus:border-signal focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={busy || !input.trim()}
                                data-testid="chatbot-send-btn"
                                className="w-10 h-10 rounded-full bg-signal text-ink-900 flex items-center justify-center font-bold disabled:opacity-50"
                                aria-label="send"
                            >
                                ↑
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
