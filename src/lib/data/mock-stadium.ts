import type {
  AnalyticsDataPoint,
  GateStatus,
  IncidentReport,
  NotificationItem,
  StadiumZone,
  SustainabilityMetric,
  TransportOption,
  VolunteerAssignment,
} from "@/types";
import { siteConfig } from "@/config/site";

export const stadiumZones: StadiumZone[] = [
  { id: "z1", name: "North Stand", capacity: 18000, occupancy: 14200, status: "busy", accessibility: true },
  { id: "z2", name: "South Stand", capacity: 18000, occupancy: 16800, status: "critical", accessibility: true },
  { id: "z3", name: "East Stand", capacity: 15000, occupancy: 11200, status: "normal", accessibility: true },
  { id: "z4", name: "West Stand", capacity: 15000, occupancy: 9800, status: "normal", accessibility: false },
  { id: "z5", name: "VIP Lounge", capacity: 2500, occupancy: 2100, status: "busy", accessibility: true },
  { id: "z6", name: "Concourse A", capacity: 8000, occupancy: 6400, status: "busy", accessibility: true },
  { id: "z7", name: "Concourse B", capacity: 6000, occupancy: 3200, status: "normal", accessibility: true },
];

export const gateStatuses: GateStatus[] = [
  { id: "g1", name: "Gate A — North", waitMinutes: 8, status: "open", accessible: true },
  { id: "g2", name: "Gate B — North", waitMinutes: 15, status: "restricted", accessible: false },
  { id: "g3", name: "Gate C — East", waitMinutes: 4, status: "open", accessible: true },
  { id: "g4", name: "Gate D — West", waitMinutes: 2, status: "open", accessible: true },
  { id: "g5", name: "Gate E — South", waitMinutes: 22, status: "restricted", accessible: true },
  { id: "g6", name: "Gate F — VIP", waitMinutes: 1, status: "open", accessible: true },
];

export const transportOptions: TransportOption[] = [
  { id: "t1", type: "metro", name: "NJ Transit Rail", eta: 12, carbonKg: 0.4, accessible: true, crowdLevel: "medium" },
  { id: "t2", type: "shuttle", name: "FIFA Shuttle Express", eta: 8, carbonKg: 0.8, accessible: true, crowdLevel: "low" },
  { id: "t3", type: "bus", name: "Metro Bus Line 160", eta: 18, carbonKg: 1.2, accessible: true, crowdLevel: "high" },
  { id: "t4", type: "bike", name: "Bike Share Station", eta: 5, carbonKg: 0, accessible: false, crowdLevel: "low" },
  { id: "t5", type: "walk", name: "Pedestrian Route A", eta: 15, carbonKg: 0, accessible: true, crowdLevel: "low" },
  { id: "t6", type: "rideshare", name: "Designated Pickup Zone", eta: 10, carbonKg: 2.1, accessible: true, crowdLevel: "medium" },
];

export const incidents: IncidentReport[] = [
  { id: "i1", type: "crowd", severity: "medium", location: "South Stand — Section 214", description: "Congestion near concession stands", status: "in-progress", timestamp: new Date(Date.now() - 12 * 60000) },
  { id: "i2", type: "medical", severity: "low", location: "East Concourse", description: "Minor heat exhaustion — aid station responding", status: "resolved", timestamp: new Date(Date.now() - 45 * 60000) },
  { id: "i3", type: "facility", severity: "low", location: "Gate B", description: "Elevator maintenance in progress", status: "open", timestamp: new Date(Date.now() - 90 * 60000) },
  { id: "i4", type: "security", severity: "high", location: "North Parking Lot", description: "Unauthorized vehicle — security dispatched", status: "in-progress", timestamp: new Date(Date.now() - 8 * 60000) },
];

export const volunteerAssignments: VolunteerAssignment[] = [
  { id: "v1", volunteerId: "VOL-1042", name: "Maria Santos", zone: "Gate C", task: "Wayfinding assistance", status: "active", shift: "14:00–20:00" },
  { id: "v2", volunteerId: "VOL-0876", name: "James Chen", zone: "Accessibility Desk", task: "Wheelchair support", status: "active", shift: "12:00–18:00" },
  { id: "v3", volunteerId: "VOL-1203", name: "Aisha Patel", zone: "South Stand", task: "Crowd flow guidance", status: "assigned", shift: "16:00–22:00" },
  { id: "v4", volunteerId: "VOL-0954", name: "Carlos Mendez", zone: "Lost & Found", task: "Guest services", status: "completed", shift: "10:00–16:00" },
  { id: "v5", volunteerId: "VOL-1108", name: "Emma Wilson", zone: "First Aid Post 3", task: "Medical support", status: "active", shift: "14:00–20:00" },
];

export const sustainabilityMetrics: SustainabilityMetric[] = [
  { id: "s1", label: "Carbon Offset", value: 847, unit: "kg CO₂ saved", target: 1000, trend: "up" },
  { id: "s2", label: "Waste Diverted", value: 72, unit: "% recycled", target: 80, trend: "up" },
  { id: "s3", label: "Energy Usage", value: 68, unit: "% of baseline", target: 60, trend: "down" },
  { id: "s4", label: "Water Saved", value: 12400, unit: "liters", target: 15000, trend: "up" },
  { id: "s5", label: "Green Transport", value: 64, unit: "% of arrivals", target: 70, trend: "up" },
];

export const occupancyTrend: AnalyticsDataPoint[] = [
  { timestamp: "12:00", value: 12000 },
  { timestamp: "13:00", value: 28000 },
  { timestamp: "14:00", value: 45000 },
  { timestamp: "15:00", value: 58000 },
  { timestamp: "16:00", value: 67200 },
  { timestamp: "17:00", value: 71000 },
  { timestamp: "18:00", value: 73800 },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Gate E Congestion", message: "AI recommends redirecting to Gate C — 18 min faster", type: "warning", timestamp: new Date(), read: false },
  { id: "n2", title: "Match Kickoff", message: "USA vs Mexico starts in 45 minutes", type: "info", timestamp: new Date(), read: false },
  { id: "n3", title: "Sustainability Milestone", message: "847 kg CO₂ offset achieved today", type: "success", timestamp: new Date(), read: true },
  { id: "n4", title: "Accessibility Update", message: "Audio description available at Section 112", type: "info", timestamp: new Date(), read: true },
];

export const totalOccupancy = stadiumZones.reduce((sum, z) => sum + z.occupancy, 0);
export const occupancyPercent = Math.round((totalOccupancy / siteConfig.capacity) * 100);
