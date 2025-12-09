"use client";

import type { CryptoCoin } from "../types/crypto";
import { ResponsiveLine } from "@nivo/line";
import { useMemo, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type SparklineTile = {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  marketCapRank: number;
  sparklineData: { x: number; y: number }[];
};

type Stats = {
  topGainer?: SparklineTile;
  topLoser?: SparklineTile;
  avgChange: number;
  mostVolatile?: SparklineTile;
  positiveCount: number;
  negativeCount: number;
};

type Props = {
  coins: CryptoCoin[];
};

type HoverData = {
  tile: SparklineTile;
  index: number;
  price: number;
  clientX: number;
  clientY: number;
} | null;

export default function SparklineTiles({ coins }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hoverData, setHoverData] = useState<HoverData>(null);

  const { sparklineTiles, stats } = useMemo(() => {
    const filteredCoins = coins
      .filter(coin => coin.price_change_percentage_24h !== undefined)
      .sort((a, b) => Math.abs(b.price_change_percentage_24h || 0) - Math.abs(a.price_change_percentage_24h || 0))
      .slice(0, 12);

    const tiles = filteredCoins.map((coin): SparklineTile => {
      const changePercent = coin.price_change_percentage_24h || 0;
      const high = coin.high_24h || coin.current_price;
      const low = coin.low_24h || coin.current_price;
      
      return {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        currentPrice: coin.current_price,
        changePercent,
        high24h: high,
        low24h: low,
        marketCapRank: coin.market_cap_rank || 0,
        sparklineData: generateSparklineData(changePercent)
      };
    });

    const stats: Stats = {
      topGainer: tiles[0],
      topLoser: tiles.find(t => t.changePercent < 0),
      avgChange: tiles.length ? tiles.reduce((sum, t) => sum + t.changePercent, 0) / tiles.length : 0,
      mostVolatile: [...tiles].sort((a, b) => Math.abs(b.high24h - b.low24h) - Math.abs(a.high24h - a.low24h))[0],
      positiveCount: tiles.filter(t => t.changePercent >= 0).length,
      negativeCount: tiles.filter(t => t.changePercent < 0).length
    };

    return { sparklineTiles: tiles, stats };
  }, [coins]);

  const getSlidesPerView = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const slidesPerView = getSlidesPerView();
  const maxSlide = Math.max(0, sparklineTiles.length - slidesPerView);

  const nextSlide = useCallback(() => {
    if (!autoScroll) return;
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  }, [autoScroll, maxSlide]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? maxSlide : prev - 1));
  };

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [autoScroll, nextSlide]);

    // Hide tooltip immediately on mobile scroll (touchmove) and desktop scroll
    useEffect(() => {
    if (!hoverData) return;

    const hideTooltip = () => setHoverData(null);

    // Desktop: hide on scroll or wheel
    window.addEventListener('scroll', hideTooltip, { passive: true });
    window.addEventListener('wheel', hideTooltip, { passive: true });

    // Mobile: hide as soon as user starts scrolling (touchmove)
    window.addEventListener('touchmove', hideTooltip, { passive: true });

    return () => {
        window.removeEventListener('scroll', hideTooltip);
        window.removeEventListener('wheel', hideTooltip);
        window.removeEventListener('touchmove', hideTooltip);
    };
    }, [hoverData, setHoverData]);
  const toggleAutoScroll = () => setAutoScroll(prev => !prev);

  if (sparklineTiles.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-1">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span>Price Performance Carousel</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Top coins by 24h price movement
          </p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span>Price Performance Carousel</span>
          </h3>
          
          <button
            onClick={toggleAutoScroll}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title={autoScroll ? "Auto-scroll is ON - Click to pause" : "Auto-scroll is OFF - Click to resume"}
          >
            <div className={`w-2 h-2 rounded-full ${autoScroll ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-700 dark:text-gray-300">
              {autoScroll ? 'Auto' : 'Paused'}
            </span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {typeof window !== 'undefined' && window.innerWidth < 640 
            ? "Swipe to see more coins" 
            : "Click dots below to navigate"}
        </p>
      </div>
      
      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${(currentSlide * (100 / slidesPerView))}%)` }}
          >
            {sparklineTiles.map((tile) => (
              <div 
                key={tile.id} 
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
                style={{ minWidth: `${100 / slidesPerView}%` }}
              >
                <Tile tile={tile} setHoverData={setHoverData} />
              </div>
            ))}
          </div>
        </div>

        {sparklineTiles.length > slidesPerView && (
          <div className="flex justify-center mt-6 space-x-3">
            {Array.from({ length: Math.ceil(sparklineTiles.length / slidesPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index * slidesPerView)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide >= index * slidesPerView && currentSlide < (index + 1) * slidesPerView
                    ? "bg-blue-600 dark:bg-blue-400 scale-110"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox 
            label="Top Gainer" 
            value={`${stats.topGainer?.symbol || "—"} +${(stats.topGainer?.changePercent ?? 0).toFixed(1)}%`} 
            color="green" 
          />
          <StatBox 
            label="Top Loser" 
            value={`${stats.topLoser?.symbol || "—"} ${(stats.topLoser?.changePercent ?? 0).toFixed(1)}%`} 
            color="red" 
          />
          <StatBox 
            label="Avg Change" 
            value={`${stats.avgChange.toFixed(1)}%`} 
            color={stats.avgChange >= 0 ? "green" : "red"} 
          />
          <StatBox 
            label="Most Volatile" 
            value={stats.mostVolatile?.symbol || "—"} 
            color="purple" 
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {sparklineTiles.length} coins • 
            <span className="ml-1 text-green-600 dark:text-green-400">
              {stats.positiveCount} positive
            </span>
            <span className="mx-1">•</span>
            <span className="text-red-600 dark:text-red-400">
              {stats.negativeCount} negative
            </span>
          </p>
        </div>
      </div>

      {/* PORTAL: Tooltip rendered in body */}
      {hoverData &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[100] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs min-w-[140px] pointer-events-none"
            style={{
              left: Math.max(10, Math.min(hoverData.clientX, window.innerWidth - 150)) + "px",
              top: Math.max(10, Math.min(hoverData.clientY - 80, window.innerHeight - 100)) + "px",
            }}
          >
            <div className="font-bold mb-1">{hoverData.tile.symbol}</div>
            <div className="text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-semibold ml-2">${hoverData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Point:</span>
                <span>{hoverData.index + 1}/12</span>
              </div>
            </div>
            <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-500">
              Hover over chart
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function Tile({ 
  tile, 
  setHoverData 
}: { 
  tile: SparklineTile; 
  setHoverData: (data: HoverData) => void; 
}) {
  const rangePosition = Math.min(
    100,
    ((tile.currentPrice - tile.low24h) / (tile.high24h - tile.low24h)) * 100
  );

  const formatPrice = (price: number) => {
    if (price > 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(2)}`;
  };

  const handleChartMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const pointIndex = Math.floor((x / width) * 12);
    const index = Math.max(0, Math.min(11, pointIndex));
    
    const dataPoint = tile.sparklineData[index];
    if (dataPoint) {
      setHoverData({
        tile,
        index,
        price: dataPoint.y,
        clientX: e.clientX,
        clientY: e.clientY
      });
    }
  };

  const handleChartMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors h-full relative">
      {/* Tile Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
              {tile.symbol}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
              #{tile.marketCapRank}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {tile.name}
          </p>
        </div>
        <div className="text-right min-w-0 flex-shrink-0 ml-2">
          <div className={`text-xs font-bold whitespace-nowrap ${
            tile.changePercent >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            {tile.changePercent >= 0 ? "+" : ""}{tile.changePercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatPrice(tile.currentPrice)}
          </div>
        </div>
      </div>

      {/* Sparkline Chart Container */}
      <div 
        className="h-16 mb-3 relative cursor-crosshair"
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        <ResponsiveLine
          data={[{ id: tile.symbol, data: tile.sparklineData }]}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
          xScale={{ type: "linear", min: 0, max: 11 }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          curve="monotoneX"
          enableArea
          areaOpacity={0.15}
          enableGridX={false}
          enableGridY={ false }
          enablePoints={false}
          colors={tile.changePercent >= 0 ? "#10b981" : "#ef4444"}
          lineWidth={1}
          isInteractive={false}
          animate={false}
        />
      </div>

      {/* Range Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <span className="truncate mr-1">Low: {formatPrice(tile.low24h)}</span>
          <span className="truncate ml-1">High: {formatPrice(tile.high24h)}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative">
          <div
            className={`h-full ${
              tile.changePercent >= 0
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-red-400 to-rose-500"
            }`}
            style={{ width: `${rangePosition}%` }}
          />
          <div
            className="h-2.5 w-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full absolute top-1/2 -translate-y-1/2"
            style={{ left: `${rangePosition}%`, marginLeft: "-0.5px" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>24h Range</span>
          <span className="font-medium">
            {formatPrice(tile.high24h - tile.low24h)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { 
  label: string; 
  value: string; 
  color: "green" | "red" | "purple" 
}) {
  const colorClasses = {
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400"
  };

  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-sm font-bold whitespace-nowrap ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  );
}

function generateSparklineData(changePercent: number) {
  const data = [];
  const base = 100;
  let current = base;
  
  for (let i = 0; i < 12; i++) {
    const randomMove = (Math.random() - 0.5) * 0.8;
    const trend = (changePercent / 100) * (i / 11);
    current = current * (1 + randomMove + trend);
    data.push({
      x: i,
      y: Math.max(current, base * 0.8)
    });
  }
  
  return data;
}