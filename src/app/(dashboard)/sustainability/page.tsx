import { PageHeader } from "@/components/layout/page-header";
import { AiChatPanel } from "@/components/features/ai-chat-panel";
import { MetricCard } from "@/components/features/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSustainabilitySnapshot } from "@/lib/domain/operations";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";

export const metadata = {
  title: "Sustainability Dashboard",
};

export default function SustainabilityPage() {
  const { sustainabilityMetrics } = getSustainabilitySnapshot();
  return (
    <div>
      <PageHeader
        title="Sustainability Dashboard"
        description="AI-driven eco operations — carbon tracking, waste optimization, and green transport"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="CO₂ Offset Today" value="847 kg" subtitle="85% of daily goal" icon={<Leaf />} trend="up" trendValue="+120 kg vs yesterday" />
        <MetricCard title="Waste Diverted" value="72%" subtitle="Target: 80%" icon={<Recycle />} trend="up" trendValue="+5% improvement" />
        <MetricCard title="Energy Usage" value="68%" subtitle="Of baseline" icon={<Zap />} trend="down" trendValue="Solar panels active" />
        <MetricCard title="Water Saved" value="12.4K L" subtitle="Recycling systems" icon={<Droplets />} trend="up" trendValue="On track" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sustainabilityMetrics.map((metric) => {
          const pct = Math.round((metric.value / metric.target) * 100);
          return (
            <Card key={metric.id} className="glass">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.label}</h3>
                <p className="mt-1 text-2xl font-bold">
                  {metric.value.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                </p>
                <Progress value={Math.min(pct, 100)} className="mt-4" indicatorClassName="bg-success" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Target: {metric.target.toLocaleString()} {metric.unit} ({pct}%)
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="text-base">AI Sustainability Report</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground">
              Today&apos;s operations have offset <strong className="text-success">847 kg of CO₂</strong>, with 64% of fans
              using green transport. Waste diversion improved to 72% through optimized sorting stations.
              Energy consumption is 32% below baseline thanks to solar panel integration.
              Projected to reach the 1,000 kg daily carbon offset target by halftime.
            </p>
          </CardContent>
        </Card>

        <AiChatPanel
          assistantType="sustainability"
          title="Sustainability AI Assistant"
          suggestions={[
            "Generate sustainability report",
            "Best eco-friendly transport options",
            "How can we reduce waste further?",
          ]}
        />
      </div>
    </div>
  );
}
