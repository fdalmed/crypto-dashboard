import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">The page you requested is unavailable or may have moved.</p>
      <nav aria-label="Helpful links" className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Home</Link>
        <Link href="/markets" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-800">Markets</Link>
        <Link href="/tools" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-800">Tools</Link>
      </nav>
    </section>
  );
}
