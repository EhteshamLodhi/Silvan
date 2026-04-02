'use client';

import SceneHotspotViewer from './SceneHotspotViewer';

export default function RoomSceneViewer({
  scenes = [],
  emptyTitle = 'Scene data is not configured yet',
  emptyDescription = 'Add Shopify collection scene metafields to turn this page into an immersive hotspot explorer.',
}) {
  if (!scenes.length) {
    return (
      <section className="rounded-[2rem] border border-black/5 bg-white/60 px-6 py-14 text-center shadow-sm shadow-black/5">
        <h2 className="font-display text-3xl font-semibold text-primary">{emptyTitle}</h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
          {emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {scenes.map((scene, index) => (
        <section key={scene.id} className="snap-start">
          <SceneHotspotViewer
            scene={scene}
            priority={index === 0}
            ctaHref={scene.collectionHandle ? `/collection/${scene.collectionHandle}` : undefined}
            ctaLabel={scene.collectionHandle ? 'Open Collection' : undefined}
            minHeightClass="min-h-[68vh] md:min-h-[78vh]"
          />
        </section>
      ))}
    </div>
  );
}
