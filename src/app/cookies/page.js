import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.cookies;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/cookies',
});

export default function CookiesPage() {
  return <ContentPage eyebrow="Legal" {...page} />;
}
