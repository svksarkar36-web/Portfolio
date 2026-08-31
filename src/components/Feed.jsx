"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "/api";

const CAT_STYLES = {
    "R&R": "bg-signal/15 text-signal border-signal/40",
    Certification: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
    Launch: "bg-sky-500/10 text-sky-300 border-sky-400/30",
    Speaking: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400/30",
    Milestone: "bg-amber-500/10 text-amber-300 border-amber-400/30",
    Update: "bg-white/5 text-bone-200 border-white/15",
};

function timeAgo(iso) {
    if (!iso) return "";
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function Feed() {
    const [posts, setPosts] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let aborted = false;
        (async () => {
            try {
                const res = await fetch(`${API}/feed`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!aborted) setPosts(data);
            } catch (e) {
                if (!aborted) setErr(e.message);
            }
        })();
        return () => {
            aborted = true;
        };
    }, []);

    return (
        <section
            id="feed"
            data-testid="feed-section"
            className="relative py-24 md:py-32 border-t border-white/5"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <p className="eyebrow"><span className="dot" />Live Feed</p>
                        <h2 className="display text-white text-4xl md:text-5xl lg:text-6xl mt-4">
                            Career signals.
                        </h2>
                    </div>
                    <p className="text-bone-300 max-w-sm text-sm md:text-base leading-relaxed">
                        Recognition, certifications, launches and milestones — posted as they happen.
                    </p>
                </div>

                {posts === null && !err && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="feed-loading">
                        {[0, 1].map((i) => (
                            <div key={i} className="h-48 rounded-2xl border border-white/8 bg-ink-700/40 animate-pulse" />
                        ))}
                    </div>
                )}

                {err && (
                    <div className="text-bone-400 text-sm" data-testid="feed-error">
                        Feed unavailable right now.
                    </div>
                )}

                {posts && posts.length === 0 && (
                    <div
                        className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-bone-400"
                        data-testid="feed-empty"
                    >
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em]">No posts yet</p>
                        <p className="mt-2 text-sm">Career updates will land here as they roll in.</p>
                    </div>
                )}

                {posts && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="feed-list">
                        {posts.map((p, i) => (
                            <motion.article
                                key={p.id}
                                data-testid={`feed-post-${p.id}`}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10% 0px" }}
                                transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.55 }}
                                className="group relative rounded-2xl border border-white/8 bg-ink-700/60 backdrop-blur p-6 md:p-7 hover:border-signal/40 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className={`text-[10px] font-mono uppercase tracking-[0.2em] border px-2.5 py-1 rounded-full ${
                                            CAT_STYLES[p.category] || CAT_STYLES.Update
                                        }`}
                                    >
                                        {p.category}
                                    </span>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400">
                                        {timeAgo(p.created_at)}
                                    </span>
                                </div>

                                {p.image_url && (
                                    <div className="rounded-xl overflow-hidden mb-4 border border-white/5">
                                        <img
                                            src={p.image_url}
                                            alt={p.title}
                                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                )}

                                <h3 className="display text-white text-xl md:text-2xl leading-snug group-hover:text-signal transition-colors">
                                    {p.title}
                                </h3>
                                <p className="text-bone-300 text-sm leading-relaxed mt-3 whitespace-pre-wrap">
                                    {p.body}
                                </p>

                                {p.link_url && (
                                    <a
                                        href={p.link_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-signal text-sm font-medium link-underline"
                                        data-testid={`feed-post-link-${p.id}`}
                                    >
                                        {p.link_label || "Read more"} <span aria-hidden>↗</span>
                                    </a>
                                )}
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
