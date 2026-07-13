import { describe, it, expect } from "vitest";
import { aiChatSchema } from "@/lib/validations/schemas";

describe("ai chat validation", () => {
  it("rejects oversized message payloads", () => {
    const oversized = {
      messages: [{ role: "user", content: "x".repeat(5000) }],
      assistantType: "stadium",
    };

    const result = aiChatSchema.safeParse(oversized);
    expect(result.success).toBe(false);
  });
});
