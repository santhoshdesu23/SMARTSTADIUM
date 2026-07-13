import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getUserFromAuthHeaderAsync,
  getCurrentUser,
  canAccessDashboard,
} from "@/lib/auth/session";
import type { AppUser } from "@/lib/auth/session";
import crypto from "crypto";

// ─── Token helpers ────────────────────────────────────────────
function makeToken(payload: object, secret: string): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

// ─── getUserFromAuthHeaderAsync ───────────────────────────────
describe("getUserFromAuthHeaderAsync", () => {
  const secret = "test-secret-key";

  beforeEach(() => { process.env.JWT_SECRET = secret; });
  afterEach(() => { delete process.env.JWT_SECRET; });

  it("returns null when JWT_SECRET is not set", async () => {
    delete process.env.JWT_SECRET;
    const token = makeToken({ id: "u1", name: "T", role: "admin" }, secret);
    expect(await getUserFromAuthHeaderAsync(`Bearer ${token}`)).toBeNull();
  });

  it("returns null when auth header is undefined", async () => {
    expect(await getUserFromAuthHeaderAsync(undefined)).toBeNull();
  });

  it("returns null when auth header is empty string", async () => {
    expect(await getUserFromAuthHeaderAsync("")).toBeNull();
  });

  it("parses a valid token with Bearer prefix", async () => {
    const token = makeToken({ id: "u1", name: "Alice", role: "admin" }, secret);
    const user = await getUserFromAuthHeaderAsync(`Bearer ${token}`);
    expect(user).not.toBeNull();
    expect(user?.id).toBe("u1");
    expect(user?.name).toBe("Alice");
    expect(user?.role).toBe("admin");
  });

  it("parses a valid token without Bearer prefix", async () => {
    const token = makeToken({ id: "u2", name: "Bob", role: "staff" }, secret);
    const user = await getUserFromAuthHeaderAsync(token);
    expect(user?.id).toBe("u2");
  });

  it("returns null for a tampered signature", async () => {
    const token = makeToken({ id: "u1", name: "Alice", role: "admin" }, secret);
    const tampered = token.slice(0, -4) + "aaaa";
    expect(await getUserFromAuthHeaderAsync(`Bearer ${tampered}`)).toBeNull();
  });

  it("returns null for a token with wrong secret", async () => {
    const token = makeToken({ id: "u1", name: "Alice", role: "admin" }, "wrong-secret");
    expect(await getUserFromAuthHeaderAsync(`Bearer ${token}`)).toBeNull();
  });

  it("returns null for a token missing required payload fields", async () => {
    const token = makeToken({ id: "u1" }, secret); // missing name + role
    expect(await getUserFromAuthHeaderAsync(`Bearer ${token}`)).toBeNull();
  });

  it("returns null for a token with only one part (no dot)", async () => {
    expect(await getUserFromAuthHeaderAsync("Bearer onlyone")).toBeNull();
  });

  it("returns null for a token with three parts", async () => {
    expect(await getUserFromAuthHeaderAsync("Bearer a.b.c")).toBeNull();
  });

  it("returns null for a token with invalid base64 payload", async () => {
    expect(await getUserFromAuthHeaderAsync("Bearer !!!.abc123")).toBeNull();
  });

  it("returns null for a token with non-JSON payload", async () => {
    const fakePayload = Buffer.from("not json").toString("base64url");
    const sig = crypto.createHmac("sha256", secret).update(fakePayload).digest("hex");
    expect(await getUserFromAuthHeaderAsync(`Bearer ${fakePayload}.${sig}`)).toBeNull();
  });
});

// ─── getCurrentUser ───────────────────────────────────────────
describe("getCurrentUser", () => {
  it("returns a user with id, name, and role", () => {
    const user = getCurrentUser();
    expect(user.id).toBeTruthy();
    expect(user.name).toBeTruthy();
    expect(user.role).toBeTruthy();
  });

  it("returns the same object on repeated calls (stable demo user)", () => {
    expect(getCurrentUser().id).toBe(getCurrentUser().id);
  });
});

// ─── canAccessDashboard ───────────────────────────────────────
describe("canAccessDashboard", () => {
  const admin: AppUser = { id: "1", name: "Admin", role: "admin" };
  const staff: AppUser = { id: "2", name: "Staff", role: "staff" };
  const operator: AppUser = { id: "3", name: "Op", role: "operator" };
  const fan: AppUser = { id: "4", name: "Fan", role: "fan" };
  const volunteer: AppUser = { id: "5", name: "Vol", role: "volunteer" };

  const protectedRoutes = [
    "/command-center", "/crowd", "/navigation", "/accessibility",
    "/transportation", "/volunteer", "/emergency", "/sustainability",
    "/analytics", "/chat",
  ];

  const publicRoutes = ["/", "/about", "/features", "/contact", "/privacy"];

  it.each(protectedRoutes)("admin can access %s", (route) => {
    expect(canAccessDashboard(admin, route)).toBe(true);
  });

  it.each(protectedRoutes)("staff can access %s", (route) => {
    expect(canAccessDashboard(staff, route)).toBe(true);
  });

  it.each(protectedRoutes)("operator can access %s", (route) => {
    expect(canAccessDashboard(operator, route)).toBe(true);
  });

  it.each(protectedRoutes)("fan is blocked from %s", (route) => {
    expect(canAccessDashboard(fan, route)).toBe(false);
  });

  it.each(protectedRoutes)("volunteer is blocked from %s", (route) => {
    expect(canAccessDashboard(volunteer, route)).toBe(false);
  });

  it.each(publicRoutes)("fan can access public route %s", (route) => {
    expect(canAccessDashboard(fan, route)).toBe(true);
  });

  it.each(publicRoutes)("admin can access public route %s", (route) => {
    expect(canAccessDashboard(admin, route)).toBe(true);
  });

  it("allows access to an unknown route (not in protected list)", () => {
    expect(canAccessDashboard(fan, "/some-unknown-page")).toBe(true);
  });
});
