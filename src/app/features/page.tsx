import Link from "next/link";
import { ArrowRight, Bot, Users, Map, Accessibility, Bus, Siren, Leaf, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Features",
};

const features = [
  { icon: Bot, title: "AI Stadium Assistant", href: "/chat", desc: "Natural language help in 8 languages" },
  { icon: Users, title: "Crowd Intelligence", href: "/crowd", desc: "AI congestion prediction & flow optimization" },
  { icon: Map, title: "Smart Navigation", href: "/navigation", desc: "Context-aware routing with gate wait times" },
  { icon: Accessibility, title: "Accessibility Hub", href: "/accessibility", desc: "Wheelchair routes, audio description, TTS/STT" },
  { icon: Bus, title: "Transportation Hub", href: "/transportation", desc: "Eco-friendly transit recommendations" },
  { icon: Siren, title: "Emergency Center", href: "/emergency", desc: "AI crisis response & incident management" },
  { icon: Leaf, title: "Sustainability", href: "/sustainability", desc: "Carbon tracking & waste optimization" },
  { icon: BarChart3, title: "Analytics", href: "/analytics", desc: "Tournament insights & operational data" },
];

export default function FeaturesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Platform Features"
        description="Every feature powered by Generative AI to enhance FIFA World Cup 2026 operations"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="glass group rounded-2xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              Explore <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/command-center">
            Launch Command Center
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
