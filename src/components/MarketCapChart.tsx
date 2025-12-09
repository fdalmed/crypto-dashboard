"use client";

import type { CryptoCoin } from "../types/crypto";
import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect, useMemo } from 'react';

type Props = {
  coins: CryptoCoin[];
};

type PriceChangeData = {
  coin: string;
  name: string;
  change: number;
  price: number;
  marketCap: number;
  rank: number;
  icon?: string;
};

export default function MarketCapChart({ coins }: Props) {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get top 10 coins by absolute percentage change (both gainers and losers)
  const priceChangeData: PriceChangeData[] = useMemo(() => {
    return [...coins]
      .filter(coin => {
        const symbol = coin.symbol.toLowerCase();
        const excluded = ['usdt', 'usdc', 'usds', 'busd', 'dai'];
        return !excluded.includes(symbol) && 
               coin.price_change_percentage_24h !== undefined;
      })
      .sort((a, b) => {
        const changeA = Math.abs(a.price_change_percentage_24h || 0);
        const changeB = Math.abs(b.price_change_percentage_24h || 0);
        return changeB - changeA;
      })
      .slice(0, 10)
      .map((coin) => ({
        coin: coin.symbol.toUpperCase(),
        name: coin.name,
        change: coin.price_change_percentage_24h || 0,
        // TEST: Force some negative values
        //change: (Math.random() * 20 - 10), // Random between -10% and +10%
        // OR specific test pattern
        // change: index % 2 === 0 ? 5.5 : -3.2, // Alternate positive/negative
        price: coin.current_price || 0,
        marketCap: Math.round((coin.market_cap || 0) / 1000000000),
        rank: coin.market_cap_rank || 0,
        icon: coin.image || `https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`,
      }));
  }, [coins]);

  if (priceChangeData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm sm:text-base">Top 24h Price Movers</span>
          </div>
        </h3>
        <div className="h-40 sm:h-48 flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No price movement data available</p>
        </div>
      </div>
    );
  }

  // Check if we have negative values
  const losers = priceChangeData.filter(coin => coin.change < 0);
  const gainers = priceChangeData.filter(coin => coin.change >= 0);
  const hasLosers = losers.length > 0;
  const hasGainers = gainers.length > 0;

  // Calculate max absolute change for symmetric axis
  const maxAbsChange = useMemo(() => {
    const changes = priceChangeData.map(d => Math.abs(d.change));
    return Math.max(...changes, 1);
  }, [priceChangeData]);

  // Determine axis range based on data
  let axisMin = 0;
  let axisMax = maxAbsChange;
  
  if (hasLosers && hasGainers) {
    axisMin = -maxAbsChange;
    axisMax = maxAbsChange;
  } else if (hasLosers && !hasGainers) {
    const negativeChanges = priceChangeData.map(d => d.change);
    const minChange = Math.min(...negativeChanges);
    axisMin = minChange * 1.1;
    axisMax = 0;
  } else {
    const positiveChanges = priceChangeData.map(d => d.change);
    const maxChange = Math.max(...positiveChanges);
    axisMin = 0;
    axisMax = maxChange * 1.1;
  }

  // Generate appropriate tick values
  const getTickValues = () => {
    const ticks = [];
    const numTicks = isMobile ? 3 : 5;
    
    if (hasLosers && !hasGainers) {
      for (let i = 0; i <= numTicks; i++) {
        const value = axisMin + (i * Math.abs(axisMin) / numTicks);
        ticks.push(value);
      }
    } else if (!hasLosers && hasGainers) {
      for (let i = 0; i <= numTicks; i++) {
        const value = i * axisMax / numTicks;
        ticks.push(value);
      }
    } else {
      for (let i = 0; i <= numTicks; i++) {
        const value = axisMin + (i * (axisMax - axisMin) / numTicks);
        ticks.push(value);
      }
    }
    
    return ticks;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-3 sm:mb-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-sm sm:text-base">Top 10 Crypto Movers (24h %)</span>
        </div>
      </h3>
      
    {/* Summary Stats */}
    <div className={`grid gap-3 mb-4 ${hasLosers && hasGainers ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
    {hasGainers && (
        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/40">
        <div className="flex items-center justify-between">
            <div>
            <div className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">Top Gainer</div>
            <div className="text-lg sm:text-xl font-bold mt-1 text-gray-800 dark:text-gray-100">
                {gainers[0]?.coin}
            </div>
            </div>
            <div className="text-right">
            <div className="text-green-600 dark:text-green-400 text-base sm:text-lg font-bold">
                +{gainers[0]?.change.toFixed(isMobile ? 1 : 2)}%
            </div>
            <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                {gainers.length} gainer{gainers.length !== 1 ? 's' : ''}
            </div>
            </div>
        </div>
        </div>
    )}
    
    {hasLosers && (
        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/40">
        <div className="flex items-center justify-between">
            <div>
            <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium">Top Loser</div>
            <div className="text-lg sm:text-xl font-bold mt-1 text-gray-800 dark:text-gray-100">
                {losers[0]?.coin}
            </div>
            </div>
            <div className="text-right">
            <div className="text-red-600 dark:text-red-400 text-base sm:text-lg font-bold">
                {losers[0]?.change.toFixed(isMobile ? 1 : 2)}%
            </div>
            <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                {losers.length} decliner{losers.length !== 1 ? 's' : ''}
            </div>
            </div>
        </div>
        </div>
    )}
    </div>
      <div className={`h-${isMobile ? '40' : '64'}`}>
        <ResponsiveBar
          data={priceChangeData}
          keys={['change']}
          indexBy="coin"
          margin={{
            top: isMobile ? 30 : 40,
            right: isMobile ? 120 : 180,
            bottom: isMobile ? 40 : 60,
            left: isMobile ? 40 : 80
          }}
          padding={isMobile ? 0.3 : 0.5}
          layout="horizontal"
          colors={({ data }) => {
            const d = data as PriceChangeData;
            const change = d?.change || 0;
            return change >= 0 ? '#10b981' : '#ef4444';
          }}
          borderRadius={isMobile ? 2 : 3}
          valueScale={{ type: 'linear', min: axisMin, max: axisMax }}
          axisBottom={{
            tickSize: 5,
            tickPadding: isMobile ? 5 : 10,
            tickRotation: isMobile ? 0 : -45,
            tickValues: getTickValues(),
            format: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(isMobile ? 0 : 0)}%`,
          }}
          axisLeft={null}
          axisTop={{
            legend: '24h Change (%)',
            legendPosition: 'middle',
            legendOffset: isMobile ? -20 : -25,
            tickValues: [],
          }}
          enableGridY={false}
          enableLabel={false}
          labelSkipWidth={20}
          labelSkipHeight={20}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#6b7280',
                  fontSize: isMobile ? '10px' : '12px'
                }
              },
              legend: {
                text: {
                  fill: '#6b7280',
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: 600
                }
              }
            },
            grid: {
              line: {
                stroke: '#e5e7eb',
                strokeWidth: 1
              }
            }
          }}
          layers={[
            'grid',
            'axes',
            'bars',
            'markers',
            'legends',
            'annotations',
            (props) => {
              const { bars } = props;
              return (
                <g>
                  {bars.map((bar: any, index: number) => {
                    const originalData = priceChangeData[index];
                    if (!originalData) return null;

                    const coinSymbol = originalData.coin;
                    const changeValue = originalData.change;
                    const isPositive = changeValue >= 0;

                    const textX = isPositive 
                      ? bar.x + bar.width + (isMobile ? 8 : 16)
                      : bar.x - (isMobile ? 8 : 16);
                    
                    const textAnchor = isPositive ? 'start' : 'end';
                    const y = bar.y + bar.height / 2;

                    const formattedChange = `${isPositive ? '+' : ''}${changeValue.toFixed(isMobile ? 1 : 2)}%`;
                    const fullLabel = `${coinSymbol} ${formattedChange}`;

                    return (
                      <text
                        key={`label-${coinSymbol}-${index}`}
                        x={textX}
                        y={y}
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                        fill={isPositive ? '#10b981' : '#ef4444'}
                        style={{
                          fontSize: isMobile ? '9px' : '11px',
                          fontWeight: 600,
                          pointerEvents: 'none',
                        }}
                      >
                        {fullLabel}
                      </text>
                    );
                  })}
                </g>
              );
            }
          ]}
          tooltip={({ data }) => {
            const coinData = data as PriceChangeData;
            return (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[180px] sm:min-w-[240px]">
                <div className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{coinData.coin}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{coinData.name}</div>
                <div className={`text-lg sm:text-xl font-bold ${coinData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {coinData.change >= 0 ? '+' : ''}{coinData.change.toFixed(4)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 sm:space-y-2">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">${coinData.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">${coinData.marketCap}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">#{coinData.rank}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
      
      {/* Quick Stats Bar */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {priceChangeData.slice(0, 5).map((coin) => (
          <div key={coin.coin} className={`p-2 sm:p-3 rounded-lg border ${coin.change >= 0 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'}`}>
            <div className="font-bold text-xs sm:text-sm truncate text-gray-800 dark:text-gray-100">{coin.coin}</div>
            <div className={`text-xs sm:text-sm font-bold mt-1 ${coin.change >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'}`}>
              {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(isMobile ? 1 : 2)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
              ${coin.price.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-2">
        Top 10 cryptocurrencies by 24h price movement (excluding stablecoins)
      </div>
    </div>
  );
}