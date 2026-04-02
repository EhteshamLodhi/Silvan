'use client';

import Image from 'next/image';
import Link from 'next/link';
import useScrollReveal from '../../hooks/useScrollReveal';

function formatMoney(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

export default function ProductCard({ product, staggerIndex = 0 }) {
  const handle = product?.handle || 'product';
  const title = product?.title || 'Untitled product';
  const image = product?.featuredImage?.url || product?.images?.edges?.[0]?.node?.url || '/assets/home/product-1.jpg';
  const imageAlt = product?.featuredImage?.altText || product?.images?.edges?.[0]?.node?.altText || title;
  const price = product?.priceRange?.minVariantPrice;
  const compareAt = product?.compareAtPriceRange?.maxVariantPrice;
  const descriptor = [product?.vendor, product?.productType].filter(Boolean).join(' · ');
  const tags = (product?.tags || []).slice(0, 3);

  const { ref, isVisible } = useScrollReveal();
  const staggerClass = ['stagger-1', 'stagger-2', 'stagger-3'][staggerIndex] || 'stagger-1';

  return (
    <div ref={ref} className={`product-card flex flex-col fade-up ${staggerClass} ${isVisible ? 'visible' : ''}`} data-test="product-card">
      <Link href={`/product/${handle}`} className="group relative mb-5 block aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
        <Image src={image} alt={imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {!product?.availableForSale ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Sold out
          </span>
        ) : null}
      </Link>

      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900 leading-snug">{title}</p>
            {descriptor ? <p className="mt-1 text-xs text-gray-500">{descriptor}</p> : null}
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-primary">
              {formatMoney(price?.amount, price?.currencyCode)}
            </h3>
            {compareAt?.amount ? (
              <p className="text-xs text-gray-400 line-through">{formatMoney(compareAt.amount, compareAt.currencyCode)}</p>
            ) : null}
          </div>
        </div>

        {tags.length ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            {tags.map((tag, index) => (
              <span key={tag} className="flex items-center gap-2">
                {index > 0 ? <span className="inline-block h-1 w-1 rounded-full bg-gray-300" /> : null}
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
