import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardMetrics } from "@/components/features/dashboard-metrics";
import { Users } from "lucide-react";
import type { MetricItem } from "@/components/features/dashboard-metrics";

const metrics: MetricItem[] = [
  { title: "Current Occupancy", value: "89%", subtitle: "73,500 fans", icon: <Users />, trend: "up", trendValue: "+5%" },
  { title: "Active Incidents", value: 3, subtitle: "In progress" },
  { title: "System Status", value: "Operational" },
];

describe("DashboardMetrics", () => {
  it("renders all metric titles", () => {
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText("Current Occupancy")).toBeInTheDocument();
    expect(screen.getByText("Active Incidents")).toBeInTheDocument();
    expect(screen.getByText("System Status")).toBeInTheDocument();
  });

  it("renders numeric value formatted", () => {
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders string value directly", () => {
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText("89%")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText("73,500 fans")).toBeInTheDocument();
  });

  it("renders trendValue when provided", () => {
    render(<DashboardMetrics metrics={metrics} />);
    expect(screen.getByText("+5%")).toBeInTheDocument();
  });

  it("renders correctly with empty metrics array", () => {
    const { container } = render(<DashboardMetrics metrics={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <DashboardMetrics metrics={metrics} className="custom-grid" />
    );
    expect(container.firstChild).toHaveClass("custom-grid");
  });
});
