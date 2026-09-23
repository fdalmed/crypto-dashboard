import Link from "next/link";

const productLinks = [
  { href: "/markets", label: "Markets" },
  { href: "/tools", label: "Tools" },
  { href: "/compare", label: "Compare" },
];

const informationLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto grid gap-8 px-4 py-8 text-sm md:grid-cols-[1.5fr_1fr_1fr] md:px-6">
        <div>
          <p className="font-semibold">AssetZeno</p>
          <p className="mt-2 max-w-sm leading-6 text-gray-600 dark:text-gray-300">Market information, comparison tools, and educational calculators for cryptocurrency research.</p>
        </div>
        <nav aria-label="Product links">
          <p className="font-medium">Product</p>
          <ul className="mt-3 space-y-2">
            {productLinks.map((link) => <li key={link.href}><FooterLink {...link} /></li>)}
          </ul>
        </nav>
        <nav aria-label="Information links">
          <p className="font-medium">Information</p>
          <ul className="mt-3 space-y-2">
            {informationLinks.map((link) => <li key={link.href}><FooterLink {...link} /></li>)}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="rounded text-gray-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400">{label}</Link>;
}
