import "server-only";

import type { MarketOverview } from "@/types/market";
import { toGlobalMarket, toMarketCoin } from "./adapters";
import { cryptoApiFetch } from "./client";
import { REVALIDATE_SECONDS } from "./config";
import type { CoinGeckoGlobalResponse, CoinGeckoMarketCoin } from "./provider-types";

const MARKET_LIST_PATH = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";
const GLOBAL_MARKET_PATH = "/global";

export async function getMarketOverview(): Promise<MarketOverview> {
  const [coinsResponse, globalResponse] = await Promise.all([
    cryptoApiFetch<CoinGeckoMarketCoin[]>(MARKET_LIST_PATH, REVALIDATE_SECONDS.markets),
    cryptoApiFetch<CoinGeckoGlobalResponse>(GLOBAL_MARKET_PATH, REVALIDATE_SECONDS.global),
  ]);

  return {
    coins: coinsResponse.map(toMarketCoin),
    global: toGlobalMarket(globalResponse),
    updatedAt: new Date().toISOString(),
  };
}
