import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminTokenValid, getAdminToken } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
    if (!adminTokenValid(getAdminToken(req))) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    const db = await getDb();
    const items = await db
        .collection("contact_messages")
        .find({}, { projection: { _id: 0 } })
        .sort({ created_at: -1 })
        .limit(500)
        .toArray();
    return NextResponse.json(items);
}
