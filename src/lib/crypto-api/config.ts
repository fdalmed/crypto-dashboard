export const CRYPTO_API_BASE_URL = "https://api.coingecko.com/api/v3";

export const REVALIDATE_SECONDS = {
  markets: 90,
  global: 90,
  trending: 300,
  coinDetail: 600,
  priceHistory: 900,
} as const;

export const MARKET_PAGE_SIZE = 100;

export const REQUEST_TIMEOUT_MS = 8_000;
