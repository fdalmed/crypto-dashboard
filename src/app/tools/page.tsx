import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import ToolPageHeader from "@/components/tools/ToolPageHeader";

export const metadata: Metadata = {
  title: "Crypto Tools & Calculators",
  description: "Useful cryptocurrency conversion, profit, DCA, and market cap calculators.",
  alternates: { canonical: "/tools" },
};

const tools = [
  { title: "Crypto Converter", description: "Convert a selected cryptocurrency amount using recent market prices and a supported fiat currency.", href: "/tools/converter" },
  { title: "Crypto Profit / ROI Calculator", description: "Estimate a trade outcome from investment amount, buy price, sell price, and flat fees.", href: "/tools/profit-calculator" },
  { title: "DCA Calculator", description: "Model recurring contributions using a manual average purchase price and current price assumption.", href: "/tools/dca-calculator" },
  { title: "Market Cap Calculator", description: "Calculate implied market cap from supply and price, or implied price from market cap and supply.", href: "/tools/market-cap-calculator" },
];

export default function ToolsPage() {
  return (
    <>
      <ToolPageHeader title="Crypto tools and calculators" description="Simple market tools for understanding prices, returns, recurring contributions, and token valuation assumptions." />
      <section className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => <ToolCard key={tool.href} {...tool} />)}
      </section>
    </>
  );
}
