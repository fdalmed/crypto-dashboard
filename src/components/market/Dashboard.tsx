"use client";

import dynamic from "next/dynamic";
import { formatCompactCurrency, formatCurrency, formatDateTime, formatPercent } from "@/lib/formatters";
import type { MarketOverview } from "@/types/market";

const MarketShareChart = dynamic(() => import("./MarketShareChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const PriceMoversChart = dynamic(() => import("./PriceMoversChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export default function Dashboard({ coins, global, updatedAt }: MarketOverview) {
  const averageChange = coins.length
    ? coins.reduce((sum, coin) => sum + (coin.priceChangePercentage24h ?? 0), 0) / coins.length
    : 0;
  const gainers = coins.filter((coin) => (coin.priceChangePercentage24h ?? 0) > 0).length;
  const losers = coins.filter((coin) => (coin.priceChangePercentage24h ?? 0) < 0).length;
  const topGainer = [...coins].sort(
    (left, right) => (right.priceChangePercentage24h ?? 0) - (left.priceChangePercentage24h ?? 0),
  )[0];

  const metrics = [
    { label: "Global market cap", value: formatCompactCurrency(global.totalMarketCap) },
    {
      label: "Global 24h change",
      value: formatPercent(global.marketCapChangePercentage24h),
      tone: (global.marketCapChangePercentage24h ?? 0) >= 0 ? "positive" : "negative",
    },
    { label: "BTC dominance", value: global.bitcoinDominance === null ? "--" : `${global.bitcoinDominance.toFixed(1)}%` },
    { label: "Tracked gainers / losers", value: `${gainers} / ${losers}` },
  ];

  return (
    <div className="space-y-8 py-6">
      <section>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">USD market overview</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crypto market at a glance</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Last updated {formatDateTime(updatedAt)}</p>
          </div>
          {topGainer && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
              Top tracked gainer: {topGainer.symbol} {formatPercent(topGainer.priceChangePercentage24h)}
            </p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
            <p className={`mt-2 text-xl font-bold ${metric.tone === "positive" ? "text-green-600" : metric.tone === "negative" ? "text-red-600" : ""}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">Top cryptocurrencies</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">By market cap</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {coins.slice(0, 5).map((coin) => (
            <article key={coin.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <img src={coin.imageUrl} alt="" className="h-8 w-8" />
                <div className="min-w-0">
                  <p className="font-semibold">{coin.symbol}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{coin.name}</p>
                </div>
              </div>
              <p className="mt-4 font-semibold">{coin.currentPrice === null ? "N/A" : formatCurrency(coin.currentPrice)}</p>
              <p className={`mt-1 text-sm font-medium ${(coin.priceChangePercentage24h ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercent(coin.priceChangePercentage24h)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MarketShareChart coins={coins} global={global} />
        <PriceMoversChart coins={coins} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MarketSignal title="Market breadth" value={`${gainers} gainers and ${losers} decliners`} description="Based on the 20 largest assets returned by the current market listing." />
        <MarketSignal title="Average tracked change" value={formatPercent(averageChange)} description="A descriptive market signal, not investment advice." />
      </section>
    </div>
  );
}

function MarketSignal({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </article>
  );
}

function ChartSkeleton() {
  return <div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />;
}
