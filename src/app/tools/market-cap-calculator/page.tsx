import type { Metadata } from "next";

import { MarketCapCalculator } from "@/components/tools/MarketCapCalculator";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";

export const metadata: Metadata = {
  title: "Crypto Market Cap Calculator | Crypto Market Dashboard",
  description: "Calculate an estimated crypto market cap from price and supply, or estimate price from a target market cap.",
};

export default function MarketCapCalculatorPage() {
  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="Crypto tools"
        title="Market cap calculator"
        description="Translate a target price into a market-cap estimate, or work backward from a target market cap."
      />
      <MarketCapCalculator />
    </div>
  );
}
