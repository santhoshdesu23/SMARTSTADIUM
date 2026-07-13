export interface RouteInfo {
  id: string;
  from: string;
  to: string;
  time: string;
  accessible: boolean;
  crowd: "low" | "medium" | "high";
}

export interface TransportIcon {
  type: string;
  emoji: string;
}

export function getPopularRoutes(): RouteInfo[] {
  return [
    { id: "r1", from: "Main Entrance", to: "Section 214", time: "6 min", accessible: true, crowd: "medium" },
    { id: "r2", from: "Gate C", to: "Food Court A", time: "4 min", accessible: true, crowd: "low" },
    { id: "r3", from: "Gate E", to: "Section 112", time: "8 min", accessible: true, crowd: "high" },
    { id: "r4", from: "Parking Lot K", to: "Gate D", time: "12 min", accessible: true, crowd: "low" },
  ];
}

export function getTransportTypeIcons(): Record<string, string> {
  return {
    metro: "🚇",
    bus: "🚌",
    shuttle: "🚐",
    bike: "🚲",
    walk: "🚶",
    rideshare: "🚗",
  };
}

export function getTransportIconEmoji(type: string): string {
  const icons = getTransportTypeIcons();
  return icons[type] || "🚗";
}

export function getCrowdLevelBadgeStatus(crowdLevel: string): "normal" | "busy" {
  return crowdLevel === "high" || crowdLevel === "medium" ? "busy" : "normal";
}
