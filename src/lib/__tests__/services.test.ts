import { describe, expect, it } from "vitest";
import { canAccessDashboard, getCurrentUser } from "@/lib/auth/session";
import { submitContactForm } from "@/lib/services/contact-service";

// ─── submitContactForm ────────────────────────────────────────
describe("submitContactForm — valid submissions", () => {
  const validBase = {
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "fan" as const,
    message: "I would love a tour of the operations center.",
  };

  it("returns ok:true for a fully valid payload", async () => {
    const result = await submitContactForm(validBase);
    expect(result.ok).toBe(true);
  });

  it("returns the submitted data on success", async () => {
    const result = await submitContactForm(validBase);
    if (!result.ok) throw new Error("Expected ok:true");
    expect(result.data.name).toBe("Jamie Smith");
    expect(result.data.role).toBe("fan");
  });

  it("returns a message string on success", async () => {
    const result = await submitContactForm(validBase);
    if (!result.ok) throw new Error("Expected ok:true");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });

  it.each(["fan", "organizer", "volunteer", "staff", "other"] as const)(
    "accepts role '%s'",
    async (role) => {
      const result = await submitContactForm({ ...validBase, role });
      expect(result.ok).toBe(true);
    }
  );

  it("accepts minimum-length message (10 chars)", async () => {
    const result = await submitContactForm({ ...validBase, message: "0123456789" });
    expect(result.ok).toBe(true);
  });

  it("accepts maximum-length message (2000 chars)", async () => {
    const result = await submitContactForm({ ...validBase, message: "x".repeat(2000) });
    expect(result.ok).toBe(true);
  });
});

describe("submitContactForm — invalid submissions", () => {
  it("returns ok:false for invalid email", async () => {
    const result = await submitContactForm({
      name: "Jamie",
      email: "not-an-email",
      role: "fan",
      message: "This is a long enough message.",
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for name shorter than 2 chars", async () => {
    const result = await submitContactForm({
      name: "J",
      email: "j@example.com",
      role: "fan",
      message: "This is a long enough message.",
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for message shorter than 10 chars", async () => {
    const result = await submitContactForm({
      name: "Jamie",
      email: "jamie@example.com",
      role: "fan",
      message: "Short",
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for invalid role", async () => {
    const result = await submitContactForm({
      name: "Jamie",
      email: "jamie@example.com",
      role: "hacker" as never,
      message: "This is a long enough message.",
    });
    expect(result.ok).toBe(false);
  });

  it("returns error object on failure", async () => {
    const result = await submitContactForm({
      name: "J",
      email: "bad",
      role: "fan",
      message: "Hi",
    });
    if (result.ok) throw new Error("Expected ok:false");
    expect(result.error).toBeDefined();
  });
});

// ─── canAccessDashboard ───────────────────────────────────────
describe("canAccessDashboard", () => {
  it("allows the demo admin user to access analytics", () => {
    const user = getCurrentUser();
    expect(canAccessDashboard(user, "/analytics")).toBe(true);
  });

  it("blocks fan from analytics", () => {
    expect(canAccessDashboard({ id: "f", name: "Fan", role: "fan" }, "/analytics")).toBe(false);
  });

  it("allows any user to access public about page", () => {
    expect(canAccessDashboard({ id: "f", name: "Fan", role: "fan" }, "/about")).toBe(true);
  });

  it("blocks volunteer from command-center", () => {
    expect(canAccessDashboard({ id: "v", name: "Vol", role: "volunteer" }, "/command-center")).toBe(false);
  });

  it("allows operator to access crowd", () => {
    expect(canAccessDashboard({ id: "o", name: "Op", role: "operator" }, "/crowd")).toBe(true);
  });
});
