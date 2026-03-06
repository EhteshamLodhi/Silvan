import Image from 'next/image';
import Link from 'next/link';

/**
 * ProductCard Component (Stitch Translation)
 * 
 * @param {Object} props
 * @param {Object} props.product - Shopify product object
 */
export default function ProductCard({ product }) {
  // MAP: Shopify bindings
  // product.title -> title
  // product.priceRange.minVariantPrice.amount -> price
  // product.images.edges[0].node.url -> image source
  const handle = product?.handle || "example-handle";
  const title = product?.title || "The Heritage Carver Chair, Portland Studio";
  const image = product?.images?.edges[0]?.node?.url || "/assets/home/product-1.jpg";
  const priceAmount = product?.priceRange?.minVariantPrice?.amount || "1,250";
  
  return (
    <div className="flex flex-col" data-test="product-card">
        <Link href={`/products/${handle}`} className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 block relative">
            <Image
                src={image}
                alt={title}
                fill
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
        </Link>
        <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold text-primary">${parseFloat(priceAmount).toLocaleString()}</h3>
                <button className="p-2 border border-gray-200 rounded-full hover:bg-primary hover:text-white transition-colors" data-test="add-to-cart">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                </button>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span>Solid Wood</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Hand-finished</span>
            </div>
            <p className="text-gray-900 font-medium">{title}</p>
        </div>
    </div>
  );
}
