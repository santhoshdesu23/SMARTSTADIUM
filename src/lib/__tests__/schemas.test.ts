import { describe, it, expect } from "vitest";
import { aiChatSchema, contactFormSchema } from "@/lib/validations/schemas";
import type { AiAssistantType } from "@/types";

// ─── aiChatSchema ──────────────────────────────────────────────
describe("aiChatSchema — valid inputs", () => {
  const allAssistantTypes: AiAssistantType[] = [
    "stadium", "crowd", "sustainability", "accessibility", "operations",
  ];

  it.each(allAssistantTypes)("accepts assistantType '%s'", (assistantType) => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
      assistantType,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid message roles", () => {
    const result = aiChatSchema.safeParse({
      messages: [
        { role: "system", content: "You are a helper." },
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello!" },
      ],
      assistantType: "stadium",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional language field", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "Hola" }],
      assistantType: "stadium",
      language: "es",
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 1 message (minimum)", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "x" }],
      assistantType: "crowd",
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 50 messages (maximum)", () => {
    const messages = Array.from({ length: 50 }, () => ({ role: "user" as const, content: "hi" }));
    const result = aiChatSchema.safeParse({ messages, assistantType: "stadium" });
    expect(result.success).toBe(true);
  });

  it("accepts message content at exactly 4000 characters", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "a".repeat(4000) }],
      assistantType: "stadium",
    });
    expect(result.success).toBe(true);
  });
});

describe("aiChatSchema — invalid inputs", () => {
  it("rejects empty messages array", () => {
    expect(aiChatSchema.safeParse({ messages: [], assistantType: "stadium" }).success).toBe(false);
  });

  it("rejects 51 messages (over maximum)", () => {
    const messages = Array.from({ length: 51 }, () => ({ role: "user" as const, content: "hi" }));
    expect(aiChatSchema.safeParse({ messages, assistantType: "stadium" }).success).toBe(false);
  });

  it("rejects message content exceeding 4000 characters", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "x".repeat(4001) }],
      assistantType: "stadium",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message content", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "" }],
      assistantType: "stadium",
    });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only message content", () => {
    const result = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "   " }],
      assistantType: "stadium",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid assistantType", () => {
    expect(aiChatSchema.safeParse({
      messages: [{ role: "user", content: "hi" }],
      assistantType: "hacker",
    }).success).toBe(false);
  });

  it("rejects invalid message role", () => {
    expect(aiChatSchema.safeParse({
      messages: [{ role: "admin", content: "hi" }],
      assistantType: "stadium",
    }).success).toBe(false);
  });

  it("rejects language field exceeding 10 characters", () => {
    expect(aiChatSchema.safeParse({
      messages: [{ role: "user", content: "hi" }],
      assistantType: "stadium",
      language: "a".repeat(11),
    }).success).toBe(false);
  });

  it("rejects missing assistantType", () => {
    expect(aiChatSchema.safeParse({
      messages: [{ role: "user", content: "hi" }],
    }).success).toBe(false);
  });

  it("rejects non-array messages field", () => {
    expect(aiChatSchema.safeParse({
      messages: "hello",
      assistantType: "stadium",
    }).success).toBe(false);
  });
});

// ─── contactFormSchema ────────────────────────────────────────
describe("contactFormSchema — valid inputs", () => {
  const validBase = {
    name: "John Doe",
    email: "john@example.com",
    role: "fan" as const,
    message: "This is a valid test message.",
  };

  it("accepts a valid submission", () => {
    expect(contactFormSchema.safeParse(validBase).success).toBe(true);
  });

  it.each(["fan", "organizer", "volunteer", "staff", "other"] as const)(
    "accepts role '%s'",
    (role) => {
      expect(contactFormSchema.safeParse({ ...validBase, role }).success).toBe(true);
    }
  );

  it("accepts name at minimum length (2)", () => {
    expect(contactFormSchema.safeParse({ ...validBase, name: "Jo" }).success).toBe(true);
  });

  it("accepts name at maximum length (100)", () => {
    expect(contactFormSchema.safeParse({ ...validBase, name: "A".repeat(100) }).success).toBe(true);
  });

  it("accepts message at minimum length (10)", () => {
    expect(contactFormSchema.safeParse({ ...validBase, message: "0123456789" }).success).toBe(true);
  });

  it("accepts message at maximum length (2000)", () => {
    expect(contactFormSchema.safeParse({ ...validBase, message: "x".repeat(2000) }).success).toBe(true);
  });

  it("accepts email at maximum length (254)", () => {
    const local = "a".repeat(243);
    expect(contactFormSchema.safeParse({ ...validBase, email: `${local}@b.com` }).success).toBe(true);
  });
});

describe("contactFormSchema — invalid inputs", () => {
  const validBase = {
    name: "John Doe",
    email: "john@example.com",
    role: "fan" as const,
    message: "This is a valid test message.",
  };

  it("rejects name shorter than 2 characters", () => {
    expect(contactFormSchema.safeParse({ ...validBase, name: "J" }).success).toBe(false);
  });

  it("rejects name longer than 100 characters", () => {
    expect(contactFormSchema.safeParse({ ...validBase, name: "A".repeat(101) }).success).toBe(false);
  });

  it("rejects invalid email format", () => {
    expect(contactFormSchema.safeParse({ ...validBase, email: "not-an-email" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validBase, email: "@nodomain" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validBase, email: "no@" }).success).toBe(false);
  });

  it("rejects invalid role", () => {
    expect(contactFormSchema.safeParse({ ...validBase, role: "hacker" as never }).success).toBe(false);
  });

  it("rejects message shorter than 10 characters", () => {
    expect(contactFormSchema.safeParse({ ...validBase, message: "short" }).success).toBe(false);
  });

  it("rejects message longer than 2000 characters", () => {
    expect(contactFormSchema.safeParse({ ...validBase, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(contactFormSchema.safeParse({}).success).toBe(false);
    expect(contactFormSchema.safeParse({ name: "Jo" }).success).toBe(false);
  });
});
