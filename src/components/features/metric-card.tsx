"use client";

import { memo, cloneElement, isValidElement, type ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  className?: string;
}

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const;

const TREND_CLASSES = {
  up: "text-success",
  down: "text-destructive",
  stable: "text-muted-foreground",
} as const;

export const MetricCard = memo(function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  const TrendIcon = trend ? TREND_ICONS[trend] : null;

  const renderedIcon = isValidElement<{ className?: string; "aria-hidden"?: boolean }>(icon)
    ? cloneElement(icon, {
        className: cn("h-6 w-6 text-primary", icon.props.className),
        "aria-hidden": true,
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("glass overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">
                {typeof value === "number" ? formatNumber(value) : value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {TrendIcon && trendValue && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendIcon
                    className={cn("h-3 w-3", trend && TREND_CLASSES[trend])}
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">{trendValue}</span>
                </div>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              {renderedIcon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
