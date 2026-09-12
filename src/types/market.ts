export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "SAR"
  | "CAD"
  | "AUD"
  | "SGD"
  | "JPY"
  | "CHF"
  | "INR"
  | "MAD";

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  imageUrl: string;
  currentPrice: number | null;
  marketCap: number | null;
  marketCapRank: number | null;
  totalVolume: number | null;
  high24h: number | null;
  low24h: number | null;
  priceChangePercentage24h: number | null;
};

export type TrendingMarketCoin = MarketCoin & {
  trendingScore: number;
};

export function isTrendingMarketCoin(coin: MarketCoin): coin is TrendingMarketCoin {
  return "trendingScore" in coin && typeof (coin as TrendingMarketCoin).trendingScore === "number";
}

export type GlobalMarket = {
  totalMarketCap: number;
  marketCapChangePercentage24h: number | null;
  bitcoinDominance: number | null;
};

export type MarketOverview = {
  coins: MarketCoin[];
  global: GlobalMarket;
  updatedAt: string;
};

export type CoinDetail = {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  marketCapRank: number | null;
  currentPrice: number | null;
  priceChangePercentage24h: number | null;
  priceChangePercentage7d: number | null;
  marketCap: number | null;
  fullyDilutedValuation: number | null;
  totalVolume: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  allTimeHigh: number | null;
  allTimeHighChangePercentage: number | null;
  allTimeLow: number | null;
  allTimeLowChangePercentage: number | null;
  lastUpdated: string | null;
};

export type HistoricalPricePoint = {
  timestamp: number;
  price: number;
};
