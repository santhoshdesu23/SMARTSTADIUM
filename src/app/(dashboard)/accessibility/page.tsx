import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility, Ear, Eye, Hand, Mic, Volume2 } from "lucide-react";
import { getAccessibilityServices, getAccessibleSeatingMap } from "@/lib/domain/accessibility";

export const metadata = {
  title: "Accessibility Hub",
};

const SERVICE_ICONS = {
  "Wheelchair Routes": Accessibility,
  "Audio Description": Ear,
  "Visual Assistance": Eye,
  "Sign Language": Hand,
  "Speech-to-Text": Mic,
  "Text-to-Speech": Volume2,
} as const;

export default function AccessibilityPage() {
  const services = getAccessibilityServices();
  const seatingMap = getAccessibleSeatingMap();
  return (
    <div>
      <PageHeader
        title="Accessibility Hub"
        description="Inclusive stadium experience with AI-powered assistance for all fans"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Accessible Gates" value="5/6" subtitle="Gate B elevator maintenance" icon={<Accessibility />} />
        <MetricCard title="Companion Seats" value="340" subtitle="Available today" icon={<Hand />} />
        <MetricCard title="Aid Stations" value="8" subtitle="Fully staffed" icon={<Ear />} />
        <MetricCard title="Satisfaction" value="96%" subtitle="Accessibility rating" icon={<Eye />} trend="up" trendValue="+2% vs last match" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = SERVICE_ICONS[service.title as keyof typeof SERVICE_ICONS];
          return (
            <Card key={service.title} className="glass hover:border-info/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                  {Icon && <Icon className="h-6 w-6 text-info" aria-hidden="true" />}
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{service.desc}</p>
                <p className="mt-3 text-xs font-medium text-success">{service.status}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Accessible Seating Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seatingMap.map((s) => (
                <div key={s} className="rounded-lg bg-muted/30 px-4 py-3 text-sm">{s}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <AiChatPanel
          assistantType="accessibility"
          title="Accessibility AI Assistant"
          suggestions={[
            "Wheelchair route to Section 214",
            "Where is audio description?",
            "Companion seat availability",
          ]}
        />
      </div>
    </div>
  );
}
