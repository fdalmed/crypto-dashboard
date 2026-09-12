"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { MarketCoin } from "@/types/market";

type Props = {
  coins: MarketCoin[];
};

export default function ComparePicker({ coins }: Props) {
  const [firstId, setFirstId] = useState(coins[0]?.id ?? "");
  const [secondId, setSecondId] = useState(coins.find((coin) => coin.id !== coins[0]?.id)?.id ?? "");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (firstId && secondId && firstId !== secondId) {
      router.push(`/compare/${firstId}-vs-${secondId}`);
    }
  }

  const isInvalidPair = !firstId || !secondId || firstId === secondId;

  return (
    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold">Choose two assets</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Compare available market statistics in USD.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <CoinSelect id="first-coin" label="First asset" value={firstId} onChange={setFirstId} coins={coins} />
        <CoinSelect id="second-coin" label="Second asset" value={secondId} onChange={setSecondId} coins={coins} />
      </div>
      {isInvalidPair ? <p className="mt-3 text-sm text-red-700 dark:text-red-400" role="alert">Choose two different assets to compare.</p> : null}
      <button type="submit" disabled={isInvalidPair} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
        Compare assets
      </button>
    </form>
  );
}

function CoinSelect({ id, label, value, onChange, coins }: { id: string; label: string; value: string; onChange: (value: string) => void; coins: MarketCoin[] }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium">{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800">
        {coins.map((coin) => <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>)}
      </select>
    </label>
  );
}
