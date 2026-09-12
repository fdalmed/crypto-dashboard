export default function CoinLoading() {
  return (
    <div className="space-y-6 py-6" aria-label="Loading coin market data">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-36 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />)}
      </div>
      <div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
