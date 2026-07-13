import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/features/metric-card";
import { ZoneGrid } from "@/components/features/zone-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getOperationsSnapshot } from "@/lib/domain/operations";
import { LazyAiChatPanel, LazyChartCard } from "@/components/features/lazy-dashboard-wrappers";
import { AlertTriangle, TrendingUp, Users, DoorOpen } from "lucide-react";

export const metadata = {
  title: "Crowd Intelligence",
};

export default function CrowdPage() {
  const snapshot = getOperationsSnapshot();
  const { stadiumZones, gateStatuses, occupancyTrend } = snapshot;
  const criticalZones = stadiumZones.filter((z) => z.status === "critical" || z.status === "busy");

  return (
    <div>
      <PageHeader
        title="AI Crowd Intelligence"
        description="Real-time crowd analytics, congestion prediction, and AI-powered flow optimization"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Peak Predicted" value="78,200" subtitle="In 35 minutes" icon={<TrendingUp />} trend="up" trendValue="+5% forecast" />
        <MetricCard title="Critical Zones" value={criticalZones.length} subtitle="Require attention" icon={<AlertTriangle />} trend="up" trendValue="South Stand critical" />
        <MetricCard title="Flow Rate" value="1,240/min" subtitle="Entry rate" icon={<Users />} trend="stable" trendValue="Normal range" />
        <MetricCard title="Gates Open" value="5/6" subtitle="Gate B restricted" icon={<DoorOpen />} trend="stable" trendValue="Auxiliary lanes available" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LazyChartCard title="Crowd Density Over Time" data={occupancyTrend} type="bar" color="#f59e0b" />
          <div>
            <h2 className="mb-4 text-lg font-semibold">Zone Occupancy</h2>
            <ZoneGrid zones={stadiumZones} />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Open Gate B auxiliary lanes to reduce South Stand congestion",
                "Deploy 4 volunteers to South Concourse for flow guidance",
                "Redirect incoming fans from Gate E to Gate C (18 min faster)",
                "Activate overflow seating protocol in East Stand",
              ].map((rec) => (
                <div key={rec} className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-sm">
                  {rec}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Gate Wait Times</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" role="list">
                {gateStatuses.map((g) => (
                  <li key={g.id} className="flex items-center justify-between text-sm">
                    <span>{g.name.split("—")[0]}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{g.waitMinutes} min</span>
                      <StatusBadge status={g.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <LazyAiChatPanel
          assistantType="crowd"
          title="Crowd Intelligence AI"
          suggestions={[
            "Summarize current crowd status",
            "Which gate should I use?",
            "Predict peak congestion time",
          ]}
        />
      </div>
    </div>
  );
}
