import Link from 'next/link';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { getCollections } from '../../utils/shopify';

export const metadata = buildMetadata({
  title: 'Collections',
  description: 'Browse all Shopify collections available in the Silvan storefront.',
  path: '/collections',
});

export const revalidate = 60;

export default async function CollectionsPage() {
  let collections = [];
  try {
    collections = await getCollections(12);
  } catch {
    collections = [];
  }

  return (
    <StorefrontLayout>
      <section className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Shop</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">All Collections</h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
          Browse collections synchronized directly from Shopify admin.
        </p>
      </section>

      {collections.length ? (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.handle} href={`/collection/${collection.handle}`} className="group block">
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[1.8rem] bg-gray-100">
                {collection.image?.url ? (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent/40">
                    <span className="material-symbols-outlined text-[48px] text-primary/40">chair</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1 text-sm font-semibold text-white">
                    Shop Collection
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
              <h2 className="font-display text-lg font-semibold text-primary group-hover:underline">{collection.title}</h2>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-center shadow-sm shadow-black/5">
          No Shopify collections are currently available to display.
        </section>
      )}
    </StorefrontLayout>
  );
}
