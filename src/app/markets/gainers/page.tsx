import type { Metadata } from "next";
import MarketPage from "@/components/market/MarketPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getGainers } from "@/lib/market-list";
import { getMarketCoins } from "@/lib/crypto-api/market";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Crypto Gainers",
  description: "Top-performing tracked cryptocurrencies over the last 24 hours.",
  alternates: { canonical: "/markets/gainers" },
};

export default async function GainersPage() {
  let coins = null;
  try {
    coins = getGainers(await getMarketCoins());
  } catch {
    coins = null;
  }

  return coins ? (
    <MarketPage
      eyebrow="24-hour performance"
      title="Top crypto gainers"
      description="Top-performing tracked cryptocurrencies over the last 24 hours. Market movements are informational, not investment advice."
      coins={coins}
      initialSort="change24h"
      initialDirection="desc"
    />
  ) : <DataUnavailable />;
}
