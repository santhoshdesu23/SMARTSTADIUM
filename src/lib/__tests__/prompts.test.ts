import { describe, it, expect, vi } from "vitest";
import {
  getSystemPrompt,
  generateMockResponse,
  streamMockResponse,
} from "@/lib/ai/prompts";
import type { AiAssistantType } from "@/types";

const ALL_TYPES: AiAssistantType[] = [
  "stadium", "crowd", "sustainability", "accessibility", "operations",
];

// ─── getSystemPrompt ──────────────────────────────────────────
describe("getSystemPrompt", () => {
  it.each(ALL_TYPES)("returns a non-empty string for '%s'", (type) => {
    const prompt = getSystemPrompt(type);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(20);
  });

  it("stadium prompt mentions FIFA World Cup 2026", () => {
    expect(getSystemPrompt("stadium")).toContain("FIFA World Cup 2026");
  });

  it("crowd prompt mentions crowd patterns or intelligence", () => {
    const p = getSystemPrompt("crowd").toLowerCase();
    expect(p).toMatch(/crowd/);
  });

  it("sustainability prompt mentions eco or sustainability", () => {
    const p = getSystemPrompt("sustainability").toLowerCase();
    expect(p).toMatch(/sustain|eco|carbon/);
  });

  it("accessibility prompt mentions accessibility or inclusive", () => {
    const p = getSystemPrompt("accessibility").toLowerCase();
    expect(p).toMatch(/access|inclusive/);
  });

  it("operations prompt mentions operations or incidents", () => {
    const p = getSystemPrompt("operations").toLowerCase();
    expect(p).toMatch(/operat|incident/);
  });
});

// ─── generateMockResponse ─────────────────────────────────────
describe("generateMockResponse — stadium type", () => {
  it("returns gate recommendation for gate/enter query", () => {
    const r = generateMockResponse("stadium", "Which gate should I use to enter?");
    expect(r.toLowerCase()).toContain("gate");
  });

  it("returns food options for food query", () => {
    const r = generateMockResponse("stadium", "Where can I eat?");
    expect(r.toLowerCase()).toMatch(/food|taco|dining/);
  });

  it("returns seat info for seat/section query", () => {
    const r = generateMockResponse("stadium", "Where is my seat in section 214?");
    expect(r.toLowerCase()).toMatch(/seat|section/);
  });

  it("returns default welcome for unrecognised query", () => {
    const r = generateMockResponse("stadium", "zxqwerty random query");
    expect(r.length).toBeGreaterThan(10);
  });
});

describe("generateMockResponse — crowd type", () => {
  it("returns a crowd intelligence summary", () => {
    const r = generateMockResponse("crowd", "What is the crowd status?");
    expect(r).toContain("Crowd Intelligence");
  });
});

describe("generateMockResponse — sustainability type", () => {
  it("returns sustainability snapshot", () => {
    const r = generateMockResponse("sustainability", "Give me the sustainability report");
    expect(r).toMatch(/Sustainability|CO₂|carbon/i);
  });
});

describe("generateMockResponse — accessibility type", () => {
  it("returns wheelchair route for wheelchair query", () => {
    const r = generateMockResponse("accessibility", "I need a wheelchair route");
    expect(r.toLowerCase()).toMatch(/wheelchair|accessible/);
  });

  it("returns general accessibility help for non-wheelchair query", () => {
    const r = generateMockResponse("accessibility", "What services do you offer?");
    expect(r.length).toBeGreaterThan(10);
  });
});

describe("generateMockResponse — operations type", () => {
  it("returns operations brief with incident info", () => {
    const r = generateMockResponse("operations", "Give me the operations brief");
    expect(r).toMatch(/Operations|Incident/i);
  });
});

describe("generateMockResponse — all types return strings", () => {
  it.each(ALL_TYPES)("type '%s' returns non-empty string", (type) => {
    const r = generateMockResponse(type, "generic query");
    expect(typeof r).toBe("string");
    expect(r.length).toBeGreaterThan(0);
  });
});

// ─── streamMockResponse ───────────────────────────────────────
describe("streamMockResponse", () => {
  it("calls onChunk for each word", async () => {
    const chunks: string[] = [];
    await streamMockResponse("hello world foo", (chunk) => chunks.push(chunk));
    expect(chunks.join("")).toBe("hello world foo");
  });

  it("calls onChunk at least once for single-word text", async () => {
    const chunks: string[] = [];
    await streamMockResponse("hello", (chunk) => chunks.push(chunk));
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join("")).toContain("hello");
  });

  it("resolves for empty string without throwing", async () => {
    await expect(streamMockResponse("", vi.fn())).resolves.toBeUndefined();
  });

  it("reconstructed text matches original", async () => {
    const text = "Gate C is open and accessible for all fans.";
    const chunks: string[] = [];
    await streamMockResponse(text, (c) => chunks.push(c));
    expect(chunks.join("")).toBe(text);
  });
});
