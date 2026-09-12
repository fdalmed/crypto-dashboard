import "server-only";

import type { FiatPerUsdRates, MarketCoin, MarketOverview, TrendingMarketCoin } from "@/types/market";
import { toFiatPerUsdRates, toGlobalMarket, toMarketCoin, toTrendingMarketCoin } from "./adapters";
import { cryptoApiFetch } from "./client";
import { MARKET_PAGE_SIZE, REVALIDATE_SECONDS } from "./config";
import type { CoinGeckoExchangeRatesResponse, CoinGeckoGlobalResponse, CoinGeckoMarketCoin, CoinGeckoTrendingResponse } from "./provider-types";

const MARKET_LIST_PATH = `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${MARKET_PAGE_SIZE}&page=1&sparkline=false`;
const GLOBAL_MARKET_PATH = "/global";
const TRENDING_PATH = "/search/trending";
const EXCHANGE_RATES_PATH = "/exchange_rates";

export async function getMarketCoins(): Promise<MarketCoin[]> {
  const response = await cryptoApiFetch<CoinGeckoMarketCoin[]>(MARKET_LIST_PATH, REVALIDATE_SECONDS.markets);
  return response.map(toMarketCoin);
}

export async function getMarketOverview(): Promise<MarketOverview> {
  const [coins, globalResponse] = await Promise.all([
    getMarketCoins(),
    cryptoApiFetch<CoinGeckoGlobalResponse>(GLOBAL_MARKET_PATH, REVALIDATE_SECONDS.global),
  ]);

  return {
    coins,
    global: toGlobalMarket(globalResponse),
    updatedAt: new Date().toISOString(),
  };
}

export async function getTrendingMarketCoins(): Promise<TrendingMarketCoin[]> {
  const [trendingResponse, marketCoins] = await Promise.all([
    cryptoApiFetch<CoinGeckoTrendingResponse>(TRENDING_PATH, REVALIDATE_SECONDS.trending),
    getMarketCoins(),
  ]);
  const marketById = new Map(marketCoins.map((coin) => [coin.id, coin]));

  return trendingResponse.coins.map((item) => toTrendingMarketCoin(item, marketById.get(item.item.id)));
}

export async function getFiatPerUsdRates(): Promise<FiatPerUsdRates> {
  const response = await cryptoApiFetch<CoinGeckoExchangeRatesResponse>(EXCHANGE_RATES_PATH, REVALIDATE_SECONDS.exchangeRates);
  return toFiatPerUsdRates(response);
}
