"use client";

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { Send, Loader2, Trash2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiChat } from "@/hooks/use-ai-chat";
import type { AiAssistantType, ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface AiChatPanelProps {
  assistantType: AiAssistantType;
  title: string;
  placeholder?: string;
  suggestions?: string[];
  language?: string;
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList = memo(function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex gap-3",
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              msg.role === "user" ? "bg-primary/20" : "bg-muted"
            )}
            aria-hidden="true"
          >
            {msg.role === "user" ? (
              <User className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Bot className="h-4 w-4" aria-hidden="true" />
            )}
          </div>
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50"
            )}
            role="article"
            aria-label={msg.role === "user" ? "Your message" : "Assistant response"}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {msg.role === "assistant" && !msg.content && isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading response" />
            )}
          </div>
        </div>
      ))}
    </>
  );
});

export function AiChatPanel({
  assistantType,
  title,
  placeholder = "Ask anything...",
  suggestions = [],
  language,
}: AiChatPanelProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAiChat({
    assistantType,
    language,
  });
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (typeof scrollRef.current.scrollTo === "function") {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    } else {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading || isComposing) return;
      sendMessage(input);
      setInput("");
    },
    [input, isLoading, isComposing, sendMessage]
  );

  const handleSuggestion = useCallback((s: string) => sendMessage(s), [sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !isComposing) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [isComposing, handleSubmit]
  );

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearMessages}
          aria-label="Clear conversation"
          disabled={messages.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        tabIndex={-1}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <Bot className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Start a conversation with the AI assistant
            </p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestion(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {error && (
        <p className="px-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="border-t border-border/50 p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[44px] resize-none"
              rows={1}
              aria-label="Message input"
              aria-describedby="chat-input-help"
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={handleKeyDown}
            />
            <p id="chat-input-help" className="mt-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for a new line.
            </p>
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
