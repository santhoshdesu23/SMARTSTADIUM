import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Accessibility } from "lucide-react";
import { MetricCard } from "@/components/features/metric-card";

describe("MetricCard", () => {
  it("renders a provided icon node", () => {
    render(
      <MetricCard
        title="Accessible Gates"
        value="5/6"
        subtitle="Gate B elevator maintenance"
        icon={<Accessibility data-testid="metric-icon" />}
      />
    );

    expect(screen.getByTestId("metric-icon")).toBeInTheDocument();
  });
});
