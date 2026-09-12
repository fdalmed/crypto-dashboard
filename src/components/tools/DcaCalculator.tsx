"use client";

import { useMemo, useState } from "react";

import { calculateDca } from "@/lib/calculators/dca";
import { formatCurrency, formatPercent } from "@/lib/formatters";

import { NumberInput } from "./NumberInput";
import { parseNumericInput } from "./input-utils";
import { ResultMetric } from "./ResultMetric";
import { ToolDisclaimer } from "./ToolDisclaimer";

export function DcaCalculator() {
  const [contribution, setContribution] = useState("100");
  const [periods, setPeriods] = useState("12");
  const [averagePurchasePrice, setAveragePurchasePrice] = useState("50000");
  const [currentPrice, setCurrentPrice] = useState("60000");

  const calculation = useMemo(() => {
    const values = [contribution, periods, averagePurchasePrice, currentPrice].map(parseNumericInput);

    if (values.some((value) => value === null)) {
      return { result: null, error: "Enter a finite value in every field." };
    }

    try {
      return {
        result: calculateDca({
          contribution: values[0]!,
          periods: values[1]!,
          averagePurchasePrice: values[2]!,
          currentPrice: values[3]!,
        }),
        error: null,
      };
    } catch (error) {
      return {
        result: null,
        error: error instanceof Error ? error.message : "Unable to calculate this estimate.",
      };
    }
  }, [averagePurchasePrice, contribution, currentPrice, periods]);

  const result = calculation.result;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Contribution plan</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Model recurring purchases with your own average purchase price.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Contribution per period" value={contribution} onChange={setContribution} prefix="$" />
          <NumberInput label="Number of periods" value={periods} onChange={setPeriods} step="1" hint="Use a whole number." />
          <NumberInput label="Average purchase price" value={averagePurchasePrice} onChange={setAveragePurchasePrice} prefix="$" />
          <NumberInput label="Current price" value={currentPrice} onChange={setCurrentPrice} prefix="$" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Estimated position</h2>
        {calculation.error ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-400" role="alert">{calculation.error}</p> : null}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultMetric label="Total invested" value={result ? formatCurrency(result.totalInvested) : "--"} />
          <ResultMetric label="Coins accumulated" value={result ? result.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "--"} />
          <ResultMetric label="Average purchase price" value={result ? formatCurrency(Number(averagePurchasePrice)) : "--"} />
          <ResultMetric label="Current value" value={result ? formatCurrency(result.currentValue) : "--"} />
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
