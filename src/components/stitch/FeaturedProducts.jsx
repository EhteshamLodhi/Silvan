'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import useScrollReveal from '../../hooks/useScrollReveal';

export default function FeaturedProducts({ products = [] }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="mb-20" data-test="featured-products">
      <div ref={ref} className={`flex items-end justify-between mb-10 fade-up ${isVisible ? 'visible' : ''}`}>
        <div>
          <h2 className="font-display text-3xl font-semibold text-primary mb-1">Featured Products</h2>
          <p className="text-gray-500 text-sm">Live inventory, pricing, and product data pulled from Shopify.</p>
        </div>
        <Link href="/collections" className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline shrink-0" data-test="shop-all-link">
          Shop All
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {products.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} staggerIndex={idx % 3} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-sm text-gray-600 shadow-sm shadow-black/5">
          No featured products are currently available from Shopify.
        </div>
      )}
    </section>
  );
}
