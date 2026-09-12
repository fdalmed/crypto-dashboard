"use client";

import { useMemo, useState } from "react";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/formatters";
import type { MarketCoin } from "@/types/market";

export default function MarketTable({ coins }: { coins: MarketCoin[] }) {
  const [query, setQuery] = useState("");
  const filteredCoins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return coins;
    return coins.filter(
      (coin) => coin.name.toLowerCase().includes(normalizedQuery) || coin.symbol.toLowerCase().includes(normalizedQuery),
    );
  }, [coins, query]);

  return (
    <section className="py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">USD market listing</p>
          <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency markets</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">The 20 largest assets by market capitalization.</p>
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Search markets</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a coin or symbol"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">24h</th>
              <th className="px-4 py-3 text-right font-medium">Market cap</th>
              <th className="px-4 py-3 text-right font-medium">Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr key={coin.id} className="border-b border-gray-100 last:border-0 dark:border-gray-700/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-right text-gray-500">{coin.marketCapRank ?? "--"}</span>
                    <img src={coin.imageUrl} alt="" className="h-7 w-7" />
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-xs text-gray-500">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(coin.currentPrice)}</td>
                <td className={`px-4 py-3 text-right font-medium ${(coin.priceChangePercentage24h ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercent(coin.priceChangePercentage24h)}
                </td>
                <td className="px-4 py-3 text-right">{formatCompactCurrency(coin.marketCap)}</td>
                <td className="px-4 py-3 text-right">{coin.totalVolume === null ? "--" : formatCompactCurrency(coin.totalVolume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCoins.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No markets matched your search.</p>}
      </div>
    </section>
  );
}
