"use client";

import { useState } from "react";
import type { CryptoCoin } from "../types/crypto";
import KPIHeader from "./KPIHeader";
import TopCoinsGrid from "./TopCoinsGrid";
import MarketShareChart from "./MarketShareChart";
import PriceChangeChart from "./PriceChangeChart";
import MarketCapChart from "./MarketCapChart";
import BTCEthComparison from "./BTCEthComparison";
import AIMarketInsights from "./AIMarketInsights"; // Updated import

type Props = {
  coins: CryptoCoin[];
  loading: boolean;
};

export default function DashboardModern({ coins, loading }: Props) {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="mt-10 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  const top5 = coins.slice(0, 5);
  const top10 = coins.slice(0, 10);

  return (
    <div className="space-y-8 mt-6">
      {/* KPI Header */}
      <KPIHeader coins={coins} />

      {/* Top Coins Grid */}
      <TopCoinsGrid 
        coins={top5} 
        selectedCoinId={selectedCoinId}
        onCoinSelect={setSelectedCoinId}
      />

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketShareChart coins={top5} />
        <PriceChangeChart coins={top10} />
      </div>

      {/* Market Cap Chart - Shows top movers */}
      <MarketCapChart coins={coins} />

      {/* AI Market Insights - Dynamic analysis */}
      <AIMarketInsights coins={coins} />

      {/* BTC/ETH Comparison */}
      <BTCEthComparison coins={coins} />
    </div>
  );
}