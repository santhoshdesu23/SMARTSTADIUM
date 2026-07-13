import OpenAI from "openai";
import type { AiAssistantType } from "@/types";
import { generateMockResponse, getSystemPrompt, streamMockResponse } from "./prompts";
import { sanitizeAiOutput } from "@/lib/sanitize";
import { logEvent, reportError } from "@/lib/observability";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface AiStreamOptions {
  assistantType: AiAssistantType;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  language?: string;
}

export async function* streamAiResponse(
  options: AiStreamOptions
): AsyncGenerator<string> {
  const client = getOpenAIClient();
  const lastUserMessage =
    [...options.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!client) {
    logEvent("ai.mock_mode", { assistantType: options.assistantType });
    const mockText = generateMockResponse(options.assistantType, lastUserMessage);
    const chunks: string[] = [];
    await streamMockResponse(mockText, (chunk) => chunks.push(chunk));
    yield* chunks;
    return;
  }

  const systemPrompt = getSystemPrompt(options.assistantType);
  const languageNote = options.language ? `\nRespond in ${options.language}.` : "";

  try {
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt + languageNote },
        ...options.messages,
      ],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield sanitizeAiOutput(content);
      }
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), "ai.service");
    yield sanitizeAiOutput(generateMockResponse(options.assistantType, lastUserMessage));
  }
}
