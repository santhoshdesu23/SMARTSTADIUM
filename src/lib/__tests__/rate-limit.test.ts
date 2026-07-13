import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

// Each test uses a unique key to avoid cross-test contamination
// in the shared in-memory store.
let keyCounter = 0;
function uniqueKey(prefix = "test") {
  return `${prefix}-${Date.now()}-${++keyCounter}`;
}

describe("rateLimit — in-memory store", () => {
  beforeEach(() => {
    // Ensure REDIS_URL is not set so tests use in-memory path
    delete process.env.REDIS_URL;
  });

  it("allows the first request", async () => {
    const result = await rateLimit(uniqueKey(), 5, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("decrements remaining on each call", async () => {
    const key = uniqueKey();
    const r1 = await rateLimit(key, 5, 60_000);
    const r2 = await rateLimit(key, 5, 60_000);
    expect(r1.remaining).toBe(4);
    expect(r2.remaining).toBe(3);
  });

  it("allows exactly limit requests", async () => {
    const key = uniqueKey();
    const limit = 3;
    for (let i = 0; i < limit; i++) {
      const r = await rateLimit(key, limit, 60_000);
      expect(r.success).toBe(true);
    }
  });

  it("blocks the (limit + 1)th request", async () => {
    const key = uniqueKey();
    const limit = 3;
    for (let i = 0; i < limit; i++) {
      await rateLimit(key, limit, 60_000);
    }
    const blocked = await rateLimit(key, limit, 60_000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("returns a resetAt timestamp in the future", async () => {
    const before = Date.now();
    const result = await rateLimit(uniqueKey(), 5, 60_000);
    expect(result.resetAt).toBeGreaterThan(before);
  });

  it("resets window after expiry", async () => {
    const key = uniqueKey();
    const windowMs = 50; // very short window
    await rateLimit(key, 1, windowMs);
    await rateLimit(key, 1, windowMs); // hits limit

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, windowMs + 10));

    const fresh = await rateLimit(key, 1, windowMs);
    expect(fresh.success).toBe(true);
    expect(fresh.remaining).toBe(0);
  });

  it("treats different keys independently", async () => {
    const key1 = uniqueKey("a");
    const key2 = uniqueKey("b");
    await rateLimit(key1, 1, 60_000);
    await rateLimit(key1, 1, 60_000); // key1 exhausted

    const result = await rateLimit(key2, 1, 60_000);
    expect(result.success).toBe(true);
  });

  it("returns remaining = 0 when blocked (not negative)", async () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) await rateLimit(key, 2, 60_000);
    const result = await rateLimit(key, 2, 60_000);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it("handles limit of 1 correctly", async () => {
    const key = uniqueKey();
    const first = await rateLimit(key, 1, 60_000);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(0);

    const second = await rateLimit(key, 1, 60_000);
    expect(second.success).toBe(false);
  });
});
