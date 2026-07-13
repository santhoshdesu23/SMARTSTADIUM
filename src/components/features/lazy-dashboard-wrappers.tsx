"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// These are loaded client-only (ssr: false) with a skeleton fallback.
// `dynamic` with `loading:` is sufficient — no extra Suspense wrapper needed.

export const LazyStadiumMap = dynamic(
  () => import("@/components/features/stadium-map").then((mod) => mod.StadiumMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-2xl" />,
  }
);

export const LazyAiChatPanel = dynamic(
  () => import("@/components/features/ai-chat-panel").then((mod) => mod.AiChatPanel),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-2xl" />,
  }
);

export const LazyChartCard = dynamic(
  () => import("@/components/features/chart-card").then((mod) => mod.ChartCard),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-2xl" />,
  }
);

// Re-export prop types for consumers
export type LazyStadiumMapProps = ComponentProps<typeof LazyStadiumMap>;
export type LazyAiChatPanelProps = ComponentProps<typeof LazyAiChatPanel>;
export type LazyChartCardProps = ComponentProps<typeof LazyChartCard>;
