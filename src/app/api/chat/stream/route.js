import { randomUUID } from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "@/lib/mongodb";
import { SOUVIK_SYSTEM_PROMPT } from "@/lib/chat-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const CHAT_MODEL = process.env.CHAT_MODEL || "claude-sonnet-4-6";

const enc = new TextEncoder();
const frame = (obj) => enc.encode(`data: ${JSON.stringify(obj)}\n\n`);

export async function POST(req) {
    if (!ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ detail: "LLM key not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ detail: "Invalid JSON" }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        });
    }

    const message = (body.message || "").trim();
    if (!message || message.length > 2000) {
        return new Response(JSON.stringify({ detail: "Validation error" }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        });
    }

    const sessionId = body.session_id || randomUUID();
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    const stream = new ReadableStream({
        async start(controller) {
            // initial frame so the client knows the session
            controller.enqueue(frame({ type: "meta", session_id: sessionId }));
            try {
                const s = await anthropic.messages.stream({
                    model: CHAT_MODEL,
                    max_tokens: 1024,
                    system: SOUVIK_SYSTEM_PROMPT,
                    messages: [{ role: "user", content: message }],
                });

                for await (const event of s) {
                    if (
                        event.type === "content_block_delta" &&
                        event.delta?.type === "text_delta"
                    ) {
                        controller.enqueue(frame({ type: "delta", text: event.delta.text }));
                    }
                }
                controller.enqueue(frame({ type: "done" }));
            } catch (e) {
                const safe = String(e?.message || e).slice(0, 200);
                controller.enqueue(frame({ type: "error", message: safe }));
            }

            // persist exchange (best-effort)
            try {
                const db = await getDb();
                await db.collection("chat_logs").insertOne({
                    session_id: sessionId,
                    user: message,
                    created_at: new Date().toISOString(),
                });
            } catch {
                // ignore
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            Connection: "keep-alive",
        },
    });
}
