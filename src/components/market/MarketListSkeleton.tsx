export default function MarketListSkeleton() {
  return (
    <div className="space-y-4 py-6" aria-label="Loading market data">
      <div className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="h-[34rem] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
