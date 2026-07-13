"use client";

import Link from "next/link";
import { Bell, Moon, Sun, Contrast, Palette } from "lucide-react";
import { useCallback } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/lib/data/mock-stadium";

export function Header() {
  const { theme, setTheme } = useTheme();
  const unread = notifications.filter((n) => !n.read).length;

  const cycleTheme = useCallback(() => {
    const modes = ["dark", "light", "high-contrast", "colorblind"] as const;
    const idx = modes.indexOf(theme as typeof modes[number]);
    setTheme(modes[(idx + 1) % modes.length]);
  }, [theme, setTheme]);

  const ThemeIcon =
    theme === "light" ? Sun : theme === "high-contrast" ? Contrast : theme === "colorblind" ? Palette : Moon;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-panel px-4 md:px-8 md:pl-72">
      <div className="ml-12 flex flex-col md:ml-0">
        <p className="text-xs text-muted-foreground">{siteConfig.stadium}</p>
        <h1 className="text-sm font-semibold md:text-base">{siteConfig.match}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="success" className="hidden sm:inline-flex">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Live
        </Badge>

        <Button variant="ghost" size="icon" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unread}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          aria-label={`Current theme: ${theme}. Click to change.`}
        >
          <ThemeIcon className="h-4 w-4" />
        </Button>

        <Button variant="glass" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/chat">AI Assistant</Link>
        </Button>
      </div>
    </header>
  );
}
