"use client";

import type { CryptoCoin } from "../types/crypto";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

type Props = {
  coins: CryptoCoin[];
};

type MarketShareData = {
  id: string;
  label: string;
  value: number;
  symbol: string;
  rank: number;
  color: string;
};

export default function MarketShareChart({ coins }: Props) {
  const totalMarketCap = useMemo(() => 
    coins.reduce((sum, c) => sum + (c.market_cap || 0), 0), 
    [coins]
  );

  // Get top 5 coins for the pie chart
  const marketShareData: MarketShareData[] = useMemo(() => {
    const topCoins = coins.slice(0, 5);
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    return topCoins.map((coin, index) => ({
      id: coin.symbol.toUpperCase(),
      label: coin.symbol.toUpperCase(),
      value: coin.market_cap || 0,
      symbol: coin.symbol.toUpperCase(),
      rank: coin.market_cap_rank || index + 1,
      color: colors[index] || colors[0],
    }));
  }, [coins]);

  // Calculate "Others" market cap
  const othersMarketCap = useMemo(() => {
    const top5MarketCap = marketShareData.reduce((sum, item) => sum + item.value, 0);
    return totalMarketCap - top5MarketCap;
  }, [marketShareData, totalMarketCap]);

  // Create data including "Others"
  const pieChartData = useMemo(() => {
    if (othersMarketCap > 0) {
      return [
        ...marketShareData,
        {
          id: 'Others',
          label: 'Others',
          value: othersMarketCap,
          symbol: 'OTHER',
          rank: 6,
          color: '#6b7280',
        }
      ];
    }
    return marketShareData;
  }, [marketShareData, othersMarketCap]);

  if (totalMarketCap === 0 || marketShareData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            Market Share Distribution
          </div>
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No market share data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          Market Share Distribution
        </div>
      </h3>
      
      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-sm">Top Coin Share</div>
          <div className="text-lg font-bold">
            {marketShareData.length > 0 
              ? `${((marketShareData[0].value / totalMarketCap) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-400">
            {marketShareData.length > 0 ? marketShareData[0].symbol : ''}
          </div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-purple-600 dark:text-purple-400 text-sm">Others Share</div>
          <div className="text-lg font-bold">
            {othersMarketCap > 0 
              ? `${((othersMarketCap / totalMarketCap) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="text-xs text-purple-500 dark:text-purple-400">
            All remaining coins
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsivePie
          data={pieChartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={({ data }) => data.color}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]]
          }}
          enableArcLabels={false}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#6b7280"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          theme={{
            text: {
              fill: '#6b7280'
            },
            tooltip: {
              container: {
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              }
            }
          }}
          tooltip={({ datum }) => {
            const percentage = totalMarketCap > 0 ? ((datum.value || 0) / totalMarketCap * 100).toFixed(1) : '0';
            const data = datum.data as MarketShareData;
            
            return (
              <div className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[180px]">
                <div className="font-bold text-lg flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: data.color }}
                  />
                  {data.id}
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xl font-bold my-1">
                  {percentage}%
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span>${Math.round((datum.value || 0) / 1000000000)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span>#{data.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{data.id === 'Others' ? 'Other Coins' : 'Major Coin'}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {pieChartData.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium">{item.id}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalMarketCap > 0 ? ((item.value / totalMarketCap) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        ))}
        {pieChartData.length > 4 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{pieChartData.length - 4} more
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
        Top {marketShareData.length} coins market dominance
      </div>
    </div>
  );
}