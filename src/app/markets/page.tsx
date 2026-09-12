import type { Metadata } from "next";
import MarketTable from "@/components/market/MarketTable";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getMarketOverview } from "@/lib/crypto-api/market";

export const metadata: Metadata = {
  title: "Crypto Markets | Crypto Market Dashboard",
  description: "Browse the largest cryptocurrencies by market capitalization in USD.",
};

export default async function MarketsPage() {
  let coins = null;

  try {
    ({ coins } = await getMarketOverview());
  } catch {
    coins = null;
  }

  return coins ? <MarketTable coins={coins} /> : <DataUnavailable />;
}
