import { Users, Activity, AlertTriangle, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardMetrics } from "@/components/features/dashboard-metrics";
import { ZoneGrid } from "@/components/features/zone-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyChartCard, LazyStadiumMap } from "@/components/features/lazy-dashboard-wrappers";
import { StatusBadge } from "@/components/ui/badge";
import { getOperationsSnapshot } from "@/lib/domain/operations";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/utils";

export const metadata = {
  title: "AI Command Center",
};

export default function CommandCenterPage() {
  const snapshot = getOperationsSnapshot();
  const { stadiumZones, gateStatuses, incidents, occupancyTrend, totalOccupancy, occupancyPercent, notifications } = snapshot;
  const activeIncidents = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div>
      <PageHeader
        title="AI Command Center"
        description={`Live operations dashboard for ${siteConfig.stadium}`}
      />

      <DashboardMetrics
        metrics={[
          { title: "Current Occupancy", value: `${occupancyPercent}%`, subtitle: `${formatNumber(totalOccupancy)} fans inside`, icon: <Users />, trend: "up", trendValue: "+12% vs last hour" },
          { title: "Active Incidents", value: activeIncidents, subtitle: "In progress", icon: <AlertTriangle />, trend: "down", trendValue: "-1 from peak" },
          { title: "Avg Gate Wait", value: "10 min", subtitle: "Gate C fastest at 4 min", icon: <Clock />, trend: "stable", trendValue: "Within target" },
          { title: "System Status", value: "Operational", subtitle: "All AI services online", icon: <Activity />, trend: "up", trendValue: "99.9% uptime" },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LazyChartCard title="Occupancy Trend — Today" data={occupancyTrend} />
        <LazyStadiumMap highlightZone="south" />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Zone Status</h2>
        <ZoneGrid zones={stadiumZones} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Gate Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {gateStatuses.map((gate) => (
                <li
                  key={gate.id}
                  className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{gate.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {gate.waitMinutes} min wait
                      {gate.accessible && " · Accessible"}
                    </p>
                  </div>
                  <StatusBadge status={gate.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Live Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list" aria-live="polite">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="rounded-lg bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{n.title}</p>
                    <StatusBadge status={n.type === "warning" ? "medium" : n.type === "emergency" ? "high" : "low"} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
