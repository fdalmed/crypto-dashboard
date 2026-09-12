import { isTrendingMarketCoin, type MarketCoin } from "@/types/market";

export type MarketSortKey = "rank" | "name" | "price" | "change24h" | "marketCap" | "volume" | "trendingScore";
export type SortDirection = "asc" | "desc";

export function filterMarketCoins(coins: MarketCoin[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return coins;

  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(normalizedQuery) ||
      coin.symbol.toLowerCase().includes(normalizedQuery),
  );
}

export function sortMarketCoins(coins: MarketCoin[], key: MarketSortKey, direction: SortDirection) {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...coins].sort((left, right) => {
    const leftValue = getSortValue(left, key);
    const rightValue = getSortValue(right, key);
    if (leftValue === null && rightValue !== null) return 1;
    if (rightValue === null && leftValue !== null) return -1;
    if (leftValue !== null && rightValue !== null) {
      const result = typeof leftValue === "string"
        ? leftValue.localeCompare(String(rightValue))
        : leftValue - Number(rightValue);
      if (result !== 0) return result * multiplier;
    }
    return left.name.localeCompare(right.name);
  });
}

function getSortValue(coin: MarketCoin, key: MarketSortKey): string | number | null {
  switch (key) {
    case "name": return coin.name;
    case "rank": return coin.marketCapRank;
    case "price": return coin.currentPrice;
    case "change24h": return coin.priceChangePercentage24h;
    case "marketCap": return coin.marketCap;
    case "volume": return coin.totalVolume;
    case "trendingScore": return isTrendingMarketCoin(coin) ? coin.trendingScore : null;
  }
}

export function getGainers(coins: MarketCoin[]) {
  return sortMarketCoins(
    coins.filter((coin) => (coin.priceChangePercentage24h ?? 0) > 0),
    "change24h",
    "desc",
  );
}

export function getLosers(coins: MarketCoin[]) {
  return sortMarketCoins(
    coins.filter((coin) => (coin.priceChangePercentage24h ?? 0) < 0),
    "change24h",
    "asc",
  );
}
