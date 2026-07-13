import { describe, it, expect } from "vitest";
import {
  getOperationsSnapshot,
  getAccessibilitySnapshot,
  getNavigationSnapshot,
  getEmergencySnapshot,
  getTransportationSnapshot,
  getSustainabilitySnapshot,
  getAnalyticsSnapshot,
  getVolunteerSnapshot,
} from "@/lib/domain/operations";

describe("getOperationsSnapshot", () => {
  it("returns occupancyPercent as a number 0–100", () => {
    const { occupancyPercent } = getOperationsSnapshot();
    expect(occupancyPercent).toBeGreaterThanOrEqual(0);
    expect(occupancyPercent).toBeLessThanOrEqual(100);
  });

  it("returns totalOccupancy as a positive number", () => {
    expect(getOperationsSnapshot().totalOccupancy).toBeGreaterThan(0);
  });

  it("returns a non-empty stadiumZones array", () => {
    const { stadiumZones } = getOperationsSnapshot();
    expect(Array.isArray(stadiumZones)).toBe(true);
    expect(stadiumZones.length).toBeGreaterThan(0);
  });

  it("every zone has required fields", () => {
    const { stadiumZones } = getOperationsSnapshot();
    for (const z of stadiumZones) {
      expect(z.id).toBeTruthy();
      expect(z.name).toBeTruthy();
      expect(typeof z.capacity).toBe("number");
      expect(typeof z.occupancy).toBe("number");
      expect(["normal", "busy", "critical", "closed"]).toContain(z.status);
    }
  });

  it("returns gateStatuses array with valid statuses", () => {
    const { gateStatuses } = getOperationsSnapshot();
    for (const g of gateStatuses) {
      expect(["open", "restricted", "closed"]).toContain(g.status);
    }
  });

  it("activeIncidents matches incidents not in resolved state", () => {
    const { incidents, activeIncidents } = getOperationsSnapshot();
    const expected = incidents.filter((i) => i.status !== "resolved").length;
    expect(activeIncidents).toBe(expected);
  });

  it("returns occupancyTrend as a non-empty array", () => {
    const { occupancyTrend } = getOperationsSnapshot();
    expect(Array.isArray(occupancyTrend)).toBe(true);
    expect(occupancyTrend.length).toBeGreaterThan(0);
  });
});

describe("getAccessibilitySnapshot", () => {
  it("returns a non-empty services array", () => {
    const { services } = getAccessibilitySnapshot();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });

  it("every service has a title and status", () => {
    const { services } = getAccessibilitySnapshot();
    for (const s of services) {
      expect(s.title).toBeTruthy();
      expect(s.status).toBeTruthy();
    }
  });
});

describe("getNavigationSnapshot", () => {
  it("returns gateStatuses array", () => {
    const { gateStatuses } = getNavigationSnapshot();
    expect(Array.isArray(gateStatuses)).toBe(true);
    expect(gateStatuses.length).toBeGreaterThan(0);
  });
});

describe("getEmergencySnapshot", () => {
  it("open incidents are a subset of all incidents", () => {
    const { incidents, open } = getEmergencySnapshot();
    for (const o of open) {
      expect(incidents.find((i) => i.id === o.id)).toBeDefined();
    }
  });

  it("critical incidents all have high/critical severity", () => {
    const { critical } = getEmergencySnapshot();
    for (const c of critical) {
      expect(["high", "critical"]).toContain(c.severity);
    }
  });

  it("open count never exceeds total incident count", () => {
    const { incidents, open } = getEmergencySnapshot();
    expect(open.length).toBeLessThanOrEqual(incidents.length);
  });
});

describe("getTransportationSnapshot", () => {
  it("returns transportOptions array", () => {
    const { transportOptions } = getTransportationSnapshot();
    expect(Array.isArray(transportOptions)).toBe(true);
    expect(transportOptions.length).toBeGreaterThan(0);
  });

  it("greenOptions all have carbonKg < 1", () => {
    const { greenOptions } = getTransportationSnapshot();
    for (const o of greenOptions) {
      expect(o.carbonKg).toBeLessThan(1);
    }
  });

  it("every transport option has required fields", () => {
    const { transportOptions } = getTransportationSnapshot();
    for (const t of transportOptions) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(typeof t.eta).toBe("number");
      expect(typeof t.carbonKg).toBe("number");
    }
  });
});

describe("getSustainabilitySnapshot", () => {
  it("metrics array has same length as raw sustainabilityMetrics", () => {
    const { sustainabilityMetrics, metrics } = getSustainabilitySnapshot();
    expect(metrics.length).toBe(sustainabilityMetrics.length);
  });

  it("every metric has a computed percent field", () => {
    const { metrics } = getSustainabilitySnapshot();
    for (const m of metrics) {
      expect(typeof m.percent).toBe("number");
    }
  });

  it("percent is calculated correctly", () => {
    const { sustainabilityMetrics, metrics } = getSustainabilitySnapshot();
    for (let i = 0; i < metrics.length; i++) {
      const expected = Math.round((sustainabilityMetrics[i].value / sustainabilityMetrics[i].target) * 100);
      expect(metrics[i].percent).toBe(expected);
    }
  });
});

describe("getAnalyticsSnapshot", () => {
  it("returns occupancyTrend, totalOccupancy, and occupancyPercent", () => {
    const snap = getAnalyticsSnapshot();
    expect(Array.isArray(snap.occupancyTrend)).toBe(true);
    expect(typeof snap.totalOccupancy).toBe("number");
    expect(typeof snap.occupancyPercent).toBe("number");
  });
});

describe("getVolunteerSnapshot", () => {
  it("active count matches assignments with active status", () => {
    const { volunteerAssignments, active } = getVolunteerSnapshot();
    expect(active).toBe(volunteerAssignments.filter((v) => v.status === "active").length);
  });

  it("completed count matches assignments with completed status", () => {
    const { volunteerAssignments, completed } = getVolunteerSnapshot();
    expect(completed).toBe(volunteerAssignments.filter((v) => v.status === "completed").length);
  });

  it("active + completed never exceeds total assignments", () => {
    const { volunteerAssignments, active, completed } = getVolunteerSnapshot();
    expect(active + completed).toBeLessThanOrEqual(volunteerAssignments.length);
  });
});
