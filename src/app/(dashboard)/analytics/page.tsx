import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/features/metric-card";
import { StatListItem } from "@/components/features/stat-list-item";
import { getAnalyticsSnapshot } from "@/lib/domain/operations";
import { getFanDemographics, getAnalyticsMetrics } from "@/lib/domain/analytics";
import { siteConfig } from "@/config/site";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { LazyChartCard } from "@/components/features/lazy-dashboard-wrappers";

export const metadata = {
  title: "Analytics Dashboard",
};

export default function AnalyticsPage() {
  const { occupancyTrend, totalOccupancy, occupancyPercent } = getAnalyticsSnapshot();
  const fanDemographics = getFanDemographics();
  const analyticsMetrics = getAnalyticsMetrics();
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
        {analyticsMetrics.map((item) => (
          <StatListItem key={item.title} title={item.title} value={item.value} change={item.change} />
        ))}
      </div>
    </div>
  );
}
