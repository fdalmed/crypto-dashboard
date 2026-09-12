import Link from "next/link";

import { getAbsoluteDifference, getComparisonSummary, getHigherToLowerRatio } from "@/lib/comparisons";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import type { CoinDetail } from "@/types/market";

type Props = {
  first: CoinDetail;
  second: CoinDetail;
};

export default function ComparisonPage({ first, second }: Props) {
  const marketCapDifference = getAbsoluteDifference(first.marketCap, second.marketCap);
  const marketCapRatio = getHigherToLowerRatio(first.marketCap, second.marketCap);
  const largerMarketCap = getHigherName(first, second, "marketCap");
  const higherVolume = getHigherName(first, second, "totalVolume");
  const largerSupply = getHigherName(first, second, "circulatingSupply");

  return (
    <div className="py-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        <Link href="/compare" className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">Compare</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{first.name} vs {second.name}</span>
      </nav>

      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Market comparison</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{first.name} vs {second.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">{getComparisonSummary(first, second)}</p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2" aria-label={`${first.name} and ${second.name} identities`}>
        <CoinIdentity coin={first} />
        <CoinIdentity coin={second} />
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold">Market data comparison</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Current USD market statistics supplied by the market-data provider. Unavailable data is shown as N/A.</p>
        <dl className="mt-5 space-y-3">
          <ComparisonColumnHeadings firstName={first.name} secondName={second.name} />
          <ComparisonMetric label="Current price" first={currencyValue(first.currentPrice)} second={currencyValue(second.currentPrice)} />
          <ComparisonMetric label="24h change" first={percentValue(first.priceChangePercentage24h)} second={percentValue(second.priceChangePercentage24h)} firstTone={percentTone(first.priceChangePercentage24h)} secondTone={percentTone(second.priceChangePercentage24h)} />
          <ComparisonMetric label="7-day change" first={percentValue(first.priceChangePercentage7d)} second={percentValue(second.priceChangePercentage7d)} firstTone={percentTone(first.priceChangePercentage7d)} secondTone={percentTone(second.priceChangePercentage7d)} />
          <ComparisonMetric label="Market cap" first={compactCurrencyValue(first.marketCap)} second={compactCurrencyValue(second.marketCap)} />
          <ComparisonMetric label="24h volume" first={compactCurrencyValue(first.totalVolume)} second={compactCurrencyValue(second.totalVolume)} />
          <ComparisonMetric label="Fully diluted valuation" first={compactCurrencyValue(first.fullyDilutedValuation)} second={compactCurrencyValue(second.fullyDilutedValuation)} />
          <ComparisonMetric label="Circulating supply" first={numberValue(first.circulatingSupply)} second={numberValue(second.circulatingSupply)} />
          <ComparisonMetric label="Total supply" first={numberValue(first.totalSupply)} second={numberValue(second.totalSupply)} />
          <ComparisonMetric label="Max supply" first={numberValue(first.maxSupply)} second={numberValue(second.maxSupply)} />
        </dl>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Historical extremes</h2>
          <dl className="mt-4 space-y-3">
            <ComparisonColumnHeadings firstName={first.name} secondName={second.name} />
            <ComparisonMetric label="All-time high" first={currencyValue(first.allTimeHigh)} second={currencyValue(second.allTimeHigh)} />
            <ComparisonMetric label="ATH change" first={percentValue(first.allTimeHighChangePercentage)} second={percentValue(second.allTimeHighChangePercentage)} firstTone={percentTone(first.allTimeHighChangePercentage)} secondTone={percentTone(second.allTimeHighChangePercentage)} />
            <ComparisonMetric label="All-time low" first={currencyValue(first.allTimeLow)} second={currencyValue(second.allTimeLow)} />
            <ComparisonMetric label="ATL change" first={percentValue(first.allTimeLowChangePercentage)} second={percentValue(second.allTimeLowChangePercentage)} firstTone={percentTone(first.allTimeLowChangePercentage)} secondTone={percentTone(second.allTimeLowChangePercentage)} />
          </dl>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Relative market size</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Market-cap difference" value={marketCapDifference === null ? "N/A" : formatCompactCurrency(marketCapDifference)} />
            <DetailRow label="Higher-to-lower market-cap ratio" value={marketCapRatio === null ? "N/A" : `${marketCapRatio.toFixed(2)}x`} />
            <DetailRow label="Larger market cap" value={largerMarketCap ?? "N/A"} />
            <DetailRow label="Higher 24h volume" value={higherVolume ?? "N/A"} />
            <DetailRow label="Larger circulating supply" value={largerSupply ?? "N/A"} />
          </dl>
          <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300">These are descriptive comparisons of the displayed data, not investment guidance.</p>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold">Explore market data</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Open either asset's market page for detail, or select another pair from the comparison hub.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/coin/${first.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">View {first.name}</Link>
          <Link href={`/coin/${second.id}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-700">View {second.name}</Link>
          <Link href="/markets" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-700">Browse markets</Link>
        </div>
      </section>
    </div>
  );
}

function CoinIdentity({ coin }: { coin: CoinDetail }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        {coin.imageUrl ? <img src={coin.imageUrl} alt={`${coin.name} logo`} className="h-11 w-11" /> : <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
        <div>
          <h2 className="font-semibold">{coin.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{coin.symbol} {coin.marketCapRank === null ? "- Rank N/A" : `- Rank #${coin.marketCapRank}`}</p>
        </div>
      </div>
      <Link href={`/coin/${coin.id}`} className="mt-4 inline-flex rounded text-sm font-medium text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400">View {coin.name} market page</Link>
    </article>
  );
}

function ComparisonMetric({ label, first, second, firstTone, secondTone }: { label: string; first: string; second: string; firstTone?: string; secondTone?: string }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-700 sm:grid-cols-[minmax(10rem,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <dt className="col-span-2 text-sm text-gray-500 dark:text-gray-400 sm:col-span-1">{label}</dt>
      <dd className={`text-sm font-medium ${firstTone ?? ""}`}>{first}</dd>
      <dd className={`text-sm font-medium ${secondTone ?? ""}`}>{second}</dd>
    </div>
  );
}

function ComparisonColumnHeadings({ firstName, secondName }: { firstName: string; secondName: string }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-[minmax(10rem,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <span className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:col-span-1">Metric</span>
      <span className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{firstName}</span>
      <span className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{secondName}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">{label}</dt><dd className="text-right font-medium">{value}</dd></div>;
}

function getHigherName(first: CoinDetail, second: CoinDetail, field: "marketCap" | "totalVolume" | "circulatingSupply") {
  const firstValue = first[field];
  const secondValue = second[field];
  if (firstValue === null || secondValue === null || !Number.isFinite(firstValue) || !Number.isFinite(secondValue) || firstValue < 0 || secondValue < 0 || firstValue === secondValue) return null;
  return firstValue > secondValue ? first.name : second.name;
}

function currencyValue(value: number | null) { return value === null ? "N/A" : formatCurrency(value); }
function compactCurrencyValue(value: number | null) { return value === null ? "N/A" : formatCompactCurrency(value); }
function numberValue(value: number | null) { return value === null ? "N/A" : formatNumber(value); }
function percentValue(value: number | null) { return formatPercent(value); }
function percentTone(value: number | null) { return value === null || value === 0 ? undefined : value > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"; }
