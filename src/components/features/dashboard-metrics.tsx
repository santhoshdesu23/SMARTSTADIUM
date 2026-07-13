"use client";

import { memo } from "react";
import type { ReactNode } from "react";
import { MetricCard } from "./metric-card";
import { cn } from "@/lib/utils";

export interface MetricItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

interface DashboardMetricsProps {
  metrics: MetricItem[];
  className?: string;
}

export const DashboardMetrics = memo(function DashboardMetrics({
  metrics,
  className,
}: DashboardMetricsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {metrics.map((m) => (
        <MetricCard
          key={m.title}
          title={m.title}
          value={m.value}
          subtitle={m.subtitle}
          icon={m.icon ?? null}
          trend={m.trend}
          trendValue={m.trendValue}
        />
      ))}
    </div>
  );
});
