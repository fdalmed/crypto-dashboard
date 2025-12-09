"use client";

import type { CryptoCoin } from "../types/crypto";

type Props = {
  coins: CryptoCoin[];
};

export default function HeroStats({ coins }: Props) {
  const totalMarketCap = coins.reduce((sum, c) => sum + (c.market_cap ?? 0), 0);
  const topGainer = coins.reduce((prev, c) =>
    (c.price_change_percentage_24h ?? 0) > (prev.price_change_percentage_24h ?? 0) ? c : prev
  );
  const topLoser = coins.reduce((prev, c) =>
    (c.price_change_percentage_24h ?? 0) < (prev.price_change_percentage_24h ?? 0) ? c : prev
  );
  const btc = coins.find((c) => c.symbol.toLowerCase() === "btc");
  const btcDominance = btc ? ((btc.market_cap ?? 0) / totalMarketCap) * 100 : 0;

  const stats = [
    { title: "Total Market Cap", value: `$${totalMarketCap.toLocaleString()}` },
    { title: "Top Gainer", value: `${topGainer.name} +${topGainer.price_change_percentage_24h?.toFixed(2)}%` },
    { title: "Top Loser", value: `${topLoser.name} ${topLoser.price_change_percentage_24h?.toFixed(2)}%` },
    { title: "BTC Dominance", value: `${btcDominance.toFixed(2)}%` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.title}
          className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-center items-center"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">{s.title}</p>
          <p className="text-lg font-semibold mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
