import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logEvent, reportError } from "@/lib/observability";

describe("observability", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Override NODE_ENV so logging actually runs (not silenced by test guard)
    Object.defineProperty(process.env, "NODE_ENV", { value: "development", configurable: true });
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(process.env, "NODE_ENV", { value: originalEnv, configurable: true });
    vi.restoreAllMocks();
  });

  // ─── logEvent ─────────────────────────────────────────────
  describe("logEvent", () => {
    it("calls console.info with a JSON string", () => {
      logEvent("test.event", { key: "value" });
      expect(infoSpy).toHaveBeenCalledOnce();
      const arg = infoSpy.mock.calls[0][0] as string;
      expect(() => JSON.parse(arg)).not.toThrow();
    });

    it("includes the event name in the output", () => {
      logEvent("stadium.gate.opened", { gate: "C" });
      const arg = infoSpy.mock.calls[0][0] as string;
      const parsed = JSON.parse(arg);
      expect(parsed.event).toBe("stadium.gate.opened");
    });

    it("includes the payload in the output", () => {
      logEvent("test.payload", { foo: "bar", count: 42 });
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.payload).toMatchObject({ foo: "bar", count: 42 });
    });

    it("includes a timestamp in ISO format", () => {
      logEvent("ts.check");
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("includes level: info", () => {
      logEvent("level.check");
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe("info");
    });

    it("works with no payload argument", () => {
      expect(() => logEvent("no.payload")).not.toThrow();
      const parsed = JSON.parse(infoSpy.mock.calls[0][0] as string);
      expect(parsed.payload).toBeDefined();
    });

    it("does not throw for non-serialisable payload values", () => {
      // Circular reference — should not throw
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      expect(() => logEvent("circular", obj as Record<string, unknown>)).not.toThrow();
    });
  });

  // ─── reportError ──────────────────────────────────────────
  describe("reportError", () => {
    it("calls console.error with a JSON string", () => {
      reportError(new Error("boom"), "test.context");
      expect(errorSpy).toHaveBeenCalledOnce();
      const arg = errorSpy.mock.calls[0][0] as string;
      expect(() => JSON.parse(arg)).not.toThrow();
    });

    it("includes the error message for Error instances", () => {
      reportError(new Error("something broke"), "ctx");
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.error.message).toBe("something broke");
    });

    it("includes stack trace for Error instances", () => {
      reportError(new Error("with stack"), "ctx");
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.error.stack).toBeDefined();
    });

    it("stringifies non-Error values", () => {
      reportError("plain string error", "ctx");
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.error.message).toBe("plain string error");
    });

    it("handles null error value", () => {
      expect(() => reportError(null, "ctx")).not.toThrow();
    });

    it("uses default context 'app' when none provided", () => {
      reportError(new Error("no ctx"));
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.context).toBe("app");
    });

    it("includes level: error", () => {
      reportError(new Error("e"), "ctx");
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.level).toBe("error");
    });

    it("includes the provided context string", () => {
      reportError(new Error("e"), "ai.service");
      const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
      expect(parsed.context).toBe("ai.service");
    });
  });
});
