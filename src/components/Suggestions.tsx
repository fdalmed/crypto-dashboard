"use client";

import type { CryptoCoin } from "../types/crypto";

type Props = {
  coins: CryptoCoin[];
};

type Suggestion = {
  coin: string;
  symbol: string;
  image: string;
  recommendation: string;
  explanation: string;
};

// Simple AI-like suggestion logic
function generateSuggestions(coins: CryptoCoin[]): Suggestion[] {
  const topCoins = coins.slice(0, 10); // max 10 coins

  return topCoins.map((coin) => {
    const change = coin.price_change_percentage_24h ?? 0;
    const marketCap = coin.market_cap ?? 0;

    let recommendation = "Hold";
    let explanation = "No significant change detected.";

    if (change > 3 && marketCap > 1_000_000_000) {
      recommendation = "Buy";
      explanation = `Strong momentum with +${change.toFixed(
        2
      )}% increase and high market cap.`;
    } else if (change < -3) {
      recommendation = "Sell";
      explanation = `High volatility with -${change.toFixed(
        2
      )}% drop. Consider risk management.`;
    } else if (change > 0) {
      recommendation = "Accumulate";
      explanation = `Slight positive growth (+${change.toFixed(
        2
      )}%). Good time to gradually buy.`;
    }

    return {
      coin: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,
      recommendation,
      explanation,
    };
  });
}

export default function Suggestions({ coins }: Props) {
  if (!coins.length)
    return (
      <p className="text-center text-gray-500 mt-10">No data available.</p>
    );

  const suggestions = generateSuggestions(coins);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-2">🤖 AI Suggestions</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Based on recent price changes, market cap, and trends, here are some
        AI-driven recommendations:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((sug) => (
          <div
            key={sug.coin}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex items-start gap-4"
          >
            <img
              src={sug.image}
              alt={sug.coin}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {sug.coin} <span className="text-sm text-gray-400">({sug.symbol})</span>
              </h3>

              <p className="mt-2">
                <span className="font-bold">Recommendation: </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${
                    sug.recommendation === "Buy"
                      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                      : sug.recommendation === "Sell"
                      ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                  }`}
                >
                  {sug.recommendation}
                </span>
              </p>

              <p className="mt-1 text-gray-600 dark:text-gray-300">{sug.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
