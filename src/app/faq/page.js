import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.faq;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/faq',
});

export default function FAQPage() {
  return (
    <ContentPage eyebrow="Support" title={page.title} description={page.description} intro={page.intro}>
      <div className="grid gap-4">
        {page.faqs.map((item) => (
          <section key={item.question} className="rounded-[1.75rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5">
            <h2 className="font-display text-2xl font-semibold text-primary">{item.question}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-700 md:text-base">{item.answer}</p>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
