import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import ComparisonPage from "@/components/compare/ComparisonPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getCanonicalComparisonPath, parseComparisonPair } from "@/lib/comparisons";
import { getCoinDetail } from "@/lib/crypto-api/coin";
import { CryptoApiNotFoundError } from "@/lib/crypto-api/client";

type Props = {
  params: Promise<{ pair: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pair = (await params).pair;
  const parsedPair = parseComparisonPair(pair);
  if (!parsedPair) return comparisonFallbackMetadata;
  const canonicalPath = getCanonicalComparisonPath(parsedPair);
  if (canonicalPath !== `/compare/${pair}`) return { ...comparisonFallbackMetadata, alternates: { canonical: canonicalPath } };

  try {
    const [first, second] = await Promise.all([getCoinDetail(parsedPair.firstId), getCoinDetail(parsedPair.secondId)]);
    return {
      title: `${first.name} vs ${second.name}: Price, Market Cap & Stats Comparison`,
      description: `Compare ${first.name} and ${second.name} price, market cap, volume, supply, historical extremes, and other current market statistics.`,
      alternates: { canonical: canonicalPath },
    };
  } catch {
    return comparisonFallbackMetadata;
  }
}

export default async function ComparePairPage({ params }: Props) {
  const pair = (await params).pair;
  const parsedPair = parseComparisonPair(pair);
  if (!parsedPair) notFound();
  const canonicalPath = getCanonicalComparisonPath(parsedPair);
  if (canonicalPath !== `/compare/${pair}`) redirect(canonicalPath);

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
  title: "Cryptocurrency Comparison",
  description: "Compare cryptocurrency prices, market caps, volumes, supply, and other market statistics.",
};
