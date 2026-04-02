import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.about;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/about',
});

export default function AboutPage() {
  return <ContentPage eyebrow="About" {...page} />;
}
