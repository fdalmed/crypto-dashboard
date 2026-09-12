export function ToolPageHeader({ title, description, eyebrow = "Crypto tools" }: { title: string; description: string; eyebrow?: string }) {
  return (
    <header className="mb-6">
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
    </header>
  );
}

export default ToolPageHeader;
