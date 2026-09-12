export function ResultMetric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone === "positive" ? "text-green-700 dark:text-green-400" : tone === "negative" ? "text-red-700 dark:text-red-400" : ""}`}>{value}</p>
    </div>
  );
}

export default ResultMetric;
