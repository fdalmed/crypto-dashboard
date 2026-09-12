import type { Metadata } from "next";
import "@/index.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Crypto Market Dashboard",
  description: "A global USD crypto market overview with live market data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main className="container mx-auto min-h-screen px-4 md:px-6">{children}</main>
      </body>
    </html>
  );
}
