import Link from 'next/link';
import { notFound } from 'next/navigation';
import PDPClient from '../../../components/stitch/PDPClient';
import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { getAllProductHandles, getProductByHandle, getProducts } from '../../../utils/shopify';

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles();
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  let product = null;
  try {
    product = await getProductByHandle(handle);
  } catch {
    product = null;
  }

  if (!product) {
    return buildMetadata({
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      path: `/product/${handle}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description?.slice(0, 160) || `Shop ${product.title} from Silvan & Co.`,
    path: `/product/${handle}`,
    type: 'website',
    image: product.featuredImage?.url || null,
  });
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  let product = null;
  try {
    product = await getProductByHandle(handle);
  } catch {
    product = null;
  }

  if (!product) {
    return notFound();
  }

  let relatedProducts = [];
  try {
    relatedProducts = (await getProducts(4)).filter((item) => item.handle !== handle);
  } catch {
    relatedProducts = [];
  }

  const collectionName = product.productType || product.vendor || 'Collections';
  const unavailable = product.availableForSale === false;

  return (
    <StorefrontLayout mainClassName="max-w-7xl mx-auto px-4 md:px-8 pb-20">
      <nav className="flex items-center gap-2 overflow-x-auto py-4 text-xs text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="whitespace-nowrap transition-colors hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/shop" className="whitespace-nowrap transition-colors hover:text-primary">{collectionName}</Link>
        <span>/</span>
        <span className="truncate font-medium text-gray-700">{product.title}</span>
      </nav>

      {unavailable ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          This piece is currently unavailable for purchase. You can still review its details and explore similar products below.
        </div>
      ) : null}

      <PDPClient product={product} relatedProducts={relatedProducts} />
    </StorefrontLayout>
  );
}
