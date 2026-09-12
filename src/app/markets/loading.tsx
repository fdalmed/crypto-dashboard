export default function MarketsLoading() {
  return (
    <div className="space-y-4 py-6" aria-label="Loading markets">
      <div className="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="h-[32rem] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
