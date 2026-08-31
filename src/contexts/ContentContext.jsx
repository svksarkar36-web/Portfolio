"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API = "/api";

const ContentContext = createContext({ content: null, loading: true, refresh: async () => {} });

// Minimal fallback so the site never renders blank if the API is down.
// Backend ships the real defaults via /api/content; this is purely a safety net.
const SAFE_FALLBACK = {
    profile: {
        name: "Souvik Sarkar", firstName: "Souvik", role: "Associate Product Manager",
        company: "Fyn Mobility", location: "Bengaluru, India",
        email: "svksarkar36@gmail.com", phone: "+91 8974105592",
        linkedin: "https://www.linkedin.com/in/souvik-sarkar-81a573211/",
        github: "https://github.com/svksarkar36-web",
        resumeUrl: "/assets/SouvikSarkar_Resume.pdf",
        tagline: "Loading…", intro: "",
    },
    metrics: [], pillars: [], experience: [], projects: [], notable: [],
    skills_product: [], skills_data: [], skills_tools: [],
    education: [], certs: [],
};

export function ContentProvider({ children }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(`${API}/content`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setContent(data);
        } catch {
            setContent(SAFE_FALLBACK);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <ContentContext.Provider value={{ content: content || SAFE_FALLBACK, loading, refresh }}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    return useContext(ContentContext);
}
