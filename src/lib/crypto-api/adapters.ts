import { CURRENCIES } from "@/lib/currencies";
import type { CoinDetail, FiatPerUsdRates, GlobalMarket, HistoricalPricePoint, MarketCoin, TrendingMarketCoin } from "@/types/market";
import type { CoinGeckoCoinDetail, CoinGeckoExchangeRatesResponse, CoinGeckoGlobalResponse, CoinGeckoMarketChartResponse, CoinGeckoMarketCoin, CoinGeckoTrendingResponse } from "./provider-types";

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

export function toFiatPerUsdRates(response: CoinGeckoExchangeRatesResponse): FiatPerUsdRates {
  const usdPerBitcoin = response.rates.usd?.value;

  return Object.keys(CURRENCIES).reduce((rates, currency) => {
    const fiatPerBitcoin = response.rates[currency.toLowerCase()]?.value;
    rates[currency as keyof FiatPerUsdRates] = usdPerBitcoin && fiatPerBitcoin ? fiatPerBitcoin / usdPerBitcoin : null;
    return rates;
  }, {} as FiatPerUsdRates);
}

function getUsdValue(values: Record<string, number | null | undefined> | null | undefined) {
  return values?.usd ?? null;
}

export function toCoinDetail(coin: CoinGeckoCoinDetail): CoinDetail {
  const marketData = coin.market_data;

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    imageUrl: coin.image.large ?? coin.image.small ?? "",
    marketCapRank: coin.market_cap_rank,
    currentPrice: getUsdValue(marketData?.current_price),
    priceChangePercentage24h: marketData?.price_change_percentage_24h ?? null,
    priceChangePercentage7d: marketData?.price_change_percentage_7d ?? null,
    marketCap: getUsdValue(marketData?.market_cap),
    fullyDilutedValuation: getUsdValue(marketData?.fully_diluted_valuation),
    totalVolume: getUsdValue(marketData?.total_volume),
    circulatingSupply: marketData?.circulating_supply ?? null,
    totalSupply: marketData?.total_supply ?? null,
    maxSupply: marketData?.max_supply ?? null,
    allTimeHigh: getUsdValue(marketData?.ath),
    allTimeHighChangePercentage: getUsdValue(marketData?.ath_change_percentage),
    allTimeLow: getUsdValue(marketData?.atl),
    allTimeLowChangePercentage: getUsdValue(marketData?.atl_change_percentage),
    lastUpdated: marketData?.last_updated ?? null,
  };
}

export function toHistoricalPricePoints(response: CoinGeckoMarketChartResponse): HistoricalPricePoint[] {
  return response.prices
    .filter(([timestamp, price]) => Number.isFinite(timestamp) && Number.isFinite(price))
    .map(([timestamp, price]) => ({ timestamp, price }));
}
