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
  currentPrice: number;
  marketCap: number;
  marketCapRank: number | null;
  totalVolume: number | null;
  high24h: number | null;
  low24h: number | null;
  priceChangePercentage24h: number | null;
};

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
