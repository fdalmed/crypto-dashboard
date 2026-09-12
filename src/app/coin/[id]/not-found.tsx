import Link from "next/link";

export default function CoinNotFound() {
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-bold">Cryptocurrency not found</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">This asset is unavailable or the market identifier is invalid.</p>
      <Link href="/markets" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Browse markets
      </Link>
    </section>
  );
}
