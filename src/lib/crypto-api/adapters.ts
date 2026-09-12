import type { GlobalMarket, MarketCoin, TrendingMarketCoin } from "@/types/market";
import type { CoinGeckoGlobalResponse, CoinGeckoMarketCoin, CoinGeckoTrendingResponse } from "./provider-types";

export function toMarketCoin(coin: CoinGeckoMarketCoin): MarketCoin {
  return {
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    imageUrl: coin.image,
    currentPrice: coin.current_price,
    marketCap: coin.market_cap,
    marketCapRank: coin.market_cap_rank,
    totalVolume: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    priceChangePercentage24h: coin.price_change_percentage_24h,
  };
}

export function toTrendingMarketCoin(
  trendingItem: CoinGeckoTrendingResponse["coins"][number],
  marketCoin: MarketCoin | undefined,
): TrendingMarketCoin {
  const { item } = trendingItem;

  return {
    id: item.id,
    symbol: marketCoin?.symbol ?? item.symbol.toUpperCase(),
    name: marketCoin?.name ?? item.name,
    imageUrl: marketCoin?.imageUrl ?? item.large ?? item.thumb ?? "",
    currentPrice: marketCoin?.currentPrice ?? null,
    marketCap: marketCoin?.marketCap ?? null,
    marketCapRank: marketCoin?.marketCapRank ?? item.market_cap_rank,
    totalVolume: marketCoin?.totalVolume ?? null,
    high24h: marketCoin?.high24h ?? null,
    low24h: marketCoin?.low24h ?? null,
    priceChangePercentage24h: marketCoin?.priceChangePercentage24h ?? null,
    trendingScore: item.score,
  };
}

export function toGlobalMarket(response: CoinGeckoGlobalResponse): GlobalMarket {
  return {
    totalMarketCap: response.data.total_market_cap.usd ?? 0,
    marketCapChangePercentage24h: response.data.market_cap_change_percentage_24h_usd,
    bitcoinDominance: response.data.market_cap_percentage.btc ?? null,
  };
}
