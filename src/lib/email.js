import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "svksarkar36@gmail.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function buildEmailHtml({ name, email, subject, message }) {
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;font-family:Helvetica,Arial,sans-serif;padding:32px;color:#ffffff;">
      <tr><td>
        <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#0d0d0d;border:1px solid #222;border-radius:16px;padding:32px;">
          <tr><td>
            <p style="margin:0;font-size:11px;letter-spacing:.25em;color:#FF0040;text-transform:uppercase;">New Portfolio Enquiry</p>
            <h1 style="margin:8px 0 24px;font-size:24px;color:#fff;">${subject}</h1>
            <p style="color:#a3a3a3;margin:0 0 4px;font-size:12px;">FROM</p>
            <p style="color:#fff;margin:0 0 16px;font-size:16px;">${name} &lt;${email}&gt;</p>
            <p style="color:#a3a3a3;margin:0 0 4px;font-size:12px;">MESSAGE</p>
            <p style="color:#e5e5e5;margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</p>
            <hr style="border:none;border-top:1px solid #222;margin:24px 0;"/>
            <p style="color:#666;font-size:11px;margin:0;">Sent from souviksarkar.portfolio · reply directly to respond</p>
          </td></tr>
        </table>
      </td></tr>
    </table>`;
}

/**
 * Best-effort send of the contact email. Returns an email_status string that
 * mirrors the original FastAPI behaviour.
 */
export async function sendContactEmail(payload) {
    if (!resend) return "skipped_no_key";
    try {
        const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: [OWNER_EMAIL],
            subject: `[Portfolio] ${payload.subject} — ${payload.name}`,
            html: buildEmailHtml(payload),
            replyTo: payload.email,
        });
        if (error) return `failed: ${String(error.message || error).slice(0, 120)}`;
        return data && data.id ? "sent" : "unknown";
    } catch (e) {
        return `failed: ${String(e).slice(0, 120)}`;
    }
}
