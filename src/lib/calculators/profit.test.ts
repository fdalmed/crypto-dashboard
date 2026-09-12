import { describe, expect, it } from "vitest";
import { calculateProfit } from "./profit";

describe("calculateProfit", () => {
  it("calculates a profitable outcome", () => {
    expect(calculateProfit({ investmentAmount: 1000, buyPrice: 50, sellPrice: 75, flatFees: 0 })).toMatchObject({ quantity: 20, finalValue: 1500, profitOrLoss: 500, roiPercentage: 50 });
  });

  it("calculates a loss and subtracts flat total fees from the final value", () => {
    expect(calculateProfit({ investmentAmount: 1000, buyPrice: 50, sellPrice: 25, flatFees: 10 })).toMatchObject({ finalValue: 490, profitOrLoss: -510, roiPercentage: -51 });
  });

  it("supports a zero investment without producing NaN", () => {
    expect(calculateProfit({ investmentAmount: 0, buyPrice: 50, sellPrice: 75, flatFees: 0 }).roiPercentage).toBe(0);
  });

  it("rejects invalid prices and non-finite values", () => {
    expect(() => calculateProfit({ investmentAmount: 100, buyPrice: 0, sellPrice: 10, flatFees: 0 })).toThrow("Buy price");
    expect(() => calculateProfit({ investmentAmount: Number.POSITIVE_INFINITY, buyPrice: 1, sellPrice: 1, flatFees: 0 })).toThrow("Investment amount");
  });
});
