"use client";

import type { CryptoCoin } from "../types/crypto";

type Props = {
  coins: CryptoCoin[];
  selectedCoinId: string | null;
  onCoinSelect: (id: string | null) => void;
};

export default function TopCoinsGrid({ coins, selectedCoinId, onCoinSelect }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">🔥 Top 5 Cryptocurrencies</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {coins.map((coin) => (
          <div 
            key={coin.id}
            onClick={() => onCoinSelect(coin.id)}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow border cursor-pointer transition-all hover:shadow-md ${
              selectedCoinId === coin.id 
                ? 'border-blue-400 dark:border-blue-500' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.symbol} className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-semibold">{coin.symbol.toUpperCase()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${(coin.current_price || 0).toLocaleString()}
                </div>
              </div>
              <div className={`text-sm font-medium ${
                (coin.price_change_percentage_24h || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(coin.price_change_percentage_24h || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}