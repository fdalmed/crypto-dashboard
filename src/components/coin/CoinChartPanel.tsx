"use client";

import dynamic from "next/dynamic";
import type { HistoricalPricePoint } from "@/types/market";

const CoinPriceChart = dynamic(() => import("./CoinPriceChart"), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />,
});

export default function CoinChartPanel({ points }: { points: HistoricalPricePoint[] }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold">30-day price chart</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Historical USD market prices from the data provider.</p>
      <div className="mt-4">
        {points.length > 1 ? <CoinPriceChart points={points} /> : <p className="flex h-80 items-center justify-center text-sm text-gray-500 dark:text-gray-400">Historical price data is unavailable for this asset.</p>}
      </div>
    </section>
  );
}
