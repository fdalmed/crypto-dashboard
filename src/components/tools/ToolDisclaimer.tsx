export function ToolDisclaimer({ className = "" }: { className?: string }) {
  return <p className={`rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 ${className}`}>Calculations are estimates for informational purposes only and are not financial advice.</p>;
}

export default ToolDisclaimer;
