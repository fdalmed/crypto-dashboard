import type { GlobalMarket, MarketCoin } from "@/types/market";
import type { CoinGeckoGlobalResponse, CoinGeckoMarketCoin } from "./provider-types";

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

export function toGlobalMarket(response: CoinGeckoGlobalResponse): GlobalMarket {
  return {
    totalMarketCap: response.data.total_market_cap.usd ?? 0,
    marketCapChangePercentage24h: response.data.market_cap_change_percentage_24h_usd,
    bitcoinDominance: response.data.market_cap_percentage.btc ?? null,
  };
}
