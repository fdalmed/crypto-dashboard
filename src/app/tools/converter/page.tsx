import type { Metadata } from "next";
import Converter from "@/components/tools/Converter";
import ToolPageHeader from "@/components/tools/ToolPageHeader";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getFiatPerUsdRates, getMarketCoins } from "@/lib/crypto-api/market";

export const metadata: Metadata = {
  title: "Crypto Converter",
  description: "Convert a cryptocurrency amount to supported fiat currencies using recent market data.",
  alternates: { canonical: "/tools/converter" },
};

export const dynamic = "force-dynamic";

export default async function ConverterPage() {
  let data = null;
  try {
    const [coins, fiatRates] = await Promise.all([getMarketCoins(), getFiatPerUsdRates()]);
    data = { coins, fiatRates, loadedAt: new Date().toISOString() };
  } catch {
    data = null;
  }

  return (
    <>
      <ToolPageHeader title="Crypto converter" description="Convert a selected cryptocurrency into a supported fiat currency using recent cached market data." />
      {data ? <Converter {...data} /> : <DataUnavailable />}
    </>
  );
}
