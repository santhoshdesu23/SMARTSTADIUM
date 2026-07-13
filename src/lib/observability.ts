type LogLevel = "info" | "warn" | "error";
type LogPayload = Record<string, unknown>;

interface LogEntry {
  ts: string;
  level: LogLevel;
  event: string;
  payload: LogPayload;
}

interface ErrorEntry {
  ts: string;
  level: "error";
  context: string;
  error: { message: string; stack?: string };
}

function serialize(obj: LogEntry | ErrorEntry): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return JSON.stringify({ ts: obj.ts, level: obj.level, error: "serialization_failed" });
  }
}

// Allow test environment to override the guard via environment variable
const isTest = process.env.NODE_ENV === "test" && process.env.VITEST_ENABLE_LOGGING !== "true";

export function logEvent(event: string, payload: LogPayload = {}): void {
  if (isTest) return;
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level: "info",
    event,
    payload,
  };
  console.info(serialize(entry));
}

export function reportError(error: unknown, context = "app"): void {
  if (isTest) return;
  const entry: ErrorEntry = {
    ts: new Date().toISOString(),
    level: "error",
    context,
    error:
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) },
  };
  console.error(serialize(entry));
}
