import StorefrontLayout from './StorefrontLayout';

function Section({ heading, body }) {
  return (
    <section className="rounded-[1.75rem] border border-black/5 bg-white/60 p-6 md:p-8 shadow-sm shadow-black/5">
      <h2 className="font-display text-2xl font-semibold text-primary">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700 md:text-base">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function ContentPage({
  eyebrow = 'Silvan & Co.',
  title,
  description,
  intro,
  sections = [],
  children,
}) {
  return (
    <StorefrontLayout>
      <section className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">{description}</p>
        {intro ? <p className="mt-6 text-sm leading-7 text-gray-600 md:text-base">{intro}</p> : null}
      </section>

      {children ? (
        children
      ) : (
        <div className="grid gap-6">
          {sections.map((section) => (
            <Section key={section.heading} {...section} />
          ))}
        </div>
      )}
    </StorefrontLayout>
  );
}
