import {
  incidents,
  stadiumZones,
  gateStatuses,
  notifications,
  sustainabilityMetrics,
  transportOptions,
  volunteerAssignments,
  occupancyTrend,
  totalOccupancy,
  occupancyPercent,
} from "@/lib/data/mock-stadium";

export function getOperationsSnapshot() {
  return {
    activeIncidents: incidents.filter((i) => i.status !== "resolved").length,
    occupancyPercent,
    totalOccupancy,
    occupancyTrend,
    stadiumZones,
    gateStatuses,
    incidents,
    notifications,
  };
}

export function getAccessibilitySnapshot() {
  return {
    services: [
      { title: "Wheelchair Routes", status: "Available" },
      { title: "Audio Description", status: "Active" },
      { title: "Visual Assistance", status: "Enabled" },
      { title: "Sign Language", status: "On Request" },
    ],
  };
}

export function getNavigationSnapshot() {
  return { gateStatuses };
}

export function getEmergencySnapshot() {
  const open = incidents.filter((i) => i.status !== "resolved");
  const critical = incidents.filter(
    (i) => i.severity === "high" || i.severity === "critical"
  );
  return { incidents, open, critical };
}

export function getTransportationSnapshot() {
  return {
    transportOptions,
    greenOptions: transportOptions.filter((o) => o.carbonKg < 1),
  };
}

export function getSustainabilitySnapshot() {
  return {
    sustainabilityMetrics,
    metrics: sustainabilityMetrics.map((m) => ({
      ...m,
      percent: Math.round((m.value / m.target) * 100),
    })),
  };
}

export function getAnalyticsSnapshot() {
  return { occupancyTrend, totalOccupancy, occupancyPercent };
}

export function getVolunteerSnapshot() {
  return {
    volunteerAssignments,
    active: volunteerAssignments.filter((v) => v.status === "active").length,
    completed: volunteerAssignments.filter((v) => v.status === "completed").length,
  };
}
