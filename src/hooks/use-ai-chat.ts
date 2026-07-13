"use client";

import { useCallback, useRef, useState } from "react";
import type { AiAssistantType, ChatMessage } from "@/types";
import { reportError } from "@/lib/observability";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_VISIBLE_CHARS = 20_000;
const UI_FLUSH_INTERVAL_MS = 60;

interface UseAiChatOptions {
  assistantType: AiAssistantType;
  language?: string;
}

interface UseAiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAiChat({ assistantType, language }: UseAiChatOptions): UseAiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to access latest values inside async streaming closures
  // without stale captures.
  const isLoadingRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  /** Batch-flush an assistant message content update. */
  const flushContent = useCallback((assistantId: string, content: string) => {
    messagesRef.current = messagesRef.current.map((m) =>
      m.id === assistantId ? { ...m, content } : m
    );
    setMessages([...messagesRef.current]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoadingRef.current) return;

      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message exceeds ${MAX_MESSAGE_LENGTH} characters.`);
        return;
      }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      // Update ref and state atomically before any async work.
      messagesRef.current = [...messagesRef.current, userMsg];
      setMessages([...messagesRef.current]);
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const assistantId = crypto.randomUUID();
      messagesRef.current = [
        ...messagesRef.current,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ];
      setMessages([...messagesRef.current]);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesRef.current.map((m) => ({ role: m.role, content: m.content })),
            assistantType,
            language,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({ error: "Request failed" }))) as {
            error?: string;
          };
          throw new Error(errBody.error ?? "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        // Stream response with batched UI updates.
        const decoder = new TextDecoder();
        let accumulated = "";
        let lastFlush = performance.now();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          accumulated += decoder.decode(value, { stream: true });

          if (performance.now() - lastFlush > UI_FLUSH_INTERVAL_MS) {
            flushContent(assistantId, accumulated.slice(-MAX_VISIBLE_CHARS));
            lastFlush = performance.now();
          }
        }

        // Always flush the final accumulated content.
        flushContent(assistantId, accumulated.slice(-MAX_VISIBLE_CHARS));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          reportError(err, "ai-chat");
          setError((err as Error).message);
          // Remove the empty placeholder on error.
          messagesRef.current = messagesRef.current.filter((m) => m.id !== assistantId);
          setMessages([...messagesRef.current]);
        }
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [assistantType, language, flushContent]
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    messagesRef.current = [];
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
