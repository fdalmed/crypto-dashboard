"use client";

import { ResponsivePie } from "@nivo/pie";
import { formatCompactCurrency } from "@/lib/formatters";
import type { GlobalMarket, MarketCoin } from "@/types/market";

type Props = {
  coins: MarketCoin[];
  global: GlobalMarket;
};

export default function MarketShareChart({ coins, global }: Props) {
  const topCoins = coins.slice(0, 5);
  const topMarketCap = topCoins.reduce((total, coin) => total + coin.marketCap, 0);
  const otherMarketCap = Math.max(global.totalMarketCap - topMarketCap, 0);
  const data = [
    ...topCoins.map((coin) => ({ id: coin.symbol, label: coin.symbol, value: coin.marketCap })),
    { id: "Other assets", label: "Other assets", value: otherMarketCap },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="font-semibold">Global market-cap distribution</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Top five tracked assets compared with the provider&apos;s global market cap.
      </p>
      <div className="h-72">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.58}
          padAngle={1}
          cornerRadius={3}
          colors={["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#6b7280"]}
          enableArcLabels={false}
          arcLinkLabelsSkipAngle={8}
          tooltip={({ datum }) => (
            <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow dark:border-gray-700 dark:bg-gray-800">
              <strong>{datum.id}</strong>
              <div>{formatCompactCurrency(datum.value)}</div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
