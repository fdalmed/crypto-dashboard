import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency, formatPercent } from "./formatters";

describe("market formatters", () => {
  it("formats USD values through Intl", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCompactCurrency(1_250_000)).toContain("1.3M");
  });

  it("formats positive, negative, and unavailable percentages", () => {
    expect(formatPercent(2.345)).toBe("+2.35%");
    expect(formatPercent(-2.345)).toBe("-2.35%");
    expect(formatPercent(null)).toBe("--");
  });
});
