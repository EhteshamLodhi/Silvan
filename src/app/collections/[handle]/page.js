import Image from 'next/image';
import Link from 'next/link';
import CollectionClient from '../../../components/stitch/CollectionClient';
import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { getAllCollectionHandles, getCollectionByHandle, getCollections } from '../../../utils/shopify';

export const revalidate = 60;

function humanizeHandle(handle) {
  return handle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateStaticParams() {
  try {
    const handles = await getAllCollectionHandles();
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  let collection = null;
  try {
    collection = await getCollectionByHandle(handle, 12);
  } catch {
    collection = null;
  }

  const title = collection?.metafields?.find((field) => field?.key === 'seo_title')?.value || collection?.title || humanizeHandle(handle);
  const description =
    collection?.metafields?.find((field) => field?.key === 'seo_description')?.value ||
    collection?.description ||
    `Browse the ${title} collection from Shopify.`;

  return buildMetadata({
    title,
    description,
    path: `/collection/${handle}`,
    image: collection?.image?.url || null,
  });
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;

  let collection = null;
  let products = [];
  let allCollections = [];

  try {
    [collection, allCollections] = await Promise.all([
      getCollectionByHandle(handle),
      getCollections(12),
    ]);
    if (collection) {
      products = collection.products?.edges?.map((edge) => edge.node) || [];
    }
  } catch {
    collection = null;
  }

  const collectionTitle = collection?.title || humanizeHandle(handle);
  const collectionDesc = collection?.description || 'This Shopify collection does not currently have a description.';
  const heroBg = collection?.image?.url || '/assets/home/hero-bg.jpg';
  const collectionMetafields = (collection?.metafields || []).filter(
    (field) => field?.value && !['seo_title', 'seo_description'].includes(field.key),
  );

  return (
    <StorefrontLayout mainClassName="max-w-7xl mx-auto px-4 md:px-8 pb-20">
      <div className="flex items-center gap-2 overflow-x-auto py-5">
        {(allCollections || []).map((item) => {
          const active = item.handle === handle;
          return (
            <Link
              key={item.handle}
              href={`/collection/${item.handle}`}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="group relative mb-10 min-h-[260px] overflow-hidden rounded-[2rem] md:min-h-[340px]">
        <Image src={heroBg} alt={collectionTitle} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-8 md:p-14">
          <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">{collectionTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-200 md:text-base">{collectionDesc}</p>
        </div>
      </div>

      {collectionMetafields.length ? (
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {collectionMetafields.map((field) => (
            <article key={`${field.namespace}-${field.key}`} className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
                {field.key.replace(/_/g, ' ')}
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-700">{field.value}</p>
            </article>
          ))}
        </section>
      ) : null}

      {products.length ? (
        <CollectionClient products={products} collectionTitle={collectionTitle} collectionHandle={handle} />
      ) : (
        <section className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-center shadow-sm shadow-black/5">
          <h2 className="font-display text-3xl font-semibold text-primary">This collection is currently empty</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Shopify does not currently return any products for this collection handle.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/collections" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
              View All Collections
            </Link>
            <Link href={`/search?q=${encodeURIComponent(collectionTitle)}`} className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
              Search Related Products
            </Link>
          </div>
        </section>
      )}
    </StorefrontLayout>
  );
}
