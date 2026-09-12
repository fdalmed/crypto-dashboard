import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Draft terms of use for the informational Crypto Market Dashboard website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PublicPage eyebrow="Terms" title="Terms of Use" introduction="These draft terms describe the informational use of this website and should be reviewed before production launch." sections={[
    { title: "Informational use", paragraphs: ["The site provides general market information and calculators for informational and educational purposes. Nothing on the site is financial, investment, legal, tax, or other professional advice."] },
    { title: "Data and availability", paragraphs: ["Market data can be delayed, inaccurate, incomplete, or unavailable. The site may change, pause, or become unavailable without notice. You are responsible for independently verifying information before making decisions."] },
    { title: "Acceptable use", paragraphs: ["Do not misuse the site, interfere with its operation, or use its content in a way that violates applicable law or the rights of others. Site content, design, and code remain subject to applicable intellectual-property rights."] },
    { title: "Limitations", paragraphs: ["To the extent allowed by applicable law, use of the site is at your own discretion and risk. These draft terms do not attempt to replace legal review or create guarantees beyond the current implementation."] },
  ]} notice="Draft for review before production launch; seek appropriate legal review for the intended jurisdiction." />;
}
