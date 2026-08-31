import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminTokenValid, getAdminToken } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
    if (!adminTokenValid(getAdminToken(req))) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = await getDb();
    const result = await db.collection("feed_posts").deleteOne({ id });
    if (result.deletedCount === 0) {
        return NextResponse.json({ detail: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "deleted", id });
}
