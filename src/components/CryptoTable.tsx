import type { CryptoCoin } from "../types/crypto";
import { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Tooltip from "./Tooltip";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  coins: CryptoCoin[];
  loading: boolean;
};

// ------------------------------
// AI decision
// ------------------------------
function getAISuggestion(change24h: number | undefined) {
  if (change24h === undefined) {
    return { text: "—", color: "bg-gray-400 text-black" };
  }
  if (change24h > 2) return { text: "Buy", color: "bg-green-600 text-white" };
  if (change24h < -2) return { text: "Sell", color: "bg-red-600 text-white" };
  return { text: "Hold", color: "bg-yellow-500 text-black" };
}

export default function CryptoTable({ coins, loading }: Props) {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter coins by search
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCoin = coins.find((c) => c.id === selectedCoinId);

  const handleRowClick = (coinId: string) => {
    setSelectedCoinId(coinId);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCoinId(null);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* SEARCH BAR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search coin name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg shadow-sm bg-white dark:bg-gray-800
                    dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none
                    text-base"
        />
      </div>

      {/* TOTAL COINS - Below search bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-700 dark:text-gray-300">
            <span className="text-lg font-semibold">
              {filteredCoins.length} {filteredCoins.length === 1 ? 'coin' : 'coins'} found
            </span>
            {search && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                for "<span className="font-medium">{search}</span>"
              </span>
            )}
          </div>
          
        {/* Stats summary - Responsive design */}
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          {/* Mobile: Just icons and numbers */}
          <div className="sm:hidden flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                {filteredCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">
                {filteredCoins.filter(c => (c.price_change_percentage_24h || 0) < 0).length}
              </span>
            </div>
          </div>
          {/* Desktop: Full text */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Gainers</span>
            <span className="font-semibold">
              {filteredCoins.filter(c => (c.price_change_percentage_24h || 0) > 0).length}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Decliners</span>
            <span className="font-semibold">
              {filteredCoins.filter(c => (c.price_change_percentage_24h || 0) < 0).length}
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* MODAL FOR SELECTED COIN DETAILS */}
      {/* -------------------------------- */}
      {isModalOpen && selectedCoin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={selectedCoin.image} 
                  alt={selectedCoin.symbol} 
                  className="w-10 h-10"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedCoin.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 dark:text-gray-400 uppercase">
                      {selectedCoin.symbol}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      (selectedCoin.price_change_percentage_24h || 0) >= 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {selectedCoin.price_change_percentage_24h?.toFixed(2) ?? '—'}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Price */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${selectedCoin.current_price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Market Cap</div>
                  <div className="font-semibold">
                    ${selectedCoin.market_cap?.toLocaleString() ?? "—"}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                  <div className="font-semibold">
                    ${selectedCoin.total_volume?.toLocaleString() ?? "—"}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h High</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    ${selectedCoin.high_24h?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) ?? "—"}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h Low</div>
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    ${selectedCoin.low_24h?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) ?? "—"}
                  </div>
                </div>
              </div>

              {/* Rank and additional info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Market Rank</div>
                    <div className="text-lg font-bold">#{selectedCoin.market_cap_rank ?? "—"}</div>
                  </div>
                  {selectedCoin.sparkline_in_7d?.price && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">7d Trend</div>
                      <Sparklines
                        data={selectedCoin.sparkline_in_7d.price}
                        width={80}
                        height={30}
                      >
                        <SparklinesLine
                          color={
                            selectedCoin.sparkline_in_7d.price[0] <=
                            selectedCoin.sparkline_in_7d.price[selectedCoin.sparkline_in_7d.price.length - 1]
                              ? "#10b981"
                              : "#ef4444"
                          }
                          style={{ strokeWidth: 2, fill: "transparent" }}
                        />
                      </Sparklines>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // You could add more actions here, like "View More Details"
                    window.open(`https://coinmarketcap.com/currencies/${selectedCoin.id}`, '_blank');
                  }}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* MAIN TABLE */}
      {/* -------------------------------- */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-sky-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-center text-sm font-semibold">Symbol</th>
              <th className="p-3 text-right text-sm font-semibold">Price</th>
              <th className="p-3 text-right text-sm font-semibold">24h %</th>
              <th className="p-3 text-right text-sm font-semibold">AI Suggestion</th>
              <th className="p-3 text-right text-sm font-semibold">7d Trend</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCoins.map((coin) => {
              const isSelected = selectedCoinId === coin.id;
              const suggestion = getAISuggestion(coin.price_change_percentage_24h);

              return (
                <tr
                  key={coin.id}
                  onClick={() => handleRowClick(coin.id)}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >

                  {/* NAME */}
                  <td className="p-3 flex items-center gap-2">
                    <img src={coin.image} alt={coin.symbol} className="w-6 h-6" />
                    <span className="font-medium">
                      {coin.name}
                    </span>
                  </td>

                  {/* SYMBOL */}
                  <td className="p-3 text-center uppercase font-mono text-sm">
                    {coin.symbol}
                  </td>

                  {/* PRICE */}
                  <td className="p-3 text-right font-medium">
                    <Tooltip text="Current Market Price (USD)">
                      <span>${coin.current_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}</span>
                    </Tooltip>
                  </td>

                  {/* 24h CHANGE */}
                  <td
                    className={`p-3 text-right font-medium ${
                      (coin.price_change_percentage_24h ?? 0) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <Tooltip text="Price Change in the Last 24 Hours">
                      {coin.price_change_percentage_24h?.toFixed(2) ?? "—"}%
                    </Tooltip>
                  </td>

                  {/* AI SUGGESTION */}
                  <td className="p-3 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${suggestion.color}`}
                    >
                      {suggestion.text}
                    </span>
                  </td>

                  {/* SPARKLINE */}
                  <td className="p-3 text-right">
                    {coin.sparkline_in_7d?.price ? (
                      <Sparklines
                        data={coin.sparkline_in_7d.price}
                        width={100}
                        height={30}
                      >
                        <SparklinesLine
                          color={
                            coin.sparkline_in_7d.price[0] <=
                            coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1]
                              ? "#10b981"
                              : "#ef4444"
                          }
                          style={{ strokeWidth: 2, fill: "transparent" }}
                        />
                      </Sparklines>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredCoins.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                      No coins found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Try a different search term
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}