import type { Metadata } from "next";

import PublicPage from "@/components/layout/PublicPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for the current Crypto Market Dashboard website implementation.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <PublicPage eyebrow="Privacy" title="Privacy Policy" introduction="This policy describes the current website implementation and should be reviewed before a production launch." sections={[
    { title: "Information we do not collect", paragraphs: ["The current site does not provide accounts, saved portfolios, payments, newsletters, or a database of user profiles."] },
    { title: "Local preferences", paragraphs: ["The website may store a theme preference in your browser so the interface can remember your light or dark mode selection. This preference remains on your device unless you clear browser storage."] },
    { title: "External services", paragraphs: ["Market information is requested from external market-data providers. Those services may process technical request information under their own policies. Hosting and delivery providers may be added later and this policy will be updated if the implementation changes."] },
    { title: "Updates", paragraphs: ["This draft policy may change as the website adds features or selects production infrastructure. Review it before relying on a future production version."] },
  ]} notice="Draft for review before production launch; it is not a substitute for jurisdiction-specific legal advice." />;
}
