import { describe, expect, it } from "vitest";
import { filterMarketCoins, getGainers, getLosers, sortMarketCoins } from "./market-list";
import type { MarketCoin } from "@/types/market";

const coins: MarketCoin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", imageUrl: "", currentPrice: 100, marketCap: 1000, marketCapRank: 1, totalVolume: 50, high24h: null, low24h: null, priceChangePercentage24h: 2 },
  { id: "ether", symbol: "ETH", name: "Ethereum", imageUrl: "", currentPrice: 10, marketCap: 500, marketCapRank: 2, totalVolume: 25, high24h: null, low24h: null, priceChangePercentage24h: -4 },
  { id: "missing", symbol: "N/A", name: "Missing Data", imageUrl: "", currentPrice: null, marketCap: null, marketCapRank: null, totalVolume: null, high24h: null, low24h: null, priceChangePercentage24h: null },
];

describe("market list utilities", () => {
  it("filters coin names and symbols without case sensitivity", () => {
    expect(filterMarketCoins(coins, "bit").map((coin) => coin.id)).toEqual(["bitcoin"]);
    expect(filterMarketCoins(coins, "eth").map((coin) => coin.id)).toEqual(["ether"]);
  });

  it("sorts numeric values deterministically and keeps missing values last", () => {
    expect(sortMarketCoins(coins, "marketCap", "desc").map((coin) => coin.id)).toEqual(["bitcoin", "ether", "missing"]);
    expect(sortMarketCoins(coins, "price", "asc").map((coin) => coin.id)).toEqual(["ether", "bitcoin", "missing"]);
  });

  it("returns correctly ordered gainers and losers", () => {
    expect(getGainers(coins).map((coin) => coin.id)).toEqual(["bitcoin"]);
    expect(getLosers(coins).map((coin) => coin.id)).toEqual(["ether"]);
  });
});
