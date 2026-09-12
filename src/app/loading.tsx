export default function Loading() {
  return (
    <div className="space-y-6 py-6" aria-label="Loading market data">
      <div className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />)}
      </div>
      <div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
