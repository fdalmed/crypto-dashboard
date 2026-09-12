import Dashboard from "@/components/market/Dashboard";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getMarketOverview } from "@/lib/crypto-api/market";

export default async function HomePage() {
  let overview = null;

  try {
    overview = await getMarketOverview();
  } catch {
    overview = null;
  }

  return overview ? <Dashboard {...overview} /> : <DataUnavailable />;
}
