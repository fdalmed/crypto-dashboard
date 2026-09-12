import type { Metadata } from "next";

import { ProfitCalculator } from "@/components/tools/ProfitCalculator";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";

export const metadata: Metadata = {
  title: "Crypto Profit Calculator",
  description: "Estimate crypto trade profit, loss, fees, final value, and return on investment.",
  alternates: { canonical: "/tools/profit-calculator" },
};

export default function ProfitCalculatorPage() {
  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="Crypto tools"
        title="Crypto profit calculator"
        description="Estimate the outcome of a buy-and-sell scenario before fees using transparent, client-side math."
      />
      <ProfitCalculator />
    </div>
  );
}
