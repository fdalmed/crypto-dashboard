"use client";

import type { CryptoCoin } from "../types/crypto";

type Props = {
  coins: CryptoCoin[];
};

export default function KPIHeader({ coins }: Props) {
  const totalMarketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
  const avg24hChange = coins.length > 0 
    ? coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length
    : 0;
  
  const gainers = coins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
  const losers = coins.filter(c => (c.price_change_percentage_24h || 0) < 0).length;
  
  const btc = coins.find((c) => c.symbol.toLowerCase() === "btc");

  const stats = [
    {
      title: "Total Market Cap",
      value: `$${Math.round(totalMarketCap / 1000000000)}B`,
      color: "blue",
      icon: "dollar",
    },
    {
      title: "24h Avg Change",
      value: `${avg24hChange.toFixed(2)}%`,
      color: avg24hChange >= 0 ? "green" : "red",
      icon: "trending",
    },
    {
      title: "Gainers / Losers",
      value: `${gainers} / ${losers}`,
      color: "purple",
      icon: "chart",
    },
    {
      title: "BTC Dominance",
      value: btc ? `${((btc.market_cap || 0) / totalMarketCap * 100).toFixed(1)}%` : 'N/A',
      color: "yellow",
      icon: "bitcoin",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-blue-500",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-l-green-500",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-l-red-500",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-l-purple-500",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-l-yellow-500",
  };

  const getIcon = (iconName: string, color: string) => {
    const iconColor = {
      blue: "text-blue-600 dark:text-blue-400",
      green: "text-green-600 dark:text-green-400", 
      red: "text-red-600 dark:text-red-400",
      purple: "text-purple-600 dark:text-purple-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
    }[color] || "text-blue-600 dark:text-blue-400";
    
    const baseClasses = `w-5 h-5 ${iconColor}`;
    
    switch (iconName) {
      case "dollar":
        return (
          <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "trending":
        return (
          <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "chart":
        return (
          <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "bitcoin":
        return (
          <svg className={baseClasses} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9 8h4.5c.83 0 1.5.67 1.5 1.5S14.33 11 13.5 11H9v2h3.5c.83 0 1.5.67 1.5 1.5S13.33 16 12.5 16H9v2.5H7V8h2zm7 9c-1.93 0-3.5-1.57-3.5-3.5S14.07 10 16 10s3.5 1.57 3.5 3.5S17.93 17 16 17z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const colorClass = colorClasses[stat.color as keyof typeof colorClasses];
        
        return (
          <div key={stat.title} className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow border-l-4 ${colorClass}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${colorClass.split(' ')[0]}`}>
                {getIcon(stat.icon, stat.color)}
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}