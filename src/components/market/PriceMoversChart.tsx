"use client";

import { ResponsiveBar } from "@nivo/bar";
import { formatPercent } from "@/lib/formatters";
import type { MarketCoin } from "@/types/market";

type Props = { coins: MarketCoin[] };

export default function PriceMoversChart({ coins }: Props) {
  const data = [...coins]
    .filter((coin) => !["USDT", "USDC", "DAI"].includes(coin.symbol))
    .filter((coin) => coin.priceChangePercentage24h !== null)
    .sort(
      (left, right) =>
        Math.abs(right.priceChangePercentage24h ?? 0) - Math.abs(left.priceChangePercentage24h ?? 0),
    )
    .slice(0, 8)
    .map((coin) => ({
      symbol: coin.symbol,
      change: coin.priceChangePercentage24h ?? 0,
    }));

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="font-semibold">Largest 24h movers</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Top tracked assets by absolute 24-hour price movement.</p>
      <div className="h-72">
        <ResponsiveBar
          data={data}
          keys={["change"]}
          indexBy="symbol"
          layout="horizontal"
          margin={{ top: 20, right: 30, bottom: 40, left: 48 }}
          padding={0.35}
          enableLabel={false}
          colors={({ data: item }) => (Number(item.change) >= 0 ? "#10b981" : "#ef4444")}
          axisBottom={{ format: (value) => `${value}%` }}
          axisLeft={{ tickSize: 0, tickPadding: 8 }}
          tooltip={({ data: item }) => (
            <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow dark:border-gray-700 dark:bg-gray-800">
              <strong>{String(item.symbol)}</strong>
              <div>{formatPercent(Number(item.change))}</div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
