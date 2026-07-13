import type { StaffRole } from "@/types";

export interface AppUser {
  id: string;
  name: string;
  role: StaffRole;
}

const DEMO_USER: AppUser = {
  id: "demo-user",
  name: "Operations Staff",
  role: "admin",
};

export function getCurrentUser(): AppUser {
  return DEMO_USER;
}

/**
 * Parse a simple HMAC-signed token with format: base64url(payload).hex(hmac)
 * Payload is a JSON object: { id, name, role }
 * If `JWT_SECRET` is not set, this function returns null.
 */
export async function getUserFromAuthHeaderAsync(auth?: string): Promise<AppUser | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret || !auth) return null;

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigHex] = parts;
  try {
    const payloadJson = Buffer.from(
      payloadB64.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    const payload = JSON.parse(payloadJson) as Partial<AppUser>;

    const computedHex = await computeHmacHex(secret, payloadB64);
    if (!computedHex || computedHex !== sigHex) return null;
    if (!payload.id || !payload.name || !payload.role) return null;

    return {
      id: String(payload.id),
      name: String(payload.name),
      role: payload.role as StaffRole,
    };
  } catch {
    return null;
  }
}

async function computeHmacHex(secret: string, data: string): Promise<string | null> {
  // Web Crypto API (Edge-compatible)
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(data));
    return Array.from(new Uint8Array(sig as ArrayBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Node.js fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto") as typeof import("crypto");
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
  } catch {
    return null;
  }
}

const PROTECTED_ROUTES = new Set([
  "/command-center",
  "/crowd",
  "/navigation",
  "/accessibility",
  "/transportation",
  "/volunteer",
  "/emergency",
  "/sustainability",
  "/analytics",
  "/chat",
]);

export function canAccessDashboard(user: AppUser, route: string): boolean {
  if (!PROTECTED_ROUTES.has(route)) return true;
  return user.role === "admin" || user.role === "staff" || user.role === "operator";
}
