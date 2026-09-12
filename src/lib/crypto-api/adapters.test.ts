import { describe, expect, it } from "vitest";
import { toGlobalMarket, toMarketCoin, toTrendingMarketCoin } from "./adapters";

describe("CoinGecko adapters", () => {
  it("maps provider fields into the internal market model", () => {
    expect(
      toMarketCoin({
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://example.test/btc.png",
        current_price: 100,
        market_cap: 200,
        market_cap_rank: 1,
        total_volume: 50,
        high_24h: 110,
        low_24h: 90,
        price_change_percentage_24h: 2,
      }),
    ).toMatchObject({ symbol: "BTC", currentPrice: 100, marketCapRank: 1 });
  });

  it("uses accurate global data fields", () => {
    expect(
      toGlobalMarket({
        data: {
          total_market_cap: { usd: 1_000_000 },
          market_cap_percentage: { btc: 56.2 },
          market_cap_change_percentage_24h_usd: -1.2,
        },
      }),
    ).toEqual({ totalMarketCap: 1_000_000, bitcoinDominance: 56.2, marketCapChangePercentage24h: -1.2 });
  });

  it("normalizes trending data without inventing unavailable market values", () => {
    expect(
      toTrendingMarketCoin(
        {
          item: {
            id: "new-coin",
            name: "New Coin",
            symbol: "new",
            market_cap_rank: null,
            large: null,
            thumb: null,
            score: 0,
          },
        },
        undefined,
      ),
    ).toMatchObject({
      id: "new-coin",
      symbol: "NEW",
      currentPrice: null,
      marketCap: null,
      totalVolume: null,
      trendingScore: 0,
    });
  });
});
