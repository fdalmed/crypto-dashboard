"use client";

import type { CryptoCoin } from "../types/crypto";

type Props = {
  coins: CryptoCoin[];
};

export default function BTCEthComparison({ coins }: Props) {
  const totalMarketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
  const btc = coins.find((c) => c.symbol.toLowerCase() === "btc");
  const eth = coins.find((c) => c.symbol.toLowerCase() === "eth");

  if (!btc && !eth) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {btc && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-xl">
              {/* Bitcoin SVG Icon */}
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9 8h4.5c.83 0 1.5.67 1.5 1.5S14.33 11 13.5 11H9v2h3.5c.83 0 1.5.67 1.5 1.5S13.33 16 12.5 16H9v2.5H7V8h2zm7 9c-1.93 0-3.5-1.57-3.5-3.5S14.07 10 16 10s3.5 1.57 3.5 3.5S17.93 17 16 17z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Bitcoin (BTC)</h3>
              <div className="text-3xl font-bold mt-1">
                ${(btc.current_price || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">24h Change</div>
              <div className={`text-lg font-semibold ${
                (btc.price_change_percentage_24h || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(btc.price_change_percentage_24h || 0).toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Market Cap</div>
              <div className="text-lg font-semibold">
                ${Math.round((btc.market_cap || 0) / 1000000000)}B
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Dominance</div>
              <div className="text-lg font-semibold">
                {totalMarketCap > 0 ? ((btc.market_cap || 0) / totalMarketCap * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Rank</div>
              <div className="text-lg font-semibold">#{btc.market_cap_rank || 1}</div>
            </div>
          </div>
        </div>
      )}
      
      {eth && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-800/20 rounded-xl">
              {/* Ethereum SVG Icon */}
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 12l8 10 8-10L12 2zm0 4.5l4.5 5.5H12V6.5zm0 7.5h4.5L12 20l-4.5-6H12z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ethereum (ETH)</h3>
              <div className="text-3xl font-bold mt-1">
                ${(eth.current_price || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">24h Change</div>
              <div className={`text-lg font-semibold ${
                (eth.price_change_percentage_24h || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(eth.price_change_percentage_24h || 0).toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Market Cap</div>
              <div className="text-lg font-semibold">
                ${Math.round((eth.market_cap || 0) / 1000000000)}B
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">vs BTC</div>
              <div className="text-lg font-semibold">
                {btc && btc.market_cap 
                  ? `${((eth.market_cap || 0) / (btc.market_cap) * 100).toFixed(1)}%` 
                  : 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">Rank</div>
              <div className="text-lg font-semibold">#{eth.market_cap_rank || 2}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}