import { describe, it, expect } from "vitest";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

describe("utils", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    expect(cn("px-2", false && "hidden", "py-1")).toBe("px-2 py-1");
  });

  it("formats numbers", () => {
    expect(formatNumber(82500)).toBe("82,500");
  });

  it("formats percentages", () => {
    expect(formatPercent(89.456)).toBe("89.5%");
  });
});
