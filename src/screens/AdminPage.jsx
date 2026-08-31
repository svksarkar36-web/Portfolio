"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useContent } from "@/contexts/ContentContext";

const API = "/api";
const TOKEN_KEY = "souvik_admin_token";

const CATEGORIES = ["R&R", "Certification", "Launch", "Speaking", "Milestone", "Update"];

// ---------- Reusable form atoms ----------
function TextInput({ label, value, onChange, placeholder, testid, type = "text" }) {
    return (
        <label className="block">
            {label && (
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">
                    {label}
                </span>
            )}
            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                data-testid={testid}
                className="w-full bg-ink-700 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-bone-500 focus:border-signal focus:outline-none text-sm"
            />
        </label>
    );
}

function TextArea({ label, value, onChange, placeholder, rows = 3, testid }) {
    return (
        <label className="block">
            {label && (
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">
                    {label}
                </span>
            )}
            <textarea
                value={value || ""}
                rows={rows}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                data-testid={testid}
                className="w-full bg-ink-700 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-bone-500 focus:border-signal focus:outline-none text-sm resize-none"
            />
        </label>
    );
}

// Editor for array of plain strings
function StringListEditor({ items, onChange, placeholder }) {
    const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const add = () => onChange([...items, ""]);
    return (
        <div className="space-y-2">
            {items.map((it, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        value={it}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-ink-700 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-bone-500 focus:border-signal focus:outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-bone-400 hover:text-red-400 text-xs px-2 py-1 border border-white/10 rounded-lg hover:border-red-400/40 transition-colors"
                    >
                        ×
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="text-xs font-mono uppercase tracking-[0.2em] text-signal border border-signal/40 px-3 py-1.5 rounded-full hover:bg-signal/10 transition-colors"
            >
                + Add
            </button>
        </div>
    );
}

// Editor for array of objects
function ObjectListEditor({ items, onChange, template, renderItem, addLabel = "+ Add item" }) {
    const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const add = () => onChange([...items, { ...template }]);
    return (
        <div className="space-y-4">
            {items.map((it, i) => (
                <div key={i} className="relative rounded-xl border border-white/8 bg-ink-700/40 p-5">
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className="absolute top-3 right-3 text-bone-400 hover:text-red-400 text-xs px-2 py-1 border border-white/10 rounded-full hover:border-red-400/40 transition-colors"
                    >
                        Remove
                    </button>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-400 mb-3">
                        Item {i + 1}
                    </div>
                    {renderItem(it, (patch) => update(i, patch), i)}
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="text-xs font-mono uppercase tracking-[0.2em] text-signal border border-signal/40 px-3 py-1.5 rounded-full hover:bg-signal/10 transition-colors"
            >
                {addLabel}
            </button>
        </div>
    );
}

// Collapsible section
function Section({ title, eyebrow, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-white/8 rounded-2xl overflow-hidden bg-ink-800/60">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 hover:bg-ink-700/40 transition-colors text-left"
            >
                <div>
                    {eyebrow && (
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal mb-1">
                            {eyebrow}
                        </div>
                    )}
                    <div className="text-white text-lg md:text-xl font-semibold">{title}</div>
                </div>
                <span className={`text-bone-300 text-xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && <div className="px-6 pb-6 pt-2 border-t border-white/5">{children}</div>}
        </div>
    );
}

// ---------- Page ----------
export default function AdminPage() {
    const { refresh: refreshSiteContent } = useContent();

    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [tokenInput, setTokenInput] = useState("");
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState("content");

    // Feed state
    const [posts, setPosts] = useState([]);
    const [postBusy, setPostBusy] = useState(false);
    const [postForm, setPostForm] = useState({
        title: "", body: "", category: "R&R", image_url: "", link_url: "", link_label: "",
    });

    // Content state
    const [content, setContent] = useState(null);
    const [contentBusy, setContentBusy] = useState(false);

    async function tryAuth(t) {
        try {
            const res = await fetch(`${API}/contact/messages`, { headers: { "X-Admin-Token": t } });
            if (res.status === 200) {
                localStorage.setItem(TOKEN_KEY, t);
                setToken(t);
                setAuthed(true);
                await Promise.all([loadFeed(), loadContent()]);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    useEffect(() => {
        if (token) tryAuth(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadFeed() {
        try {
            const res = await fetch(`${API}/feed`);
            if (res.ok) setPosts(await res.json());
        } catch {/* noop */}
    }
    async function loadContent() {
        try {
            const res = await fetch(`${API}/content`);
            if (res.ok) setContent(await res.json());
        } catch {/* noop */}
    }

    async function submitToken(e) {
        e.preventDefault();
        if (!tokenInput.trim()) return;
        const ok = await tryAuth(tokenInput.trim());
        if (!ok) toast.error("Invalid admin token");
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(""); setAuthed(false); setTokenInput("");
    }

    // ---- Feed ----
    async function createPost(e) {
        e.preventDefault();
        if (!postForm.title.trim() || !postForm.body.trim()) {
            toast.error("Title and body are required"); return;
        }
        setPostBusy(true);
        try {
            const res = await fetch(`${API}/feed`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Admin-Token": token },
                body: JSON.stringify({ ...postForm, image_url: postForm.image_url || null, link_url: postForm.link_url || null, link_label: postForm.link_label || null }),
            });
            if (!res.ok) throw new Error(await res.text());
            toast.success("Post published");
            setPostForm({ title: "", body: "", category: "R&R", image_url: "", link_url: "", link_label: "" });
            await loadFeed();
        } catch (err) { toast.error(`Failed: ${err.message || "unknown"}`); }
        finally { setPostBusy(false); }
    }
    async function deletePost(id) {
        if (!window.confirm("Delete this post?")) return;
        try {
            const res = await fetch(`${API}/feed/${id}`, { method: "DELETE", headers: { "X-Admin-Token": token } });
            if (!res.ok) throw new Error(await res.text());
            toast.success("Deleted"); await loadFeed();
        } catch (err) { toast.error(`Failed: ${err.message || "unknown"}`); }
    }

    // ---- Content ----
    function patchContent(patch) { setContent((c) => ({ ...c, ...patch })); }

    async function saveContent() {
        if (!content) return;
        setContentBusy(true);
        try {
            // Strip mongo _id if present
            const payload = { ...content };
            delete payload._id;
            const res = await fetch(`${API}/content`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-Admin-Token": token },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `HTTP ${res.status}`);
            }
            toast.success("Site content saved");
            await refreshSiteContent();
        } catch (err) {
            toast.error(`Save failed: ${err.message || "unknown"}`);
        } finally {
            setContentBusy(false);
        }
    }

    // ---- Render ----
    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 grain-overlay">
                <form onSubmit={submitToken} className="w-full max-w-sm glass rounded-2xl p-8" data-testid="admin-login-form">
                    <p className="eyebrow"><span className="dot" />Admin</p>
                    <h1 className="display text-white text-3xl mt-3">Identify yourself.</h1>
                    <p className="text-bone-400 text-sm mt-2">Enter your admin token to manage the site.</p>
                    <input
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="ADMIN_TOKEN"
                        data-testid="admin-token-input"
                        className="mt-6 w-full bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-signal focus:outline-none"
                    />
                    <button type="submit" data-testid="admin-login-btn" className="mt-4 w-full bg-signal text-ink-900 px-4 py-3 rounded-full font-semibold hover:bg-signal-hover transition-colors">
                        Enter
                    </button>
                    <Link href="/" className="block mt-4 text-center text-bone-400 text-xs hover:text-signal">← back to portfolio</Link>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 grain-overlay">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <p className="eyebrow"><span className="dot" />Admin Console</p>
                        <h1 className="display text-white text-3xl md:text-5xl mt-3">Mission control.</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Link href="/" className="text-bone-300 hover:text-signal text-sm link-underline" data-testid="admin-home-link">← View site</Link>
                        <button onClick={logout} className="text-bone-300 hover:text-signal text-sm link-underline" data-testid="admin-logout-btn">Logout</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-white/8" data-testid="admin-tabs">
                    {[
                        { id: "content", label: "Site Content" },
                        { id: "feed", label: "Feed Posts" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            data-testid={`admin-tab-${t.id}`}
                            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                tab === t.id
                                    ? "text-signal border-signal"
                                    : "text-bone-300 border-transparent hover:text-white"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "content" && (
                    <ContentTab content={content} patchContent={patchContent} saveContent={saveContent} busy={contentBusy} />
                )}
                {tab === "feed" && (
                    <FeedTab
                        posts={posts}
                        form={postForm}
                        setForm={setPostForm}
                        busy={postBusy}
                        onSubmit={createPost}
                        onDelete={deletePost}
                    />
                )}
            </div>
        </div>
    );
}

// ---------- Content Tab ----------
function ContentTab({ content, patchContent, saveContent, busy }) {
    if (!content) {
        return <div className="text-bone-400 text-sm">Loading content…</div>;
    }
    const p = content.profile || {};
    const patchProfile = (patch) => patchContent({ profile: { ...p, ...patch } });

    return (
        <div className="space-y-5" data-testid="admin-content-editor">
            {/* Save bar */}
            <div className="sticky top-20 z-30 -mt-2 mb-4 flex items-center justify-between gap-4 bg-ink-800/85 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3">
                <div className="text-bone-300 text-sm">
                    Edit any section below — changes apply site-wide after saving.
                </div>
                <button
                    onClick={saveContent}
                    disabled={busy}
                    data-testid="admin-save-content-btn"
                    className="bg-signal text-ink-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-signal-hover transition-colors disabled:opacity-60"
                >
                    {busy ? "Saving…" : "Save changes"}
                </button>
            </div>

            <Section title="Profile & Contact" eyebrow="Identity" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput label="Full name" value={p.name} onChange={(v) => patchProfile({ name: v })} testid="content-profile-name" />
                    <TextInput label="First name (large display)" value={p.firstName} onChange={(v) => patchProfile({ firstName: v })} />
                    <TextInput label="Role" value={p.role} onChange={(v) => patchProfile({ role: v })} />
                    <TextInput label="Company" value={p.company} onChange={(v) => patchProfile({ company: v })} />
                    <TextInput label="Location" value={p.location} onChange={(v) => patchProfile({ location: v })} />
                    <TextInput label="Email" type="email" value={p.email} onChange={(v) => patchProfile({ email: v })} />
                    <TextInput label="Phone" value={p.phone} onChange={(v) => patchProfile({ phone: v })} />
                    <TextInput label="LinkedIn URL" value={p.linkedin} onChange={(v) => patchProfile({ linkedin: v })} />
                    <TextInput label="GitHub URL" value={p.github} onChange={(v) => patchProfile({ github: v })} />
                    <TextInput label="Resume URL" value={p.resumeUrl} onChange={(v) => patchProfile({ resumeUrl: v })} />
                </div>
                <div className="mt-4 space-y-4">
                    <TextArea label="Hero tagline" value={p.tagline} rows={2} onChange={(v) => patchProfile({ tagline: v })} />
                    <TextArea label="Hero intro paragraph" value={p.intro} rows={2} onChange={(v) => patchProfile({ intro: v })} />
                </div>
            </Section>

            <Section title="Metrics — Control Room" eyebrow="4 KPI cards">
                <ObjectListEditor
                    items={content.metrics || []}
                    onChange={(metrics) => patchContent({ metrics })}
                    template={{ label: "", value: 0, prefix: "", suffix: "", note: "" }}
                    addLabel="+ Add metric"
                    renderItem={(it, set) => (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <TextInput label="Label" value={it.label} onChange={(v) => set({ label: v })} />
                            <TextInput label="Value" type="number" value={it.value} onChange={(v) => set({ value: parseFloat(v) || 0 })} />
                            <TextInput label="Prefix" value={it.prefix} onChange={(v) => set({ prefix: v })} placeholder="₹" />
                            <TextInput label="Suffix" value={it.suffix} onChange={(v) => set({ suffix: v })} placeholder="%" />
                            <TextInput label="Note" value={it.note} onChange={(v) => set({ note: v })} />
                        </div>
                    )}
                />
            </Section>

            <Section title="About — 3 Pillars" eyebrow="Discovery · Delivery · Adoption">
                <ObjectListEditor
                    items={content.pillars || []}
                    onChange={(pillars) => patchContent({ pillars })}
                    template={{ k: "", v: "" }}
                    addLabel="+ Add pillar"
                    renderItem={(it, set) => (
                        <div className="grid grid-cols-1 gap-3">
                            <TextInput label="Title" value={it.k} onChange={(v) => set({ k: v })} />
                            <TextArea label="Description" value={it.v} rows={2} onChange={(v) => set({ v })} />
                        </div>
                    )}
                />
            </Section>

            <Section title="Experience — Timeline" eyebrow="Trajectory">
                <ObjectListEditor
                    items={content.experience || []}
                    onChange={(experience) => patchContent({ experience })}
                    template={{ period: "", role: "", company: "", location: "", bullets: [], impact: [] }}
                    addLabel="+ Add experience"
                    renderItem={(it, set) => (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <TextInput label="Period (e.g. Sep 2025 — Now)" value={it.period} onChange={(v) => set({ period: v })} />
                                <TextInput label="Role" value={it.role} onChange={(v) => set({ role: v })} />
                                <TextInput label="Company" value={it.company} onChange={(v) => set({ company: v })} />
                                <TextInput label="Location" value={it.location} onChange={(v) => set({ location: v })} />
                            </div>
                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">Bullets</span>
                                <StringListEditor items={it.bullets || []} onChange={(bullets) => set({ bullets })} placeholder="One bullet…" />
                            </div>
                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">Impact chips</span>
                                <StringListEditor items={it.impact || []} onChange={(impact) => set({ impact })} placeholder="Impact tag…" />
                            </div>
                        </div>
                    )}
                />
            </Section>

            <Section title="Projects" eyebrow="Selected work">
                <ObjectListEditor
                    items={content.projects || []}
                    onChange={(projects) => patchContent({ projects })}
                    template={{ id: "", title: "", subtitle: "", tag: "", span: "lg:col-span-6 lg:row-span-2", image: "", summary: "", results: [] }}
                    addLabel="+ Add project"
                    renderItem={(it, set) => (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <TextInput label="ID (slug)" value={it.id} onChange={(v) => set({ id: v })} placeholder="my-project" />
                                <TextInput label="Tag" value={it.tag} onChange={(v) => set({ tag: v })} placeholder="AI · Knowledge" />
                                <TextInput label="Title" value={it.title} onChange={(v) => set({ title: v })} />
                                <TextInput label="Subtitle" value={it.subtitle} onChange={(v) => set({ subtitle: v })} />
                                <TextInput label="Image URL" value={it.image} onChange={(v) => set({ image: v })} />
                                <TextInput label="Grid span (advanced)" value={it.span} onChange={(v) => set({ span: v })} placeholder="lg:col-span-7 lg:row-span-2" />
                            </div>
                            <TextArea label="Summary" value={it.summary} rows={3} onChange={(v) => set({ summary: v })} />
                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">Results / outcomes</span>
                                <StringListEditor items={it.results || []} onChange={(results) => set({ results })} placeholder="Outcome chip…" />
                            </div>
                        </div>
                    )}
                />
            </Section>

            <Section title="Notable Work" eyebrow="Highlights">
                <ObjectListEditor
                    items={content.notable || []}
                    onChange={(notable) => patchContent({ notable })}
                    template={{ id: "", title: "", metric: "", metricLabel: "", tag: "", summary: "", chips: [] }}
                    addLabel="+ Add notable item"
                    renderItem={(it, set) => (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <TextInput label="ID (slug)" value={it.id} onChange={(v) => set({ id: v })} />
                                <TextInput label="Tag" value={it.tag} onChange={(v) => set({ tag: v })} />
                                <TextInput label="Big metric (e.g. +50%)" value={it.metric} onChange={(v) => set({ metric: v })} />
                                <TextInput label="Metric label" value={it.metricLabel} onChange={(v) => set({ metricLabel: v })} />
                                <TextInput label="Title" value={it.title} onChange={(v) => set({ title: v })} />
                            </div>
                            <TextArea label="Summary" value={it.summary} rows={3} onChange={(v) => set({ summary: v })} />
                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">Chips</span>
                                <StringListEditor items={it.chips || []} onChange={(chips) => set({ chips })} placeholder="Chip text…" />
                            </div>
                        </div>
                    )}
                />
            </Section>

            <Section title="Skills" eyebrow="Toolkit · 3 groups">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
                        <StringListEditor items={content.skills_product || []} onChange={(v) => patchContent({ skills_product: v })} placeholder="Skill…" />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Data & Analytics</h4>
                        <StringListEditor items={content.skills_data || []} onChange={(v) => patchContent({ skills_data: v })} placeholder="Skill…" />
                    </div>
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-3">Tools</h4>
                        <StringListEditor items={content.skills_tools || []} onChange={(v) => patchContent({ skills_tools: v })} placeholder="Tool…" />
                    </div>
                </div>
            </Section>

            <Section title="Education" eyebrow="Foundations">
                <ObjectListEditor
                    items={content.education || []}
                    onChange={(education) => patchContent({ education })}
                    template={{ period: "", title: "", org: "" }}
                    addLabel="+ Add education"
                    renderItem={(it, set) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <TextInput label="Period" value={it.period} onChange={(v) => set({ period: v })} placeholder="2021 — 2022" />
                            <TextInput label="Title" value={it.title} onChange={(v) => set({ title: v })} />
                            <TextInput label="Organisation" value={it.org} onChange={(v) => set({ org: v })} />
                        </div>
                    )}
                />
            </Section>

            <Section title="Certifications" eyebrow="Stamped">
                <StringListEditor items={content.certs || []} onChange={(certs) => patchContent({ certs })} placeholder="Certification…" />
            </Section>
        </div>
    );
}

// ---------- Feed Tab ----------
function FeedTab({ posts, form, setForm, busy, onSubmit, onDelete }) {
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    return (
        <div>
            <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8 mb-10" data-testid="admin-post-form">
                <h2 className="display text-white text-2xl md:text-3xl mb-5">Post a career update.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} testid="admin-input-title" />
                    <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-400 block mb-1.5">Category</span>
                        <select
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            data-testid="admin-input-category"
                            className="w-full bg-ink-700 border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:border-signal focus:outline-none text-sm"
                        >
                            {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </label>
                </div>
                <div className="mt-5">
                    <TextArea label="Body" value={form.body} rows={5} onChange={(v) => setForm({ ...form, body: v })} testid="admin-input-body" placeholder="Share the update — what, why it matters, and any context." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    <TextInput label="Image URL (optional)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} testid="admin-input-image" />
                    <TextInput label="Link URL (optional)" value={form.link_url} onChange={(v) => setForm({ ...form, link_url: v })} testid="admin-input-link" />
                    <TextInput label="Link label (optional)" value={form.link_label} onChange={(v) => setForm({ ...form, link_label: v })} testid="admin-input-link-label" placeholder="Read more" />
                </div>
                <div className="mt-7 flex justify-end">
                    <button type="submit" disabled={busy} data-testid="admin-publish-btn" className="bg-signal text-ink-900 px-6 py-3 rounded-full font-semibold hover:bg-signal-hover transition-colors disabled:opacity-60">
                        {busy ? "Publishing…" : "Publish post"}
                    </button>
                </div>
            </form>

            <h2 className="display text-white text-2xl md:text-3xl mb-6">{posts.length} {posts.length === 1 ? "post" : "posts"}</h2>
            <div className="space-y-4" data-testid="admin-posts-list">
                {posts.map((p) => (
                    <div key={p.id} className="rounded-xl border border-white/8 bg-ink-700/60 p-5 flex items-start justify-between gap-5" data-testid={`admin-post-${p.id}`}>
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-signal border border-signal/30 px-2 py-0.5 rounded-full">{p.category}</span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-bone-400">{new Date(p.created_at).toLocaleString()}</span>
                            </div>
                            <div className="text-white font-semibold">{p.title}</div>
                            <p className="text-bone-300 text-sm mt-1 line-clamp-2">{p.body}</p>
                        </div>
                        <button onClick={() => onDelete(p.id)} className="text-xs text-bone-400 hover:text-red-400 transition-colors flex-shrink-0" data-testid={`admin-delete-${p.id}`}>Delete</button>
                    </div>
                ))}
                {posts.length === 0 && <div className="text-bone-400 text-sm">No posts yet — publish the first one above.</div>}
            </div>
        </div>
    );
}
