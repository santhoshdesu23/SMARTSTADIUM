"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/badge";
import type { StadiumZone } from "@/types";
import { formatNumber } from "@/lib/utils";

interface ZoneGridProps {
  zones: StadiumZone[];
}

type ZoneStatus = StadiumZone["status"];

const STATUS_INDICATOR_CLASSES: Record<ZoneStatus, string> = {
  normal: "bg-success",
  busy: "bg-warning",
  critical: "bg-destructive",
  closed: "bg-muted",
};

export const ZoneGrid = memo(function ZoneGrid({ zones }: ZoneGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone, i) => {
        const pct = Math.round((zone.occupancy / zone.capacity) * 100);
        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{zone.name}</CardTitle>
                  <StatusBadge status={zone.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatNumber(zone.occupancy)} / {formatNumber(zone.capacity)}
                  </span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <Progress
                  value={pct}
                  indicatorClassName={STATUS_INDICATOR_CLASSES[zone.status]}
                  aria-label={`${zone.name} occupancy ${pct}%`}
                />
                {zone.accessibility && (
                  <p className="text-xs text-info">♿ Accessible zone</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
});
