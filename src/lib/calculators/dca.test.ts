import { describe, expect, it } from "vitest";
import { calculateDca } from "./dca";

describe("calculateDca", () => {
  it("calculates a standard DCA outcome", () => {
    expect(calculateDca({ contribution: 100, periods: 10, averagePurchasePrice: 50, currentPrice: 75 })).toMatchObject({ totalInvested: 1000, totalQuantity: 20, currentValue: 1500, profitOrLoss: 500, roiPercentage: 50 });
  });

  it("handles negative returns and zero contributions", () => {
    expect(calculateDca({ contribution: 100, periods: 2, averagePurchasePrice: 50, currentPrice: 25 }).profitOrLoss).toBe(-100);
    expect(calculateDca({ contribution: 0, periods: 2, averagePurchasePrice: 50, currentPrice: 25 }).roiPercentage).toBe(0);
  });

  it("rejects invalid periods and average purchase prices", () => {
    expect(() => calculateDca({ contribution: 1, periods: 1.5, averagePurchasePrice: 1, currentPrice: 1 })).toThrow("Periods");
    expect(() => calculateDca({ contribution: 1, periods: 1, averagePurchasePrice: 0, currentPrice: 1 })).toThrow("Average purchase price");
  });
});
