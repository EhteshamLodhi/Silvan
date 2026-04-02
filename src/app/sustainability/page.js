import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.sustainability;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/sustainability',
});

export default function SustainabilityPage() {
  return <ContentPage eyebrow="Responsibility" {...page} />;
}
