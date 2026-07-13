import { NextRequest } from "next/server";
import { aiChatSchema } from "@/lib/validations/schemas";
import { rateLimit } from "@/lib/rate-limit";
import { streamAiResponse } from "@/lib/ai/service";
import { sanitizeText } from "@/lib/sanitize";
import { logEvent, reportError } from "@/lib/observability";

const MAX_REQUEST_BYTES = 64_000;

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

  // Optional API key enforcement: if API_KEY is set, require matching header
  const requiredKey = process.env.API_KEY;
  if (requiredKey) {
    const provided = request.headers.get("x-api-key") || undefined;
    if (!provided || provided !== requiredKey) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const limit = await rateLimit(`ai-chat:${ip}`, 30, 60_000);

  if (!limit.success) {
    return Response.json(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.resetAt),
        },
      }
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = aiChatSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { messages, assistantType, language } = parsed.data;
  const sanitizedMessages = messages.map((m) => ({
    role: m.role,
    content: sanitizeText(m.content),
  }));

  if (sanitizedMessages.some((message) => message.content.length === 0)) {
    return Response.json({ error: "Empty message content is not allowed" }, { status: 400 });
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
      } catch {
        const errMsg = "I apologize, but I encountered an error. Please try again.";
        reportError(new Error('AI stream failed'), 'ai.chat');
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
}
