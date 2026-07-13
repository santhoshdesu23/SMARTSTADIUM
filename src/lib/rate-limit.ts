interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Async rate limiter with optional Redis backend.
 * If `REDIS_URL` is provided it attempts to use ioredis;
 * otherwise falls back to an in-memory Map.
 */
export async function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): Promise<RateLimitResult> {
  const now = Date.now();

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && typeof window === "undefined") {
    const result = await tryRedisRateLimit(key, limit, windowMs, redisUrl);
    if (result) return result;
  }

  return inMemoryRateLimit(key, limit, windowMs, now);
}

async function tryRedisRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  redisUrl: string
): Promise<RateLimitResult | null> {
  try {
    // Dynamic import keeps ioredis out of the client bundle.
    // The conditional means bundlers won't statically trace this import.
    const mod = await import("ioredis");
    const Redis = mod.default ?? mod;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new (Redis as any)(redisUrl) as {
      incr(key: string): Promise<number>;
      pexpire(key: string, ms: number): Promise<number>;
      pttl(key: string): Promise<number>;
      quit(): Promise<string>;
    };

    const count = await client.incr(key);
    if (count === 1) await client.pexpire(key, windowMs);

    const ttl = await client.pttl(key);
    const resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);
    const remaining = Math.max(0, limit - count);
    await client.quit();

    return { success: count <= limit, remaining, resetAt };
  } catch (err) {
    console.warn("Redis rate limiter failed, falling back to in-memory", err);
    return null;
  }
}

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number
): RateLimitResult {
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
