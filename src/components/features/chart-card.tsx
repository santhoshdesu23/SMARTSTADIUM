"use client";

import { useId, memo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsDataPoint } from "@/types";

interface ChartCardProps {
  title: string;
  data: AnalyticsDataPoint[];
  type?: "area" | "bar";
  color?: string;
}

export const ChartCard = memo(function ChartCard({
  title,
  data,
  type = "area",
  color = "#3b82f6",
}: ChartCardProps) {
  const id = useId();
  const gradientId = `chart-gradient-${id}`;
  const summaryId = `chart-summary-${id}`;

  const tooltipStyle = {
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
  };

  const gridStroke = "rgba(255,255,255,0.05)";
  const axisStroke = "#888";

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="h-[280px]"
          role="img"
          aria-label={`${title} chart`}
          aria-describedby={summaryId}
        >
          <p id={summaryId} className="sr-only">
            Chart summarizing the latest operational trends for {title}.
          </p>
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="timestamp" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={`url(#${gradientId})`}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="timestamp" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});
