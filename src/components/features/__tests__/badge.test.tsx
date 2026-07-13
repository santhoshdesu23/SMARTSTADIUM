import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge, StatusBadge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Live</Badge>);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test").tagName).toBe("SPAN");
  });

  it("applies additional className", () => {
    render(<Badge className="my-custom-class">X</Badge>);
    expect(screen.getByText("X")).toHaveClass("my-custom-class");
  });

  it("forwards extra HTML attributes", () => {
    render(<Badge data-testid="test-badge">Y</Badge>);
    expect(screen.getByTestId("test-badge")).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  const statuses = [
    "normal", "open", "busy", "restricted", "critical", "closed",
    "resolved", "in-progress", "active", "assigned", "completed",
    "low", "medium", "high",
  ];

  it.each(statuses)("renders status '%s' without throwing", (status) => {
    expect(() => render(<StatusBadge status={status} />)).not.toThrow();
  });

  it("renders the status text (hyphen replaced with space)", () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText("in progress")).toBeInTheDocument();
  });

  it("renders unknown status with default styling", () => {
    render(<StatusBadge status="unknown-custom" />);
    expect(screen.getByText("unknown custom")).toBeInTheDocument();
  });

  it("renders 'normal' status", () => {
    render(<StatusBadge status="normal" />);
    expect(screen.getByText("normal")).toBeInTheDocument();
  });

  it("renders 'critical' status", () => {
    render(<StatusBadge status="critical" />);
    expect(screen.getByText("critical")).toBeInTheDocument();
  });
});
