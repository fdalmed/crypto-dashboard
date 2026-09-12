export default function ComparisonLoading() {
  return (
    <div className="animate-pulse py-6" aria-label="Loading comparison" role="status">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-9 w-72 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-6 h-96 rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
