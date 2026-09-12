type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  step?: string;
  prefix?: string;
};

export function NumberInput({ id, label, value, onChange, hint, step = "any", prefix }: Props) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
      <div className="relative mt-2">
        {prefix ? <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500 dark:text-gray-400">{prefix}</span> : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </label>
  );
}

export default NumberInput;
