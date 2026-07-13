import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ZoneGrid } from "@/components/features/zone-grid";
import type { StadiumZone } from "@/types";

const mockZones: StadiumZone[] = [
  { id: "z1", name: "North Stand", capacity: 18000, occupancy: 14200, status: "busy", accessibility: true },
  { id: "z2", name: "South Stand", capacity: 18000, occupancy: 16800, status: "critical", accessibility: false },
  { id: "z3", name: "East Stand",  capacity: 15000, occupancy: 9000,  status: "normal", accessibility: true },
];

describe("ZoneGrid", () => {
  it("renders a card for each zone", () => {
    render(<ZoneGrid zones={mockZones} />);
    expect(screen.getByText("North Stand")).toBeInTheDocument();
    expect(screen.getByText("South Stand")).toBeInTheDocument();
    expect(screen.getByText("East Stand")).toBeInTheDocument();
  });

  it("displays occupancy percentage for each zone", () => {
    render(<ZoneGrid zones={mockZones} />);
    // North Stand: 14200/18000 = 79%
    expect(screen.getByText("79%")).toBeInTheDocument();
  });

  it("shows accessibility indicator only for accessible zones", () => {
    render(<ZoneGrid zones={mockZones} />);
    const accessibleTexts = screen.getAllByText(/accessible zone/i);
    // z1 and z3 are accessible, z2 is not
    expect(accessibleTexts.length).toBe(2);
  });

  it("renders occupancy numbers formatted", () => {
    render(<ZoneGrid zones={mockZones} />);
    expect(screen.getByText(/14,200/)).toBeInTheDocument();
  });

  it("renders progress bar with correct aria-label", () => {
    render(<ZoneGrid zones={mockZones} />);
    expect(screen.getByLabelText(/North Stand occupancy/)).toBeInTheDocument();
  });

  it("renders empty grid for empty zones array", () => {
    const { container } = render(<ZoneGrid zones={[]} />);
    expect(container.querySelectorAll('[class*="card"]').length).toBe(0);
  });

  it("renders status badge for each zone", () => {
    render(<ZoneGrid zones={mockZones} />);
    expect(screen.getByText("busy")).toBeInTheDocument();
    expect(screen.getByText("critical")).toBeInTheDocument();
    expect(screen.getByText("normal")).toBeInTheDocument();
  });
});
