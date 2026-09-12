import type { Metadata } from "next";

import { DcaCalculator } from "@/components/tools/DcaCalculator";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";

export const metadata: Metadata = {
  title: "Crypto DCA Calculator | Crypto Market Dashboard",
  description: "Model dollar-cost averaging contributions, accumulated crypto, current value, and ROI.",
};

export default function DcaCalculatorPage() {
  return (
    <div className="space-y-6">
      <ToolPageHeader
        eyebrow="Crypto tools"
        title="DCA calculator"
        description="Model a recurring contribution plan using an average purchase price and today's price."
      />
      <DcaCalculator />
    </div>
  );
}
