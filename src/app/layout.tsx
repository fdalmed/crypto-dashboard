import type { Metadata } from "next";
import "@/index.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Crypto Market Dashboard",
    template: "%s | Crypto Market Dashboard",
  },
  description: "A global USD crypto market overview with live market data.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Crypto Market Dashboard",
    title: "Crypto Market Dashboard",
    description: "A global USD crypto market overview with live market data.",
  },
  twitter: {
    card: "summary",
    title: "Crypto Market Dashboard",
    description: "A global USD crypto market overview with live market data.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]">Skip to content</a>
        <Header />
        <main id="main-content" className="container mx-auto min-h-screen px-4 md:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
