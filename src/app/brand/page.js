import Link from 'next/link';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { getStorefrontDirectories } from '../../lib/storefrontData';

export const metadata = buildMetadata({
  title: 'Brand',
  description: 'Explore brand landing hubs automatically grouped from Shopify collection metafields.',
  path: '/brand',
});

export const revalidate = 60;

export default async function BrandIndexPage() {
  const { brands } = await getStorefrontDirectories();

  return (
    <StorefrontLayout>
      <section className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Brand</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">
          Brand Landing Hubs
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
          Each brand route is powered by Shopify collection metafields, so assigned collections appear
          here automatically without hardcoded product grids.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={brand.href}
            className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 transition-transform hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
              Brand Hub
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-primary">{brand.label}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {brand.collectionCount} Shopify collection
              {brand.collectionCount === 1 ? '' : 's'} currently mapped to this brand.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open brand
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </Link>
        ))}
      </section>
    </StorefrontLayout>
  );
}
