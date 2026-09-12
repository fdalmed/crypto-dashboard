import { describe, expect, it } from "vitest";
import { calculateConservativeReallocation } from "./portfolio";

describe("calculateConservativeReallocation", () => {
  it("reduces only underperforming holdings without creating funds", () => {
    expect(
      calculateConservativeReallocation(
        [
          { symbol: "BTC", amount: 1000, change24h: 1.5 },
          { symbol: "ALT", amount: 500, change24h: -3 },
        ],
        20,
      ),
    ).toEqual([
      { symbol: "BTC", amount: 1000, change24h: 1.5, currentAmount: 1000, suggestedAmount: 1000 },
      { symbol: "ALT", amount: 500, change24h: -3, currentAmount: 500, suggestedAmount: 400 },
    ]);
  });

  it("rejects impossible input values", () => {
    expect(() => calculateConservativeReallocation([], 101)).toThrow("Reallocation rate");
    expect(() => calculateConservativeReallocation([{ symbol: "BTC", amount: -1, change24h: 0 }], 10)).toThrow("Holding amounts");
  });
});
