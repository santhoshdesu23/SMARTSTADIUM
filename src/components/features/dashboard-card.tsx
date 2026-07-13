"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const DashboardCard = memo(function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
});
