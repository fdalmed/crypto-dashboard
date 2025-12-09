"use client";

import type { CryptoCoin } from "../types/crypto";
import { ResponsiveBar } from "@nivo/bar";
import { useMemo } from "react";

type Props = {
  coins: CryptoCoin[];
};

type RisingStarData = {
  coin: string;
  name: string;
  value: number;
  price: number;
  change: number;
  rank: number;
  iconIndex: number;
  gradient: string;
  description: string;
};

export default function RisingStarsChart({ coins }: Props) {
  // Filter for successful new coins (excluding major ones)
  const risingStarsData: RisingStarData[] = useMemo(() => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500'
    ];

    return coins
      .filter(coin => {
        const symbol = coin.symbol.toLowerCase();
        const excluded = ['btc', 'eth', 'usdt', 'usdc', 'busd', 'bnb', 'xrp', 'ada', 'sol', 'doge'];
        return !excluded.includes(symbol) && 
               coin.market_cap_rank && 
               coin.market_cap_rank <= 50 &&
               (coin.price_change_percentage_24h || 0) > 0; // Only positive performers
      })
      .slice(0, 6) // Take top 6 rising stars
      .map((coin, index) => {
        const gradient = gradients[index] || gradients[0];
        
        return {
          coin: coin.symbol.toUpperCase(),
          name: coin.name,
          value: Math.round((coin.market_cap || 0) / 1000000000),
          price: coin.current_price || 0,
          change: coin.price_change_percentage_24h || 0,
          rank: coin.market_cap_rank || 0,
          iconIndex: index,
          gradient,
          description: generateDynamicDescription(coin)
        };
      });
  }, [coins]);

  function generateDynamicDescription(coin: CryptoCoin): string {
    const rank = coin.market_cap_rank || 100;
    const change = coin.price_change_percentage_24h || 0;
    
    if (rank <= 10 && change > 5) {
      return `Leading cryptocurrency showing strong momentum and adoption.`;
    } else if (rank <= 20 && change > 10) {
      return `High-growth token with impressive market performance.`;
    } else if (rank <= 30) {
      return `Emerging crypto asset gaining traction in the market.`;
    } else {
      return `Promising digital asset with growing community support.`;
    }
  }

  // Helper function to get color from gradient
  const getColorFromGradient = (gradient: string): string => {
    const colors: Record<string, string> = {
      'from-purple-500 to-pink-500': '#8b5cf6',
      'from-blue-500 to-cyan-500': '#3b82f6',
      'from-green-500 to-emerald-500': '#10b981',
      'from-orange-500 to-red-500': '#f97316',
      'from-indigo-500 to-purple-500': '#6366f1',
      'from-teal-500 to-green-500': '#14b8a6',
    };
    return colors[gradient] || '#3b82f6';
  };

  // Icon components as inline SVGs
  const getIconSvg = (index: number, className: string = "w-5 h-5") => {
    const icons = [
      // Rocket
      <svg key="rocket" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      // Zap
      <svg key="zap" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      // Sparkles
      <svg key="sparkles" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
      // Shield
      <svg key="shield" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>,
      // Globe
      <svg key="globe" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      // Trophy
      <svg key="trophy" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ];
    
    return icons[index] || icons[0];
  };

  if (risingStarsData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              {getIconSvg(0, "w-5 h-5 text-white")}
            </div>
            Rising Stars & Emerging Cryptocurrencies
          </div>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          These cryptocurrencies show promising growth and innovation in the market.
        </p>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No rising stars data available at the moment</p>
        </div>
      </div>
    );
  }

  const formatLabel = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0B';
    return `$${value}B`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            {getIconSvg(0, "w-5 h-5 text-white")}
          </div>
          Rising Stars & Emerging Cryptocurrencies
        </div>
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        These cryptocurrencies show promising growth and innovation in the market.
      </p>
      
      <div className="h-64">
        <ResponsiveBar
          data={risingStarsData}
          keys={['value']}
          indexBy="coin"
          margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
          padding={0.5}
          colors={(bar) => {
            const coin = risingStarsData.find(c => c.coin === bar.indexValue);
            return coin ? getColorFromGradient(coin.gradient) : '#3b82f6';
          }}
          borderRadius={6}
          axisBottom={{
            legend: 'Cryptocurrency',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            legend: 'Market Cap (Billions USD)',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          label={({ value }) => formatLabel(value)}
          labelTextColor="#ffffff"
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#6b7280'
                }
              },
              legend: {
                text: {
                  fill: '#6b7280'
                }
              }
            },
            grid: {
              line: {
                stroke: '#e5e7eb',
                strokeWidth: 1
              }
            },
            labels: {
              text: {
                fill: '#ffffff',
                fontSize: '11px',
                fontWeight: 'bold'
              }
            }
          }}
          tooltip={({ data }) => {
            const coinData = data as RisingStarData;
            return (
              <div className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-gradient-to-r ${coinData.gradient} rounded-lg`}>
                    {getIconSvg(coinData.iconIndex, "w-6 h-6 text-white")}
                  </div>
                  <div>
                    <strong className="text-lg">{coinData.coin}</strong>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{coinData.name}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
                    <span className="font-semibold">${coinData.value}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Price:</span>
                    <span>${coinData.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">24h Change:</span>
                    <span className={`font-semibold ${coinData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {coinData.change >= 0 ? '+' : ''}{coinData.change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Rank:</span>
                    <span>#{coinData.rank}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">{coinData.description}</p>
                </div>
              </div>
            );
          }}
        />
      </div>
      
      {/* Coin Cards Grid */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {risingStarsData.map((coin) => (
          <div key={coin.coin} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 bg-gradient-to-r ${coin.gradient} rounded-md`}>
                {getIconSvg(coin.iconIndex, "w-3 h-3 text-white")}
              </div>
              <span className="font-medium text-sm">{coin.coin}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ${coin.value}B • <span className={`font-semibold ${coin.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 truncate">
              Rank #{coin.rank}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}