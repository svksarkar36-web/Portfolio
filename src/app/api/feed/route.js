import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongodb";
import { adminTokenValid, getAdminToken } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const db = await getDb();
    const items = await db
        .collection("feed_posts")
        .find({}, { projection: { _id: 0 } })
        .sort({ created_at: -1 })
        .limit(200)
        .toArray();
    return NextResponse.json(items);
}

export async function POST(req) {
    if (!adminTokenValid(getAdminToken(req))) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ detail: "Invalid JSON" }, { status: 422 });
    }

    const title = (body.title || "").trim();
    const bodyText = (body.body || "").trim();
    if (!title || title.length > 160 || !bodyText || bodyText.length > 4000) {
        return NextResponse.json({ detail: "Validation error" }, { status: 422 });
    }

    const post = {
        id: randomUUID(),
        title,
        body: bodyText,
        category: (body.category || "Update").trim() || "Update",
        image_url: body.image_url ?? null,
        link_url: body.link_url ?? null,
        link_label: body.link_label ?? null,
        created_at: new Date().toISOString(),
    };

    const db = await getDb();
    await db.collection("feed_posts").insertOne({ ...post });
    return NextResponse.json(post);
}
