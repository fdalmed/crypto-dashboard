import type { Metadata } from "next";
import MarketPage from "@/components/market/MarketPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getLosers } from "@/lib/market-list";
import { getMarketCoins } from "@/lib/crypto-api/market";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Crypto Losers",
  description: "Tracked cryptocurrencies with the largest negative price movements over the last 24 hours.",
  alternates: { canonical: "/markets/losers" },
};

export default async function LosersPage() {
  let coins = null;
  try {
    coins = getLosers(await getMarketCoins());
  } catch {
    coins = null;
  }

  return coins ? (
    <MarketPage
      eyebrow="24-hour performance"
      title="Top crypto losers"
      description="Tracked cryptocurrencies with the largest negative price movements over the last 24 hours. Data is presented for information only."
      coins={coins}
      initialSort="change24h"
      initialDirection="asc"
    />
  ) : <DataUnavailable />;
}
