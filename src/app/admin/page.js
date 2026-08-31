"use client";

import dynamic from "next/dynamic";

// The admin screen reads localStorage during render and is entirely
// interactive, so it renders client-side only (no SSR / prerender).
const AdminPage = dynamic(() => import("@/screens/AdminPage"), { ssr: false });

export default function AdminRoute() {
    return <AdminPage />;
}
