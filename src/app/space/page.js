import Link from 'next/link';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { getStorefrontDirectories } from '../../lib/storefrontData';

export const metadata = buildMetadata({
  title: 'Shop by Space',
  description: 'Browse immersive room-based discovery routes connected to Shopify collections and scene metafields.',
  path: '/space',
});

export const revalidate = 60;

export default async function SpaceIndexPage() {
  const { spaces } = await getStorefrontDirectories();

  return (
    <StorefrontLayout>
      <section className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">
          Shop by Space
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">
          Room Discovery
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
          These immersive routes are powered by Shopify collection metafields, ready for scene
          imagery, hotspots, future 3D placements, and product discovery by room.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {spaces.map((space) => (
          <Link
            key={space.slug}
            href={space.href}
            className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 transition-transform hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
              Space Route
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-primary">{space.label}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {space.collectionCount} mapped collection{space.collectionCount === 1 ? '' : 's'} and{' '}
              {space.sceneCount} scene{space.sceneCount === 1 ? '' : 's'} detected from Shopify.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Open space
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </Link>
        ))}
      </section>
    </StorefrontLayout>
  );
}
