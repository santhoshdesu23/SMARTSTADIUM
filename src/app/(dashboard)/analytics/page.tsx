import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSnapshot } from "@/lib/domain/operations";
import { siteConfig } from "@/config/site";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { LazyChartCard } from "@/components/features/lazy-dashboard-wrappers";

export const metadata = {
  title: "Analytics Dashboard",
};

const fanDemographics = [
  { timestamp: "Local", value: 45 },
  { timestamp: "National", value: 35 },
  { timestamp: "International", value: 20 },
];

export default function AnalyticsPage() {
  const { occupancyTrend, totalOccupancy, occupancyPercent } = getAnalyticsSnapshot();
  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        description={`Tournament insights and operational analytics for ${siteConfig.stadium}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Attendance" value={formatNumber(totalOccupancy)} subtitle={`${occupancyPercent}% capacity`} icon={<Users />} trend="up" trendValue="+8% vs avg" />
        <MetricCard title="Revenue Index" value="112" subtitle="Above forecast" icon={<TrendingUp />} trend="up" trendValue="+12 points" />
        <MetricCard title="Fan Engagement" value="87%" subtitle="App usage rate" icon={<BarChart3 />} trend="up" trendValue="+5% vs last match" />
        <MetricCard title="Intl. Visitors" value="20%" subtitle="Of total attendance" icon={<Globe />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LazyChartCard title="Occupancy Timeline" data={occupancyTrend} />
        <LazyChartCard title="Fan Demographics (%)" data={fanDemographics} type="bar" color="#8b5cf6" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          { title: "Concession Sales", value: "$2.4M", change: "+18%" },
          { title: "Merchandise", value: "$890K", change: "+24%" },
          { title: "Avg Dwell Time", value: "4.2 hrs", change: "+0.3 hrs" },
          { title: "App Sessions", value: "34,200", change: "+42%" },
          { title: "AI Queries", value: "8,450", change: "+67%" },
          { title: "NPS Score", value: "78", change: "+6 pts" },
        ].map((item) => (
          <Card key={item.title} className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-success">{item.change} vs last match</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
