import ContentPage from '../../components/stitch/ContentPage';
import { buildMetadata, policyPageContent } from '../../lib/site';

const page = policyPageContent.returns;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: '/returns',
});

export default function ReturnsPage() {
  return <ContentPage eyebrow="Support" {...page} />;
}
