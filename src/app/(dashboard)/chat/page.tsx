"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supportedLanguages } from "@/config/site";
import type { AiAssistantType } from "@/types";
import { Bot, Users, Leaf, Accessibility, Settings } from "lucide-react";

const assistants: Array<{
  type: AiAssistantType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { type: "stadium", label: "Stadium", icon: Bot, description: "Navigation, seating, food & match info" },
  { type: "crowd", label: "Crowd", icon: Users, description: "Congestion & flow optimization" },
  { type: "sustainability", label: "Green", icon: Leaf, description: "Eco transport & carbon insights" },
  { type: "accessibility", label: "Access", icon: Accessibility, description: "Inclusive assistance" },
  { type: "operations", label: "Ops", icon: Settings, description: "Incidents & volunteer coordination" },
];

export default function ChatPage() {
  const [assistantType, setAssistantType] = useState<AiAssistantType>("stadium");
  const [language, setLanguage] = useState("en");

  const current = assistants.find((a) => a.type === assistantType)!;

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Multilingual GenAI assistant for fans, staff, and organizers"
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={assistantType} onValueChange={(v) => setAssistantType(v as AiAssistantType)}>
          <TabsList aria-label="Select chat assistant" className="flex-wrap h-auto">
            {assistants.map((a) => (
              <TabsTrigger key={a.type} value={a.type} className="gap-1.5">
                <a.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {a.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm text-muted-foreground">
            Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        <current.icon className="inline h-4 w-4 mr-1" aria-hidden="true" />
        {current.description}
      </p>

      <AiChatPanel
        key={`${assistantType}-${language}`}
        assistantType={assistantType}
        title={`${current.label} AI Assistant`}
        language={language}
        suggestions={[
          "What's the fastest way to my seat?",
          "Summarize current stadium status",
          "Help me find accessible seating",
        ]}
      />
    </div>
  );
}
