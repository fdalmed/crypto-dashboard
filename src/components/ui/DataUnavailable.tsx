"use client";

import { useRouter } from "next/navigation";

export default function DataUnavailable() {
  const router = useRouter();

  return (
    <section className="mx-auto mt-10 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/30">
      <h1 className="text-lg font-semibold">Market data is temporarily unavailable</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Please try again in a moment. No market data is shown until a provider response is available.
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Retry
      </button>
    </section>
  );
}
