"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  step?: number;
  content: string;
  variant?: "default" | "emergency" | "success";
  className?: string;
}

const VARIANT_STYLES = {
  default: "bg-primary/5 border border-primary/20",
  emergency: "bg-destructive/5 border border-destructive/20",
  success: "bg-success/5 border border-success/20",
} as const;

export const RecommendationCard = memo(function RecommendationCard({
  step,
  content,
  variant = "default",
  className,
}: RecommendationCardProps) {
  return (
    <div className={cn("flex gap-3 rounded-lg px-4 py-3", VARIANT_STYLES[variant], className)}>
      {step !== undefined && (
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            variant === "emergency"
              ? "bg-destructive/20 text-destructive"
              : "bg-primary/20 text-primary"
          )}
        >
          {step}
        </span>
      )}
      <p className="text-sm">{content}</p>
    </div>
  );
});
