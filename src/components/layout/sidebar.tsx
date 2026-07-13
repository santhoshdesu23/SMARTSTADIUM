"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  BarChart3,
  Bot,
  Bus,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Map,
  Menu,
  Siren,
  Users,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Map,
  Accessibility,
  Bus,
  HeartHandshake,
  Siren,
  Leaf,
  BarChart3,
  Bot,
};

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = useMemo(
    () => (
      <nav aria-label="Main navigation" className="flex flex-col gap-1 p-4">
        {mainNav.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    ),
    [pathname]
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              SO
            </div>
            <span className="font-semibold">{siteConfig.name}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
