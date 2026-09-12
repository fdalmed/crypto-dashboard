import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information and future support details for Crypto Market Dashboard.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <PublicPage eyebrow="Contact" title="Contact" introduction="Public contact details will be added before the production launch." sections={[
    { title: "Support and feedback", paragraphs: ["A public support channel is not configured in this version of the site. Please check this page again after launch for the appropriate contact method."] },
    { title: "Market-data questions", paragraphs: ["This platform displays information from external market-data providers. For time-sensitive or transaction-related questions, verify information directly with the relevant service or source."] },
  ]} />;
}
