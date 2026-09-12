import { describe, expect, it } from "vitest";

import { getAbsoluteDifference, getComparisonSummary, getHigherToLowerRatio, parseComparisonPair } from "./comparisons";
import type { CoinDetail } from "@/types/market";

const bitcoin: CoinDetail = {
  id: "bitcoin", name: "Bitcoin", symbol: "BTC", imageUrl: "", marketCapRank: 1,
  currentPrice: 60000, priceChangePercentage24h: null, priceChangePercentage7d: null,
  marketCap: 1200000000000, fullyDilutedValuation: null, totalVolume: null,
  circulatingSupply: null, totalSupply: null, maxSupply: null, allTimeHigh: null,
  allTimeHighChangePercentage: null, allTimeLow: null, allTimeLowChangePercentage: null, lastUpdated: null,
};

const ethereum: CoinDetail = { ...bitcoin, id: "ethereum", name: "Ethereum", symbol: "ETH", currentPrice: 3000, marketCap: 400000000000 };

describe("parseComparisonPair", () => {
  it("parses two valid, distinct coin ids", () => {
    expect(parseComparisonPair("bitcoin-vs-ethereum")).toEqual({ firstId: "bitcoin", secondId: "ethereum" });
  });

  it.each(["bitcoin", "bitcoin-vs-bitcoin", "bitcoin-vs-ethereum-vs-solana", "Bitcoin-vs-ethereum", "bitcoin-vs-"])("rejects malformed pair %s", (pair) => {
    expect(parseComparisonPair(pair)).toBeNull();
  });
});

describe("comparison derived values", () => {
  it("calculates an absolute difference and a higher-to-lower ratio", () => {
    expect(getAbsoluteDifference(120, 40)).toBe(80);
    expect(getHigherToLowerRatio(120, 40)).toBe(3);
  });

  it("does not divide or substitute zero for unavailable values", () => {
    expect(getAbsoluteDifference(null, 40)).toBeNull();
    expect(getHigherToLowerRatio(0, 40)).toBeNull();
    expect(getHigherToLowerRatio(null, 40)).toBeNull();
  });

  it("builds a deterministic factual summary", () => {
    expect(getComparisonSummary(bitcoin, ethereum)).toBe("Bitcoin currently has a larger market capitalization. Bitcoin has a higher unit price.");
  });
});
