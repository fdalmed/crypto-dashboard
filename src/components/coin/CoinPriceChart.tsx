"use client";

import { ResponsiveLine } from "@nivo/line";
import { formatCurrency } from "@/lib/formatters";
import type { HistoricalPricePoint } from "@/types/market";

export default function CoinPriceChart({ points }: { points: HistoricalPricePoint[] }) {
  const data = [{
    id: "USD price",
    data: points.map((point) => ({ x: point.timestamp, y: point.price })),
  }];

  return (
    <div className="nivo-chart h-80" role="img" aria-label="30-day historical USD price chart">
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 24, bottom: 48, left: 70 }}
        xScale={{ type: "linear", min: "auto", max: "auto" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        curve="monotoneX"
        enableArea
        areaOpacity={0.12}
        colors={["#2563eb"]}
        lineWidth={2}
        enablePoints={false}
        enableGridX={false}
        axisBottom={{
          tickValues: 4,
          format: (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(Number(value))),
        }}
        axisLeft={{
          tickValues: 5,
          format: (value) => formatCurrency(Number(value)),
        }}
        tooltip={({ point }) => (
          <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow dark:border-gray-700 dark:bg-gray-800">
            <strong>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(Number(point.data.x)))}</strong>
            <div>{formatCurrency(Number(point.data.y))}</div>
          </div>
        )}
        theme={{
          axis: { ticks: { text: { fill: "#6b7280", fontSize: 11 } } },
          grid: { line: { stroke: "#e5e7eb" } },
        }}
      />
    </div>
  );
}
