import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.shipping;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/shipping',
});

export default function ShippingPage() {
  return <ContentPage eyebrow="Support" {...page} />;
}
