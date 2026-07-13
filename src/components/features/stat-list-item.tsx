"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatListItemProps {
  title: string;
  value: string;
  change?: string;
  className?: string;
}

export const StatListItem = memo(function StatListItem({
  title,
  value,
  change,
  className,
}: StatListItemProps) {
  return (
    <Card className={cn("glass", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {change && <p className="text-xs text-success">{change}</p>}
      </CardContent>
    </Card>
  );
});
