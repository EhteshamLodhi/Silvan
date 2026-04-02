'use client';
import Link from 'next/link';
import useScrollReveal from '../../hooks/useScrollReveal';

export default function ShopByBrand({ brands = [] }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col fade-up ${isVisible ? 'visible' : ''}`}
      data-test="shop-by-brand"
    >
      <h2 className="font-display text-xl font-semibold text-primary mb-5 flex items-center justify-between">
        Shop by Brand
        <span className="material-symbols-outlined text-accent text-[22px]">auto_awesome</span>
      </h2>

      <div className="flex flex-col space-y-3 flex-1">
        {brands.map((brand) => (
          <Link
            key={brand.slug || brand.label}
            href={brand.href}
            className="group flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">
              {brand.label}
            </span>
            <span className="material-symbols-outlined text-gray-300 text-[18px] group-hover:text-primary transition-colors group-hover:translate-x-0.5 duration-200">
              arrow_forward
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <Link
          href="/brand"
          className="text-xs text-primary font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          View All Brands
          <span className="material-symbols-outlined text-[14px]">east</span>
        </Link>
      </div>
    </div>
  );
}
