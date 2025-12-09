"use client";

import type { CryptoCoin } from "../types/crypto";
import { Sparklines, SparklinesLine } from "react-sparklines";

type Props = {
  coin: CryptoCoin;
  selected?: boolean;
  onClick?: () => void;
};

export default function CoinCard({ coin, selected, onClick }: Props) {
  const change = coin.price_change_percentage_24h ?? 0;
  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div
      onClick={onClick}
      className={`
        flex-shrink-0 w-44 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg
        cursor-pointer transition-transform hover:scale-105
        ${selected ? "ring-2 ring-blue-400" : ""}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <img src={coin.image} alt={coin.symbol} className="w-8 h-8" />
        <div>
          <p className="font-semibold">{coin.name}</p>
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400">{coin.symbol}</p>
        </div>
      </div>

      <div className="text-sm mb-2">
        <p>Price: ${coin.current_price.toLocaleString()}</p>
        <p className={changeColor}>{change.toFixed(2)}%</p>
      </div>

      <div className="h-12">
        {coin.sparkline_in_7d?.price ? (
          <Sparklines data={coin.sparkline_in_7d.price} width={160} height={40}>
            <SparklinesLine color={change >= 0 ? "#16a34a" : "#dc2626"} style={{ strokeWidth: 2, fill: "transparent" }} />
          </Sparklines>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-xs">No data</p>
        )}
      </div>
    </div>
  );
}
