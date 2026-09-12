"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tools", label: "All tools" },
  { href: "/tools/converter", label: "Converter" },
  { href: "/tools/profit-calculator", label: "Profit" },
  { href: "/tools/dca-calculator", label: "DCA" },
  { href: "/tools/market-cap-calculator", label: "Market cap" },
];

export default function ToolsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Crypto tools" className="mb-6 overflow-x-auto">
      <div className="flex min-w-max gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
        {links.map((link) => {
          const active = pathname === link.href;
          return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>{link.label}</Link>;
        })}
      </div>
    </nav>
  );
}
