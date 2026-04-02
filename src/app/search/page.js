import Link from 'next/link';
import ProductCard from '../../components/stitch/ProductCard';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { getCollections, searchCollections, searchProducts } from '../../utils/shopify';

export const metadata = buildMetadata({
  title: 'Search',
  description: 'Search Shopify-synced products and collections from the Silvan storefront.',
  path: '/search',
});

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q?.trim() || '';

  let productResults = [];
  let collectionResults = [];
  let collections = [];

  try {
    collections = await getCollections(6);
  } catch {
    collections = [];
  }

  if (query) {
    try {
      [productResults, collectionResults] = await Promise.all([
        searchProducts(query, 24),
        searchCollections(query, 12),
      ]);
    } catch {
      productResults = [];
      collectionResults = [];
    }
  }

  const totalResults = productResults.length + collectionResults.length;

  return (
    <StorefrontLayout>
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Search</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">Search the catalog</h1>
        <form action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by product, material, vendor, or collection"
            className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
          />
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
            Search
          </button>
        </form>
      </section>

      {query ? (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-primary">
              {totalResults ? `Results for "${query}"` : `No results for "${query}"`}
            </h2>
            <p className="text-sm text-gray-500">{totalResults} result{totalResults === 1 ? '' : 's'}</p>
          </div>

          {totalResults ? (
            <div className="mt-8 space-y-10">
              {collectionResults.length ? (
                <div>
                  <h3 className="font-display text-2xl font-semibold text-primary">Collections</h3>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {collectionResults.map((collection) => (
                      <Link key={collection.id} href={`/collection/${collection.handle}`} className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5 transition-transform hover:-translate-y-0.5">
                        <h4 className="font-display text-xl font-semibold text-primary">{collection.title}</h4>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{collection.description || 'Open this Shopify collection.'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {productResults.length ? (
                <div>
                  <h3 className="font-display text-2xl font-semibold text-primary">Products</h3>
                  <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {productResults.map((product, index) => (
                      <ProductCard key={product.id} product={product} staggerIndex={index % 3} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-8 shadow-sm shadow-black/5">
              <p className="max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
                Try a broader term like chair, oak, storage, or the name of a collection managed in Shopify admin.
              </p>
            </div>
          )}
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-3xl font-semibold text-primary">Browse collections</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.handle} href={`/collection/${collection.handle}`} className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5 transition-transform hover:-translate-y-0.5">
              <h3 className="font-display text-2xl font-semibold text-primary">{collection.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{collection.description || 'Explore available products in this Shopify collection.'}</p>
            </Link>
          ))}
        </div>
      </section>
    </StorefrontLayout>
  );
}
