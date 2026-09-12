"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Overview" },
  { href: "/markets", label: "Markets" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <div className="container mx-auto flex min-h-16 flex-col justify-center gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 md:px-6">
        <Link href="/" className="rounded text-base font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-xl">
          Crypto Market Dashboard
        </Link>
        <nav aria-label="Primary navigation" className="flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:flex-nowrap sm:justify-start">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
