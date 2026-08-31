import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/mongodb";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ detail: "Invalid JSON" }, { status: 422 });
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "Portfolio enquiry").trim() || "Portfolio enquiry";
    const message = (body.message || "").trim();

    if (!name || name.length > 120 || !email || !message || message.length > 4000) {
        return NextResponse.json({ detail: "Validation error" }, { status: 422 });
    }

    const msg = {
        id: randomUUID(),
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
        email_status: "pending",
    };

    msg.email_status = await sendContactEmail({ name, email, subject, message });

    const db = await getDb();
    await db.collection("contact_messages").insertOne({ ...msg });

    return NextResponse.json(msg);
}
