import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getTransportationSnapshot } from "@/lib/domain/operations";
import { getTransportIconEmoji, getCrowdLevelBadgeStatus } from "@/lib/domain/navigation";
import { Bus, Bike, Leaf, Clock } from "lucide-react";

export const metadata = {
  title: "Transportation Hub",
};

export default function TransportationPage() {
  const { transportOptions, greenOptions } = getTransportationSnapshot();

  return (
    <div>
      <PageHeader
        title="Transportation Hub"
        description="Eco-friendly transit options with AI-powered route recommendations"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Green Arrivals" value="64%" subtitle="Using eco transport" icon={<Leaf />} trend="up" trendValue="Target: 70%" />
        <MetricCard title="Fastest Option" value="8 min" subtitle="FIFA Shuttle Express" icon={<Clock />} />
        <MetricCard title="Active Routes" value={transportOptions.length} subtitle="All operational" icon={<Bus />} />
        <MetricCard title="Bike Stations" value="4" subtitle="Lot K, A, C, F" icon={<Bike />} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transportOptions.map((option) => (
          <Card key={option.id} className="glass hover:border-success/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={option.type}>{getTransportIconEmoji(option.type)}</span>
                  <div>
                    <h3 className="font-semibold">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">ETA: {option.eta} min</p>
                  </div>
                </div>
                <StatusBadge status={getCrowdLevelBadgeStatus(option.crowdLevel)} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                  {option.carbonKg} kg CO₂
                </span>
                {option.accessible && (
                  <span className="rounded-full bg-info/10 px-2 py-1 text-info">♿ Accessible</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-base">AI Green Transport Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on your location and current traffic, we recommend the{" "}
              <strong className="text-foreground">FIFA Shuttle Express</strong> — arriving in 8 minutes
              with only 0.8 kg CO₂ (vs 2.1 kg for rideshare). {greenOptions.length} eco-friendly options available.
            </p>
          </CardContent>
        </Card>

        <AiChatPanel
          assistantType="sustainability"
          title="Transport & Sustainability AI"
          suggestions={[
            "Best eco-friendly route to stadium",
            "Compare carbon footprint of options",
            "Accessible transport from Lot K",
          ]}
        />
      </div>
    </div>
  );
}
