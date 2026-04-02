'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getVariantInventoryLabel } from '../../utils/shopify';
import Product3DViewer from './Product3DViewer';
import ProductCard from './ProductCard';

function formatMoney(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function metafieldLabel(key = '') {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeMedia(product) {
  const media = product?.media?.edges?.map((edge) => edge.node) || [];

  const normalized = media
    .map((item, index) => {
      if (item.mediaContentType === 'MODEL_3D') {
        const glbSource = (item.sources || []).find((source) =>
          source?.mimeType?.includes('gltf-binary') || source?.format?.toLowerCase() === 'glb',
        );

        if (!glbSource?.url) {
          return null;
        }

        return {
          id: `model-${index}`,
          type: 'model',
          alt: item.alt || item.previewImage?.altText || product?.title || '3D model',
          modelUrl: glbSource.url,
          image: item.previewImage || product?.featuredImage || null,
          sources: item.sources || [],
        };
      }

      if (item.mediaContentType === 'IMAGE' && item.image?.url) {
        return {
          id: `image-${index}`,
          type: 'image',
          alt: item.alt || item.image.altText || product?.title || 'Product image',
          image: item.image,
        };
      }

      if (item.mediaContentType === 'VIDEO') {
        const source = (item.sources || [])[0];
        if (!source?.url) {
          return null;
        }

        return {
          id: `video-${index}`,
          type: 'video',
          alt: item.alt || item.previewImage?.altText || product?.title || 'Product video',
          image: item.previewImage || product?.featuredImage || null,
          videoUrl: source.url,
        };
      }

      if (item.mediaContentType === 'EXTERNAL_VIDEO' && item.embeddedUrl) {
        return {
          id: `external-video-${index}`,
          type: 'externalVideo',
          alt: item.alt || item.previewImage?.altText || product?.title || 'Product video',
          image: item.previewImage || product?.featuredImage || null,
          videoUrl: item.embeddedUrl,
        };
      }

      return null;
    })
    .filter(Boolean);

  if (normalized.length) {
    return normalized;
  }

  if (product?.featuredImage) {
    return [
      {
        id: 'featured-image',
        type: 'image',
        alt: product.featuredImage.altText || product.title,
        image: product.featuredImage,
      },
    ];
  }

  return [];
}

function getMediaTypePriority(item) {
  if (item.type === 'model') {
    return 0;
  }

  if (item.type === 'image') {
    return 1;
  }

  return 2;
}

function getVariantMediaScore(item, variant) {
  if (!variant) {
    return 0;
  }

  const optionValues = variant.selectedOptions?.map((option) => option.value.toLowerCase()) || [];
  const searchableText = [
    item.alt,
    item.modelUrl,
    item.videoUrl,
    item.image?.url,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  let score = 0;

  optionValues.forEach((value) => {
    if (value && searchableText.includes(value)) {
      score += 2;
    }
  });

  if (variant.image?.url && item.image?.url && variant.image.url === item.image.url) {
    score += 5;
  }

  return score;
}

function sortMediaItems(mediaItems, variant) {
  return [...mediaItems].sort((left, right) => {
    const leftPriority = getMediaTypePriority(left);
    const rightPriority = getMediaTypePriority(right);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return getVariantMediaScore(right, variant) - getVariantMediaScore(left, variant);
  });
}

function MediaThumbnail({ item, isActive, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-colors ${
        isActive ? 'border-primary' : 'border-transparent hover:border-gray-300'
      }`}
      aria-label={`Show ${title}`}
    >
      {item.image ? (
        <Image src={item.image.url} alt={item.image.altText || title} fill className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-[#EFE7DA] text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {item.type === 'model' ? '3D' : 'Media'}
        </div>
      )}
      <div className="absolute inset-x-2 bottom-2 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
        {item.type === 'model'
          ? '3D'
          : item.type === 'image'
            ? 'Image'
            : 'Video'}
      </div>
    </button>
  );
}

export default function PDPClient({ product, relatedProducts = [] }) {
  const { addToCart, isUpdating } = useCart();
  const variants = product?.variants?.edges?.map((edge) => edge.node) || [];
  const options = product?.options || [];
  const productMetafields = (product?.metafields || []).filter(Boolean);
  const allMediaItems = useMemo(() => normalizeMedia(product), [product]);
  const initialVariant = variants[0] || null;

  const [selectedOptions, setSelectedOptions] = useState(() =>
    Object.fromEntries(
      variants[0]?.selectedOptions?.map((option) => [option.name, option.value]) || [],
    ),
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    return (
      variants.find((variant) =>
        variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
      ) || variants[0]
    );
  }, [variants, selectedOptions]);

  const mediaItems = useMemo(
    () => sortMediaItems(allMediaItems, selectedVariant || initialVariant),
    [allMediaItems, initialVariant, selectedVariant],
  );
  const [selectedMediaId, setSelectedMediaId] = useState(() => mediaItems[0]?.id || null);

  useEffect(() => {
    if (!mediaItems.length) {
      setSelectedMediaId(null);
      return;
    }

    const preferredItem = mediaItems[0];
    const currentItem = mediaItems.find((item) => item.id === selectedMediaId);
    const shouldKeepCurrent = currentItem && currentItem.type !== 'model';

    if (!shouldKeepCurrent) {
      setSelectedMediaId(preferredItem.id);
    }
  }, [mediaItems, selectedMediaId]);

  const currentMedia = mediaItems.find((item) => item.id === selectedMediaId) || mediaItems[0] || null;
  const currentPrice = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  const compareAtPrice =
    selectedVariant?.compareAtPrice || product?.compareAtPriceRange?.maxVariantPrice;
  const variantMetafields = (selectedVariant?.metafields || []).filter(Boolean);
  const disabled = !selectedVariant?.availableForSale || isUpdating;

  function updateOption(optionName, value) {
    setSelectedOptions((current) => ({ ...current, [optionName]: value }));
  }

  function handleAddToCart() {
    if (!selectedVariant?.id) {
      return;
    }

    addToCart(selectedVariant.id, quantity);
  }

  return (
    <>
      <section className="mb-16 flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="lg:w-[55%]">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-100">
            {currentMedia?.type === 'model' ? (
              <Product3DViewer
                modelUrl={currentMedia.modelUrl}
                posterImage={currentMedia.image || selectedVariant?.image || product?.featuredImage}
                alt={currentMedia.alt || product.title}
                className="aspect-square"
              />
            ) : null}

            {currentMedia?.type === 'image' && currentMedia.image ? (
              <Image
                src={currentMedia.image.url}
                alt={currentMedia.image.altText || product.title}
                fill
                className="object-cover"
                priority
              />
            ) : null}

            {currentMedia?.type === 'video' && currentMedia.videoUrl ? (
              <video
                src={currentMedia.videoUrl}
                controls
                playsInline
                preload="metadata"
                poster={currentMedia.image?.url}
                className="h-full w-full object-cover"
              />
            ) : null}

            {currentMedia?.type === 'externalVideo' && currentMedia.videoUrl ? (
              <iframe
                src={currentMedia.videoUrl}
                title={currentMedia.alt || product.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}
          </div>

          {mediaItems.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-5">
              {mediaItems.map((item) => (
                <MediaThumbnail
                  key={item.id}
                  item={item}
                  isActive={item.id === currentMedia?.id}
                  onClick={() => setSelectedMediaId(item.id)}
                  title={item.alt || product.title}
                />
              ))}
            </div>
          ) : null}

          {currentMedia?.type === 'model' && currentMedia.sources?.length ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-5 text-sm text-gray-600 shadow-sm shadow-black/5">
              <p className="font-semibold text-primary">Shopify-managed 3D sources</p>
              {currentMedia.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-primary hover:underline"
                >
                  Open {source.format?.toUpperCase() || source.mimeType}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex lg:w-[45%] flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                selectedVariant?.availableForSale
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {getVariantInventoryLabel(selectedVariant)}
            </span>
            {product.vendor ? (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary/60">
                {product.vendor}
              </span>
            ) : null}
          </div>

          <h1 className="mb-2 font-display text-3xl font-semibold text-primary lg:text-4xl">
            {product.title}
          </h1>
          {product.productType ? (
            <p className="mb-4 text-sm text-gray-500">{product.productType}</p>
          ) : null}
          <p className="mb-6 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mb-6 flex flex-wrap items-end gap-3">
            <span className="text-4xl font-bold text-orange-600">
              {formatMoney(currentPrice?.amount, currentPrice?.currencyCode)}
            </span>
            {compareAtPrice?.amount ? (
              <span className="mb-1 text-lg text-gray-400 line-through">
                {formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            ) : null}
          </div>

          <div className="space-y-5">
            {options
              .filter(
                (option) => !(option.values.length === 1 && option.values[0] === 'Default Title'),
              )
              .map((option) => (
                <div key={option.id || option.name}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    {option.name}: <span className="text-gray-900">{selectedOptions[option.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const optionVariant = variants.find((variant) =>
                        variant.selectedOptions.every((selectedOption) => {
                          if (selectedOption.name === option.name) {
                            return selectedOption.value === value;
                          }

                          return selectedOptions[selectedOption.name] === selectedOption.value;
                        }),
                      );
                      const unavailable = optionVariant && !optionVariant.availableForSale;

                      return (
                        <button
                          key={value}
                          onClick={() => updateOption(option.name, value)}
                          disabled={unavailable}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            selectedOptions[option.name] === value
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
                          } ${unavailable ? 'cursor-not-allowed opacity-40' : ''}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            <div className="grid gap-3 rounded-[1.5rem] bg-white/60 p-5 shadow-sm shadow-black/5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">SKU</p>
                <p className="mt-1 text-sm text-gray-700">
                  {selectedVariant?.sku || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Inventory
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {typeof selectedVariant?.quantityAvailable === 'number'
                    ? selectedVariant.quantityAvailable
                    : 'Not tracked'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-12 w-12 items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-12 w-12 items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={disabled || !selectedVariant?.id}
                className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-50"
              >
                {disabled ? 'Variant unavailable' : isUpdating ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {product.tags?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {productMetafields.length || variantMetafields.length ? (
        <section className="mb-16 border-t border-gray-200 pt-12">
          <h2 className="mb-8 font-display text-2xl font-semibold text-primary">
            Metafields & Attributes
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[...productMetafields, ...variantMetafields].map((field) => (
              <div
                key={`${field.namespace}-${field.key}`}
                className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                  {metafieldLabel(field.key)}
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-700">{field.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-16 border-t border-gray-200 pt-12">
        <h2 className="mb-8 font-display text-2xl font-semibold text-primary">Variant Details</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
              Selected Variant
            </p>
            <p className="mt-3 text-sm text-gray-700">
              {selectedVariant?.title || 'Unavailable'}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
              Availability
            </p>
            <p className="mt-3 text-sm text-gray-700">
              {getVariantInventoryLabel(selectedVariant)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-black/5 bg-white/60 p-5 shadow-sm shadow-black/5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
              Selected Options
            </p>
            <p className="mt-3 text-sm text-gray-700">
              {selectedVariant?.selectedOptions
                ?.map((option) => `${option.name}: ${option.value}`)
                .join(', ') || 'Default'}
            </p>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="mb-16 border-t border-gray-200 pt-12">
          <div className="mb-8 flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-primary">
              Related Products
            </h2>
            <Link href="/collections" className="text-sm font-semibold text-primary hover:underline">
              Browse all collections
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
              <ProductCard
                key={relatedProduct.id || index}
                product={relatedProduct}
                staggerIndex={index % 3}
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
