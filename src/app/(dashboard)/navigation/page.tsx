import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyAiChatPanel, LazyStadiumMap } from "@/components/features/lazy-dashboard-wrappers";
import { StatusBadge } from "@/components/ui/badge";
import { getNavigationSnapshot } from "@/lib/domain/operations";
import { MapPin, Navigation, Clock, Accessibility } from "lucide-react";
import { MetricCard } from "@/components/features/metric-card";

export const metadata = {
  title: "Smart Navigation",
};

const routes = [
  { id: "r1", from: "Main Entrance", to: "Section 214", time: "6 min", accessible: true, crowd: "medium" },
  { id: "r2", from: "Gate C", to: "Food Court A", time: "4 min", accessible: true, crowd: "low" },
  { id: "r3", from: "Gate E", to: "Section 112", time: "8 min", accessible: true, crowd: "high" },
  { id: "r4", from: "Parking Lot K", to: "Gate D", time: "12 min", accessible: true, crowd: "low" },
];

export default function NavigationPage() {
  const { gateStatuses } = getNavigationSnapshot();
  return (
    <div>
      <PageHeader
        title="Smart Stadium Navigation"
        description="AI-powered routing with real-time gate wait times and accessibility-first paths"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Fastest Gate" value="Gate D" subtitle="2 min wait" icon={<Navigation />} />
        <MetricCard title="Avg Walk Time" value="7 min" subtitle="To any section" icon={<Clock />} />
        <MetricCard title="Accessible Routes" value="12" subtitle="Wheelchair optimized" icon={<Accessibility />} />
        <MetricCard title="Active Waypoints" value="48" subtitle="Across stadium" icon={<MapPin />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LazyStadiumMap />
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Popular Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {routes.map((route) => (
                <li key={route.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{route.from} → {route.to}</p>
                    <p className="text-xs text-muted-foreground">
                      {route.time} · {route.accessible ? "♿ Accessible" : "Standard"}
                    </p>
                  </div>
                  <StatusBadge status={route.crowd === "high" ? "busy" : route.crowd === "medium" ? "busy" : "normal"} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <LazyAiChatPanel
          assistantType="stadium"
          title="Navigation Assistant"
          placeholder="Where do you want to go?"
          suggestions={[
            "How do I get to Section 214?",
            "Fastest gate from parking?",
            "Find nearest restroom",
          ]}
        />
      </div>
    </div>
  );
}
