import type { Metadata } from "next";
import MarketPage from "@/components/market/MarketPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getTrendingMarketCoins } from "@/lib/crypto-api/market";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Cryptocurrencies",
  description: "Cryptocurrencies currently listed by the market-data provider as trending.",
  alternates: { canonical: "/markets/trending" },
};

export default async function TrendingPage() {
  let coins = null;
  try {
    coins = await getTrendingMarketCoins();
  } catch {
    coins = null;
  }

  return coins ? (
    <MarketPage
      eyebrow="Provider trend data"
      title="Trending cryptocurrencies"
      description="Assets currently listed as trending by the market-data provider. Price and market fields are shown when available."
      coins={coins}
      initialSort="trendingScore"
      initialDirection="asc"
      searchable={false}
      showTrendingScore
    />
  ) : <DataUnavailable />;
}
