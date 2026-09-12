import type { Metadata } from "next";
import MarketPage from "@/components/market/MarketPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getMarketOverview } from "@/lib/crypto-api/market";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cryptocurrency Markets",
  description: "Browse the largest cryptocurrencies by market capitalization in USD.",
  alternates: { canonical: "/markets" },
};

export default async function MarketsPage() {
  let coins = null;

  try {
    ({ coins } = await getMarketOverview());
  } catch {
    coins = null;
  }

  return coins ? (
    <MarketPage
      eyebrow="USD market listing"
      title="Cryptocurrency markets"
      description="Browse and sort the 100 largest tracked cryptocurrencies by market capitalization."
      coins={coins}
    />
  ) : <DataUnavailable />;
}
