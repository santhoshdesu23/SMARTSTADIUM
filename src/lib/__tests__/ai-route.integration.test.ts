import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { streamAiResponseMock } = vi.hoisted(() => ({
  streamAiResponseMock: vi.fn(),
}));

vi.mock("@/lib/ai/service", () => ({
  streamAiResponse: streamAiResponseMock,
}));

vi.mock("@/lib/sanitize", () => ({
  sanitizeText: (value: string) => value.trim(),
}));

import { POST } from "@/app/api/ai/chat/route";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/ai/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const validBody = {
  messages: [{ role: "user", content: "Hello" }],
  assistantType: "stadium",
  language: "en",
};

describe("POST /api/ai/chat — success path", () => {
  beforeEach(() => streamAiResponseMock.mockReset());

  it("returns 200 with streamed content", async () => {
    streamAiResponseMock.mockImplementation(async function* () {
      yield "hello";
      yield " world";
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    await expect(res.text()).resolves.toBe("hello world");
  });

  it("includes X-RateLimit-Remaining header", async () => {
    streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });
    const res = await POST(makeRequest(validBody));
    expect(res.headers.get("x-ratelimit-remaining")).not.toBeNull();
  });

  it("includes X-RateLimit-Reset header", async () => {
    streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });
    const res = await POST(makeRequest(validBody));
    expect(res.headers.get("x-ratelimit-reset")).not.toBeNull();
  });

  it("sets Content-Type text/plain", async () => {
    streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });
    const res = await POST(makeRequest(validBody));
    expect(res.headers.get("content-type")).toContain("text/plain");
  });

  it("streams multiple chunks correctly", async () => {
    streamAiResponseMock.mockImplementation(async function* () {
      yield "chunk1";
      yield "chunk2";
      yield "chunk3";
    });
    const res = await POST(makeRequest(validBody));
    await expect(res.text()).resolves.toBe("chunk1chunk2chunk3");
  });

  it("accepts all valid assistantType values", async () => {
    for (const assistantType of ["stadium", "crowd", "sustainability", "accessibility", "operations"]) {
      streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });
      const res = await POST(makeRequest({ ...validBody, assistantType }));
      expect(res.status).toBe(200);
    }
  });
});

describe("POST /api/ai/chat — validation errors (400)", () => {
  beforeEach(() => streamAiResponseMock.mockReset());

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not json {{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty messages array", async () => {
    const res = await POST(makeRequest({ messages: [], assistantType: "stadium" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid assistantType", async () => {
    const res = await POST(makeRequest({
      messages: [{ role: "user", content: "Hi" }],
      assistantType: "unknown",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for message content exceeding 4000 chars", async () => {
    const res = await POST(makeRequest({
      messages: [{ role: "user", content: "x".repeat(4001) }],
      assistantType: "stadium",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing assistantType", async () => {
    const res = await POST(makeRequest({ messages: [{ role: "user", content: "Hi" }] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when all messages have empty content after trim", async () => {
    const res = await POST(makeRequest({
      messages: [{ role: "user", content: "   " }],
      assistantType: "stadium",
    }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/ai/chat — rate limiting (429)", () => {
  beforeEach(() => streamAiResponseMock.mockReset());

  it("returns 429 after exhausting the rate limit", async () => {
    streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });

    // Use a unique IP to avoid contaminating other tests
    const ip = `rate-limit-test-${Date.now()}`;
    const headers = { "x-forwarded-for": ip };

    // Exhaust the 30-request limit
    for (let i = 0; i < 30; i++) {
      await POST(makeRequest(validBody, headers));
    }
    const blocked = await POST(makeRequest(validBody, headers));
    expect(blocked.status).toBe(429);
  });
});

describe("POST /api/ai/chat — payload size (413)", () => {
  it("returns 413 when content-length header exceeds 64KB", async () => {
    const res = await POST(makeRequest(validBody, { "content-length": "65000" }));
    expect(res.status).toBe(413);
  });
});

describe("POST /api/ai/chat — API key enforcement (401)", () => {
  beforeEach(() => {
    streamAiResponseMock.mockReset();
    process.env.API_KEY = "secret-key";
  });

  afterEach(() => {
    delete process.env.API_KEY;
  });

  it("returns 401 when API_KEY is set but header is missing", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("returns 401 when wrong API key is provided", async () => {
    const res = await POST(makeRequest(validBody, { "x-api-key": "wrong-key" }));
    expect(res.status).toBe(401);
  });

  it("returns 200 when correct API key is provided", async () => {
    streamAiResponseMock.mockImplementation(async function* () { yield "ok"; });
    const res = await POST(makeRequest(validBody, { "x-api-key": "secret-key" }));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/ai/chat — stream error recovery", () => {
  beforeEach(() => streamAiResponseMock.mockReset());

  it("returns 200 with fallback message when stream throws", async () => {
    streamAiResponseMock.mockImplementation(async function* () {
      throw new Error("OpenAI down");
      // eslint-disable-next-line no-unreachable
      yield "";
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });
});
