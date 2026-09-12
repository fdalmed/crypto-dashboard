"use client";

import { useMemo, useState } from "react";

import { calculateProfit } from "@/lib/calculators/profit";
import { formatCurrency, formatPercent } from "@/lib/formatters";

import { NumberInput } from "./NumberInput";
import { parseNumericInput } from "./input-utils";
import { ResultMetric } from "./ResultMetric";
import { ToolDisclaimer } from "./ToolDisclaimer";

export function ProfitCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState("1000");
  const [buyPrice, setBuyPrice] = useState("50000");
  const [sellPrice, setSellPrice] = useState("60000");
  const [flatFees, setFlatFees] = useState("0");

  const calculation = useMemo(() => {
    const values = [investmentAmount, buyPrice, sellPrice, flatFees].map(parseNumericInput);

    if (values.some((value) => value === null)) {
      return { result: null, error: "Enter a finite value in every field." };
    }

    try {
      return {
        result: calculateProfit({
          investmentAmount: values[0]!,
          buyPrice: values[1]!,
          sellPrice: values[2]!,
          flatFees: values[3]!,
        }),
        error: null,
      };
    } catch (error) {
      return {
        result: null,
        error: error instanceof Error ? error.message : "Unable to calculate this estimate.",
      };
    }
  }, [buyPrice, flatFees, investmentAmount, sellPrice]);

  const result = calculation.result;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Trade assumptions</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Estimate an investment outcome using a single buy and sell price.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Investment amount" value={investmentAmount} onChange={setInvestmentAmount} prefix="$" />
          <NumberInput label="Buy price per coin" value={buyPrice} onChange={setBuyPrice} prefix="$" />
          <NumberInput label="Sell price per coin" value={sellPrice} onChange={setSellPrice} prefix="$" />
          <NumberInput
            label="Total flat fees"
            value={flatFees}
            onChange={setFlatFees}
            prefix="$"
            hint="Deducted once from the gross final value."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Estimated outcome</h2>
        {calculation.error ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">{calculation.error}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultMetric label="Coins acquired" value={result ? result.quantity.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "--"} />
          <ResultMetric label="Initial investment" value={result ? formatCurrency(result.initialInvestment) : "--"} />
          <ResultMetric label="Gross final value" value={result ? formatCurrency(result.grossFinalValue) : "--"} />
          <ResultMetric label="Fees" value={result ? formatCurrency(result.totalFees) : "--"} />
          <ResultMetric label="Final value" value={result ? formatCurrency(result.finalValue) : "--"} />
          <ResultMetric
            label="Profit / loss"
            value={result ? formatCurrency(result.profitOrLoss) : "--"}
            tone={result && result.profitOrLoss !== 0 ? (result.profitOrLoss > 0 ? "positive" : "negative") : undefined}
          />
          <ResultMetric
            label="ROI"
            value={result ? formatPercent(result.roiPercentage) : "--"}
            tone={result && result.roiPercentage !== 0 ? (result.roiPercentage > 0 ? "positive" : "negative") : undefined}
          />
        </div>
        <ToolDisclaimer className="mt-5" />
      </section>
    </div>
  );
}
