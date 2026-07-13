export interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
}

export function getFanDemographics(): Array<{ timestamp: string; value: number }> {
  return [
    { timestamp: "Local", value: 45 },
    { timestamp: "National", value: 35 },
    { timestamp: "International", value: 20 },
  ];
}

export function getAnalyticsMetrics(): AnalyticsMetric[] {
  return [
    { title: "Concession Sales", value: "$2.4M", change: "+18% vs last match" },
    { title: "Merchandise", value: "$890K", change: "+24% vs last match" },
    { title: "Avg Dwell Time", value: "4.2 hrs", change: "+0.3 hrs vs last match" },
    { title: "App Sessions", value: "34,200", change: "+42% vs last match" },
    { title: "AI Queries", value: "8,450", change: "+67% vs last match" },
    { title: "NPS Score", value: "78", change: "+6 pts vs last match" },
  ];
}
