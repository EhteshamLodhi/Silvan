import Image from 'next/image';
import Link from 'next/link';
import ProductCard from './ProductCard';

/**
 * FeaturedProducts Component (Stitch Translation)
 * 
 * @param {Object} props
 * @param {Array} props.products - Array of Shopify products
 */
export default function FeaturedProducts({ products = [] }) {
  return (
    <section className="mb-20" data-test="featured-products">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-semibold text-primary mb-2">Featured Products</h2>
          <p className="text-gray-600">Explore our most coveted pieces from local artisans.</p>
        </div>
        <Link href="/collections/all" className="text-primary font-semibold flex items-center hover:underline" data-test="shop-all-link">
            Shop All
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <ProductCard key={product.id || idx} product={product} />
        ))}
        {products.length === 0 && (
          <p className="text-gray-500">No products available. (TODO: wire with real Shopify data map)</p>
        )}
      </div>
    </section>
  );
}
