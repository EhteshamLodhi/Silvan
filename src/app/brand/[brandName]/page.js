import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductExplorer from '../../../components/stitch/ProductExplorer';
import RoomSceneViewer from '../../../components/stitch/RoomSceneViewer';
import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { getBrandPageData } from '../../../lib/storefrontData';
import { BRAND_DIRECTORY } from '../../../lib/storefrontDiscovery';

export const revalidate = 60;

export function generateStaticParams() {
  return BRAND_DIRECTORY.map((brand) => ({ brandName: brand.slug }));
}

export async function generateMetadata({ params }) {
  const { brandName } = await params;
  const brand = BRAND_DIRECTORY.find((entry) => entry.slug === brandName);

  if (!brand) {
    return buildMetadata({
      title: 'Brand Not Found',
      description: 'The requested brand hub does not exist.',
      path: `/brand/${brandName}`,
      noIndex: true,
    });
  }

  const data = await getBrandPageData(brandName);

  return buildMetadata({
    title: brand.label,
    description: data.description,
    path: `/brand/${brandName}`,
    image: data.heroImage,
  });
}

export default async function BrandLandingPage({ params }) {
  const { brandName } = await params;
  const brand = BRAND_DIRECTORY.find((entry) => entry.slug === brandName);

  if (!brand) {
    return notFound();
  }

  const data = await getBrandPageData(brandName);
  const collectionLinks = data.collections.map((collection) => ({
    handle: collection.handle,
    title: collection.title,
  }));

  return (
    <StorefrontLayout mainClassName="max-w-7xl mx-auto px-4 md:px-8 pb-20">
      <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#E8DECF]">
        {data.heroImage ? (
          <>
            <Image src={data.heroImage} alt={brand.label} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : null}

        <div className="relative z-[1] grid gap-6 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-10">
          <div className={data.heroImage ? 'text-white' : ''}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70 md:text-white/70">
              Brand Hub
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">{brand.label}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 md:text-base">
              {data.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
                Sub-Collections
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-primary">
                {data.collections.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/85 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
                Products
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-primary">
                {data.products.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {collectionLinks.length ? (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-primary">Sub-Collections</h2>
            <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
              Open Shop Page
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {collectionLinks.map((collection) => (
              <Link
                key={collection.handle}
                href={`/collection/${collection.handle}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {data.scenes.length ? (
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-semibold text-primary">Featured Scenes</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
              These future-ready scene blocks are mapped from Shopify collection metafields and share
              the same hotspot interaction system used across the storefront.
            </p>
          </div>
          <RoomSceneViewer scenes={data.scenes.slice(0, 2)} />
        </section>
      ) : null}

      <ProductExplorer
        products={data.products}
        collections={collectionLinks}
        explorerKey={`brand-${brand.slug}`}
        title={`${brand.label} Product Feed`}
        description="Infinite-scroll product discovery with dynamic collection switching and Shopify-synced filters."
        emptyTitle={`No collections are assigned to ${brand.label} yet`}
        emptyDescription="Set the collection metafield custom.brand in Shopify admin to automatically populate this brand hub."
      />
    </StorefrontLayout>
  );
}
