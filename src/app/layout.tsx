import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/index.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ThemeScript from "@/components/layout/ThemeScript";
import { siteUrl } from "@/lib/site-url";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "AssetZeno",
  title: {
    default: "AssetZeno - Crypto Markets, Tools & Insights",
    template: "%s | AssetZeno",
  },
  description: "Explore cryptocurrency markets, coin data, comparisons, converters, and educational calculators with AssetZeno.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AssetZeno",
    title: "AssetZeno - Crypto Markets, Tools & Insights",
    description: "Explore cryptocurrency markets, coin data, comparisons, converters, and educational calculators with AssetZeno.",
  },
  twitter: {
    card: "summary",
    title: "AssetZeno - Crypto Markets, Tools & Insights",
    description: "Explore cryptocurrency markets, coin data, comparisons, converters, and educational calculators with AssetZeno.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <a href="#main-content" className="sr-only rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]">Skip to content</a>
        <Header />
        <main id="main-content" className="container mx-auto min-h-screen px-4 md:px-6">{children}</main>
        <Footer />
      </body>
      {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </html>
  );
}
