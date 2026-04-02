'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';

function formatMoney(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function getQuickAddVariant(product) {
  const variants = product?.variants?.edges?.map((edge) => edge.node) || [];
  return variants.find((variant) => variant.availableForSale) || variants[0] || null;
}

export default function SceneHotspotViewer({
  scene,
  className = '',
  priority = false,
  ctaLabel,
  ctaHref,
  minHeightClass = 'min-h-[70vh]',
}) {
  const { addToCart, isUpdating } = useCart();
  const [activeHotspotId, setActiveHotspotId] = useState(null);

  const activeHotspot = useMemo(
    () => scene?.hotspots?.find((hotspot) => hotspot.id === activeHotspotId) || null,
    [activeHotspotId, scene?.hotspots],
  );
  const activeProduct = activeHotspot?.product || null;
  const quickAddVariant = getQuickAddVariant(activeProduct);

  function closePreview() {
    setActiveHotspotId(null);
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-[#E9E0D1] ${minHeightClass} ${className}`.trim()}
    >
      {scene?.image ? (
        <Image
          src={scene.image}
          alt={scene.title || 'Room scene'}
          fill
          className="object-cover"
          priority={priority}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <div className="absolute inset-0 z-[2]">
        {(scene?.hotspots || []).map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => setActiveHotspotId(hotspot.id)}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            aria-label={`Open ${hotspot.product?.title || hotspot.label || 'product'} preview`}
          >
            <span className="absolute inset-0 rounded-full bg-white/35 animate-ping" style={{ animationDuration: '2.6s' }} />
            <span className="relative h-3.5 w-3.5 rounded-full bg-white ring-2 ring-white/60 shadow-lg transition-transform duration-200 hover:scale-110" />
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[3] p-6 md:p-8">
        {scene?.collectionTitle ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            {scene.collectionTitle}
          </p>
        ) : null}
        {scene?.title ? (
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white md:text-4xl">
            {scene.title}
          </h2>
        ) : null}
        {scene?.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            {scene.description}
          </p>
        ) : null}

        {ctaHref && ctaLabel ? (
          <Link
            href={ctaHref}
            className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F1E8]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>

      {activeProduct ? (
        <div
          className="absolute inset-0 z-[4] flex items-end justify-center bg-black/30 p-4 md:items-center"
          onClick={closePreview}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              {activeProduct.featuredImage?.url ? (
                <Image
                  src={activeProduct.featuredImage.url}
                  alt={activeProduct.featuredImage.altText || activeProduct.title}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">
                    {activeProduct.vendor || 'Shopify Product'}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-primary">
                    {activeProduct.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Close preview"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {activeProduct.description || 'Open this product to see the full specification.'}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-primary">
                  {formatMoney(
                    activeProduct?.priceRange?.minVariantPrice?.amount,
                    activeProduct?.priceRange?.minVariantPrice?.currencyCode,
                  )}
                </p>
                {activeProduct.productType ? (
                  <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs text-gray-600">
                    {activeProduct.productType}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/product/${activeProduct.handle}`}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  View Product
                </Link>
                {quickAddVariant?.id ? (
                  <button
                    type="button"
                    onClick={() => addToCart(quickAddVariant.id, 1)}
                    disabled={isUpdating}
                    className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary disabled:opacity-50"
                  >
                    {isUpdating ? 'Adding...' : 'Quick Add'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
