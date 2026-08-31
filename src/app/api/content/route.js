import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminTokenValid, getAdminToken } from "@/lib/admin";
import { DEFAULT_CONTENT } from "@/lib/content-defaults";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getOrSeedContent() {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: "site" });
    if (doc) {
        // backfill missing keys from defaults so older docs stay valid
        const { _id, ...rest } = doc;
        return { ...DEFAULT_CONTENT, ...rest };
    }
    await db.collection("site_content").insertOne({ _id: "site", ...DEFAULT_CONTENT });
    return DEFAULT_CONTENT;
}

export async function GET() {
    return NextResponse.json(await getOrSeedContent());
}

export async function PUT(req) {
    if (!adminTokenValid(getAdminToken(req))) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    let data;
    try {
        data = await req.json();
    } catch {
        return NextResponse.json({ detail: "Invalid JSON" }, { status: 422 });
    }
    if (!data || typeof data !== "object" || !data.profile) {
        return NextResponse.json({ detail: "Validation error" }, { status: 422 });
    }

    const db = await getDb();
    await db
        .collection("site_content")
        .updateOne({ _id: "site" }, { $set: data }, { upsert: true });
    return NextResponse.json(data);
}
