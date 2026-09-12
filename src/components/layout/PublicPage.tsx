type Section = {
  title: string;
  paragraphs: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: Section[];
  notice?: string;
};

export default function PublicPage({ eyebrow, title, introduction, sections, notice }: Props) {
  return (
    <article className="mx-auto max-w-3xl py-8">
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{introduction}</p>
      </header>
      {notice ? <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">{notice}</p> : null}
      <div className="mt-8 space-y-7">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">{paragraph}</p>)}
          </section>
        ))}
      </div>
    </article>
  );
}
