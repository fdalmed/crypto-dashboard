import type { MetadataRoute } from "next";

import { getMarketCoins } from "@/lib/crypto-api/market";
import { getAbsoluteUrl } from "@/lib/site-url";

const staticPaths = [
  "/", "/markets", "/markets/gainers", "/markets/losers", "/markets/trending",
  "/tools", "/tools/converter", "/tools/profit-calculator", "/tools/dca-calculator", "/tools/market-cap-calculator",
  "/compare", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer",
];

const popularPairs = ["bitcoin-vs-ethereum", "bitcoin-vs-solana", "ethereum-vs-solana"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticPaths.map((path) => ({ url: getAbsoluteUrl(path), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 }));
  const comparisonEntries = popularPairs.map((pair) => ({ url: getAbsoluteUrl(`/compare/${pair}`), changeFrequency: "daily" as const, priority: 0.6 }));
  const coins = await getMarketCoins().catch(() => []);
  const coinEntries = coins.map((coin) => ({ url: getAbsoluteUrl(`/coin/${coin.id}`), changeFrequency: "daily" as const, priority: 0.8 }));

  return [...staticEntries, ...comparisonEntries, ...coinEntries];
}
