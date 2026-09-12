import Link from "next/link";

export default function ToolCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
      <Link href={href} className="mt-5 inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Open tool</Link>
    </article>
  );
}
