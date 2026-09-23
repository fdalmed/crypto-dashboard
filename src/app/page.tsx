import Dashboard from "@/components/market/Dashboard";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getMarketOverview } from "@/lib/crypto-api/market";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AssetZeno - Crypto Markets, Tools & Insights",
  description: "A global USD overview of cryptocurrency prices, market capitalization, market breadth, and recent movers.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let overview = null;

  try {
    overview = await getMarketOverview();
  } catch {
    overview = null;
  }

  return overview ? <Dashboard {...overview} /> : <DataUnavailable />;
}
