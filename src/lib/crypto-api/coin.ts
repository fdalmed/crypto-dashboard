import "server-only";

import { cache } from "react";
import type { CoinDetail, HistoricalPricePoint } from "@/types/market";
import { toCoinDetail, toHistoricalPricePoints } from "./adapters";
import { cryptoApiFetch } from "./client";
import { REVALIDATE_SECONDS } from "./config";
import type { CoinGeckoCoinDetail, CoinGeckoMarketChartResponse } from "./provider-types";

function getCoinPath(id: string) {
  return `/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
}

export const getCoinDetail = cache(async function getCoinDetail(id: string): Promise<CoinDetail> {
  const response = await cryptoApiFetch<CoinGeckoCoinDetail>(getCoinPath(id), REVALIDATE_SECONDS.coinDetail);
  return toCoinDetail(response);
});

export async function getCoinPriceHistory(id: string): Promise<HistoricalPricePoint[]> {
  const path = `/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=30&interval=daily`;
  const response = await cryptoApiFetch<CoinGeckoMarketChartResponse>(path, REVALIDATE_SECONDS.priceHistory);
  return toHistoricalPricePoints(response);
}
