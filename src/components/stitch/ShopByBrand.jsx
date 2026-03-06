import Link from 'next/link';

/**
 * ShopByBrand Component (Stitch Translation)
 */
export default function ShopByBrand() {
  const brands = [
    { name: "Nordic Birch", href: "#" },
    { name: "Onyx Grain", href: "#" },
    { name: "Honey Pine", href: "#" },
    { name: "Pure Ash", href: "#" },
    { name: "Stained Palette", href: "#" },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full" data-test="shop-by-brand">
      <h2 className="text-xl font-display font-semibold text-primary mb-4 flex items-center justify-between">
        Shop by Brand
        <span className="material-symbols-outlined text-accent">auto_awesome</span>
      </h2>
      <div className="flex flex-col space-y-3 flex-1">
        {brands.map((brand, i) => (
          <Link key={i} href={brand.href} className="group flex items-center justify-between py-1">
            <span className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">{brand.name}</span>
            <span className="material-symbols-outlined text-gray-300 text-sm group-hover:text-primary transition-colors">arrow_forward</span>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50">
        <Link href="/collections/brands" className="text-xs text-primary font-bold uppercase tracking-widest hover:underline flex items-center">
            View All Brands
            <span className="material-symbols-outlined ml-1 text-xs">east</span>
        </Link>
      </div>
    </div>
  );
}
