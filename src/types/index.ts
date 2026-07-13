/** Role for fan-facing features (navigation, accessibility, etc.) */
export type UserRole =
  | "fan"
  | "organizer"
  | "volunteer"
  | "staff"
  | "emergency"
  | "security";

/** Role for authenticated staff/operators within the dashboard */
export type StaffRole = "fan" | "operator" | "volunteer" | "staff" | "admin";

export type ThemeMode = "dark" | "light" | "high-contrast" | "colorblind";

export type AiAssistantType =
  | "stadium"
  | "crowd"
  | "sustainability"
  | "accessibility"
  | "operations";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  language?: string;
}

export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  status: "normal" | "busy" | "critical" | "closed";
  accessibility: boolean;
}

export interface GateStatus {
  id: string;
  name: string;
  waitMinutes: number;
  status: "open" | "restricted" | "closed";
  accessible: boolean;
}

export interface TransportOption {
  id: string;
  type: "metro" | "bus" | "shuttle" | "bike" | "walk" | "rideshare";
  name: string;
  eta: number;
  carbonKg: number;
  accessible: boolean;
  crowdLevel: "low" | "medium" | "high";
}

export interface IncidentReport {
  id: string;
  type: "medical" | "security" | "crowd" | "facility" | "weather";
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  timestamp: Date;
}

export interface VolunteerAssignment {
  id: string;
  volunteerId: string;
  name: string;
  zone: string;
  task: string;
  status: "assigned" | "active" | "completed";
  shift: string;
}

export interface SustainabilityMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: "up" | "down" | "stable";
}

export interface AnalyticsDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "emergency" | "success";
  timestamp: Date;
  read: boolean;
}

export interface AiChatRequest {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  assistantType: AiAssistantType;
  language?: string;
  context?: Record<string, unknown>;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}
