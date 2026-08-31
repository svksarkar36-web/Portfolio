import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        resend: Boolean(process.env.RESEND_API_KEY),
        llm: Boolean(process.env.ANTHROPIC_API_KEY),
        time: new Date().toISOString(),
    });
}
