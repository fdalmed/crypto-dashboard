"use client";

import type { CryptoCoin } from "../types/crypto";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import {
  ResponsiveContainer,
} from "recharts";

type Props = {
  coins: CryptoCoin[];
  loading: boolean;
};

// Colors for charts
//const PIE_COLORS = ["#00A6FB", "#0582CA", "#006494", "#003554", "#051923"];

// ------------------------------
// Simple AI Market Insight
// ------------------------------
function getAIMarketSummary(coins: CryptoCoin[]) {
  const avgChange =
    coins.reduce((sum, c) => sum + (c.price_change_percentage_24h ?? 0), 0) /
    coins.length;

  if (avgChange > 2)
    return "📈 The market is bullish. Momentum is strong — possible buy opportunities.";
  if (avgChange < -2)
    return "📉 The market is bearish. Volatility high — caution recommended.";
  return "🔍 Market is stable with small fluctuations. Good time to watch and accumulate.";
}

// ------------------------------
// PieChart AI Analysis
// ------------------------------
function getPieAnalysis(top5: CryptoCoin[]) {
  if (!top5.length) return "";

  const total = top5.reduce((sum, c) => sum + (c.market_cap ?? 0), 0);
  const biggest = top5.reduce((prev, c) =>
    (c.market_cap ?? 0) > (prev.market_cap ?? 0) ? c : prev
  );

  return `🤖 The largest market share belongs to ${biggest.name} (${(
    ((biggest.market_cap ?? 0) / total) *
    100
  ).toFixed(1)}%). Consider this in your investment strategy.`;
}

export default function CryptoDashboard({ coins, loading }: Props) {
  if (loading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  const top5 = coins.slice(0, 5);
  const aiSummary = getAIMarketSummary(coins);
  const pieAnalysis = getPieAnalysis(top5);

  // Multi-line price comparison
//   const multiLineData =
//     top5[0]?.sparkline_in_7d?.price.map((_, i) => ({
//       day: i,
//       ...Object.fromEntries(
//         top5.map((coin) => [
//           coin.symbol.toUpperCase(),
//           coin.sparkline_in_7d?.price[i] ?? 0,
//         ])
//       ),
//     })) || [];

  // Volume Bar Chart
  const volumeData = top5.map((coin) => ({
    name: coin.symbol.toUpperCase(),
    volume: coin.total_volume ?? 0,
  }));

  return (
    <div className="mt-10 space-y-10">
      {/* =============================== */}
      {/* AI MARKET SUMMARY               */}
      {/* =============================== */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow text-lg font-medium">
        <h2 className="text-xl font-bold mb-2">🤖 AI Market Summary</h2>
        <p className="text-gray-700 dark:text-gray-300">{aiSummary}</p>
      </div>

      {/* =============================== */}
      {/* MARKET OVERVIEW CARDS          */}
      {/* =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top5.map((coin) => (
          <div
            key={coin.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center gap-4"
          >
            <img src={coin.image} className="w-10 h-10" />
            <div>
              <h3 className="text-lg font-semibold">{coin.name}</h3>
              <p className="text-sm text-gray-500">
                Price: ${coin.current_price.toLocaleString()}
              </p>
              <p
                className={`p-3 text-right ${
                  (coin.price_change_percentage_24h ?? 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =============================== */}
      {/* TOP 5 – MARKET SHARE PIE CHART */}
      {/* =============================== */}
        {/* MODERN DONUT CHART */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col md:flex-row gap-6">
        <div className="flex-1 h-72">
            <h3 className="text-lg font-bold mb-2">🥧 Market Share (Top 5)</h3>

            <ResponsiveContainer width="100%" height="100%">
            <div style={{ height: "100%" }}>
                <ResponsivePie
                data={top5.map((c) => ({
                    id: c.symbol.toUpperCase(),
                    label: c.symbol.toUpperCase(),
                    value: c.market_cap,
                }))}
                innerRadius={0.65}
                padAngle={2}
                cornerRadius={8}
                activeOuterRadiusOffset={12}
                colors={["#00A6FB", "#0582CA", "#006494", "#003554", "#051923"]}
                borderWidth={1}
                borderColor="#fff"
                arcLinkLabelsTextColor="#333"
                arcLabelsTextColor="#fff"
                />
            </div>
            </ResponsiveContainer>
        </div>

        <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2">🤖 AI Analysis</h4>
            <p className="text-gray-700 dark:text-gray-300">{pieAnalysis}</p>
        </div>
        </div>


      {/* =============================== */}
      {/* VOLUME BAR CHART (MODERN)      */}
      {/* =============================== */}
        {/* MODERN BAR CHART */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">📦 Trading Volume (Top 5)</h3>

        <div style={{ height: "320px" }}>
            <ResponsiveBar
            data={volumeData}
            keys={['volume']}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
            padding={0.3}
            colors={['#00A6FB']}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            borderRadius={6}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#fff"
            theme={{
                text: {
                fill: "#000000",   // text color
                },
                axis: {
                ticks: {
                    text: {
                    fill: "#000000",
                    },
                },
                legend: {
                    text: {
                    fill: "#000000",
                    },
                },
                },
                legends: {
                text: {
                    fill: "#000000",
                },
                },
            }}

            tooltip={({ value, indexValue }) => (
                <div className="px-3 py-2 bg-gray-900 text-white rounded shadow">
                <strong>{indexValue}</strong>
                <br />
                Volume: {value.toLocaleString()}
                </div>
            )}
            />
        </div>
        </div>

    </div>
  );
}
