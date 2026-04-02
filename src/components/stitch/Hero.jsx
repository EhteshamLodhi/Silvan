'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SceneHotspotViewer from './SceneHotspotViewer';

const AUTO_INTERVAL = 8000;
const FALLBACK_IMAGES = [
  '/assets/home/hero-bg.jpg',
  '/assets/home/showroom-ny.jpg',
  '/assets/home/showroom-cp.jpg',
];
const FALLBACK_HOTSPOT_COORDINATES = [
  [
    { x: 24, y: 58 },
    { x: 50, y: 46 },
    { x: 76, y: 34 },
    { x: 63, y: 72 },
  ],
  [
    { x: 19, y: 48 },
    { x: 46, y: 62 },
    { x: 71, y: 38 },
    { x: 83, y: 56 },
  ],
  [
    { x: 28, y: 36 },
    { x: 47, y: 56 },
    { x: 69, y: 44 },
    { x: 57, y: 74 },
  ],
];

function chunkProducts(products = [], size = 4) {
  const chunks = [];

  for (let index = 0; index < products.length; index += size) {
    chunks.push(products.slice(index, index + size));
  }

  return chunks;
}

function buildFallbackHomeScenes(featuredProducts = [], spaces = []) {
  const primarySpace = spaces.find((space) => space.sceneCount > 0) || spaces[0];
  const productGroups = chunkProducts(featuredProducts, 4).slice(0, FALLBACK_IMAGES.length);
  const groups = productGroups.length ? productGroups : [[]];

  return groups.map((group, sceneIndex) => ({
    id: `home-fallback-scene-${sceneIndex}`,
    title:
      sceneIndex === 0
        ? 'Discover furniture through interactive hotspots'
        : `Explore curated home moments ${sceneIndex + 1}`,
    description:
      'The homepage hero keeps hotspot-based discovery active even before Shopify scene metafields are configured.',
    image: FALLBACK_IMAGES[sceneIndex] || FALLBACK_IMAGES[0],
    hotspots: group.map((product, productIndex) => ({
      id: `home-hotspot-${sceneIndex}-${product.handle || productIndex}`,
      ...(FALLBACK_HOTSPOT_COORDINATES[sceneIndex]?.[productIndex] ||
        FALLBACK_HOTSPOT_COORDINATES[0][productIndex]),
      product,
      handle: product.handle,
      label: product.title,
    })),
    collectionTitle: 'Home',
    ctaHref: primarySpace?.href || '/shop',
    ctaLabel: primarySpace ? `Explore ${primarySpace.label}` : 'Open Shop Page',
  }));
}

export default function Hero({ scenes = [], spaces = [], featuredProducts = [] }) {
  const heroScenes = useMemo(() => {
    if (scenes.length) {
      return scenes.map((scene, index) => ({
        ...scene,
        ctaHref: scene.collectionHandle ? `/collection/${scene.collectionHandle}` : '/space',
        ctaLabel: scene.collectionHandle ? 'Open Collection' : 'Explore Shop by Space',
        image: scene.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      }));
    }

    return buildFallbackHomeScenes(featuredProducts, spaces);
  }, [featuredProducts, scenes, spaces]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0 });

  const totalScenes = heroScenes.length;
  const currentScene = heroScenes[currentIndex] || heroScenes[0];

  const goTo = useCallback(
    (index) => {
      if (!totalScenes) {
        return;
      }

      const normalized = (index + totalScenes) % totalScenes;
      setCurrentIndex(normalized);
    },
    [totalScenes],
  );

  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const previous = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  useEffect(() => {
    if (isPaused || totalScenes <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % totalScenes);
    }, AUTO_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isPaused, totalScenes]);

  function onTouchStart(event) {
    touchRef.current.startX = event.touches[0].clientX;
    touchRef.current.startY = event.touches[0].clientY;
  }

  function onTouchEnd(event) {
    const dx = event.changedTouches[0].clientX - touchRef.current.startX;
    const dy = event.changedTouches[0].clientY - touchRef.current.startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        next();
      } else {
        previous();
      }
    }
  }

  if (!currentScene) {
    return null;
  }

  return (
    <div
      className="relative w-full lg:w-[70%]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <SceneHotspotViewer
        scene={currentScene}
        className="w-full"
        minHeightClass="min-h-[520px] lg:h-[680px]"
        priority={currentIndex === 0}
        ctaHref={currentScene.ctaHref}
        ctaLabel={currentScene.ctaLabel}
      />

      {totalScenes > 1 ? (
        <>
          <button
            type="button"
            onClick={previous}
            className="absolute left-3 top-1/2 z-[5] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 md:flex"
            aria-label="Previous hero scene"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-[5] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 md:flex"
            aria-label="Next hero scene"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>

          <div className="absolute bottom-6 left-1/2 z-[5] flex -translate-x-1/2 items-center gap-2">
            {heroScenes.map((scene, index) => (
              <button
                key={scene.id || index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to hero scene ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'h-2.5 w-7 bg-white'
                    : 'h-2.5 w-2.5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
