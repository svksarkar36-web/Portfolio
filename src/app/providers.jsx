"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import { ContentProvider } from "@/contexts/ContentContext";
import CursorGlow from "@/components/CursorGlow";

export default function Providers({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ContentProvider>
                <CursorGlow />
                <Toaster
                    theme="dark"
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            background: "rgba(16,16,16,0.85)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#F8FAFC",
                            fontFamily: "Inter, sans-serif",
                            backdropFilter: "blur(12px)",
                        },
                    }}
                />
                {children}
            </ContentProvider>
        </QueryClientProvider>
    );
}
