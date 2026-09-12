import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the informational cryptocurrency market data, comparison tools, and calculators available on Crypto Market Dashboard.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <PublicPage eyebrow="About" title="About Crypto Market Dashboard" introduction="Crypto Market Dashboard is an informational website for exploring cryptocurrency market data and practical research tools." sections={[
    { title: "What the platform provides", paragraphs: ["The platform presents current market listings, coin statistics, historical price views, side-by-side asset comparisons, currency conversion, and simple calculators for educational use."] },
    { title: "How to use it", paragraphs: ["Use the data and tools as a starting point for independent research. Market information may be delayed, incomplete, or unavailable, so important details should be verified from additional sources."] },
    { title: "What it is not", paragraphs: ["This website is not an exchange, broker, investment adviser, portfolio manager, or trading service. It does not provide personalized recommendations or manage user assets."] },
  ]} />;
}
