import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductExplorer from '../../../components/stitch/ProductExplorer';
import RoomSceneViewer from '../../../components/stitch/RoomSceneViewer';
import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { getSpacePageData } from '../../../lib/storefrontData';
import { SPACE_DIRECTORY } from '../../../lib/storefrontDiscovery';

export const revalidate = 60;

export function generateStaticParams() {
  return SPACE_DIRECTORY.map((space) => ({ roomName: space.slug }));
}

export async function generateMetadata({ params }) {
  const { roomName } = await params;
  const space = SPACE_DIRECTORY.find((entry) => entry.slug === roomName);

  if (!space) {
    return buildMetadata({
      title: 'Space Not Found',
      description: 'The requested room discovery page does not exist.',
      path: `/space/${roomName}`,
      noIndex: true,
    });
  }

  const data = await getSpacePageData(roomName);

  return buildMetadata({
    title: space.label,
    description: data.description,
    path: `/space/${roomName}`,
    image: data.heroImage,
  });
}

export default async function SpaceLandingPage({ params }) {
  const { roomName } = await params;
  const space = SPACE_DIRECTORY.find((entry) => entry.slug === roomName);

  if (!space) {
    return notFound();
  }

  const data = await getSpacePageData(roomName);
  const collectionLinks = data.collections.map((collection) => ({
    handle: collection.handle,
    title: collection.title,
  }));

  return (
    <StorefrontLayout mainClassName="max-w-7xl mx-auto px-4 md:px-8 pb-20">
      <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#E8DECF]">
        {data.heroImage ? (
          <>
            <Image src={data.heroImage} alt={space.label} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : null}

        <div className={`relative z-[1] px-6 py-16 md:px-10 ${data.heroImage ? 'text-white' : ''}`.trim()}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70 md:text-white/70">
            Shop by Space
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
            {space.label}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 md:text-base">
            {data.description}
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary">
              Immersive Scene Explorer
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
              Scene imagery, hotspots, and linked product previews are read from Shopify collection
              metafields so merchandising can evolve from admin without redeploying the storefront.
            </p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
            Open Shop Page
          </Link>
        </div>
        <RoomSceneViewer scenes={data.scenes} />
      </section>

      {collectionLinks.length ? (
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-primary">Mapped Collections</h2>
          <div className="mt-4 flex flex-wrap gap-2">
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

      <ProductExplorer
        products={data.products}
        collections={collectionLinks}
        explorerKey={`space-${space.slug}`}
        title={`${space.label} Product Feed`}
        description="Continue the room journey below with Shopify-synced products, dynamic filters, and infinite scroll."
        emptyTitle={`No collections are mapped to ${space.label} yet`}
        emptyDescription="Add matching room_category or usage_space metafields in Shopify to populate this route automatically."
      />
    </StorefrontLayout>
  );
}
