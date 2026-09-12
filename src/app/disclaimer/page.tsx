import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important informational and financial disclaimer for Crypto Market Dashboard market data and tools.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return <PublicPage eyebrow="Disclaimer" title="Important disclaimer" introduction="Crypto Market Dashboard provides general information and educational utilities only." sections={[
    { title: "No professional advice", paragraphs: ["Nothing on this website is financial, investment, legal, tax, accounting, or other professional advice. The website does not recommend buying, selling, or holding any asset."] },
    { title: "Market risk", paragraphs: ["Crypto assets are volatile and can lose value. Historical performance and displayed market data do not guarantee future results."] },
    { title: "Data and calculations", paragraphs: ["Market information may be delayed or inaccurate. Calculator and converter outputs are estimates based on supplied inputs and available data. Verify important information independently before acting."] },
  ]} />;
}
