export type CoinGeckoMarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
};

export type CoinGeckoTrendingResponse = {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number | null;
      large: string | null;
      thumb: string | null;
      score: number;
    };
  }>;
};

export type CoinGeckoGlobalResponse = {
  data: {
    total_market_cap: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number | null;
  };
};

type CurrencyValues = Record<string, number | null | undefined>;

export type CoinGeckoCoinDetail = {
  id: string;
  name: string;
  symbol: string;
  image: {
    large?: string | null;
    small?: string | null;
  };
  market_cap_rank: number | null;
  market_data: {
    current_price: CurrencyValues;
    market_cap: CurrencyValues;
    fully_diluted_valuation: CurrencyValues | null;
    total_volume: CurrencyValues;
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
    ath: CurrencyValues;
    ath_change_percentage: CurrencyValues;
    atl: CurrencyValues;
    atl_change_percentage: CurrencyValues;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    last_updated: string | null;
  } | null;
};

export type CoinGeckoMarketChartResponse = {
  prices: Array<[number, number]>;
};
