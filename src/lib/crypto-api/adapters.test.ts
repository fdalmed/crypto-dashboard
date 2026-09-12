import { describe, expect, it } from "vitest";
import { toCoinDetail, toGlobalMarket, toHistoricalPricePoints, toMarketCoin, toTrendingMarketCoin } from "./adapters";

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

  it("normalizes coin detail market fields and retains missing values as null", () => {
    expect(
      toCoinDetail({
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        image: { large: "https://example.test/bitcoin.png" },
        market_cap_rank: 1,
        market_data: {
          current_price: { usd: 100 },
          market_cap: { usd: 200 },
          fully_diluted_valuation: null,
          total_volume: { usd: 50 },
          circulating_supply: 10,
          total_supply: null,
          max_supply: 21,
          ath: { usd: 120 },
          ath_change_percentage: { usd: -16.67 },
          atl: { usd: 1 },
          atl_change_percentage: { usd: 9900 },
          price_change_percentage_24h: 2.5,
          price_change_percentage_7d: null,
          last_updated: "2026-01-01T00:00:00.000Z",
        },
      }),
    ).toMatchObject({
      symbol: "BTC",
      currentPrice: 100,
      fullyDilutedValuation: null,
      priceChangePercentage7d: null,
      maxSupply: 21,
    });
  });

  it("filters invalid historical chart points without inventing prices", () => {
    expect(toHistoricalPricePoints({ prices: [[1, 10], [Number.NaN, 12], [3, Number.NaN]] })).toEqual([
      { timestamp: 1, price: 10 },
    ]);
  });
});
