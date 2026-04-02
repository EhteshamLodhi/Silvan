import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.terms;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/terms',
});

export default function TermsPage() {
  return <ContentPage eyebrow="Legal" {...page} />;
}
