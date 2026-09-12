"use client";

import { useMemo, useState } from "react";

import { calculateMarketCapFromPrice, calculatePriceFromMarketCap } from "@/lib/calculators/market-cap";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";

import { NumberInput } from "./NumberInput";
import { parseNumericInput } from "./input-utils";
import { ResultMetric } from "./ResultMetric";
import { ToolDisclaimer } from "./ToolDisclaimer";

type CalculatorMode = "market-cap" | "price";

export function MarketCapCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("market-cap");
  const [supply, setSupply] = useState("21000000");
  const [targetPrice, setTargetPrice] = useState("100000");
  const [targetMarketCap, setTargetMarketCap] = useState("2100000000000");

  const calculation = useMemo(() => {
    const parsedSupply = parseNumericInput(supply);
    const targetValue = parseNumericInput(mode === "market-cap" ? targetPrice : targetMarketCap);

    if (parsedSupply === null || targetValue === null) {
      return { value: null, error: "Enter a finite value in every field." };
    }

    try {
      return {
        value:
          mode === "market-cap"
            ? calculateMarketCapFromPrice(parsedSupply, targetValue)
            : calculatePriceFromMarketCap(targetValue, parsedSupply),
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : "Unable to calculate this estimate.",
      };
    }
  }, [mode, supply, targetMarketCap, targetPrice]);

  const marketCapMode = mode === "market-cap";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Scenario inputs</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Explore the relationship between circulating supply, price, and market capitalization.
          </p>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Calculation mode">
          <button type="button" onClick={() => setMode("market-cap")} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${marketCapMode ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
            Price to market cap
          </button>
          <button type="button" onClick={() => setMode("price")} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${!marketCapMode ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
            Market cap to price
          </button>
        </div>
        <div className="grid gap-4">
          <NumberInput label="Circulating supply" value={supply} onChange={setSupply} hint="Number of coins in circulation." />
          {marketCapMode ? (
            <NumberInput label="Target price per coin" value={targetPrice} onChange={setTargetPrice} prefix="$" />
          ) : (
            <NumberInput label="Target market cap" value={targetMarketCap} onChange={setTargetMarketCap} prefix="$" />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Estimated result</h2>
        {calculation.error ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">{calculation.error}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultMetric label="Circulating supply" value={calculation.value !== null ? Number(supply).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"} />
          <ResultMetric
            label={marketCapMode ? "Estimated market cap" : "Estimated price per coin"}
            value={calculation.value !== null ? (marketCapMode ? formatCompactCurrency(calculation.value) : formatCurrency(calculation.value)) : "--"}
          />
          <ResultMetric
            label={marketCapMode ? "Full market-cap figure" : "Target market cap"}
            value={calculation.value !== null ? (marketCapMode ? formatCurrency(calculation.value) : formatCompactCurrency(Number(targetMarketCap))) : "--"}
          />
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
          This uses the simple formula <span className="font-medium text-slate-800 dark:text-slate-200">market cap = price x circulating supply</span>. It does not account for dilution, liquidity, or market conditions.
        </p>
        <ToolDisclaimer className="mt-5" />
      </section>
    </div>
  );
}
