import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ComparisonPage from "@/components/compare/ComparisonPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { parseComparisonPair } from "@/lib/comparisons";
import { getCoinDetail } from "@/lib/crypto-api/coin";
import { CryptoApiNotFoundError } from "@/lib/crypto-api/client";

type Props = {
  params: Promise<{ pair: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsedPair = parseComparisonPair((await params).pair);
  if (!parsedPair) return comparisonFallbackMetadata;

  try {
    const [first, second] = await Promise.all([getCoinDetail(parsedPair.firstId), getCoinDetail(parsedPair.secondId)]);
    return {
      title: `${first.name} vs ${second.name}: Price, Market Cap & Stats Comparison | Crypto Market Dashboard`,
      description: `Compare ${first.name} and ${second.name} price, market cap, volume, supply, historical extremes, and other current market statistics.`,
    };
  } catch {
    return comparisonFallbackMetadata;
  }
}

export default async function ComparePairPage({ params }: Props) {
  const parsedPair = parseComparisonPair((await params).pair);
  if (!parsedPair) notFound();

  let coins = null;
  try {
    coins = await Promise.all([getCoinDetail(parsedPair.firstId), getCoinDetail(parsedPair.secondId)]);
  } catch (error) {
    if (error instanceof CryptoApiNotFoundError) notFound();
  }

  if (!coins) return <DataUnavailable />;
  return <ComparisonPage first={coins[0]} second={coins[1]} />;
}

const comparisonFallbackMetadata: Metadata = {
  title: "Cryptocurrency Comparison | Crypto Market Dashboard",
  description: "Compare cryptocurrency prices, market caps, volumes, supply, and other market statistics.",
};
