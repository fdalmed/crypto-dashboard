type Props = {
  eyebrow: string;
  title: string;
  description: string;
  count?: number;
};

export default function MarketPageHeader({ eyebrow, title, description, count }: Props) {
  return (
    <header className="mb-6">
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{eyebrow}</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        {count !== undefined && <p className="text-sm text-gray-500 dark:text-gray-400">{count} assets shown</p>}
      </div>
    </header>
  );
}
