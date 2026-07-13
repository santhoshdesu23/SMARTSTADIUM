import { NextRequest } from "next/server";
import { aiChatSchema } from "@/lib/validations/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { streamAiResponse } from "@/lib/ai/service";
import { sanitizeText } from "@/lib/sanitize";
import { logEvent, reportError } from "@/lib/observability";
import { API, RATE_LIMIT } from "@/lib/constants";
import { ValidationError, AuthenticationError, RateLimitError, PayloadTooLargeError, isAppError } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

    // Optional API key enforcement: if API_KEY is set, require matching header
    const requiredKey = process.env.API_KEY;
    if (requiredKey) {
      const provided = request.headers.get("x-api-key") || undefined;
      if (!provided || provided !== requiredKey) {
        throw new AuthenticationError("Invalid or missing API key");
      }
    }

    const limit = await rateLimit(`ai-chat:${ip}`, RATE_LIMIT.AI_CHAT_LIMIT, RATE_LIMIT.AI_CHAT_WINDOW_MS);

    if (!limit.success) {
      throw new RateLimitError("Rate limit exceeded. Please try again later.", {
        remaining: limit.remaining,
        resetAt: limit.resetAt,
      });
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > API.MAX_REQUEST_BYTES) {
      throw new PayloadTooLargeError("Payload too large");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError("Invalid JSON body");
    }

    const parsed = aiChatSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", { details: parsed.error.flatten() });
    }

    const { messages, assistantType, language } = parsed.data;
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: sanitizeText(m.content),
    }));

    if (sanitizedMessages.some((message) => message.content.length === 0)) {
      throw new ValidationError("Empty message content is not allowed");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAiResponse({
            assistantType,
            messages: sanitizedMessages,
            language,
          })) {
            controller.enqueue(encoder.encode(chunk));
            logEvent('ai.chat.chunk', { length: chunk.length, assistantType });
          }
        } catch (err) {
          const errMsg = "I apologize, but I encountered an error. Please try again.";
          reportError(err, 'ai.chat');
          controller.enqueue(encoder.encode(errMsg));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset": String(limit.resetAt),
      },
    });
  } catch (error) {
    if (isAppError(error)) {
      const headers: Record<string, string> = {};
      if (error instanceof RateLimitError && error.context) {
        headers["X-RateLimit-Remaining"] = String(error.context.remaining ?? "0");
        headers["X-RateLimit-Reset"] = String(error.context.resetAt ?? Date.now());
      }
      return Response.json({ error: error.message, code: error.code }, { 
        status: error.statusCode,
        headers,
      });
    }
    
    reportError(error, 'ai.chat');
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
