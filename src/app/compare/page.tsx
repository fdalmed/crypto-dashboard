import type { Metadata } from "next";
import Link from "next/link";

import ComparePicker from "@/components/compare/ComparePicker";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getMarketCoins } from "@/lib/crypto-api/market";

export const metadata: Metadata = {
  title: "Compare Cryptocurrencies | Crypto Market Dashboard",
  description: "Compare cryptocurrency price, market cap, volume, supply, and historical market statistics side by side.",
};

const popularComparisons = [
  { first: "Bitcoin", second: "Ethereum", href: "/compare/bitcoin-vs-ethereum" },
  { first: "Bitcoin", second: "Solana", href: "/compare/bitcoin-vs-solana" },
  { first: "Ethereum", second: "Solana", href: "/compare/ethereum-vs-solana" },
];

export const dynamic = "force-dynamic";

export default async function CompareLandingPage() {
  const coins = await getMarketCoins().catch(() => null);

  return (
    <div className="py-6">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Market comparison</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Compare cryptocurrencies</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">Review current price, market capitalization, trading volume, supply, and historical extremes for two assets side by side. Comparisons are factual market-data views, not investment advice.</p>
      </header>

      <section className="mt-6" aria-labelledby="popular-comparisons">
        <h2 id="popular-comparisons" className="text-lg font-semibold">Popular comparisons</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {popularComparisons.map((comparison) => (
            <Link key={comparison.href} href={comparison.href} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <h3 className="font-semibold">{comparison.first} vs {comparison.second}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Compare price, market cap, supply, and volume.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 max-w-3xl">
        {coins ? <ComparePicker coins={coins} /> : <DataUnavailable />}
      </section>
    </div>
  );
}
