import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata } from '../../lib/site';

export const metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Silvan & Co. for product questions, delivery support, custom requests, or trade inquiries.',
  path: '/contact',
});

const contactCards = [
  {
    title: 'General Support',
    body: 'Questions about products, orders, or lead times.',
    detail: 'support@silvanandco.com',
    href: 'mailto:support@silvanandco.com',
  },
  {
    title: 'Custom Requests',
    body: 'Need sizing, finish guidance, or a made-to-order brief.',
    detail: 'studio@silvanandco.com',
    href: 'mailto:studio@silvanandco.com',
  },
  {
    title: 'Call Us',
    body: 'Monday to Friday, 9am to 6pm.',
    detail: '+1 (800) 555-0144',
    href: 'tel:+18005550144',
  },
];

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Contact Us"
      description="Reach out for product guidance, delivery help, custom project questions, or support after your order arrives."
      intro="We keep support personal and practical. Share your order number or the piece you are considering and we will help you as quickly as possible."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-primary">How we can help</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {contactCards.map((card) => (
              <a key={card.title} href={card.href} className="rounded-2xl border border-primary/10 bg-[#F7F1E8] p-5 transition-colors hover:border-primary/30">
                <h3 className="font-display text-xl font-semibold text-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{card.body}</p>
                <p className="mt-4 text-sm font-semibold text-primary">{card.detail}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 md:p-8">
          <h2 className="font-display text-2xl font-semibold text-primary">Visit our studio</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-700 md:text-base">
            <p>Silvan & Co. Studio</p>
            <p>245 Mercer Street, Suite 4B</p>
            <p>New York, NY 10012</p>
            <p>Appointments are recommended for custom consultations and material reviews.</p>
          </div>
          <div className="mt-6 rounded-2xl bg-primary px-5 py-4 text-sm leading-7 text-white/90">
            For urgent delivery issues, include photos and your order number so we can resolve the issue faster.
          </div>
        </section>
      </div>
    </ContentPage>
  );
}
