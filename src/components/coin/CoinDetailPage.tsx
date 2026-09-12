import Link from "next/link";
import CoinChartPanel from "@/components/coin/CoinChartPanel";
import { formatCompactCurrency, formatCurrency, formatDateTime, formatNumber, formatPercent } from "@/lib/formatters";
import type { CoinDetail, HistoricalPricePoint } from "@/types/market";

type Props = {
  coin: CoinDetail;
  history: HistoricalPricePoint[];
};

export default function CoinDetailPage({ coin, history }: Props) {
  const changeTone = (coin.priceChangePercentage24h ?? 0) >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400";

  return (
    <div className="py-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        <Link href="/" className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">Overview</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/markets" className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">Markets</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{coin.name}</span>
      </nav>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            {coin.imageUrl ? <img src={coin.imageUrl} alt={`${coin.name} logo`} className="h-14 w-14" /> : <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{coin.name} price</h1>
              <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">{coin.symbol} {coin.marketCapRank === null ? "" : `· Rank #${coin.marketCapRank}`}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold">{coin.currentPrice === null ? "N/A" : formatCurrency(coin.currentPrice)}</p>
            <p className={`mt-1 text-sm font-medium ${changeTone}`}>24h: {formatPercent(coin.priceChangePercentage24h)}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Market cap" value={formatValue(coin.marketCap, formatCompactCurrency)} />
        <Metric label="24h volume" value={formatValue(coin.totalVolume, formatCompactCurrency)} />
        <Metric label="Fully diluted valuation" value={formatValue(coin.fullyDilutedValuation, formatCompactCurrency)} />
        <Metric label="Circulating supply" value={formatValue(coin.circulatingSupply, formatNumber)} />
        <Metric label="Total supply" value={formatValue(coin.totalSupply, formatNumber)} />
        <Metric label="Max supply" value={formatValue(coin.maxSupply, formatNumber)} />
      </section>

      <div className="mt-6">
        <CoinChartPanel points={history} />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Market statistics</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="7-day change" value={formatPercent(coin.priceChangePercentage7d)} />
            <DetailRow label="All-time high" value={formatValue(coin.allTimeHigh, formatCurrency)} />
            <DetailRow label="ATH change" value={formatPercent(coin.allTimeHighChangePercentage)} />
            <DetailRow label="All-time low" value={formatValue(coin.allTimeLow, formatCurrency)} />
            <DetailRow label="ATL change" value={formatPercent(coin.allTimeLowChangePercentage)} />
            <DetailRow label="Last updated" value={coin.lastUpdated ? formatDateTime(coin.lastUpdated) : "N/A"} />
          </dl>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold">About this market page</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            This page summarizes current USD market data and recent price history for {coin.name}. Values are supplied by an external market-data provider and may be delayed or unavailable.
          </p>
          <Link href="/markets" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Explore all markets
          </Link>
        </article>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">{label}</dt><dd className="text-right font-medium">{value}</dd></div>;
}

function formatValue(value: number | null, formatter: (value: number) => string) {
  return value === null ? "N/A" : formatter(value);
}
