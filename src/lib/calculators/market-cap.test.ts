import { describe, expect, it } from "vitest";
import { calculateMarketCapFromPrice, calculatePriceFromMarketCap } from "./market-cap";

describe("market cap calculations", () => {
  it("calculates implied market cap and implied price", () => {
    expect(calculateMarketCapFromPrice(10_000_000, 5)).toBe(50_000_000);
    expect(calculatePriceFromMarketCap(50_000_000, 10_000_000)).toBe(5);
  });

  it("supports large numbers", () => {
    expect(calculateMarketCapFromPrice(1_000_000_000_000, 100)).toBe(100_000_000_000_000);
  });

  it("rejects invalid or zero circulating supply", () => {
    expect(() => calculateMarketCapFromPrice(0, 5)).toThrow("Circulating supply");
    expect(() => calculatePriceFromMarketCap(1, Number.NaN)).toThrow("Circulating supply");
  });
});
