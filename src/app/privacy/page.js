import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.privacy;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/privacy',
});

export default function PrivacyPage() {
  return <ContentPage eyebrow="Legal" {...page} />;
}
