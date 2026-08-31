import crypto from "crypto";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

/**
 * Constant-time check that avoids leaking the token via timing and refuses
 * access when no ADMIN_TOKEN is configured or none is supplied.
 */
export function adminTokenValid(token) {
    if (!ADMIN_TOKEN || !token) return false;
    const a = Buffer.from(token);
    const b = Buffer.from(ADMIN_TOKEN);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

/** Reads the X-Admin-Token header from a NextRequest. */
export function getAdminToken(req) {
    return req.headers.get("x-admin-token");
}
