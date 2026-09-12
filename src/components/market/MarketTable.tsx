"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/formatters";
import { filterMarketCoins, sortMarketCoins, type MarketSortKey, type SortDirection } from "@/lib/market-list";
import { isTrendingMarketCoin, type MarketCoin } from "@/types/market";
import MarketEmptyState from "./MarketEmptyState";

type Props = {
  coins: MarketCoin[];
  initialSort?: MarketSortKey;
  initialDirection?: SortDirection;
  searchable?: boolean;
  showTrendingScore?: boolean;
};

const columns: Array<{ key: MarketSortKey; label: string; align?: "right" }> = [
  { key: "rank", label: "Rank", align: "right" },
  { key: "name", label: "Asset" },
  { key: "price", label: "Price", align: "right" },
  { key: "change24h", label: "24h %", align: "right" },
  { key: "marketCap", label: "Market cap", align: "right" },
  { key: "volume", label: "24h volume", align: "right" },
];

export default function MarketTable({
  coins,
  initialSort = "rank",
  initialDirection = "asc",
  searchable = true,
  showTrendingScore = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<MarketSortKey>(initialSort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);
  const results = useMemo(
    () => sortMarketCoins(filterMarketCoins(coins, query), sortKey, sortDirection),
    [coins, query, sortDirection, sortKey],
  );

  const updateSort = (key: MarketSortKey) => {
    if (key === sortKey) {
      setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "name" || key === "rank" || key === "trendingScore" ? "asc" : "desc");
  };

  return (
    <section>
      {searchable && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{results.length} matching assets</p>
          <label className="w-full sm:w-80">
            <span className="sr-only">Search markets by coin name or symbol</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search coin name or symbol"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800"
            />
          </label>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
            <tr>
              {columns.map((column) => {
                const isActive = sortKey === column.key;
                const ariaSort = isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={column.key} scope="col" aria-sort={ariaSort} className={`px-4 py-3 ${column.align === "right" ? "text-right" : "text-left"}`}>
                    <button
                      type="button"
                      onClick={() => updateSort(column.key)}
                      className="inline-flex items-center gap-1 rounded font-medium outline-none ring-blue-500 focus:ring-2"
                      aria-label={`Sort by ${column.label}${isActive ? `, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : ""}`}
                    >
                      {column.label}
                      <span aria-hidden="true">{isActive ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}</span>
                    </button>
                  </th>
                );
              })}
              {showTrendingScore && (
                <th scope="col" aria-sort={sortKey === "trendingScore" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => updateSort("trendingScore")}
                    className="inline-flex items-center gap-1 rounded font-medium outline-none ring-blue-500 focus:ring-2"
                    aria-label="Sort by provider trend position"
                  >
                    Trend position
                    <span aria-hidden="true">{sortKey === "trendingScore" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {results.map((coin) => (
              <tr key={coin.id} className="border-b border-gray-100 last:border-0 dark:border-gray-700/70">
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{coin.marketCapRank ?? "N/A"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {coin.imageUrl ? <img src={coin.imageUrl} alt="" className="h-7 w-7" /> : <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
                    <div>
                      <Link href={`/coin/${coin.id}`} className="rounded font-medium hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:text-blue-400">
                        {coin.name}
                      </Link>
                      <p className="text-xs text-gray-500">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">{coin.currentPrice === null ? "N/A" : formatCurrency(coin.currentPrice)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${(coin.priceChangePercentage24h ?? 0) >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {formatPercent(coin.priceChangePercentage24h)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{coin.marketCap === null ? "N/A" : formatCompactCurrency(coin.marketCap)}</td>
                <td className="px-4 py-3 text-right">{coin.totalVolume === null ? "N/A" : formatCompactCurrency(coin.totalVolume)}</td>
                {showTrendingScore && <td className="px-4 py-3 text-right font-medium">{isTrendingMarketCoin(coin) ? coin.trendingScore + 1 : "N/A"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && <MarketEmptyState message="No market assets matched the current filters." />}
      </div>
    </section>
  );
}
