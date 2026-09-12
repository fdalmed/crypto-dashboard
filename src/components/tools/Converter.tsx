"use client";

import { useMemo, useState } from "react";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currencies";
import { convertCryptoToFiat, convertFiatToCrypto } from "@/lib/calculators/converter";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import type { CurrencyCode, FiatPerUsdRates, MarketCoin } from "@/types/market";
import NumberInput from "./NumberInput";
import ResultMetric from "./ResultMetric";
import ToolDisclaimer from "./ToolDisclaimer";

type Props = {
  coins: MarketCoin[];
  fiatRates: FiatPerUsdRates;
  loadedAt: string;
};

export default function Converter({ coins, fiatRates, loadedAt }: Props) {
  const [query, setQuery] = useState("");
  const [coinId, setCoinId] = useState(coins[0]?.id ?? "");
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [amount, setAmount] = useState("1");
  const [direction, setDirection] = useState<"cryptoToFiat" | "fiatToCrypto">("cryptoToFiat");
  const filteredCoins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return normalizedQuery ? coins.filter((coin) => coin.name.toLowerCase().includes(normalizedQuery) || coin.symbol.toLowerCase().includes(normalizedQuery)) : coins;
  }, [coins, query]);
  const coin = coins.find((item) => item.id === coinId) ?? coins[0];
  const parsedAmount = amount.trim() === "" ? null : Number(amount);
  const fiatPerUsd = fiatRates[currency];

  let result: number | null = null;
  let validationMessage: string | null = null;
  if (parsedAmount !== null) {
    try {
      result = direction === "cryptoToFiat"
        ? convertCryptoToFiat(parsedAmount, coin?.currentPrice ?? null, fiatPerUsd)
        : convertFiatToCrypto(parsedAmount, coin?.currentPrice ?? null, fiatPerUsd);
      if (result === null) validationMessage = "Current conversion data is unavailable for this selection.";
    } catch (error) {
      validationMessage = error instanceof Error ? error.message : "Enter a valid amount.";
    }
  }

  const currentFiatPrice = coin?.currentPrice !== null && coin?.currentPrice !== undefined && fiatPerUsd !== null
    ? coin.currentPrice * fiatPerUsd
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium">Find cryptocurrency</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or symbol" className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Cryptocurrency</span>
            <select value={coinId} onChange={(event) => setCoinId(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800">
              {filteredCoins.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.symbol})</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Fiat currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800">
              {Object.entries(CURRENCIES).map(([code, details]) => <option key={code} value={code}>{code} - {details.label}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2" role="group" aria-label="Conversion direction">
            <p className="text-sm font-medium">Conversion direction</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setDirection("cryptoToFiat")} className={`rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${direction === "cryptoToFiat" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}>Crypto to fiat</button>
              <button type="button" onClick={() => setDirection("fiatToCrypto")} className={`rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${direction === "fiatToCrypto" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}>Fiat to crypto</button>
            </div>
          </div>
          <div className="sm:col-span-2"><NumberInput id="converter-amount" label={direction === "cryptoToFiat" ? `${coin?.symbol ?? "Crypto"} amount` : `${currency} amount`} value={amount} onChange={setAmount} hint="Enter a non-negative amount." /></div>
        </div>
        <ToolDisclaimer />
      </section>
      <aside aria-live="polite" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold">Conversion result</h2>
        <div className="mt-4 space-y-3">
          <ResultMetric label={direction === "cryptoToFiat" ? `Value in ${currency}` : `Amount in ${coin?.symbol ?? "crypto"}`} value={result === null ? "N/A" : direction === "cryptoToFiat" ? formatCurrency(result, currency) : result.toLocaleString(undefined, { maximumFractionDigits: 8 })} />
          <ResultMetric label={`Current ${coin?.symbol ?? "crypto"} price`} value={currentFiatPrice === null ? "N/A" : formatCurrency(currentFiatPrice, currency)} />
        </div>
        {validationMessage && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">{validationMessage}</p>}
        <p className="mt-5 text-xs leading-5 text-gray-500 dark:text-gray-400">Prices use recent cached market data. Crypto prices can change continuously. Market data loaded {formatDateTime(loadedAt)} from CoinGecko.</p>
      </aside>
    </div>
  );
}
